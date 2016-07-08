--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/7/8
-- Time: 11:05
-- To change this template use File | Settings | File Templates.
--

local json = require 'cjson'
local redisPool = require 'dzp/redis_wyqPool'

local goPrize = function()
    ngx.req.read_body()
    local body = ngx.req.get_post_args()
    ngx.log(ngx.INFO, "========== body ========== ", json.encode(body));

    local dzpId = body["id"]; --大转盘Id
    local tOpenId = body["openid"]; --
    if (not dzpId or not tOpenId) then
        return ngx.say("param incomplete");
    end

    local redisClient = redisPool:new({ timeout = 10000, db_address = "127.0.0.1:6379" });
    local dzpInfo, err = redisClient:hget("dzp_config_info", dzpId);
    ngx.log(ngx.INFO, "========== dzpInfo ========== ", dzpInfo);
    if err then
        ngx.log(ngx.ERR, "********** redis err: ", err);
        return ngx.say("redis err: ", err);
    end
    if (not dzpInfo) then
        ngx.log(ngx.ERR, "********** dzpInfo not exists dzpId: ", dzpId);
        return ngx.say("dzpInfo null");
    end
    dzpInfo = json.decode(dzpInfo);
    local startTime = dzpInfo.startTime;
    local endTime = dzpInfo.endTime;
    local nowTime = os.time() * 1000;
    if nowTime < startTime then
        return ngx.say("not start");
    end
    if nowTime > endTime then
        return ngx.say("already end");
    end

    --{"sec":19,"min":20,"day":8,"isdst":false,"wday":6,"yday":190,"year":2016,"month":7,"hour":15}
    local nowTable = os.date("*t", os.time()); -- 当前时间表,返回结果如上
    local userPartKey = string.format("%s%s_%s", "dzp_perDay_times-", dzpId,
        string.format("%d%02d%02d", nowTable.year, nowTable.month, nowTable.day));
    local userPartTimes, err = redisClient:hincrby(userPartKey, tOpenId, 1); --获取用户当天参与次数
    redisClient:expire(userPartKey, 24 * 3600); -- 24小时后删除
    if err then
        ngx.log(ngx.ERR, "********** redis err: ", err);
        return ngx.say("redis err: ", err);
    end
    if tonumber(userPartTimes) > dzpInfo.limit then
        return ngx.say("no part times");
    end

    local totalPartKey = "dzp_total_part_in_times"; -- 获取大转盘总的参与次数
    local tatalPartTimes, err = redisClient:hincrby(totalPartKey, dzpId, 1);
    if err then
        ngx.log(ngx.ERR, "********** redis err: ", err);
        return ngx.say("redis err: ", err);
    end

    local blackUserKey = "dzp_prize_winner_user_black-" .. tOpenId; --获取用户是不是黑名单
    local isBlack, err = redisClient:get(blackUserKey);
    if err then
        ngx.log(ngx.ERR, "********** redis err: ", err);
        return ngx.say("redis err: ", err);
    end

    local defaultPrize = {};
    local normalPrize = {};
    for i = 1, #dzpInfo.prizes do
        local tempPrize = dzpInfo.prizes[i];
        if (tonumber(tempPrize.isDefault) ~= 0) then --默认奖
        defaultPrize[#defaultPrize + 1] = tempPrize;
        else --大奖
        normalPrize[#normalPrize + 1] = tempPrize;
        end
    end
    table.sort(normalPrize, function(a, b) --大奖按中奖间隔降序排列
    return a.perTimes > b.perTimes;
    end);


end

goPrize();






