--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/7/8
-- Time: 16:43
-- To change this template use File | Settings | File Templates.
--

local json = require './resty/dkjson'
--[[
function compFunc(a, b)
    math.randomseed(os.time());
    return math.random() < 0.5
    ]]--[[if math.random() < 0.5 then
        return true;
    end]]--[[
end

local t = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
for i = 1, #t do
    print(t[i]);
end]]

--[[print("===================");
local len = #t;
print("len: ", len);
math.randomseed(os.time())
local ran = math.random();
print("ran: ", ran);
local index = math.ceil(ran * len);
print("index: ", index);


print(t[index]);]]

--[[
table.sort(t, compFunc);

print("===================");
for i = 1, #t do
    print(t[i]);
end
]]


--[[function(a, b)
   if math.random() - 0.5 > 0 then
       return 1;
   end
   return 0;
end]]

--[[local json = require './resty/dkjson'
local a = "[{\"id\":0.1,\"no\":1},{\"id\":-0.5,\"no\":2},{\"id\":3.2,\"no\":3},{\"id\":-6.7,\"no\":4},{\"id\":0.15,\"no\":5},{\"id\":0.04,\"no\":6},{\"id\":7.15,\"no\":7}]";
local b = json.decode(a);
for i = 1, #b do
    print(json.encode(b[i]));
end
print("============================");
table.sort(b, function(a, b)
    ]]--[[if b.id > a.id then
        return true;
    end]]--[[
    math.randomseed(os.time());
    if math.random() > 0.5 then
        return true;
    end
end)

print(json.encode(b));]]
--[[

function getRandomEle(list, count)
    return list[(count % #list) + 1];
end

--print(getRandomEle({ 1, 2, 3, 4, 5, 6, 7, 8, 9 }, "1"));

local a;
print(not  a);
]]
--[[local t = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
for i = 1, #t do
    if t[i] > 5 then return end;
    print(t[i]);
end]]




function Split(szFullString, szSeparator)
    local nFindStartIndex = 1
    local nSplitIndex = 1
    local nSplitArray = {}
    while true do
        local nFindLastIndex = string.find(szFullString, szSeparator, nFindStartIndex)
        if not nFindLastIndex then
            nSplitArray[nSplitIndex] = string.sub(szFullString, nFindStartIndex, string.len(szFullString))
            break
        end
        nSplitArray[nSplitIndex] = string.sub(szFullString, nFindStartIndex, nFindLastIndex - 1)
        nFindStartIndex = nFindLastIndex + string.len(szSeparator)
        nSplitIndex = nSplitIndex + 1
    end
    return nSplitArray
end

function getMinus(timeStr)
    local timeList = Split(timeStr, ":");
    return tonumber(timeList[1]) * 60 + tonumber(timeList[2]);
end

local startTime = "14:28";
local endTimes = "15:20";
local nowTimes = "14:21";
if getMinus(nowTimes) >= getMinus(startTime) and getMinus(nowTimes) <= getMinus(endTimes) then
    print("=============");
end
