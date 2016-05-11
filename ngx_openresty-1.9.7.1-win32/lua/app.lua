--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/1/27
-- Time: 15:34
-- To change this template use File | Settings | File Templates.
--
--[[local redis = require "redis"
local red = redis:new()
local ok, err = red:connect("127.0.0.1", 6379)
local res, err = red:get("dog")
ngx.say(res);]]

--[[
local args = ngx.req.get_uri_args()
if args['action'] == 'orderStateNumber' then


else
    ngx.say("failure")
end
]]
--return say("success", "123456");

local red = redis:new()
local ok, err = red:connect("127.0.0.1", 6379)

local args = ngx.req.get_uri_args()
if args['action'] == 'orderStateNumber' then
    local data, err = red:get("dog")
    say("success", data);
else
    say("failure", "errMsg")
end
