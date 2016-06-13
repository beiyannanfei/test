$(function() {
    var page = 0;
    var options = {}
    var scripts=document.scripts;
    var pageSize = 10
    var jsHost;
    for(var i=scripts.length;i>0;i--){
        if(scripts[i-1].src.indexOf("lottery-bound.js") > -1){
            jsHost=scripts[i-1].src.substring(0,scripts[i-1].src.lastIndexOf("/pointMall/javascripts/lottery-bound.js"));
        }
    }

    $('head').append('<link href="' + jsHost + '/pointMall/stylesheets/lottery-bound.css" rel="stylesheet" type="text/css" />');

    function loadRecord(done){
        $.ajax({
            method: 'GET',
            url: jsHost + '/pointMall/3rd/lottery/record/list?pageSize=' + pageSize + '&page=' + page + '&activityIds=' + options.ids + '&token=' + options.token + '&_=' + new Date().getTime(),
            success: function(data){
                renderBound(data, done)
            },
            error: function(xhr){
                done(xhr.responseText)
            }
        })
    }

    function initBound(done){
        var domString = '';
        domString += '<div class="bound-tip-text" id="bound-tip-text"> ── 看看朋友们的运气如何 ──</div>'
        domString += '<ul class="bound_list_others" id="bound-list">'
        domString += '</ul>'
        domString += '<div id="lottery-load-more" style="text-align: center; font-size: 14px; padding: 6px 10px; display: none; color: white;">查看更多</div>'
        done(null)
        $('#' + options.viewId).append(domString)
        loadRecordData()

        $('#lottery-load-more').click(function(){
            page++
            loadRecordData()
        })
    }

    function loadLotteryData(viewId, token, ids, done){
        if (!ids || ids.length == 0){
            return done('没有抽奖id')
        }
        if (!token){
            return done('没有token参数');
        }
        if (!viewId){
            return done('没有viewId参数');
        }
        ids = ids.join(',')

        options.token = token
        options.ids = ids
        options.viewId = viewId
        initBound(done);
    }

    function loadRecordData(){
        loadRecord(function(err, data){
            if (err){
                alert('加载失败');
            } else {
                $('#bound-list').append(data)
            }
        });
    }

    function renderBound(data, done){
        var domString = '';
        $.each(data, function(i, o){
            domString += '<li><div class="avatar"><img src="' + o.userIcon + '"></div>' +
                '<div class="cnt"><span class="arrow"></span>' +
                '<h2><strong>' + o.userName + '</strong><span>' + o.dateTime + '</span></h2>' +
                '<div class="desc">参与抽奖中了' + o.prizeName + '</div></div></li>'
        })
        if (data.length < pageSize){
            $('#lottery-load-more').hide()
        } else {
            $('#lottery-load-more').show()
        }
        if (page == 0 && data.length == 0){
            $('#bound-tip-text').hide()
        } else {
            $('#bound-tip-text').show()
        }
        done(null, domString)
    }

    $.extend({
        loadLotteryData: loadLotteryData
    })
});