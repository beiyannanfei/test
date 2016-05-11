--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/26
-- Time: 15:17
-- To change this template use File | Settings | File Templates.
--

local data = ngx.req.get_body_data()
ngx.say("lua body1 hello ", data)

