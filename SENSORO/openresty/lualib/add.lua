--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 16/11/16
-- Time: 下午6:08
-- To change this template use File | Settings | File Templates.
--

local args = ngx.req.get_uri_args();
ngx.say(args.a + args.b);

