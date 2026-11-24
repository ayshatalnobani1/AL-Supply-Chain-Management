// Organization-scoped capabilities; only selected reads are connected to routes.
const PERMISSIONS = Object.freeze({
  PRODUCTS_READ: 'products:read', PRODUCTS_MANAGE: 'products:manage',
  SUPPLIERS_READ: 'suppliers:read',
  ORDERS_READ: 'orders:read', ORDERS_MANAGE: 'orders:manage',
  INVENTORY_READ: 'inventory:read', INVENTORY_MANAGE: 'inventory:manage',
  WAREHOUSES_READ: 'warehouses:read', WAREHOUSES_MANAGE: 'warehouses:manage',
  PRODUCTION_READ: 'production:read', PRODUCTION_MANAGE: 'production:manage',
  REPORTS_READ: 'reports:read', REPORTS_MANAGE: 'reports:manage',
  PAYMENTS_READ: 'payments:read', PAYMENTS_MANAGE: 'payments:manage',
  USERS_READ: 'users:read', USERS_MANAGE: 'users:manage',
  ROLES_READ: 'roles:read', ROLES_MANAGE: 'roles:manage'
});

const knownPermissions = new Set(Object.values(PERMISSIONS));
const roles = new Map([
  ['Admin', new Set(knownPermissions)],
  ['Manager', new Set([
    PERMISSIONS.PRODUCTS_READ, PERMISSIONS.PRODUCTS_MANAGE, PERMISSIONS.SUPPLIERS_READ,
    PERMISSIONS.ORDERS_READ, PERMISSIONS.ORDERS_MANAGE,
    PERMISSIONS.INVENTORY_READ, PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.WAREHOUSES_READ, PERMISSIONS.WAREHOUSES_MANAGE,
    PERMISSIONS.PRODUCTION_READ, PERMISSIONS.PRODUCTION_MANAGE,
    PERMISSIONS.REPORTS_READ
  ])],
  ['Employee', new Set([
    PERMISSIONS.PRODUCTS_READ, PERMISSIONS.SUPPLIERS_READ, PERMISSIONS.ORDERS_READ, PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.WAREHOUSES_READ, PERMISSIONS.PRODUCTION_READ
  ])],
  ['Supplier', new Set([PERMISSIONS.PRODUCTS_READ, PERMISSIONS.SUPPLIERS_READ, PERMISSIONS.ORDERS_READ])],
  ['eng', new Set()]
]);

function hasPermission(roleName, permission) {
  return knownPermissions.has(permission) && (roles.get(roleName)?.has(permission) ?? false);
}

module.exports = { PERMISSIONS, hasPermission };
