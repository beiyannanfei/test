--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 16/11/17
-- Time: 下午12:10
-- To change this template use File | Settings | File Templates.
--

local args = ngx.req.get_uri_args();
ngx.say(args.a - args.b);

