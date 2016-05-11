--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/1/4
-- Time: 15:52
-- To change this template use File | Settings | File Templates.
--

--[[
local swap = function(a, b)
    local temp = a;
    a = b;
    b = temp;
    print(a, b);
end

local x = "hello";
local y = 20;
print(x, y);
swap(x, y);
print(x, y);
]]

--[[
local function fun1(a, b)
    print(a, b);
end

local function fun2(a, b, c, d)
    print(a, b, c, d);
end

local x = 1;
local y = 2;
local z = 3;

fun1(x, y, z);
fun2(x, y, z);
]]

--[[
local function func(...)
    local temp = { ... };
    local ans = table.concat(temp, "*");
    print(ans);
end

func(1, 2);
func(1, 2, 3, 4);
]]

--[[
local function change(arg)
    arg.width = arg.width * 2;
    arg.height = arg.height * 2;
    return arg
end

local rectangle = { width = 20, height = 15 };
print("before change:", "width =", rectangle.width, "height =", rectangle.height);
change(rectangle);
print("after change:", "width =", rectangle.width, "height =", rectangle.height);
]]

--[[
local start, stop = string.find("hello world", "llo");
print(start, stop);
]]

--[[
local function swap(a, b)
    return b, a;
end

local x = 1;
local y = 2;
x, y = swap(x, y);
print(x, y);
]]

--[[
function init()
    return 1, "lua";
end

x = init();
print(x);

x, y, z = init();
print(x, y, z);
]]

--[[
local function init()
    return 1, "lua";
end

local x, y, z = init(), 2;
print(x, y, z);
local a, b, c = 2, init();
print(a, b, c);
]]

--[[
local function init()
    return 1, "lua";
end
print(init(), 2);
print(2, init());

print((init()), 2);
print(2, (init()));
]]

--[[
print(string.byte("abc", 1, 3));
print(string.byte("abc", 3));
print(string.byte("abc"));
]]

--[[
print(string.char(96, 97, 98))
print(string.char())
print(string.char(65, 66))
]]

--[[
print("string.upper " .. string.upper("hello lua"));
print("string.lower " .. string.lower("HEllo LuA"));
print("string.len " .. string.len("hello lua"));
print(string.find("abc cba", "ab"));
]]

--[[
print(string.format("%.4f", 3.1415926)); --保留4位小数
print(string.format("%d %x %o", 31, 31, 31)) --十进制31转换
d = 5; m = 7; y = 2016
print(string.format("%s %02d/%02d/%d", "today is:", d, m, y));
print(string.format("today is: %02d/%02d/%d", d, m, y));
print(string.sub("hello lua", 4, 7));
]]

--[[
print(string.gsub("lua lua lua", "lua", "hello"));
print(string.gsub("lua lua lua", "lua", "hello", 2));
print(string.reverse("Hello Lua"));
]]

--[[
local a = { 1, 3, 5, "hello" };
print(table.concat(a));
print(table.concat(a, "|"));
]]

--[[
local a = { 1, 8 };
table.insert(a, 1, 3);
print(a[1], a[2], a[3]);
table.insert(a, 10);
print(a[1], a[2], a[3], a[4]);
]]

--[[
local a = {};
a[-1] = 10;
print(table.maxn(a));
a[5] = 10;
print(table.maxn(a));
print(a[1], a[2], a[3], a[4], a[5])
]]

--[[
local a = { 1, 2, 3, 4 };
print(table.remove(a, 1)); --删除索引为1的元素
print(a[1], a[2], a[3], a[4]);
print(table.remove(a)); --删除最后一个元素
print(a[1], a[2], a[3], a[4]);
]]

--[[
local function compare(x, y)
    return x > y;
end

local a = { 5, 10, 57, 84, -15, 59, 2 };
table.sort(a);
print(table.concat(a, " "));
table.sort(a, compare);
print(table.concat(a, " "));
]]

