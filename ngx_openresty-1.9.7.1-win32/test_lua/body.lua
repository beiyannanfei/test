--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/26
-- Time: 15:13
-- To change this template use File | Settings | File Templates.
--

ngx.req.read_body()
local data = ngx.req.get_body_data()
ngx.say("lua hello ", data)

