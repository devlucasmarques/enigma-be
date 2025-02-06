const factoryRoutes = require('./factoryRoutes');
const modelRoutes = require('./modelRoutes');
const moduleRoutes = require('./moduleRoutes');
const calcRoutes = require('./calcRoutes');
const userRoutes = require('./userRoutes');
const serviceRoutes = require('./serviceRoutes');
const managementRoutes = require('./managementRoutes');
const planRoutes = require('./planRoutes');
const paymentsRoutes = require('./paymentRoutes');
const paymentsOtherRoutes = require('./paymentOtherRoutes');
const couponsRoutes = require('./couponRoutes');
const creditCardRoutes = require('./creditCardRoutes');
const serviceTypeRoutes = require('./serviceTypeRoutes');
const dbaRoutes = require('./dbaRoutes');

const getRoutes = (app) => {
  app.use('/', factoryRoutes);
  app.use('/', modelRoutes);
  app.use('/', moduleRoutes);
  app.use('/', calcRoutes);
  app.use('/', userRoutes);
  app.use('/', serviceRoutes);
  app.use('/', managementRoutes);
  app.use('/', planRoutes);
  app.use('/', paymentsRoutes);
  app.use('/', paymentsOtherRoutes);
  app.use('/', couponsRoutes);
  app.use('/', creditCardRoutes);
  app.use('/', dbaRoutes);
  app.use('/', serviceTypeRoutes);
};

module.exports = { getRoutes };
