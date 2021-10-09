function load() {
    window.location.reload();
};

function outFn() {
    window.location.href = '../index.html';
};

layui.define(["http", "getFn"], function (e) {
    var http = layui.http, urls = layui.urls, getFn = layui.getFn;
    var $ = layui.jquery, form = layui.form, laydate = layui.laydate, carousel = layui.carousel;

    $("#user").html(sessionStorage.user);
    var level = sessionStorage.limit;
    $("[name=level" + level + "]").hide();

    $("#toFn").click(function () {
        window.location.href = '../pages/home.html';
    });
    $("#user").click(function () {
        var isUser = getFn.isUserFn();
        isUser ? alrFn('./user.html', '个人中心管理', '600px', '480px') : alrFn('./users.html', '个人中心管理', '600px', '380px');
    });


    var carIdex = 0;
    carousel.render({ elem: '#carousel', autoplay: false, arrow: 'always', width: '440px', height: '100%', indicator: 'none', index: this.carIdex });
    carousel.on('change(carousel)', (obj) => { carIdex = obj.index; getEchartsFn(); });

    function getEchartsFn() {
        if (carIdex == 1) {
            getGaugeFn();
            getLineFn();
        } else {
            clearTimeout(this.gaugeTimout);
            clearTimeout(this.lineTimout);
            getFileFn();
        }
    };

    // 获取默认站点
    var xm, siteId, latlog = [];
    function initXmFn() {
        http({
            url: urls.search,
            success: (res) => {
                var data = res.data;
                xm = xmSelect.render({
                    el: '#xmSelect',
                    radio: true, clickClose: true,
                    prop: { name: 'station', value: 'id' },
                    model: { icon: 'hidden', label: { type: 'text' } },
                    filterable: true, data: data,
                    on: (e) => { siteId = e.change[0].id; getEchartsFn(); getDetaFn(); clickFn(); }
                });
                http({
                    url: urls.sitedefault,
                    type: 'get',
                    success: (res) => {
                        siteId = res.id;
                        xm.setValue([res.id]);
                        getDetaFn();
                        getTypeFn();
                    }
                });
            },
        });
    };
    initXmFn();

    function getDetaFn() {
        http({
            url: urls.sitedeta,
            type: 'post',
            data: { id: siteId },
            success: function (res) {
                var data = res.data.fields;
                latlog = [data.lon, data.lat];
                setImgFn();
                getFileFn();
            }
        });
    };
    //左侧数据:今日传输量和数据到报显示
    var fileTime;
    function getFileFn() {
        clearTimeout(fileTime);
        http({
            url: urls.receive,
            data: { id: siteId },
            success: (res) => {
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
            complete: () => {
                fileTime = setTimeout(function () { getFileFn(); }, 60000);
            }
        });
    };

    // 获取右侧站类型
    var type = "", checkArr = [];
    function getTypeFn() {
        http({
            url: urls.layer,
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
                form.render("checkbox");
                type = checkArr.join(',');
                mapDataFn();
                getStateFn();
            }
        });
    };
    // 监听类型选择
    var mapInt, mapTime, delaTime;
    form.on('checkbox(check)', function (data) {
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
    // 地图数据
    var zoom = 2, center = [120.81, 32.026];
    function mapDataFn() {
		clearTimeout(mapInt);
        http({
            url: urls.homeindex,
            data: {
                type: type, num: zoom
            },
            success: function (res) {
                var station = res.data;
                var lineData = res.line;
                var scatData = scatConvert(station);
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
    function scatConvert(station) {
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
    // 左侧报警
    var rollTime, rollTimeout, rollSh = 40, rollSpeed = 30;
    function getStateFn() {
        clearInterval(rollTime);
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
            clearInterval(rollTime);
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

    // 初始化地图
    var colorArr = ['#33CC00', '#f00', '#ffde00', '#808080'];
    var myChart = echarts.init(document.getElementById('map'));
    function initMapFn() {
        var option = {
            tooltip: {
                trigger: 'item', borderColor: '#FFFFCC', hideDelay: 0,
                transitionDuration: 0, extraCssText: 'z-index:100',
                textStyle: { color: '#fff' },
                formatter: function (params) {
                    var data = params.data;
                    return data.site;
                }
            },
            geo: {
                map: 'china', zoom: zoom,
                scaleLimit: { min: 1, max: 56 },
                center: center,
                label: { emphasis: { show: false } },
                roam: true, silent: true,
                itemStyle: {
                    normal: {
                        areaColor: "rgba(0,0,0,0.1)", color: '#334559', borderColor: '#1422CA', shadowColor: '#010B1D',
                        borderWidth: 1, shadowOffsetX: -2, shadowOffsetY: 2, shadowBlur: 10
                    },
                    emphasis: { color: '#252b3d' }
                },
                regions: [{ name: '南海诸岛', itemStyle: { normal: { opacity: 0 } } }]
            },
            series: [{
                type: 'effectScatter', coordinateSystem: 'geo', zlevel: 3,
                rippleEffect: { period: 3, brushType: 'fill', scale: 0 },
                label: {
                    normal: {
                        show: true, position: 'right',
                        textStyle: { color: '#fff', fontStyle: 'normal', fontFamily: 'arial' },
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
                        return '';
                    }
                },
                zlevel: 3,
                effect: {
                    show: true, period: 7, symbolSize: 2, trailLength: 0.02,
                    constantSpeed: 50, color: 'rgba(255,255,255,0.1)', shadowBlur: 8
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
                    xm.setValue([siteId]);
                    latlog = e.data.value;
                    clearTimeout(mapTime);
                    mapTime = setTimeout(function () {
                        clickFn();
                        getFileFn();
                        getEchartsFn();
                        setImgFn();
                    }, 500);
                }
            };
        });
    };
    initMapFn();

    // 右侧数据:右侧海区到报显示
    var barTime;
    function getSeaDataFn() {
        clearTimeout(barTime);
        http({
            url: urls.bar,
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
                    getSeaDataFn();
                }, 60000);
            }
        });
    };
    getSeaDataFn();

    // 获取仪表盘数据 右侧水文或气象的切换
    var siteHtml = $("span.type").eq(0).html();
    $("span.type").eq(0).addClass("add");
    $("span.type").click(function () {
        siteHtml = $(this).html();
        $(this).addClass("add");
        $(this).siblings().removeClass("add");
        getGaugeFn();
    });
    var gaugeTimout, gaugeArr = [], time = 60000;
    function getGaugeFn() {
        clearTimeout(gaugeTimout);
        http({
            url: urls.homeEl,
            data: {
                id: siteId,
                type: siteHtml
            },
            success: function (res) {
                var arr = res.data;
                var ec = '';
                for (var i = 0; i < arr.length; i++) {
                    ec += '<div class="gauge-item"></div>';
                };
                $("#gauge").html(ec);
                var gauge = document.getElementsByClassName("gauge-item");
                for (var g = 0; g < gauge.length; g++) {
                    gaugeArr[g] = echarts.init(gauge[g]);
                    gaugeArr[g].setOption(initGaugeFn(arr[g]));
                };
            },
            error: function () {
                for (var i = 0; i < gaugeArr.length; i++) {
                    gaugeArr[i].clear();
                };
            },
            complete: function () {
                gaugeTimout = setTimeout(function () {
                    getGaugeFn(siteId, siteHtml);
                }, 60000);
            }
        });
    };
    // 处理右侧仪表盘数据
    function initGaugeFn(data) {
        var min = data.min || 0, max = data.max || 0, value = data.value || 0, name = data.name || "", unit = data.unit || "";
        var str = name + value + unit;
        var option = {
            series: [{
                type: 'gauge',
                min: min,
                max: max,
                splitNumber: 4,
                axisLine: { lineStyle: { width: 5, color: [[0.3, "#33CC00"], [0.7, "#ffde00"], [1, "#f00"]], } },
                radius: '90%',
                pointer: { itemStyle: { color: 'auto' } },
                axisTick: { distance: 0, length: 10, lineStyle: { color: 'auto', width: 2 } },
                splitLine: { distance: 0, length: 15, lineStyle: { color: 'auto', width: 4 } },
                axisLabel: { color: '#227BA6', fontSize: 8 },
                detail: { valueAnimation: true, formatter: str, color: '#227BA6', fontSize: 16, offsetCenter: ['0%', '90%'] },
                data: [{ value: value }]
            },]
        };
        return option;
    };

    // 折线图要素选择 获取折线图数据
    var siteEl = $("#homeEl").val(), siteTimeout = null, siteType = $("div.lay_type").eq(0).html();
    form.on('select(homeEl)', function (data) {
        siteEl = data.value;
        getLineFn();
    });
    $(".lay_type").click(function () {
        clearTimeout(siteTimeout);
        $(".lay_type").removeClass("add");
        $(this).addClass("add");
        siteTimeout = setTimeout(function () {
            siteType = $(this).html();
            getLineFn();
        }, 500);
    });
    var lineTimout, myLine;
    function getLineFn() {
        clearTimeout(lineTimout);
        http({
            url: urls.homeEl,
            type: 'post',
            data: { id: siteId, name: siteEl, type: siteType },
            success: function (res) {
                var xData = res.title, data = res.data, unit = res.unit;
                var max = res.max, min = res.min;
                var max_mult = max > 0 ? 1.2 : max < 0 ? 0.8 : 0,
                    min_mult = min > 0 ? 0.8 : 1.2;
                // var max_val = Math.floor(max * max_mult),
                //     min_val = Math.ceil(min * min_mult);
				var max_val = (max * max_mult).toFixed(2),
                    min_val = (min * min_mult).toFixed(2);
                myLine = echarts.init(document.getElementById("line"));
                var option = initLineFn(siteEl, xData, data, unit, max_val, min_val);
                myLine.setOption(option);
            },
            error: function () {
                myLine.clear();
            },
            complete: function () {
                lineTimout = setTimeout(function () {
                    getLineFn(siteId, siteEl);
                }, time);
            }
        });
    };
    // 处理右侧折线图数据
    function initLineFn(siteEl, xData, data, unit, max, min) {
        var option = {
            grid: { top: 20, bottom: 20, right: 10 },
            tooltip: {
                trigger: "axis",
                formatter: function (item) {
                    var item = item[0];
                    var html = item.marker + "<span>" + item.data.time + "</span>" + "<p>" + siteEl + ":" + item.data.value + unit +
                        "</p>"
                    return html;
                }
            },
            xAxis: [{
                type: 'category',
                data: xData,
                axisLine: { onZero: false, lineStyle: { color: "#227BA6" } },
                axisTick: { show: false },
                axisLabel: { interval: "auto", textStyle: { color: "#227BA6" }, fontSize: 12, margin: 15, rotate: 45 },
                axisPointer: { label: { padding: [0, 0, 10, 0], margin: 15, fontSize: 12 } },
                boundaryGap: false
            }],
            yAxis: [{
                type: 'value',
                min: min,
                max: max,
                axisTick: { show: false },
                axisLine: { show: true, lineStyle: { color: "#227BA6" } },
                axisLabel: { textStyle: { color: "#227BA6" } },
                splitLine: { show: false }
            }],
            series: [{
                type: 'line',
                data: data,
                symbolSize: 1, symbol: 'circle', smooth: true, yAxisIndex: 0, showSymbol: false,
                lineStyle: { normal: { color: "#07a6ff" } }
            }]
        };
        return option;
    };
    
    // 监听站点异常
    var inspTime;
    function inspFn() {
        clearTimeout(inspTime);
        http({
            url: urls.faultpush,
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
    var layDeta;
    function clickFn() {
        layDeta ? layer.close(layDeta, function () {
            layerFn();
        }) : layerFn();
    };
    function layerFn() {
        http({
            url: urls.homeclock,
            data: { id: siteId },
            success: function (res) {
                var data = res.data, type = res.type, title = data.station;
                if (type < 0) {
                    var layHeight = "414px", content = '../pages/layHome.html?id=' + siteId;
                } else {
                    var layHeight = "576px", content = '../pages/layHomes.html?id=' + siteId;
                };
                layDeta = layer.open({
                    type: 2, shade: 0, resize: false,
                    title: title, area: ["355px", layHeight],
                    skin: 'drop-demo lay-drop', offset: "150px",
                    id: "drop-demo", content: content,
                    success: function () { clearTimeout(inspTime); },
                    cancel: function () { inspTime = setTimeout(inspFn, 500); layDeta = null }
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
                index = layer.load(1, { shade: [0.1, '#fff'] });
            },
            success: function (res) {
                var url = res.url;
                window.location.href = url;
                layer.closeAll(function () { inspTime = setTimeout(inspFn, 500) });
            },
            error: function () {
                layer.close(index)
            }
        });
        return false;
    });

    // 弹出页面调取封装的
    window.alrFn = function (u, t, w, h) {
        var url = u || '',
            title = t || !1,
            width = w || "100%",
            height = h || "635px";
        layAlertFn(url, title, width, height);
    };
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
    function childFn() {
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
    e("map", {})
});
