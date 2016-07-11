--
-- Created by IntelliJ IDEA.
-- User: wyq
-- Date: 2016/7/8
-- Time: 11:05
-- To change this template use File | Settings | File Templates.
--

local json = require 'cjson'
local redisPool = require 'dzp/redis_wyqPool'

function split(szFullString, szSeparator)
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
    local timeList = split(timeStr, ":");
    return tonumber(timeList[1]) * 60 + tonumber(timeList[2]);
end

function getRanDefaultPrize(list, count)    --随机获取一个默认将奖
    return list[(count % #list) + 1];
end

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
    ngx.log(ngx.INFO, string.format("================= user part times: %s =============", userPartTimes));
    if tonumber(userPartTimes) > dzpInfo.limit then
        return ngx.say("no part times");
    end

    local totalPartKey = "dzp_total_part_in_times"; -- 获取大转盘总的参与次数
    local tatalPartTimes, err = redisClient:hincrby(totalPartKey, dzpId, 1);
    if err then
        ngx.log(ngx.ERR, "********** redis err: ", err);
        return ngx.say("redis err: ", err);
    end
    ngx.log(ngx.INFO, string.format("================= total part times: %s =============", tatalPartTimes));

    local blackUserKey = "dzp_prize_winner_user_black-" .. tOpenId; --获取用户是不是黑名单
    local isBlack, err = redisClient:get(blackUserKey);
    if err then
        ngx.log(ngx.ERR, "********** redis err: ", err);
        return ngx.say("redis err: ", err);
    end
    ngx.log(ngx.INFO, string.format("================= isBlack: %s =============", isBlack));

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
    if a.perTimes > b.perTimes then
        return true;
    end
    end);
    ngx.log(ngx.INFO, string.format("================= normalPrize: %s, defaultPrize: %s", json.encode(normalPrize), json.encode(defaultPrize)));

    local finanalPrize = nil;       --最终奖
    for index = 1, #normalPrize do
        local tempPrize = normalPrize[index];
        local perTimes = tempPrize.perTimes; --间隔
        if tatalPartTimes % perTimes == 0 then --满足间隔
            local rule = tempPrize.rule; --规则
            if rule == 2 then --按天
                local key = "dzp_prize_issued_count";       --获取奖品当天已经发放的数量
                local field = dzpId .. "_" .. tempPrize.id .. "_" .. string.format("%d%02d%02d", nowTable.year, nowTable.month, nowTable.day);
                local todayTimes, err = redisClient:hincrby(key, field, 1);
                if err then
                    ngx.log(ngx.ERR, "********** redis err: ", err);
                    return ngx.say("redis err: ", err);
                end
                if todayTimes <= tempPrize.count then    --满足今天的封顶数量
                    local key = "dzp_prize_total_issued_count"; --获取奖品总的发放数量
                    local field = dzpId .. "_" .. tempPrize.id;
                    local totalTimes, err = redisClient:hincrby(key, field, 1);
                    if err then
                        ngx.log(ngx.ERR, "********** redis err: ", err);
                        return ngx.say("redis err: ", err);
                    end
                    if totalTimes <= tempPrize.limitCount then  -- 没有超过封顶数量
                        finanalPrize = tempPrize;
                        break;
                    end
                end
            else --按时间段
                local nowMins = nowTable.hour * 60 + nowTable.min;  --当前时间的分钟数
                for aIndex = 1, #tempPrize.times do
                    local tempTimes = tempPrize.times[aIndex];
                    local startMins = getMinus(tempTimes.startTime);
                    local endMins = getMinus(tempTimes.endTime);
                    if nowMins >= startMins and nowMins <= endMins then     --时间符合
                        local key = "dzp_prize_issued_count";       --获取奖品当天这个时间段已经发放的数量
                        local field = dzpId .. "_" .. tempPrize.id .. "_" .. tempTimes.startTime .. "_" .. string.format("%d%02d%02d", nowTable.year, nowTable.month, nowTable.day);
                        local todayTimes, err = redisClient:hincrby(key, field, 1);
                        if err then
                            ngx.log(ngx.ERR, "********** redis err: ", err);
                            return ngx.say("redis err: ", err);
                        end
                        if todayTimes <= tempPrize.count then    --满足今天的封顶数量
                            local key = "dzp_prize_total_issued_count"; --获取奖品总的发放数量
                            local field = dzpId .. "_" .. tempPrize.id;
                            local totalTimes, err = redisClient:hincrby(key, field, 1);
                            if err then
                                ngx.log(ngx.ERR, "********** redis err: ", err);
                                return ngx.say("redis err: ", err);
                            end
                            if totalTimes <= tempPrize.limitCount then  -- 没有超过封顶数量
                                finanalPrize = tempPrize;
                                break;
                            end
                        end
                    end
                    if finanalPrize then    --奖品确定
                        break;
                    end
                end
            end
        end
    end

    ngx.log(ngx.INFO, string.format("================= finanalPrize: %s", json.encode(finanalPrize)));

    if finanalPrize then    --找到大奖
        if isBlack then --黑名单用户缓存大奖
            local key = "dzp_normal_prize_list";
            local o, err = redisClient:lpush(key, json.encode(finanalPrize));
            if err then
                ngx.log(ngx.ERR, "********** redis err: %s, finanalPrize: %s", err, json.encode(finanalPrize));
            end
            finanalPrize = getRanDefaultPrize(defaultPrize, tatalPartTimes);
        else    --不是黑名单用户加入黑名单
            local o, err = redisClient:setex(blackUserKey, 24 * 3600, nowTime);
            if err then
                ngx.log(ngx.ERR, "********** redis err: %s, finanalPrize: %s", err);
            end
        end
    else    --没有找到大奖
        finanalPrize = getRanDefaultPrize(defaultPrize, tatalPartTimes);    --先给一个默认奖
        if not isBlack then --不是黑名单
            local key = "dzp_normal_prize_list";
            local cachePrize, err = redisClient:rpop(key);
            if err then
                ngx.log(ngx.ERR, "********** redis err: %s, finanalPrize: %s", err);
            end
            if cachePrize then  --缓存中存在大奖
                finanalPrize = cachePrize;
                local o, err = redisClient:setex(blackUserKey, 24 * 3600, nowTime);
                if err then
                    ngx.log(ngx.ERR, "********** redis err: %s, finanalPrize: %s", err);
                end
            end
        end
    end
    if not finanalPrize then
        finanalPrize = getRanDefaultPrize(defaultPrize, tatalPartTimes);
    end
    return ngx.say(json.encode(finanalPrize));
end

goPrize();






