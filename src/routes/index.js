const contractsRouter = require('./contracts.router');
const jobsRouter = require('./jobs.router');
const balancesRouter = require('./balances.router');
const adminRouter = require('./admin.router');

function routerApi(app) {
  app.use('/contracts', contractsRouter);
  app.use('/jobs', jobsRouter);
  app.use('/balances', balancesRouter);
  app.use('/admin', adminRouter);
}

module.exports = routerApi;