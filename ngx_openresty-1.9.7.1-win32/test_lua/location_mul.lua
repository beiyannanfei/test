--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/26
-- Time: 16:09
-- To change this template use File | Settings | File Templates.
--

local args = ngx.req.get_uri_args()
ngx.print(tonumber(args.a) * tonumber(args.b))

