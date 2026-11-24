const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PERMISSIONS: P, hasPermission } = require('../config/permissions');
const { requirePermission } = require('../middleware/requirePermission');

const all = Object.values(P);
const expected = {
  Admin: all,
  Manager: [P.PRODUCTS_READ, P.PRODUCTS_MANAGE, P.SUPPLIERS_READ, P.ORDERS_READ, P.ORDERS_MANAGE, P.INVENTORY_READ, P.INVENTORY_MANAGE, P.WAREHOUSES_READ, P.WAREHOUSES_MANAGE, P.PRODUCTION_READ, P.PRODUCTION_MANAGE, P.REPORTS_READ],
  Employee: [P.PRODUCTS_READ, P.SUPPLIERS_READ, P.ORDERS_READ, P.INVENTORY_READ, P.WAREHOUSES_READ, P.PRODUCTION_READ],
  Supplier: [P.PRODUCTS_READ, P.SUPPLIERS_READ, P.ORDERS_READ],
  eng: []
};

for (const [role, allowed] of Object.entries(expected)) {
  test(`${role} has only its proposed permissions`, () => {
    for (const permission of all) assert.equal(hasPermission(role, permission), allowed.includes(permission));
  });
}
test('unknown roles and undefined permissions are denied', () => {
  assert.equal(hasPermission('unknown', P.PRODUCTS_READ), false);
  assert.equal(hasPermission('Admin', 'anything:undefined'), false);
  assert.equal(hasPermission('__proto__', P.PRODUCTS_READ), false);
});
test('marketplace read middleware allows only the four approved roles', () => {
  for (const roleName of ['Admin', 'Manager', 'Employee', 'Supplier', 'eng', 'unknown']) {
    for (const permission of [P.PRODUCTS_READ, P.SUPPLIERS_READ]) {
      let status = 200, next = false;
      const res = { status(code) { status = code; return this; }, json() { return this; } };
      requirePermission(permission)({ user: { roleName } }, res, () => { next = true; });
      const allowed = ['Admin', 'Manager', 'Employee', 'Supplier'].includes(roleName);
      assert.equal(next, allowed, `${roleName}: ${permission}`);
      assert.equal(status, allowed ? 200 : 403);
    }
  }
});
test('middleware requires authentication and checks the current role', () => {
  const invoke = (user, permission) => {
    let status = 200, next = false;
    const res = { status(code) { status = code; return this; }, json() { return this; } };
    requirePermission(permission)({ user }, res, () => { next = true; });
    return { status, next };
  };
  assert.deepEqual(invoke(null, P.PRODUCTS_READ), { status: 401, next: false });
  assert.deepEqual(invoke({ roleName: 'Employee' }, P.PRODUCTS_READ), { status: 200, next: true });
  assert.deepEqual(invoke({ roleName: 'Employee' }, P.USERS_MANAGE), { status: 403, next: false });
  assert.deepEqual(invoke({ roleName: 'Admin' }, 'undefined:permission'), { status: 403, next: false });
});
test('Admin role alone does not grant global development access', () => {
  process.env.DEV_ADMIN_USER_IDS = '';
  process.env.NODE_ENV = 'development';
  const { requireDevelopmentAdmin } = require('../middleware/businessAccess');
  let status = 200, next = false;
  const res = { status(code) { status = code; return this; }, json() { return this; } };
  requireDevelopmentAdmin({ user: { userId: 999, roleName: 'Admin' } }, res, () => { next = true; });
  assert.equal(status, 403);
  assert.equal(next, false);
});