--[[
local day1 = { year = 2015, month = 7, day = 30 };
local day2 = { year = 2015, month = 7, day = 31 };
local t1 = os.time(day1);
local t2 = os.time(day2);
print(os.difftime(t2, t1));
print(t2 - t1);
]]

--[[
local tab1 = os.date("*t");
for k,v in pairs(tab1) do
    print(k, "=", v);
end
print("=================");
print(tab1.year);
print(tab1.month);
print(tab1.day);
print(tab1.hour);
print(tab1.min);
print(tab1.sec);
print(tab1.isdst);
]]

--[[
local tab2 = os.date("*t", 13245678);
for k, v in pairs(tab2) do
    print(k .. "=" .. tostring(v));
end
]]

--[[
print(os.date("today is %A, in %B"));
print(os.date("now is %x %X"));
]]

--[[
print(math.floor(3.1415));
print(math.ceil(3.1415));
math.randomseed(os.time());
print(math.random());
print(math.random(100));
print(math.random(100, 300));
]]

--[[
file = io.input("fileTest"); --打开文件
repeat
    line = io.read() --逐行读取内容，文件结束时返回nil
    if nil == line then
        break;
    end
    print(line);
until (false)
io.close(file); --关闭文件
]]

--[[
file = io.open("fileTest", "a+"); --打开文件
io.output(file);--设置默认输出文件
io.write("\n hello file write");
io.close(file);
]]

--[[
file = io.open("fileTest", "r");
for line in file:lines() do
    print(line);
end
file:close();
]]

--[[
local set1 = { 10, 20, 30 };
local set2 = { 20, 40, 50 };
local union = function(self, another)
    local set = {};
    local result = {};
    for i, j in pairs(self) do
        set[j] = true
    end
    for i, j in pairs(another) do
        set[j] = true
    end

    for i, j in pairs(set) do
        table.insert(result, i)
    end
    return result;
end
setmetatable(set1, { __add = union });
local set3 = set1 + set2;
for i, j in pairs(set3) do
    --    print(j .. " ");
    io.write(j .. " ");
end
]]

--[[
arr = { 1, 2, 3, 4 };
arr = setmetatable(arr, {
    __tostring = function(self)
        local result = "{";
        local sep = "";
        for _, i in pairs(self) do
            result = result .. sep .. i;
            sep = ", "
        end
        result = result .. "}";
        return result;
    end
})
print(arr);
]]

--[[
Account = { balance = 0 }
function Account:deposit(v)
    self.balance = self.balance + v;
end

function Account:withdraw(v)
    if self.balance > v then
        self.balance = self.balance - v;
    else
        error("insufficient funds");
    end
end

function Account:new(o)
    o = o or {};
    setmetatable(o, { __index = self })
    return o;
end

a = Account:new();
a:deposit(100);
b = Account:new();
b:deposit(50);
print(a.balance);
print(b.balance);
b:withdraw(10);
print(b.balance);
--b:withdraw(50);
print("===============");
SpecialAccount = Account:new({ limit = 1000 });
function SpecialAccount:withdraw(v)
    if v - self.balance >= self:getLimit() then
        error("insufficient funds")
    end
    self.balance = self.balance - v;
end

function SpecialAccount:getLimit()
    return self.limit or 0;
end

spacc = SpecialAccount:new()
spacc:withdraw(100);
print(spacc.balance);
acc = Account:new();
--acc.withdraw(100);error
]]

--[[
function newAccount(initialBalance)
    local self = { balance = initialBalance }
    local withdraw = function(v)
        self.balance = self.balance - v
    end
    local deposit = function(v)
        self.balance = self.balance + v
    end
    local getBalance = function()
        return self.balance
    end
    return {
        withdraw = withdraw,
        deposit = deposit,
        getBalance = getBalance
    }
end

a = newAccount(100);
a.deposit(100)
print(a.getBalance())
print(a.balance)
]]

