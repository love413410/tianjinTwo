/*
    此类开发可能引起不适
    layui里面套了arcgis、vue
    想用vue的双向绑定
    又想用layui的组件
*/
layui.define(["http", "getFn"], function (exports) {
    require(
        [
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
            window.vm = new Vue({
                el: "#app",
                data: {
                    carIdex: 0, userName: null, xm: null, siteId: null,

                    fileTime: null, fileData: { dir: 0, dunit: "个", size: 0, sunit: "MB", time: "2020-10-10", list: [] },
                    stateTime: null, list: [], height: 0, rollTime: null, rollTimeout: null,

                    barTime: null, seaData: { type: 0, data: [] },

                    map: null, zoom: 6, center: null, mapTime: null, type: "", checkArr: [],
                    delaTime: null, mapInt: null, isClick: null, layDeta: null,

                    siteHtml: "水文", gaugeTimout: null,
                    siteEl: "潮位", siteTimeout: null, siteType: "日", lineTimout: null, myLine: null, gaugeArr: [],
                    inspTime: null,
                    hdate: getFn.initM(), index: null
                },
                methods: {
                    initMapFn: function () {
                        this.map = new Map("map", { zoom: this.zoom, minZoom: 5, center: this.center });
                        var baseUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer";
                        // var baseUrl = "http://71.3.251.104:8066/arcgis/rest/services/6199/0/MapServer?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNjN8NjE5OXw3MS4zLjAuMTB8fHx8MSIsImlhdCI6MTYyOTk0NDUyNywiZXhwIjoxNjMwMzA0NTI3fQ.qh-q9Xq66jwPqR1TatApz6f79Xe4mziSJvJ6Ehhm9dPXSR3T5yRuiFPcmfHEKxPLn2gJRR6htRRR75HfS1RyoQ";
                        var layer = new ArcGISTiledMapServiceLayer(baseUrl);
                        this.map.addLayer(layer);
                        this.map.on("zoom-end", (e) => {
                            clearTimeout(this.mapTime);
                            this.zoom = e.level;
                            this.mapTime = setTimeout(() => {
                                this.mapDataFn();
                            }, 500);
                        });
                        this.getTypeFn();
                    },

                    initXmFn: function () {
                        http({
                            url: urls.search,
                            success: (res) => {
                                var data = res.data;
                                this.xm = xmSelect.render({
                                    el: '#xmSelect',
                                    radio: true, clickClose: true,
                                    prop: { name: 'station', value: 'id' },
                                    model: { icon: 'hidden', label: { type: 'text' } },
                                    filterable: true, data: data,
                                    on: (e) => { this.siteId = e.change[0].id; this.getEchartsFn(); this.clickFn() }
                                });
                                http({
                                    url: urls.sitedefault,
                                    success: (res) => {
                                        this.siteId = res.id;
                                        this.xm.setValue([res.id]);
                                        this.center = [res.lon, res.lat];
                                        this.initMapFn();
                                    }
                                });
                            },
                        });
                    },
                    //左侧数据:今日传输量和数据到报显示
                    getFileFn: function () {
                        clearTimeout(this.fileTime);
                        http({
                            url: urls.receive,
                            data: { id: this.siteId, type: this.type },
                            success: (res) => {
                                this.fileData = res.data;
                            },
                            complete: () => {
                                this.fileTime = setTimeout(() => { this.getFileFn() }, 60000);
                            }
                        });
                    },
                    // 获取站点类型
                    getTypeFn: function () {
                        http({
                            url: urls.layer,
                            success: (res) => {
                                var country = res.country;
                                var checks = '';
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
                                        this.checkArr.push(id);
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

                                var local = res.local;
                                var check = '';
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
                                        this.checkArr.push(id);
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
                                this.type = this.checkArr.join(',');
                                this.mapDataFn();
                                this.getStateFn();
                                this.getFileFn();
                                this.getSeaDataFn();
                            }
                        });
                    },
                    // 左侧各站故障信息
                    getStateFn: function () {
                        clearTimeout(this.stateTime);
                        http({
                            url: urls.alarms,
                            data: { type: this.type },
                            success: (res) => {
                                this.list = res.data;
                            },
                            complete: () => { this.stateTime = setTimeout(() => { this.getStateFn(); }, 60000); }
                        })
                    },
                    DomResize(data) {
                        clearInterval(this.rollTime);
                        let { height } = data;
                        let n = height.slice(0, -2);
                        var h = $("#deta").height();
                        this.height = n;
                        if (n > h) {
                            this.rollTime = setInterval(() => { this.setRollFn(); }, 30);
                        };
                    },
                    setRollFn: function () {
                        $("#roll").animate({
                            marginTop: '-=1'
                        }, 0, function () {
                            var s = Math.abs(parseInt($("#roll").css("margin-top")));
                            if (s >= 40) {
                                $(this).find("ul").slice(0, 1).appendTo($("#roll"));
                                $(this).css("margin-top", 0);
                            }
                        });
                    },
                    enter: function () {
                        clearInterval(this.rollTime);
                        clearTimeout(this.rollTimeout);
                    },
                    leave: function () {
                        clearInterval(this.rollTime);
                        clearTimeout(this.rollTimeout);

                        var h = $("#deta").height();
                        if (this.height > h) {
                            this.rollTime = setInterval(() => { this.setRollFn(); }, 30);
                        };
                        this.rollTimeout = setTimeout(() => {
                            this.getStateFn();
                        }, 30000);
                    },
                    // 地图数据
                    mapDataFn: function () {
                        clearTimeout(this.mapInt);
                        http({
                            url: urls.homeindex,
                            type: "post",
                            data: { type: this.type, num: this.zoom },
                            success: (res) => {
                                this.setLineDataFn(res.line);
                                this.setMapDataFn(res.data);
                            },
                            complete: () => {
                                this.mapInt = setTimeout(() => { this.mapDataFn() }, 60000);
                            }
                        });
                    },
                    setMapDataFn: function (data) {
                        if (data.length <= 0) { return false; };
                        var mapLayers = this.map.getLayer('mapLayer');
                        if (mapLayers != undefined) { this.map.removeLayer(mapLayers); };
                        var mapLayer = new GraphicsLayer({ id: "mapLayer" });
                        this.map.addLayer(mapLayer, 9);
                        for (var i = 0; i < data.length; i++) {
                            var dataItem = data[i];
                            var log = dataItem.from[0], lat = dataItem.from[1];
                            var area = this.zoom * 2 >= 18 ? 18 : this.zoom * 2 <= 10 ? 10 : this.zoom * 2;
                            var point = new Point(log, lat);
                            var pic = new PictureMarkerSymbol({
                                url: "../static/icon" + dataItem.type + dataItem.val + ".png",
                                width: area, height: area, item: dataItem
                            });
                            var gp = new graphic(point, pic);
                            mapLayer.add(gp);
                            //添加站名
                            if (this.zoom >= 8) {
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

                        mapLayer.on('click', (e) => {
                            clearTimeout(this.isClick);
                            this.isClick = setTimeout(() => {
                                var item = e.graphic.symbol.item;
                                this.siteId = item.id;
                                this.xm.setValue([this.siteId]);
                                this.getEchartsFn();
                                this.clickFn();
                                this.getFileFn();
                            }, 250);
                        });
                        // mapLayer.on('mouse-move', (e) => {
                        //     var item = e.graphic.symbol.item;
                        //     var scrPt =  this.map.toScreen(e.graphic.geometry);
                        //     var textDiv = domConstruct.create("div");
                        //     domAttr.set(textDiv, {
                        //         "id": "popup"
                        //     });
                        //     domStyle.set(textDiv, {
                        //         "left": scrPt.x + 10 + "px",
                        //         "top": scrPt.y + 10 + "px",
                        //         "position": "absolute",
                        //         "z-index": 99,
                        //         "background": "#fcffd1",
                        //         "font-size": "10px",
                        //         "border": "1px solid #0096ff",
                        //         "padding": "3px",
                        //         "border-radius": "3px",
                        //     });
                        //     textDiv.innerHTML = "当前是：" + item.name;
                        //     dom.byId("map").appendChild(textDiv);
                        // });
                        // mapLayer.on("mouse-out", (e)=>{
                        //     console.log(e)
                        //     dom.byId("map").removeChild(dom.byId("popup"));
                        // });

                    },
                    setLineDataFn: function (data) {
                        if (data.length <= 0) {
                            return false;
                        };
                        var mapLayers = this.map.getLayer('lineId');
                        if (mapLayers != undefined) { this.map.removeLayer(mapLayers) };
                        var layer = new GraphicsLayer({ id: "lineId" });
                        this.map.addLayer(layer, 7);
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
                    },
                    // 判断是哪个轮播图页面
                    getEchartsFn: function () {
                        if (this.carIdex == 1) {
                            this.getGaugeFn();
                            this.getLineFn();
                        } else {
                            clearTimeout(this.gaugeTimout);
                            clearTimeout(this.lineTimout);
                            this.getFileFn();
                        };
                    },
                    // 右侧数据:右侧海区到报显示
                    getSeaDataFn: function () {
                        clearTimeout(this.barTime);
                        http({
                            url: urls.bar,
                            data: { type: this.type },
                            success: (res) => {
                                this.seaData = res;
                            },
                            complete: () => {
                                this.barTime = setTimeout(() => { this.getSeaDataFn() }, 60000);
                            }
                        });
                    },
                    gaugeFn: function (e) {
                        this.siteHtml = e; this.getGaugeFn();
                    },
                    //仪表盘数据
                    getGaugeFn: function () {
                        clearTimeout(this.gaugeTimout);
                        http({
                            url: urls.homeEl,
                            data: { id: this.siteId, type: this.siteHtml },
                            success: (res) => {
                                var arr = res.data, ec = '';
                                for (var i = 0; i < arr.length; i++) {
                                    ec += '<div class="gauge-item"></div>';
                                };
                                $("#gauge").html(ec);
                                var gauge = document.getElementsByClassName("gauge-item");
                                for (var g = 0; g < gauge.length; g++) {
                                    this.gaugeArr[g] = echarts.init(gauge[g]);
                                    this.gaugeArr[g].setOption(this.initGaugeFn(arr[g]));
                                };
                            },
                            error: () => {
                                for (var i = 0; i < this.gaugeArr.length; i++) {
                                    this.gaugeArr[i].clear();
                                };
                            },
                            complete: () => {
                                this.gaugeTimout = setTimeout(() => { this.getGaugeFn() }, 60000);
                            }
                        });
                    },
                    initGaugeFn: function (data) {
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
                    },
                    siteTypeFn: function (e) {
                        clearTimeout(this.siteTimeout);
                        this.siteTimeout = setTimeout(() => { this.siteType = e; this.getLineFn(); }, 500);
                    },
                    //折线图数据
                    getLineFn: function () {
                        clearTimeout(this.lineTimout);
                        this.myLine = echarts.init(document.getElementById("line"));
                        var range = { 潮位: 5, 气压: 1, 气温: 1, 水温: 0.5, 湿度: 1, 盐度: 1, 风: 0, 波浪: 0 };
                        var rangeVal = range[this.siteEl];
                        http({
                            url: urls.homeEl,
                            type: 'post',
                            data: { id: this.siteId, name: this.siteEl, type: this.siteType },
                            success: (res) => {
                                var xData = res.title, data = res.data, unit = res.unit;
                                var max = res.max, min = res.min;
                                // var max_mult = max > 0 ? 1.2 : max < 0 ? 0.8 : 0,
                                //     min_mult = min > 0 ? 0.8 : 1.2;
                                // var max_val = (max * max_mult).toFixed(2),
                                //     min_val = (min * min_mult).toFixed(2);
                                var max_val = (max + rangeVal).toFixed(2),
                                    min_val = (min - rangeVal).toFixed(2);
                                // this.myLine = echarts.init(document.getElementById("line"));
                                let option = this.initLineFn(this.siteEl, xData, data, unit, max_val, min_val);
                                this.myLine.setOption(option);
                            },
                            error: () => {
                                this.myLine.dispose();
                            },
                            complete: () => {
                                this.lineTimout = setTimeout(() => { this.getLineFn(); }, 60000);
                            }
                        });
                    },
                    initLineFn: function (siteEl, xData, data, unit, max, min) {
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
                    },
                    //监控站点异常,自动弹窗
                    inspFn: function () {
                        var _this = this;
                        clearTimeout(this.inspTime);
                        http({
                            url: urls.faultpush,
                            success: (res) => {
                                var data = res.data, stationId = data.stationId;
                                if (stationId > -1) {
                                    http({
                                        url: urls.homeclock,
                                        data: { id: stationId },
                                        success: (res) => {
                                            var data = res.data, type = res.type, title = data.station;
                                            // var layHeight = type < 0 ? "480px" : "650px";
                                            // var content = type < 0 ? '../pages/layHome.html?id=' + stationId : '../pages/layHomes.html?id=' + stationId;
                                            var layHeight = "650px", content = '../pages/layHomes.html?id=' + stationId;
                                            if (type < 0) {
                                                layHeight = "480px"; content = '../pages/layHome.html?id=' + stationId;
                                            };
                                            layer.open({
                                                type: 2, shade: 0, resize: false,
                                                title: title, area: ["355px", layHeight],
                                                skin: 'drop-demo lay-drop', offset: "150px",
                                                id: "drop-demo", content: content,
                                                success: () => { clearTimeout(_this.inspTime); },
                                                cancel: function () {
                                                    http({
                                                        url: urls.close,
                                                        data: { id: stationId, type: type },
                                                        success: () => {
                                                            layer.closeAll(() => {
                                                                _this.inspTime = setTimeout(() => { _this.inspFn() }, 500);
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    this.inspTime = setTimeout(() => { this.inspFn() }, 30000);
                                };
                            }
                        });
                    },
                    // 点击站点弹窗
                    clickFn: function () {
                        this.layDeta ? layer.close(this.layDeta, () => {
                            this.layerFn()
                        }) : this.layerFn();
                    },
                    layerFn: function () {
                        var _this = this;
                        http({
                            url: urls.homeclock,
                            data: { id: this.siteId },
                            success: (res) => {
                                var data = res.data, type = res.type, title = data.station;
                                // var layHeight = type < 0 ? "480px" : "650px";
                                // var content = type < 0 ? '../pages/layHome.html?id=' + this.siteId : '../pages/layHomes.html?id=' + this.siteId;
                                var layHeight = "650px", content = '../pages/layHomes.html?id=' + this.siteId;
                                if (type < 0) {
                                    layHeight = "480px"; content = '../pages/layHome.html?id=' + this.siteId;
                                };
                                this.layDeta = layer.open({
                                    type: 2, shade: 0, resize: false,
                                    title: title, area: ["355px", layHeight],
                                    skin: 'drop-demo lay-drop', offset: "150px",
                                    id: "drop-demo", content: content,
                                    success: () => { clearTimeout(_this.inspTime); },
                                    cancel: () => { _this.inspTime = setTimeout(_this.inspFn, 500); _this.layDeta = null }
                                });
                            }
                        });
                    },
                    lineFn() {
                        var url = "./line.html?id=" + this.siteId;
                        this.layAlertFn(url, "数据折线图");
                    },
                    childFn: function () {
                        layer.closeAll(() => {
                            this.inspTime = setTimeout(() => { this.inspFn() }, 500)
                        });
                    },
                    layAlertFn: function (url, title, width, height) {
                        var url = url || '',
                            title = title || !1,
                            width = width || "100%",
                            height = height || "635px";
                        var _this = this;
                        layer.closeAll(() => {
                            layer.open({
                                type: 2, title: title,
                                shade: 0.8, resize: !1, moveOut: 1,
                                skin: "lay-drop", area: [width, height], content: url,
                                success: () => { clearTimeout(_this.inspTime) },
                                cancel: () => { _this.childFn() }
                            });
                        });
                    },
                    toFn: function () {
                        window.location.href = '../pages/map.html'
                    },
                    userFn: function () {
                        let isUser = getFn.isUserFn();
                        isUser ? this.layAlertFn('./user.html', '个人中心管理', '600px', '480px') : this.layAlertFn('./users.html', '个人中心管理', '600px', '380px');
                    },
                    loadFn: function () {
                        var _this = this;
                        layer.closeAll(function () {
                            layer.open({
                                type: 1, title: "报告下载",
                                shade: 0.5, closeBtn: 1,
                                skin: 'drop-demo lay-drop',
                                area: ['400px'],
                                content: $("#monthDown"),
                                success: () => {
                                    clearTimeout(_this.inspTime);
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
                                cancel: () => {
                                    _this.inspTime = setTimeout(() => { _this.inspFn() }, 500)
                                }
                            });
                        })
                    },
                    outFn: function () { window.location.href = '../index.html' }
                },
                // 监听dom变化
                directives: {
                    resize: {
                        bind(el, binding) {
                            var width = '', height = '';
                            function isReize() {
                                const style = document.defaultView.getComputedStyle(el);
                                if (width !== style.width || height !== style.height) {
                                    binding.value({ width: style.width, height: style.height });
                                };
                                width = style.width; height = style.height;
                                el.__vueSetInterval__ = setTimeout(isReize, 300);
                            };
                            isReize();
                        },
                        unbind(el) { clearInterval(el.__vueSetInterval__) }
                    }
                },
                created: function () {
                    this.userName = sessionStorage.user;
                },
                mounted: function () {
                    this.inspFn();
                    carousel.render({ elem: '#carousel', autoplay: false, arrow: 'always', width: '440px', height: '100%', indicator: 'none', index: this.carIdex });
                    carousel.on('change(carousel)', (obj) => { this.carIdex = obj.index; this.getEchartsFn(); });

                    form.render(); this.initXmFn();

                    var level = sessionStorage.limit; $("[name=level" + level + "]").hide();

                    form.on('checkbox(check)', (data) => {
                        clearTimeout(this.delaTime);
                        var tv = Number(data.value);
                        let tempIs = data.elem.checked;
                        if (tempIs) {
                            this.checkArr.push(tv)
                        } else {
                            let idx = this.checkArr.indexOf(tv);
                            this.checkArr.splice(idx, 1);
                        };
                        this.type = this.checkArr.join(',');
                        this.delaTime = setTimeout(() => {
                            this.mapDataFn();
                            this.getStateFn();
                            this.getFileFn();
                            this.getSeaDataFn();
                        }, 1000);
                    });
                    form.on('select(homeEl)', (data) => {
                        this.siteEl = data.value; this.getLineFn();
                    });
                    // 月报单选
                    form.on('radio(monthType)', (data) => {
                        var value = data.value;
                        $('.layItem').addClass('layui-hide');
                        $('.' + value).removeClass('layui-hide');
                        value == "month" ? laydate.render({
                            elem: '#monthTime', type: 'month',
                            btns: ['confirm'], format: 'yyyy-MM',
                            max: this.hdate, value: this.hdate,
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
                        http({
                            url: urls.homeReport,
                            type: "post",
                            data: data,
                            beforeSend: () => {
                                this.index = layer.load(1, { shade: [0.1, '#fff'] });
                            },
                            success: (res) => {
                                var url = res.url;
                                window.location.href = url;
                                layer.closeAll(() => {
                                    this.inspTime = setTimeout(() => { this.inspFn() }, 500)
                                });
                            },
                            error: () => {
                                layer.close(this.index)
                            }
                        });
                        return false;
                    });
                }
            });
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