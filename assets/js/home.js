function load() {
    window.location.reload();
};

function outFn() {
    window.location.href = '../index.html';
};

layui.define(['http', "getFn"], function (e) {
    var http = layui.http,
        urls = layui.urls,
        getFn = layui.getFn;

    var $ = layui.jquery,
        layForm = layui.form,
        laydate = layui.laydate;

    $("#user").html(sessionStorage.user);
    var level = sessionStorage.limit;
    $("[name=level" + level + "]").hide();

    // 获取默认站点
    var siteId = null;
    var latlog = [];
    function getSiteFn() {
        http({
            url: urls.search,
            type: 'get',
            data: {},
            success: function (res) {
                var data = res.data;
                var str = '';
                for (var i = 0; i < data.length; i++) {
                    str += '<option value="' + data[i].id + '">' + data[i].station + '</option>';
                };
                $("#laySearch").html(str);

                http({
                    url: urls.sitedefault,
                    type: 'get',
                    data: {},
                    success: function (res) {
                        siteId = res.id;
                        layForm.val("layForm", {
                            site: siteId
                        });
                        fileFn();
                        getTypeFn();
                        getDetaFn();
                    }
                });
            }
        });

    };
    getSiteFn();
    // 获取站点详情
    function getDetaFn() {
        http({
            url: urls.sitedeta,
            type: 'post',
            data: {
                id: siteId
            },
            success: function (res) {
                var data = res.data.fields;
                latlog = [data.lon, data.lat];
                setImgFn();
            }
        });
    }
    //监听选择
    layForm.on('select(laySearch)', function (data) {
        siteId = data.value;
        getDetaFn();
        fileFn();
    });

    var fileTime = null;
    function fileFn() {
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
                fileTime = setTimeout(function () {
                    fileFn();
                }, 60000);
            }
        });
    };

    // 监听异常
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

    function clickFn() {
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
    // 右侧海区数据到报显示
    var barTime = null;
    function getBarFn() {
        clearTimeout(barTime);
        http({
            url: urls.bar,
            type: 'get',
            data: {},
            success: function (res) {
                var data = res.data;
                var str = '';
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    str += '<div>' +
                        '<p title="' + dataItem.name + '">' + dataItem.name + '</p>' +
                        '<p>' + dataItem.total + '</p>' +
                        '<p>' + dataItem.relay + '</p>' +
                        '<p>' + dataItem.obtain + '</p>' +
                        '</div>';
                };
                $("#menuIn").html(str);
                var type = res.type;
                type == 1 ? $("#subRt").show() : "";
            },
            complete: function () {
                barTime = setTimeout(function () {
                    getBarFn();
                }, 60000);
            }
        });
    };
    getBarFn();

    // 获取右侧站类型
    var type = "";
    var checkArr = [];
    function getTypeFn() {
        http({
            url: urls.layer,
            type: 'get',
            success: function (res) {
                var data = res.data;
                var str = '';
                for (var i = 0; i < data.length; i++) {
                    var id = data[i].id;
                    var title = data[i].title;
                    var is = data[i].checkd;
                    if (is == 1) {
                        str += '<div class="layui-inline">' +
                            '<div class="layui-input-inline">' +
                            '<input type="checkbox" value="' + id + '" lay-skin="primary" lay-filter="check" title="' +
                            title + '" checked />' +
                            '</div>' +
                            '</div>';
                        checkArr.push(id);
                    } else {
                        str += '<div class="layui-inline">' +
                            '<div class="layui-input-inline">' +
                            '<input type="checkbox" value="' + id + '" lay-skin="primary" lay-filter="check" title="' +
                            title + '"/>' +
                            '</div>' +
                            '</div>';
                    };
                };
                $("#check").html(str);
                layForm.render("checkbox");
                type = checkArr.join(',');
                mapDataFn();
                getStateFn();
            }
        });
    };
    // getTypeFn();
    // 监听类型选择
    var mapInt, mapTime, delaTime;
    layForm.on('checkbox(check)', function (data) {
        clearTimeout(mapInt);
        clearTimeout(delaTime);
        var tempVal = Number(data.value);
        var tempIs = data.elem.checked;
        if (tempIs) {
            checkArr.push(tempVal)
        } else {
            var idx = checkArr.indexOf(tempVal);
            checkArr.splice(idx, 1);
        };
        type = checkArr.join(',');
        delaTime = setTimeout(function () {
            mapDataFn();
            getStateFn();
        }, 1000)
    });

    // 获取左侧各站报警信息
    var rollTimeout,
        rollTime = null,
        rollIntrol = null,
        rollSh = 40,
        rollSpeed = 30;

    function getStateFn() {
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
                        setRollFn();
                    }, rollSpeed);
                };
            },
            complete: function () {
                rollTimeout = setTimeout(getStateFn, 60000);
            }
        });
    };
    function setRollFn() {
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
            clearInterval(rollIntrol);
        }, function () {
            clearInterval(rollTime);
            clearTimeout(rollIntrol);
            rollTime = setInterval(function () {
                setRollFn();
            }, rollSpeed);
            rollIntrol = setTimeout(getStateFn, 30000);
        });
    };

    var station;
    var zoom = 2;
    var center = [120.81, 32.026];

    function mapDataFn() {
        http({
            url: urls.homeindex,
            type: 'get',
            data: {
                type: type,
                num: zoom
            },
            success: function (res) {
                station = res.data;
                var lineData = res.line;
                var scatData = scatConvert();
                myChart.setOption({
                    series: [{
                        data: scatData
                    }, {
                        data: lineData
                    }]
                });
                setImgFn();
            },
            complete: function () {
                mapInt = setTimeout(mapDataFn, 60000);
            }
        });
    };
    /*
        @@字段区分
        name:站点名
        id:站点ID
        type用于区分类别,1-6对应:1台站、2浮标、3雷达、4志愿船、5gps、6管理单位
        val是空值圈的颜色 1:正常(绿色),2维护(灰色),3异常(红色)
        line控制线的颜色	0为绿色 1为红色
    */
    function scatConvert() {
        var temp = [];
        for (var i = 0; i < station.length; i++) {
            var dataItem = station[i];
            var img = "image://../static/icon" + dataItem.type + dataItem.val + ".png";
            var site = dataItem.fontsize == 0 ? "" : dataItem.name;

            var obj = {
                name: site,
                site: dataItem.name,
                value: dataItem.from,
                val: dataItem.val,
                id: dataItem.id,
                type: dataItem.type,
                symbolSize: dataItem.size,
                symbol: img,
                label: {
                    normal: {
                        textStyle: {
                            fontSize: dataItem.fontsize
                        }
                    }
                }
            };
            temp.push(obj)
        };
        return temp;
    };

    // 添加选中的圈
    function setImgFn() {

        var c = myChart.convertToPixel('geo', latlog);
        var w = Math.ceil(zoom * 0.6),
            h = Math.ceil(zoom * 0.6);

        var w = w < 30 ? 30 : w,
            h = h < 30 ? 30 : h;

        var ew = Math.ceil(w / 2);
        var eh = Math.ceil(h / 2);

        var mw = c[0],
            mh = c[1];

        var l = mw - ew;
        var t = mh - eh;

        $("#sele").css({
            "width": w + 'px',
            "height": h + 'px',
            "left": l + 'px',
            "top": t + 'px',
        });
    };
    $("#sele").on("click", function () {
        clickFn();
    });
    //初始化中间地图
    var colorArr = ['#33CC00', '#f00', '#ffde00', '#808080'];
    var myChart = echarts.init(document.getElementById('maps'));

    function initEchartFn() {
        var option = {
            tooltip: {
                trigger: 'item',
                borderColor: '#FFFFCC',
                hideDelay: 0,
                transitionDuration: 0,
                extraCssText: 'z-index:100',
                textStyle: {
                    color: '#fff'
                },
                formatter: function (params) {
                    var data = params.data;
                    return data.site;
                }
            },
            geo: {
                map: 'china',
                zoom: zoom,
                scaleLimit: {
                    min: 1,
                    max: 56
                },
                // center: [108, 34],

                center: center,
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                silent: true,
                itemStyle: {
                    normal: {
                        areaColor: "rgba(0,0,0,0.1)",
                        color: '#334559',
                        // borderColor: '#00b8fd',
                        // shadowColor: '#00b8fd',
                        borderColor: '#1422CA',
                        shadowColor: '#010B1D',
                        borderWidth: 1,
                        shadowOffsetX: -2,
                        shadowOffsetY: 2,
                        shadowBlur: 10
                    },
                    emphasis: {
                        color: '#252b3d'
                    }
                },
                regions: [{
                    name: '南海诸岛',
                    itemStyle: {
                        normal: {
                            opacity: 0
                        }
                    }
                }]
            },
            series: [{
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 3,
                rippleEffect: {
                    period: 3,
                    brushType: 'fill',
                    scale: 0
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        textStyle: {
                            color: '#fff',
                            fontStyle: 'normal',
                            fontFamily: 'arial',
                            // fontSize: 14
                        },
                        formatter: '{b}'
                    }
                },
                itemStyle: {
                    normal: {
                        show: false,
                        color: function (item) {
                            var val = item.data.val;
                            return colorArr[val];
                        }
                    }
                }
            }, {
                type: 'lines',
                tooltip: {
                    formatter: function (e) {
                        //这里必须写,要不然鼠标放在线上会显示undefined
                        return '';
                    }
                },
                zlevel: 3,
                effect: {
                    show: true,
                    period: 7,
                    symbolSize: 2,
                    trailLength: 0.02,
                    constantSpeed: 50,
                    color: 'rgba(255,255,255,0.1)',
                    shadowBlur: 8
                },
                lineStyle: {
                    normal: {
                        curveness: 0.2,
                        color: function (item) {
                            var line = item.data.line;
                            var clr = line == 0 ? "rgba(51,204,0,0.1)" : "rgba(255,0,0,0.1)";
                            return clr;
                        }
                    }
                }
            }]
        };
        myChart.setOption(option);
        myChart.on('georoam', function (e) {
            var _option = myChart.getOption();
            var _zoom = _option.geo[0].zoom;
            zoom = Math.round(_zoom);
            clearTimeout(mapInt);
            mapInt = setTimeout(mapDataFn, 1000)
        });
        myChart.on('click', function (e) {
            if (e.data) {
                if (e.data.val > -1) {
                    siteId = e.data.id;
                    layForm.val("layForm", {
                        site: siteId
                    });
                    latlog = e.data.value;
                    clearTimeout(mapTime);
                    mapTime = setTimeout(function () {
                        clickFn();
                        fileFn();
                        setImgFn();
                    }, 500);
                }
            };
        });
    };
    initEchartFn();

    window.alrFn = function (url, t, w, h) {
        var url = url || '',
            // w = w || "1320px",
            w = w || "100%",
            h = h || "635px",
            title = t || !1;
        layer.closeAll(function () {
            layer.open({
                type: 2,
                title: title,
                // title: false,
                shade: 0.8,
                resize: !1,
                moveOut: 1,
                skin: "lay-drop",
                area: [w, h],
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
    // 只为了弹出配置页面
    window.alrFns = function (url) {
        layer.open({
            type: 2,
            title: "传输任务管理",
            shade: 0.8,
            resize: !1,
            moveOut: 1,
            skin: "lay-drop",
            area: ["1320px", "670px"],
            content: url,
        });
    };

    $("#user").click(function () {
        var isUser = getFn.isUserFn();
        isUser ? alrFn('./user.html', '个人中心管理', '600px', '480px') : alrFn('./users.html', '个人中心管理', '600px', '380px');
    });

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
    layForm.on('radio(monthType)', function (data) {
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

    layForm.on('submit(dateBtn)', function (data) {
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

    layForm.verify({
        handler: function (val) {
            if (!/^[\u4E00-\u9FA5a-zA-Z]*$/.test(val)) {
                return '请输入正确的故障处理人!';
            }
        }
    });

    // 子页面调取
    window.childFn = function () {
        layer.closeAll(function () {
            inspTime = setTimeout(inspFn, 500)
        });
    };

    e("home", {})
});