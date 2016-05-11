--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/26
-- Time: 11:39
-- To change this template use File | Settings | File Templates.
--

local redis = require "redis"

local cache = redis.new()
local ok, err = cache:connect("127.0.0.1", 6379)

if not ok then
    return ngx.say("failure", err)
end

local res, err = cache:hgetall("test");

for _,v in ipairs(res) do
    ngx.say(v)
end

cache:set_keepalive(10000, 1000)
cache:close()

