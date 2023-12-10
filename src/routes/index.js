const contractsRouter = require('./contracts.router');
const jobsRouter = require('./jobs.router');

function routerApi(app) {
  app.use('/contracts', contractsRouter);
  app.use('/jobs', jobsRouter);
}

module.exports = routerApi;