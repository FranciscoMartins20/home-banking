const { authenticateToken } = require('../middleware/token');
const { helloHandler, subscribeHandler, loginHandler, fundsHandler,logoutHandler } = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: helloHandler,
  },
  {
    method: 'POST',
    path: '/subscribe',
    handler: subscribeHandler,
  },
  {
    method: 'POST',
    path: '/login',
    handler: loginHandler,
  },
 {
    method: 'GET',
    path: '/funds',
    handler: fundsHandler,
    config: {
      pre: [{ method: authenticateToken }],
    },
  },
  {
    method: 'POST',
    path: '/funds',
    handler: fundsHandler,
    config: {
      pre: [{ method: authenticateToken }],
    },
  },
  {
    method: 'PUT',
    path: '/funds',
    handler: fundsHandler,
    config: {
      pre: [{ method: authenticateToken }],
    },
  },
  {
    method: 'DELETE',
    path: '/funds',
    handler: fundsHandler,
    config: {
      pre: [{ method: authenticateToken }],
    },
  },

  {
    method: 'POST', 
    path: '/logout',
    handler: logoutHandler,
    config: {
      pre: [{ method: authenticateToken }],
    },
  },
];

module.exports = routes;
