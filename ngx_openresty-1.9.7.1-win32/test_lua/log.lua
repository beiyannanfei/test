--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/25
-- Time: 15:51
-- To change this template use File | Settings | File Templates.
--

local num = 55
local str = "string"
local obj
ngx.log(ngx.ERR, "*****========num:", num)
ngx.log(ngx.INFO, " string:", str)  --不会输出，因为log级别是error
print([[i am print]])               --不会输出，print是INFO级别的
ngx.log(ngx.ERR, " ***=====object:", obj)
