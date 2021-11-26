layui.define(["http", "getFn"], function (e) {
    var http = layui.http,
        urls = layui.urls,
        getFn = layui.getFn;

    var $ = layui.$;

    var siteId = getFn.locaStr("id");
    $("#element p").eq(0).addClass("add");
    $("#time p").eq(0).addClass("add");

    var siteEl = $("#element p").eq(0).html();
    var siteType = $("#time p").eq(0).html();

    var setTime;
    $("#element p").click(function () {
        $("#element p").removeClass("add");
        $(this).addClass("add");
        siteEl = $(this).html();
        clearTimeout(setTime);
        setTime = setTimeout(function () {
            getLineFn();
        }, 500);
    });

    $("#time p").click(function () {
        $("#time p").removeClass("add");
        $(this).addClass("add");
        siteType = $(this).html();
        clearTimeout(setTime);
        setTime = setTimeout(function () {
            getLineFn();
        }, 500);
    });

    var lineTimout, myLine;

    function getLineFn() {
        clearTimeout(lineTimout);
        myLine = echarts.init(document.getElementById("lines"));
        var range = { 潮位: 5, 气压: 1, 气温: 1, 水温: 0.5, 湿度: 1, 盐度: 1, 风: 0, 波浪: 0 };
        var rangeVal = range[siteEl];
        http({
            url: urls.homeEl,
            type: 'post',
            data: {
                id: siteId,
                name: siteEl,
                type: siteType
            },
            success: function (res) {
                var xData = res.title,
                    data = res.data,
                    unit = res.unit;
                var max = res.max,
                    min = res.min;
                var max_val = (max + rangeVal).toFixed(2),
                    min_val = (min - rangeVal).toFixed(2);
                var option = initLineFn(siteEl, xData, data, unit, max_val, min_val);
                myLine.setOption(option);
                var str = '';
                for (var i = data.length - 1; i >= 0; i--) {
                    str += '<li><p>' + data[i].time + '</p><p>' + data[i].value + unit + '</p></li>'
                };
                $("#rolls").html(str);

                // var str = '';
                // for (var i = 0; i < data.length; i++) {
                //     str += '<li><p>' + data[i].time + '</p><p>' + data[i].value + unit + '</p></li>'
                // };
                // $("#rolls").html(str);
            },
            error: function () {
                myLine.dispose();
            },
            complete: function () {
                lineTimout = setTimeout(function () {
                    getLineFn(siteId, siteEl);
                }, 60000);
            }
        });
    };
    getLineFn();

    // 处理右侧折线图数据
    function initLineFn(siteEl, xData, data, unit, max, min) {
        var option = {
            grid: {
                top: 40,
                bottom: 60,
                left: 50,
                right: 10
            },
            tooltip: {
                trigger: "axis",
                formatter: function (item) {
                    var item = item[0];
                    var html = item.marker + "<span>" + item.data.time + "</span>" + "<p>" + siteEl +
                        ":" + item.data.value + unit +
                        "</p>"
                    return html;
                }
            },
            xAxis: [{
                type: 'category',
                data: xData,
                axisLine: {
                    onZero: false,
                    lineStyle: {
                        color: "#227BA6"
                    }
                },
                axisLabel: {
                    interval: "auto",
                    showMaxLabel: 1,
                    showMaxLabel: 1,
                    textStyle: {
                        color: "#227BA6"
                    },
                    fontSize: 12,
                    margin: 15,
                    rotate: 45
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#227BA6'
                    },
                },
                axisPointer: {
                    label: {
                        padding: [0, 0, 10, 0],
                        margin: 15,
                        fontSize: 12
                    }
                },
                boundaryGap: false
            }],
            yAxis: [{
                name: unit,
                nameTextStyle: {
                    fontSize: 16
                },
                type: 'value',
                min: min,
                max: max,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#227BA6"
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: "#227BA6"
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#227BA6'
                    },
                }
            }],
            series: [{
                type: 'line',
                data: data,
                symbolSize: 1,
                symbol: 'circle',
                smooth: true,
                yAxisIndex: 0,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        color: "#07a6ff"
                    }
                }
            }]
        };
        return option;
    };
    e("line", {})
});
