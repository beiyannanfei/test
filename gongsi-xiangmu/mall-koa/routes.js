"use strict";

var admin = require('./controllers/admin')

module.exports = function routes(router) {
  router.get('/admin', admin.admin)
}