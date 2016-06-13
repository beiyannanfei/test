/*
 * 各种配置
 */


module.exports = {
  debug: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 6600,
  mongodb: '127.0.0.1:27017/mall'
}