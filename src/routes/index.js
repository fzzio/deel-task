const contractsRouter = require('./contracts.router');
const jobsRouter = require('./jobs.router');
const balancesRouter = require('./balances.router');

function routerApi(app) {
  app.use('/contracts', contractsRouter);
  app.use('/jobs', jobsRouter);
  app.use('/balances', balancesRouter);
}

module.exports = routerApi;