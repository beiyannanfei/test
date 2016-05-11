--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/25
-- Time: 16:07
-- To change this template use File | Settings | File Templates.
--
local _M = {}

function _M.isNumber(...)
    local args = {...};
    for _, v in ipairs(args) do
        local num = tonumber(v)
        if nil == num then
            return false
        end
    end
    return true
end

return _M

