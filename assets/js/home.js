layui.define(["http", "getFn"], function (exports) {
    require([
        "esri/map", "esri/graphic", "esri/geometry/Point",
        "esri/layers/GraphicsLayer", "esri/Color", "esri/symbols/TextSymbol",
        "esri/symbols/SimpleLineSymbol", "esri/geometry/Polyline", "esri/symbols/PictureMarkerSymbol",
        "esri/layers/ArcGISTiledMapServiceLayer",
        "dojo/dom", "dojo/dom-construct", "dojo/dom-attr", "dojo/dom-style",
        "dojo/domReady!",
    ],
        function (
            Map, graphic, Point, GraphicsLayer, Color,
            TextSymbol, SimpleLineSymbol, Polyline,
            PictureMarkerSymbol, ArcGISTiledMapServiceLayer,
            dom, domConstruct, domAttr, domStyle
        ) {
            var http = layui.http, urls = layui.urls, getFn = layui.getFn;
            var $ = layui.$, form = layui.form, carousel = layui.carousel, laydate = layui.laydate;

            var userName = sessionStorage.user;
            $("#userName").html(userName);

            var layUrl = {
                layHomes: {
                    layHeight: "650px",
                    content: "../pages/layHomes.html"
                },
                layHome: {
                    layHeight: "480px",
                    content: "../pages/layHome.html"
                }
            };

            // 监控站点异常,弹出窗
            var inspTimer = null;
            function getInspFn() {
                function inspFn() {
                    http({
                        url: urls.faultpush,
                        success: function (res) {
                            var stationId = res.data.stationId;
                            if (stationId > -1) { homeclock(stationId); }
                        }
                    });
                };
                inspFn();
                inspTimer = setInterval(inspFn, 30000);

                function homeclock(stationId) {
                    http({
                        url: urls.homeclock,
                        data: { id: stationId },
                        success: function (res) {
                            var data = res.data, type = res.type, title = data.station;
                            // var layHeight = "650px", content = '../pages/layHomes.html?id=' + stationId;
                            // if (type < 0) {
                            //     layHeight = "480px"; content = '../pages/layHome.html?id=' + stationId;
                            // };
                            var layItem = type < 0 ? layUrl.layHome : layUrl.layHomes;
                            var layHeight = layItem.layHeight,
                                content = layItem.content + "?id=" + stationId;
                            layer.open({
                                type: 2, shade: 0, resize: false,
                                title: title, area: ["355px", layHeight],
                                skin: 'drop-demo lay-drop', offset: "150px",
                                id: "drop-demo", content: content,
                                success: function () { clearInterval(inspTimer); },
                                cancel: function () {
                                    http({
                                        url: urls.close,
                                        data: { id: stationId, type: type },
                                        success: function () {
                                            layer.closeAll(function () { inspFn(); })
                                        }
                                    });
                                }
                            });
                        }
                    });
                };
            };
            getInspFn();

            // 初始化xmselect
            var siteId, map, zoom = 6, center;
            var xm;
            function initXmFn() {
                http({
                    url: urls.search,
                    success: function (res) {
                        var data = res.data;
                        xm = xmSelect.render({
                            el: '#xmSelect',
                            radio: true, clickClose: true,
                            prop: { name: 'station', value: 'id' },
                            model: { icon: 'hidden', label: { type: 'text' } },
                            filterable: true, data: data,
                            on: function (e) {
                                siteId = e.change[0].id;
                                getEchartsFn();
                                clickFn()
                            }
                        });
                        http({
                            url: urls.sitedefault,
                            success: function (res) {
                                siteId = res.id;
                                xm.setValue([res.id]);
                                center = [res.lon, res.lat];
                                initMapFn();
                            }
                        });
                    },
                });
            };
            initXmFn();

            var layDeta;
            function clickFn() {
                layDeta ? layer.close(layDeta, function () {
                    layerFn()
                }) : layerFn();
            };

            function layerFn() {
                http({
                    url: urls.homeclock,
                    data: { id: siteId },
                    success: function (res) {
                        var data = res.data, type = res.type, title = data.station;
                        // var layHeight = "650px", content = '../pages/layHomes.html?id=' + siteId;
                        // if (type < 0) {
                        //     layHeight = "480px"; content = '../pages/layHome.html?id=' + siteId;
                        // };
                        var layItem = type < 0 ? layUrl.layHome : layUrl.layHomes;
                        var layHeight = layItem.layHeight,
                            content = layItem.content + "?id=" + siteId;
                        layDeta = layer.open({
                            type: 2, shade: 0, resize: false,
                            title: title, area: ["355px", layHeight],
                            skin: 'drop-demo lay-drop', offset: "150px",
                            id: "drop-demo", content: content,
                            success: function () { clearInterval(inspTimer); },
                            cancel: function () { setTimeout(getInspFn, 500); layDeta = null }
                        });
                    }
                });
            };


            var mapTimer;
            function initMapFn() {
                map = new Map("map", { zoom: zoom, minZoom: 5, center: center });
                var baseUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer";
                // var baseUrl = "http://71.3.251.104:8066/arcgis/rest/services/6199/0/MapServer?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNjN8NjE5OXw3MS4zLjAuMTB8fHx8MSIsImlhdCI6MTYyOTk0NDUyNywiZXhwIjoxNjMwMzA0NTI3fQ.qh-q9Xq66jwPqR1TatApz6f79Xe4mziSJvJ6Ehhm9dPXSR3T5yRuiFPcmfHEKxPLn2gJRR6htRRR75HfS1RyoQ";
                var layer = new ArcGISTiledMapServiceLayer(baseUrl);
                map.addLayer(layer);
                map.on("zoom-end", function (e) {
                    clearTimeout(mapTimer);
                    zoom = e.level;
                    zoom = e.level;
                    mapTimer = setTimeout(mapDataFn, 500);
                });
                getTypeFn();
            };
            // 获取站点类型
            var checkArr = [], type = '';
            function getTypeFn() {
                http({
                    url: urls.layer,
                    success: function (res) {
                        var country = res.country, checks = '';
                        for (var i = 0; i < country.length; i++) {
                            var id = country[i].id,
                                title = country[i].title,
                                is = country[i].checkd;
                            if (is == 1) {
                                checks += '<div class="layui-inline">' +
                                    '<div class="layui-input-inline">' +
                                    '<input type="checkbox" value="' + id + '" lay-skin="primary" lay-filter="check" title="' +
                                    title + '" checked />' +
                                    '</div>' +
                                    '</div>';
                                checkArr.push(id);
                            } else {
                                checks += '<div class="layui-inline">' +
                                    '<div class="layui-input-inline">' +
                                    '<input type="checkbox" value="' + id + '" lay-skin="primary" lay-filter="check" title="' +
                                    title + '"/>' +
                                    '</div>' +
                                    '</div>';
                            };
                        };
                        $("#checks").html(checks);

                        var local = res.local, check = '';

                        for (var i = 0; i < local.length; i++) {
                            var id = local[i].id,
                                title = local[i].title,
                                is = local[i].checkd;
                            if (is == 1) {
                                check += '<div class="layui-inline">' +
                                    '<div class="layui-input-inline">' +
                                    '<input type="checkbox" value="' + id + '" lay-skin="primary" lay-filter="check" title="' +
                                    title + '" checked />' +
                                    '</div>' +
                                    '</div>';
                                checkArr.push(id);
                            } else {
                                check += '<div class="layui-inline">' +
                                    '<div class="layui-input-inline">' +
                                    '<input type="checkbox" value="' + id + '" lay-skin="primary" lay-filter="check" title="' +
                                    title + '"/>' +
                                    '</div>' +
                                    '</div>';
                            };
                        };
                        $("#check").html(check);
                        form.render("checkbox");
                        type = checkArr.join(',');
                        mapDataFn();
                        getFileFn();
                        getFaultFn();
                        getSeaDataFn();
                    },
                });
            };
            // 类型选择
            var delaTime;

            form.on('checkbox(check)', function (data) {
                clearTimeout(delaTime);
                var value = Number(data.value);
                var checked = data.elem.checked;
                if (checked) {
                    checkArr.push(value)
                } else {
                    var idx = checkArr.indexOf(value);
                    checkArr.splice(idx, 1);
                };
                type = checkArr.join(',');
                delaTime = setTimeout(function () {
                    mapDataFn();
                    getFileFn();
                    getFaultFn();
                    getSeaDataFn();
                }, 1000);
            });

            // 获取地图数据
            var mapDataTimer;
            function mapDataFn() {
                clearTimeout(mapDataTimer);
                http({
                    url: urls.homeindex,
                    type: "post",
                    data: { type: type, num: zoom },
                    success: function (res) {
                        setLineDataFn(res.line);
                        setMapDataFn(res.data);
                    }
                });
                mapDataTimer = setTimeout(mapDataFn, 60000);
            };

            function setLineDataFn(data) {
                if (data.length <= 0) {
                    return false;
                };
                var mapLayers = map.getLayer('lineId');
                if (mapLayers != undefined) { map.removeLayer(mapLayers) };
                var layer = new GraphicsLayer({ id: "lineId" });
                map.addLayer(layer, 7);
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i].coords;
                    var isShowLine = data[i].line;
                    if (isShowLine != 100) {
                        var paths = [dataItem[0], dataItem[1]];
                        var geos = new Polyline({ "paths": [paths] });
                        var line = data[i].line;
                        var color = line == 0 ? new Color("#32CD32") : new Color("#f00");
                        var lines = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, color, 1);
                        var sls = new graphic(geos, lines);
                        layer.add(sls);
                    };
                };
            };
            function setMapDataFn(data) {
                if (data.length <= 0) { return false; };
                var mapLayers = map.getLayer('mapLayer');
                if (mapLayers != undefined) { map.removeLayer(mapLayers); };
                var mapLayer = new GraphicsLayer({ id: "mapLayer" });
                map.addLayer(mapLayer, 9);
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    var log = dataItem.from[0], lat = dataItem.from[1];
                    var area = zoom * 2 >= 18 ? 18 : zoom * 2 <= 10 ? 10 : zoom * 2;
                    var point = new Point(log, lat);
                    var pic = new PictureMarkerSymbol({
                        url: "../static/icon" + dataItem.type + dataItem.val + ".png",
                        width: area, height: area, item: dataItem
                    });
                    var gp = new graphic(point, pic);
                    mapLayer.add(gp);
                    //添加站名
                    if (zoom >= 8) {
                        var text = new TextSymbol({
                            text: dataItem.name,
                            xoffset: 0,
                            yoffset: -20,
                            color: new Color("#227ba6"),
                            item: dataItem
                        });
                        var siteName = new graphic(point, text);
                        mapLayer.add(siteName);
                    };
                };

                var isClick;
                mapLayer.on('click', function (e) {
                    clearTimeout(isClick);
                    isClick = setTimeout(function () {
                        var item = e.graphic.symbol.item;
                        siteId = item.id;
                        xm.setValue([siteId]);
                        getEchartsFn();
                        clickFn();
                        getFileFn();
                    }, 250);
                });
            };

            // 判断是哪个轮播图页面
            var carIdex = 0;
            function getEchartsFn() {
                if (carIdex == 1) {
                    getGaugeFn();
                    getLineFn();
                } else {
                    clearTimeout(gaugeTimer);
                    clearTimeout(lineTimer);
                    getFileFn();
                };
            };
            carousel.render({ elem: '#carousel', autoplay: false, arrow: 'always', width: '440px', height: '100%', indicator: 'none', index: carIdex });
            carousel.on('change(carousel)', function (obj) { carIdex = obj.index; getEchartsFn(); });

            //左侧-今日传输量 右侧-实时文件到报显示
            var fileTime;
            function getFileFn() {
                clearTimeout(fileTime);
                http({
                    url: urls.receive,
                    data: { id: siteId, type: type },
                    success: function (res) {
                        var data = res.data;
                        var list = data.list, listStr = '';
                        for (var i = 0; i < list.length; i++) {
                            var dataItem = list[i];
                            listStr += '<div>' +
                                '<p>' + dataItem.key + '</p>' +
                                '<p>' + dataItem.val + '</p>' +
                                '</div>';
                        };
                        $("#rtTop").html(listStr);
                        $("#dataTime").html(data.time);

                        $("#file").html(data.dir);
                        $("#fileNum").html(data.dunit);
                        $("#data").html(data.size);
                        $("#dataNum").html(data.sunit);

                    },
                });
                fileTime = setTimeout(getFileFn, 60000);
            };
            // 左侧-各站点故障信息
            var faultTimer, rollTimer;
            function getFaultFn() {
                clearTimeout(faultTimer);
                clearInterval(rollTimer);
                $("#roll").empty();
                http({
                    url: urls.alarms,
                    data: { type: type },
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
                        if ($("#roll").height() > $("#deta").height()) {
                            rollTimer = setInterval(setRollFn, 30);
                        };
                    }
                });
                faultTimer = setTimeout(getFaultFn, 60000);
            };

            function setRollFn() {
                $("#roll").animate({
                    marginTop: '-=1'
                }, 0, function () {
                    var s = Math.abs(parseInt($(this).css("margin-top")));
                    if (s >= 40) {
                        $(this).find("ul").slice(0, 1).appendTo($(this));
                        $(this).css("margin-top", 0);
                    }
                });
                $("#deta").hover(function () {
                    clearInterval(rollTimer);
                    clearTimeout(faultTimer);
                }, function () {
                    clearInterval(rollTimer);
                    clearTimeout(faultTimer);
                    rollTimer = setInterval(setRollFn, 30);
                    faultTimer = setTimeout(getFaultFn, 30000);
                });
            };

            // 右侧-海区实时到报显示
            var seaDataTimer;
            function getSeaDataFn() {
                clearTimeout(seaDataTimer);
                http({
                    url: urls.bar,
                    data: { type: type },
                    success: function (res) {
                        var data = res.data, str = '';
                        for (var i = 0; i < data.length; i++) {
                            var dataItem = data[i];
                            str += '<div>' +
                                '<p title=\'' + dataItem.name + '\'>' + dataItem.name + '</p>' +
                                '<p title=\'' + dataItem.total + '\'>' + dataItem.total + '</p>' +
                                '<p title=\'' + dataItem.relay + '\'>' + dataItem.relay + '</p>' +
                                '<p title=\'' + dataItem.obtain + '\'>' + dataItem.obtain + '</p>' +
                                '</div>';
                        };
                        $("#menuIn").html(str);
                    }
                });
                seaDataTimer = setTimeout(getSeaDataFn, 60000);
            };

            // 右侧-仪表盘数据
            var gaugeTimer, gaugeArr = [];
            var siteHtml = $(".sub-rt .type").eq(0).html();
            function getGaugeFn() {
                clearTimeout(gaugeTimer);
                http({
                    url: urls.homeEl,
                    data: { id: siteId, type: siteHtml },
                    success: function (res) {
                        var arr = res.data, ec = '';
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
                    }
                });
                gaugeTimer = setTimeout(getGaugeFn, 60000);

                function initGaugeFn(data) {
                    var min = data.min || 0, max = data.max || 0, value = data.value || 0, name = data.name || "", unit = data.unit || "";
                    var str = name + value + unit;
                    var option = {
                        series: [{
                            type: 'gauge',
                            min: min, max: max,
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
            };
            $(".sub-rt .type").click(function () {
                $(".sub-rt .type").removeClass("add");
                $(this).addClass("add");
                siteHtml = $(this).text();
                getGaugeFn();
            });

            // 右侧-折线图数据
            var lineTimer, myLine, siteEl = "潮位", siteType = $(".lay_type").eq(0).text();
            var range = { 潮位: 5, 气压: 1, 气温: 1, 水温: 0.5, 湿度: 1, 盐度: 1, 风: 0, 波浪: 0 };;
            function getLineFn() {
                clearTimeout(lineTimer);
                myLine = echarts.init(document.getElementById("line"));
                var rangeVal = range[siteEl];

                http({
                    url: urls.homeEl,
                    type: 'post',
                    data: { id: siteId, name: siteEl, type: siteType },
                    success: function (res) {
                        var xData = res.title, data = res.data, unit = res.unit;
                        var max = res.max, min = res.min;
                        var max_val = (max + rangeVal).toFixed(2),
                            min_val = (min - rangeVal).toFixed(2);
                        var option = initLineFn(xData, data, unit, max_val, min_val);
                        myLine.setOption(option);
                    },
                    error: function () {
                        myLine.dispose();
                    }
                });
                lineTimer = setTimeout(getLineFn, 60000);

                function initLineFn(xData, data, unit, max, min) {
                    var option = {
                        grid: { top: 40, bottom: 60, left: 50, right: 10 },
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
                            axisLabel: { interval: "auto", showMaxLabel: 1, showMaxLabel: 1, textStyle: { color: "#227BA6" }, fontSize: 12, margin: 15, rotate: 45 },
                            axisPointer: { label: { padding: [0, 0, 10, 0], margin: 15, fontSize: 12 } },
                            splitLine: { lineStyle: { color: '#227BA6' } },
                            boundaryGap: false
                        }],
                        yAxis: [{
                            name: unit,
                            type: 'value',
                            min: min,
                            max: max,
                            axisTick: { show: false },
                            axisLine: { show: true, lineStyle: { color: "#227BA6" } },
                            axisLabel: { textStyle: { color: "#227BA6" } },
                            splitLine: { lineStyle: { color: '#227BA6' } },
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
            };

            form.on('select(homeEl)', (data) => {
                siteEl = data.value;
                getLineFn();
            });


            $(".lay_type").click(function () {
                $(".lay_type").removeClass("add");
                $(this).addClass("add");
                siteType = $(this).text();
                getLineFn();
            });
            window.lineFn = function () {
                var url = "./line.html?id=" + siteId;
                layAlertFn(url, "数据折线图");
            };


            window.toFn = function () {
                window.location.href = '../pages/map.html';
            };
            window.userFn = function () {
                var isUser = getFn.isUserFn();
                isUser ? layAlertFn('./user.html', '个人中心管理', '600px', '480px') : layAlertFn('./users.html', '个人中心管理', '600px', '380px');
            };
            window.outFn = function () {
                window.location.href = '../index.html'
            };

            window.loadFn = function () {
                layer.closeAll(function () {
                    layer.open({
                        type: 1, title: "报告下载",
                        shade: 0.5, closeBtn: 1,
                        skin: 'drop-demo lay-drop',
                        area: ['400px'],
                        content: $("#monthDown"),
                        success: function () {
                            clearInterval(inspTimer);
                            $(".layItem").addClass("layui-hide");
                            $("#layItem").removeClass("layui-hide");
                            $('#monthDown')[0].reset();
                            var yearVal = new Date().getFullYear();
                            laydate.render({
                                elem: '#yearTime', type: 'year',
                                value: yearVal, max: 0,
                                trigger: 'click', btns: ['confirm'],
                            });
                        },
                        cancel: function () {
                            childFn();
                        }
                    });
                })
            };
            // 月报单选
            var hdate = getFn.initM();
            form.on('radio(monthType)', (data) => {
                var value = data.value;
                $('.layItem').addClass('layui-hide');
                $('.' + value).removeClass('layui-hide');
                value == "month" ? laydate.render({
                    elem: '#monthTime', type: 'month',
                    btns: ['confirm'], format: 'yyyy-MM',
                    max: hdate, value: hdate,
                    trigger: 'click'
                }) : "";
            });
            // 开始下载月报
            var loadIdex;
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
                http({
                    url: urls.homeReport,
                    type: "post",
                    data: data,
                    beforeSend: function () {
                        loadIdex = layer.load(1, { shade: [0.1, '#fff'] });
                    },
                    success: function (res) {
                        var url = res.url;
                        window.location.href = url;
                        layer.closeAll(function () {
                            childFn();
                        });
                    },
                    error: function () {
                        layer.close(loadIdex)
                    }
                });
                return false;
            });

            var inspTimeoutr;
            window.childFn = function () {
                layer.closeAll(function () {
                    inspTimeoutr = setTimeout(getInspFn, 500)
                });
            };
            window.layAlertFn = function (url, title, width, height) {
                var url = url || '',
                    title = title || !1,
                    width = width || "100%",
                    height = height || "635px";
                layer.closeAll(function () {
                    layer.open({
                        type: 2, title: title,
                        shade: 0.8, resize: !1, moveOut: 1,
                        skin: "lay-drop", area: [width, height], content: url,
                        success: function () { clearInterval(inspTimer) },
                        cancel: function () { childFn() }
                    });
                });
            };


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
        });
    exports('home', {});
});