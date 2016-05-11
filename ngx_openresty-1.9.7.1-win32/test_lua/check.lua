--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/25
-- Time: 16:16
-- To change this template use File | Settings | File Templates.
--
local param = require("test_lua.param")
local args = ngx.req.get_uri_args()

if not param.isNumber(args.a, args.b) then
    return ngx.exit(ngx.HTTP_BAD_REQUEST)
end


