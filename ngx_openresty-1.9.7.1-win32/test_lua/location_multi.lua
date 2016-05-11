--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/26
-- Time: 16:20
-- To change this template use File | Settings | File Templates.
--

local res1, res2, res3 = ngx.location.capture_multi({
    {"/sum", {args = {a = 3, b = 8}}},
    {"/sub", {args = {a = 3, b = 8}}},
    {"/mul", {args = {a = 3, b = 8}}}
})

ngx.say("res1 status: ", res1.status, " res1 response: ", res1.body)
ngx.say("res2 status: ", res2.status, " res2 response: ", res2.body)
ngx.say("res3 status: ", res3.status, " res3 response: ", res3.body)

