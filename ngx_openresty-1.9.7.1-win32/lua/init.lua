--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/1/27
-- Time: 15:34
-- To change this template use File | Settings | File Templates.
--

redis = require "resty.redis"
restystring = require "resty.string"
dkjson = require 'resty.dkjson'

function say(status, data)
    local res = {}
    if status == "success" then
        res.status = "SUCCESS"
        res.data = data
    else
        res.status = "failure"
        res.errMsg = data
    end
    local jsonStr = dkjson.encode(res)
    return ngx.say(jsonStr)
end

