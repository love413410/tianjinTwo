layui.define(['http', 'getFn'], function (e) {
    var $ = layui.jquery,
        form = layui.form,
        laydate = layui.laydate;
    var http = layui.http,
        urls = layui.urls,
        getFn = layui.getFn;
    // 监听站点异常
    var inspTime = null;
    function inspFn() {
        http({
            url: urls.faultpush,
            type: 'get',
            data: {},
            success: function (res) {
                var data = res.data;
                var stationId = data.stationId;
                if (stationId > -1) {
                    http({
                        url: urls.homeclock,
                        type: 'get',
                        data: {
                            id: stationId
                        },
                        success: function (res) {
                            var data = res.data;
                            var type = res.type;
                            var title = data.station;
                            if (type < 0) {
                                var layHeight = "414px";
                                var content = '../pages/layHome.html?id=' + stationId;
                            } else {
                                var layHeight = "576px";
                                var content = '../pages/layHomes.html?id=' + stationId;
                            };
                            layer.open({
                                type: 2,
                                shade: 0,
                                resize: false,
                                title: title,
                                area: ["355px", layHeight],
                                skin: 'drop-demo lay-drop',
                                offset: "150px",
                                id: "drop-demo",
                                content: content,
                                success: function (layero, index) {
                                    clearTimeout(inspTime);
                                },
                                cancel: function () {
                                    http({
                                        url: urls.close,
                                        type: 'get',
                                        data: {
                                            id: stationId,
                                            type: type
                                        },
                                        success: function () {
                                            layer.closeAll(function () {
                                                inspTime = setTimeout(inspFn, 500)
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    inspTime = setTimeout(inspFn, 30000);
                };
            }
        });
    };
    inspFn();

    // 点击站点
    function clickFn(siteId) {
        http({
            url: urls.homeclock,
            type: 'get',
            data: {
                id: siteId
            },
            success: function (res) {
                var data = res.data;
                var type = res.type;
                var title = data.station;
                if (type < 0) {
                    var layHeight = "414px";
                    var content = '../pages/layHome.html?id=' + siteId;
                } else {
                    var layHeight = "576px";
                    var content = '../pages/layHomes.html?id=' + siteId;
                };
                layer.open({
                    type: 2,
                    shade: 0,
                    resize: false,
                    title: title,
                    area: ["355px", layHeight],
                    skin: 'drop-demo lay-drop',
                    offset: "150px",
                    id: "drop-demo",
                    content: content,
                    success: function () {
                        clearTimeout(inspTime);
                    },
                    cancel: function () {
                        inspTime = setTimeout(inspFn, 500)
                    }
                });
            }
        })
    };

    // 点击月报下载
    var hdate = getFn.initM();
    $("#load").click(function () {
        layer.closeAll(function () {
            layAlr = layer.open({
                type: 1,
                title: "月报下载",
                skin: 'drop-demo lay-drop',
                shade: 0.5,
                closeBtn: 1,
                area: ['400px'],
                content: $("#monthDown"),
                success: function () {
                    clearTimeout(inspTime);
                    $(".layItem").addClass("layui-hide");
                    $("#layItem").removeClass("layui-hide");
                    $('#monthDown')[0].reset();
                    var yearVal = new Date().getFullYear();
                    laydate.render({
                        elem: '#yearTime',
                        type: 'year',
                        value: yearVal,
                        max: 0,
                        trigger: 'click',
                        btns: ['confirm'],
                    });
                },
                cancel: function () {
                    inspTime = setTimeout(inspFn, 500)
                }
            });
        })
    });
    // 单选
    form.on('radio(monthType)', function (data) {
        var value = data.value;
        $('.layItem').addClass('layui-hide');
        $('.' + value).removeClass('layui-hide');
        value == "month" ? laydate.render({
            elem: '#monthTime',
            type: 'month',
            btns: ['confirm'],
            format: 'yyyy-MM',
            max: hdate,
            value: hdate,
            trigger: 'click'
        }) : "";
    });
    // 开始下载月报
    form.on('submit(dateBtn)', function (data) {
        var data = data.field;
        var type = data.type;
        switch (type) {
            case "year":
                delete data.season;
                delete data.month;
                break;
            case "season":
                data.month = data.season;
                delete data.season;
                break;
            case "month":
                delete data.season;
                var month = data.month;
                data.year = month.substring(0, 4);
                data.month = month.substring(5);
                break;
            default:
                console.log("111111")
        };
        var index;
        http({
            url: urls.homeReport,
            type: "post",
            data: data,
            beforeSend: function () {
                index = layer.load(1, {
                    shade: [0.1, '#fff']
                });
            },
            success: function (res) {
                var url = res.url;
                window.location.href = url;
                layer.closeAll(function () {
                    inspTime = setTimeout(inspFn, 500)
                });
            },
            error: function () {
                layer.close(index)
            }
        });
        return false;
    });

    // 弹出页面封装
    function layAlertFn(url, title, width, height) {
        layer.closeAll(function () {
            layer.open({
                type: 2,
                title: title,
                shade: 0.8,
                resize: !1,
                moveOut: 1,
                skin: "lay-drop",
                area: [width, height],
                content: url,
                success: function () {
                    clearTimeout(inspTime);
                },
                cancel: function () {
                    childFn();
                }
            });
        });
    };
    // 关闭页面时调取
    window.childFn = function () {
        layer.closeAll(function () {
            inspTime = setTimeout(inspFn, 500)
        });
    };

    // 正则验证
    form.verify({
        handler: function (val) {
            if (!/^[\u4E00-\u9FA5a-zA-Z]*$/.test(val)) {
                return '请输入正确的故障处理人!';
            }
        }
    });

    var homeFun = {
        layAlertFn: layAlertFn,
        clickFn: clickFn
    };
    e("homeFun", homeFun)
});