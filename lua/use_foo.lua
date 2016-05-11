--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/17
-- Time: 16:20
-- To change this template use File | Settings | File Templates.
--

A = 360     --定义全局变量
local foo = require("foo")

local b = foo.add(A, A)
print("b = ", b)

foo.update_A()
print("A = ", A)

