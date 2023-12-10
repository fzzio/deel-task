const contractsRouter = require('./contracts.router');

function routerApi(app) {
  app.use('/contracts', contractsRouter);
}

module.exports = routerApi;