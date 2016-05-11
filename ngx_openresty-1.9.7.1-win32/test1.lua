--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/2/29
-- Time: 12:40
-- To change this template use File | Settings | File Templates.
--

--[[
local ok = 1;
local err = nil;

print(ok)
print(not ok)
print(err)
print(not err)
print("============")
print(err or ok)

print((not ok) or err)
print(err or (not ok))
]]

--[[
local openId = "aaa"
local sig = nil
if (not openId) or (not sig) then
    print("null", openId, sig)
else
    print("not null", openId, sig)
end

local _M = {
    ENV="ws",
    yyyAuth="http://yao.qq.com/tv/entry?redirect_uri=",
    redirect="http://yaotv.qq.com/shake_tv/auto2/2015/12/24gylpwii6n0vs3/yao/index.html",
    orderRedis={
        "10.47.107.125:7003",
        "10.47.107.125:7002",
        "10.47.76.50:7003",
        "10.47.76.50:7002",
        "10.47.76.76:7003",
        "10.47.76.76:7002",
        "10.45.21.149:7003",
        "10.45.21.149:7002",
        "10.47.107.251:7003",
        "10.47.107.251:7002"
    },
    dayPayRedis = {
        "10.117.180.219:6383"
    }
}

print(_M["dayPayRedis"][1])

local rkey = "9t8V7m6I5n4I3n2G1";
local encryStr = string.format("%s&%s", openId, rkey);
print(encryStr)

local a1 = "asdf1";
local a2 = "0asdf1";

if a1 ~= a2 then
    print("not equal");
else
    print("equal");
end

local a3 = "AAAAAAAAAA_" .. a2;
print(a3)
]]

local tojson = require "lualib.resty.dkjson"
local a = { a = 10, b = 20, v = 30, 40 };
local b = tojson.encode(a);
print(b);

print(tojson.decode(b));

