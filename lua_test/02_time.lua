--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 16/10/21
-- Time: 下午3:32
-- To change this template use File | Settings | File Templates.
--
local json = require "lualib.dkjson"

print(json.encode(os.time()));
print(json.encode(os.date("*t")));
print(os.date("now is %x %X"));
print(os.date("now is %Y-%m-%d %H:%M:%S"));


