--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/29
-- Time: 16:32
-- To change this template use File | Settings | File Templates.
--

local json = require "resty.dkjson"

local t1 = { a = 10, b = 20, c = 30 };
local str = json.encode(t1)
print(str)

