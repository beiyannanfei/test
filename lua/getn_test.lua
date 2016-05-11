--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/29
-- Time: 10:29
-- To change this template use File | Settings | File Templates.
--

local t1 = { 10, 20, 15, 30, 40, 50 };
print("t1 len: ", #t1); -- 6

local t2 = { a = 10, b = 20, c = 30, d = 40 };
print("t2 len: ", #t2); -- 0

local t3 = { a = 1, b = 2, 3, c = 4, 5 };
print("t3 len: ", #t3); -- 2

for k, v in pairs(t3) do
    print(k, v);
end
