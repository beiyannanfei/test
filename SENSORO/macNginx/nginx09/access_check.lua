--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 16/11/16
-- Time: 下午6:06
-- To change this template use File | Settings | File Templates.
--

local param= require("comm/param")  --注意 lua文件的搜索路径是配置在nginx的lua_package_path中的
local args = ngx.req.get_uri_args()

if not param.is_number(args.a, args.b) then
    ngx.exit(ngx.HTTP_BAD_REQUEST)
    return
end