--[[
local arr1 = {1, 2, 3, [5]=5}
print(#arr1)               -- output: 3

local arr2 = {1, 2, 3, nil, nil}
print(#arr2)               -- output: 3

local arr3 = {1, nil, 2}
arr3[5] = 5
print(#arr3)               -- output: 1

local arr4 = {1,[3]=2}
arr4[4] = 4
print(#arr4)               -- output: 4
]]

--[[
local start, finish = string.find("hello", "he");
print(start, finish)
local start = string.find("hello", "he");
print(start)
local _, finish = string.find("hello", "he");
print(finish);
]]

--[[
local t = { 1, 3, 5 };
for i, v in ipairs(t) do
    print(i, v)
end
print("==============");
for _, v in ipairs(t) do
    print(v)
end
]]

--[[
local my_module = require "my_module"
my_module.foo()
]]


--[[
local redis = require "redis_iresty"
local red = redis:new()

local ok, err = red:set("dog", "an animal")
if not ok then
    print("failed to set dog: ", err)
    return
end

print.say("set result: ", ok)
]]


--[[
function fact(n)
    if n == 0 then
        return 1
    else
        return n * fact(n - 1)
    end
end

print("enter a number:")
a = io.read("*number")
print(fact(a))
]]

sum = 0
i = 1
while true do
    sum = sum + i
    if sum > 100 then
        break
    end
    i = i + 1
end
print("The result is " .. i) -->output:The result is 14
print(os.time())

local corp = {
    web = "www.google.com", --索引为字符串，key = "web", value = "www.google.com"
    telephone = "12345678", --索引为字符串
    staff = { "Jack", "Scott", "Gary" }, --索引为字符串，值也是一个表
    100876, --相当于 [1] = 100876，此时索引为数字,key = 1, value = 100876
    100191, --相当于 [2] = 100191，此时索引为数字
    [10] = 360, --直接把数字索引给出
    ["city"] = "Beijing" --索引为字符串
}
print(corp)

local str = "abcde"
print("case 1:", str:sub(1, 2))
print("case 2:", str.sub(str, 1, 2))



local file = io.input("fileTest") --使用io.input()函数打开文件
repeat
    local line = io.read() --逐行读取内容，文件结束时返回nil
    if nil == line then
        break
    end
    print(line)
until (false)
io.close(file) --关闭文件

for i = 10, 1, -1 do
    print(i)
end

for i = 1, math.huge do
    if (0.3 * i ^ 3 - 20 * i ^ 2 - 500 >= 0) then
        print(i)
        break
    end
end


local a = { "a", "b", "c", "d" }
for i, v in ipairs(a) do
    print("index:" .. i .. " value:" .. v)
end

for k in pairs(a) do
    print(k)
end

local strTest = "aaa bbb ccc, ddd,eee";
for w in string.gmatch(strTest, "%a+") do
    print(w)
end

print("hello world!")
local m = math.max(1, 5)
print(m)
print("====================================");

local function swap(a, b) --定义函数swap,函数内部进行交换两个变量的值
local temp = a
a = b
b = temp
print(a, b)
end

local x = "hello"
local y = 20
print(x, y)
swap(x, y) --调用swap函数
print(x, y) --调用swap函数后，x和y的值并没有交换


local function func(...) --形参为 ... ,表示函数采用变长参数
local temp = { ... } --访问的时候也要使用 ...
local ans = table.concat(temp, " ") --使用table.concat库函数，对数组内容使用" "拼接成字符串。
print(ans)
end

func(1, 2) --传递了两个参数
func(1, 2, 3, 4) --传递了四个参数

local function swap(a, b) --定义函数swap，实现两个变量交换值
return b, a --按相反顺序返回变量的值
end

local x = 1
local y = 20
x, y = swap(x, y) --调用swap函数
print(x, y)


local a = {}
local b = {name = "Bob", sex = "Male"}
local c = {"Male", "Female"}
local d = nil

print(#a)
print(#b)
print(#c)

if _G.next(a) then
    print("_G.next(a) == nil");
end

print(not not d)






