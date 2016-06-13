"use strict";

var redis = require('../common/redis')
var Post = require('../models/Post')

exports.admin = function* () {

  var post = new Post({
    title: 'hello koa',
    body: 'hahha'
  })

  var p = yield post.save()

  var c = yield redis.get('test')

  yield this.render('index', {
    title: 'template',
    para: 'buzhidao'+c
  })
}