--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/26
-- Time: 15:38
-- To change this template use File | Settings | File Templates.
--

local res = ngx.location.capture(
    "/sum0", {args = {a = 30, b = 80}}
)
ngx.say("status: ", res.status, " response: ", res.body);

