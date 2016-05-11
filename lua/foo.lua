--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/17
-- Time: 16:19
-- To change this template use File | Settings | File Templates.
--

local _M = { _VERSION = '0.01' }

function _M.add(a, b) --两个number型变量相加
    return a + b
end

function _M.update_A() --更新变量值
    A = 365
end

return _M
