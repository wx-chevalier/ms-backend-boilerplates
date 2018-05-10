const publicRoutes = require('./routes/publicRoutes');
const privateRoutes = require('./routes/privateRoutes');

module.exports = {
  migrate: false,
  publicRoutes,
  privateRoutes,
  port: process.env.PORT || '2017',
};
