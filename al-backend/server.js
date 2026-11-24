const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Use middleware to handle CORS and parse JSON
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.options('/{*splat}', cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());

// Oracle DB config
const { dbConfig } = require('./config/environment');
const authenticate = require('./middleware/authenticate');
const { requireOrganization, readOnly, requireDevelopmentAdmin, denyRestrictedReads } = require('./middleware/businessAccess');
const { requirePermission } = require('./middleware/requirePermission');
const { PERMISSIONS } = require('./config/permissions');

// Test route to check connection
app.get('/test-connection', async (req, res) => {
  if (process.env.NODE_ENV === 'production' || !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) {
    return res.sendStatus(404);
  }
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    res.send('Oracle DB connection successful!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to Oracle DB');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

const productsRoutes = require('./routes/products');
const suppliersRoutes = require('./routes/suppliers');
const rolesRoutes = require('./routes/roles');
const usersRoutes = require('./routes/users');
const warehousesRoutes = require('./routes/warehouses');
const supplierOrdersRoutes = require('./routes/supplier_orders');
const inventoryRoutes = require('./routes/inventory_movements');
const paymentsRoutes = require('./routes/payments');
const productionRecipesRoutes = require('./routes/production_recipes');
const productionsRoutes = require('./routes/productions');
const stockAdjustmentsRoutes = require('./routes/stock_adjustments');
const productImagesRoutes = require('./routes/product_Images');
const orderStatusRoutes = require('./routes/order_status');
const userProfilesRoutes = require('./routes/user_profiles');
const authRoutes = require('./routes/auth');
const { getSelf, getCompanyUsers } = require('./controllers/usersController');
const { getSelfProfiles } = require('./controllers/userProfilesController');

// Route middleware
app.use('/products', authenticate, requireOrganization, readOnly, requirePermission(PERMISSIONS.PRODUCTS_READ), productsRoutes);
app.use('/suppliers', authenticate, requireOrganization, readOnly, requirePermission(PERMISSIONS.SUPPLIERS_READ), suppliersRoutes);
app.use('/product-images', authenticate, requireOrganization, readOnly, requirePermission(PERMISSIONS.PRODUCTS_READ), productImagesRoutes);
app.use('/roles', authenticate, requireOrganization, readOnly, requireDevelopmentAdmin, rolesRoutes);
app.use('/warehouses', authenticate, requireOrganization, readOnly, requireDevelopmentAdmin, warehousesRoutes);
app.use('/supplier-orders', authenticate, requireOrganization, readOnly, requireDevelopmentAdmin, supplierOrdersRoutes);
app.use('/inventory', authenticate, requireOrganization, readOnly, requireDevelopmentAdmin, inventoryRoutes);
app.use('/payments', authenticate, requireOrganization, readOnly, requireDevelopmentAdmin, paymentsRoutes);
app.use('/production-recipes', authenticate, requireOrganization, readOnly, requireDevelopmentAdmin, productionRecipesRoutes);
app.use('/productions', authenticate, requireOrganization, readOnly, requireDevelopmentAdmin, productionsRoutes);
app.use('/stock-adjustments', authenticate, requireOrganization, readOnly, requireDevelopmentAdmin, stockAdjustmentsRoutes);
app.use('/order-status', authenticate, requireOrganization, readOnly, requireDevelopmentAdmin, orderStatusRoutes);
app.get('/users/me', authenticate, getSelf);
app.get('/users/company', authenticate, requireOrganization, requirePermission(PERMISSIONS.USERS_READ), getCompanyUsers);
app.get('/user-profiles/me', authenticate, getSelfProfiles);
app.use('/users', authenticate, requireOrganization, readOnly, denyRestrictedReads, usersRoutes);
app.use('/user-profiles', authenticate, requireOrganization, readOnly, denyRestrictedReads, userProfilesRoutes);
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
