--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/25
-- Time: 17:54
-- To change this template use File | Settings | File Templates.
--

local args = ngx.req.get_uri_args();
for k,v in pairs(args) do
    ngx.say("[GET] key: ", k, " value: ", v);
end

ngx.req.read_body();
local args = ngx.req.get_post_args();
for k,v in pairs(args) do
    ngx.say("[POST] key: ", k, " value: ", v);
end


