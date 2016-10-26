--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 16/10/21
-- Time: 下午2:29
-- To change this template use File | Settings | File Templates.
--
local json = require "lualib.dkjson"


local function mySort()
    local function compare(x, y)
        return x > y;
    end

    local a = { 1, 7, 3, 4, 25 };
    table.sort(a);
    print(a[1], a[2], a[3], a[4], a[5]);
    table.sort(a, compare);
    print(a[1], a[2], a[3], a[4], a[5]);
end


local function objSort()
    local function compare(x, y)
        return x.a < y.a;
    end

    local objArr = { { a = 5 }, { a = 20 }, { a = 15 } };
    print(json.encode(objArr));
    table.sort(objArr, compare)
    print(json.encode(objArr));
end

objSort();