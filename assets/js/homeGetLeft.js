layui.define(['http'], function (e) {
    var $ = layui.jquery;
    var http = layui.http,
        urls = layui.urls;
    // 获取左侧的今日传输和右侧的数据到报显示
    var fileTime = null;
    function getFileFn(siteId) {
        clearTimeout(fileTime);
        http({
            url: urls.receive,
            type: 'get',
            data: {
                id: siteId
            },
            success: function (res) {
                var data = res.data;
                $("#dataTime").html(data.time);
                $("#file").html(data.dir);
                $("#fileNum").html(data.dunit);
                $("#data").html(data.size);
                $("#dataNum").html(data.sunit);
                var list = data.list;
                var str = '';
                for (var i = 0; i < list.length; i++) {
                    str += '<div>' +
                        '<p>' + list[i].key + '</p>' +
                        '<p>' + list[i].val + '</p>' +
                        '</div>';
                };
                $("#rtTop").html(str);
            },
            complete: function () {
                fileTime = setTimeout(function () { getFileFn(siteId); }, 60000);
            }
        });
    };

    // 获取左侧各站报警信息
    var rollTimeout, rollTime = null, rollSh = 40, rollSpeed = 30;
    function getStateFn(type) {
        clearTimeout(rollTime);
        clearTimeout(rollTimeout);
        $("#roll").empty();
        http({
            url: urls.alarms,
            type: 'get',
            data: {
                type: type
            },
            success: function (res) {
                var data = res.data;
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i].fields;
                    var title = dataItem.station + dataItem.faultReason;
                    var str = '<ul class="item">' +
                        '<li title=' + title + '>' + title + '</li>' +
                        '<li>' + dataItem.startTime + '</li>' +
                        '</ul>';
                    $("#roll").append(str);
                };
                clearInterval(rollTime);
                if ($("#roll").height() > $("#deta").height()) {
                    rollTime = setInterval(function () {
                        setRollFn(type);
                    }, rollSpeed);
                };
            },
            complete: function () {
                rollTimeout = setTimeout(function () { getStateFn(type); }, 60000);
            }
        });
    };
    function setRollFn(type) {
        $("#roll").animate({
            marginTop: '-=1'
        }, 0, function () {
            var s = Math.abs(parseInt($(this).css("margin-top")));
            if (s >= rollSh) {
                $(this).find("ul").slice(0, 1).appendTo($(this));
                $(this).css("margin-top", 0);
            }
        });
        $("#deta").hover(function () {
            clearTimeout(rollTime);
            clearTimeout(rollTimeout);
        }, function () {
            clearInterval(rollTime);
            clearTimeout(rollTimeout);
            rollTime = setInterval(function () {
                setRollFn();
            }, rollSpeed);
            rollTimeout = setTimeout(function () {
                getStateFn(type);
            }, 30000);
        });
    };

    var homeGet = {
        getFileFn: getFileFn,
        getStateFn: getStateFn
    };
    e("homeGetLeft", homeGet)
});