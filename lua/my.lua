--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/1/5
-- Time: 12:38
-- To change this template use File | Settings | File Templates.
--
local foo={};
local function getName()
    return "Lucy";
end

function foo.Greeting()
    print("hello" .. getName())
end

return foo;

