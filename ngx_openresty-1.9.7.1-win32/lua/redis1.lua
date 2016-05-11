local redis = require "resty.redis_iresty"
local red = redis:new()
local ok, err = red:connect("127.0.0.1", 6379)
local ok, err = red:set("dog1", "an animal")
if not ok then
    ngx.say("failed to set dog: ", err)
    return
end

ngx.say("set result: ", ok)