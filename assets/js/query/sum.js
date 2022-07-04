layui.define(["http", "load"], function (e) {
    var http = layui.http,
        urls = layui.urls,
        load = layui.load;

    var $ = layui.$,
        form = layui.form,
        laydate = layui.laydate,
        table = layui.table;

    var date = new Date();
    var year = date.getFullYear(), type = "";


    laydate.render({
        elem: '#time',
        type: 'year',
        format: 'yyyy',
        max: 0,
        value: year,
        btns: ['confirm']
    });

    function getTypeFn() {
        http({
            url: urls.getType,
            data: {
                id: 1
            },
            success: function (res) {
                var data = res.data;
                var str = '';
                for (var i = 0; i < data.length; i++) {
                    var id = data[i].pk;
                    var title = data[i].fields.title;
                    str += '<option value="' + id + '">' + title + '</option>';
                };
                $("#laySele").html(str);
                form.render("select");
            }
        });
    };
    getTypeFn();


    form.on('submit(subBtn)', function (data) {
        year = data.field.year;
        type = data.field.type;
        getListFn();
        getLineFn(); //折线图
        getColFn();//柱状图
    });
    form.on('submit(expBtn)', function (data) {
        year = data.field.year;
        type = data.field.type;
        load(urls.dataLoad, "post", {
            time: year,
            type: type
        })
    });

    function getListFn() {
        table.render({
            elem: '#table',
            url: urls.global,
            headers: { token: sessionStorage.token },
            where: { time: year, type: type },
            parseData: function (res) {
                var data = res.data;
                var tabData = [];
                for (var i = 0; i < data.length; i++) {
                    tabData.push({ title: data[i][0], all: data[i][1], north: data[i][2], east: data[i][3], south: data[i][4] })
                };
                return {
                    "code": 0, "count": 0, "data": tabData
                };
            },
            cols: [
                [
                    { title: '月份', field: 'title' },
                    { title: '全局情况(%)', field: 'all' },
                    { title: '北海(%)', field: 'north' },
                    { title: '东海(%)', field: 'east' },
                    { title: '南海(%)', field: 'south' }
                ]
            ],
            cellMinWidth: 80
        });
    };
    // 折线图
    function getLineFn() {
        http({
            url: urls.global,
            type: "post",
            data: {
                time: year,
                type: type
            },
            success: function (res) {
                var title = res.title;
                var data = res.data;
                var nameArr = [];
                var dataArr = [];
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    nameArr.push(dataItem.name);
                    dataArr.push({
                        name: dataItem.name,
                        type: 'line',
                        smooth: true,
                        data: dataItem.data
                    })
                };
                line.setOption({
                    legend: {
                        data: nameArr,
                    },
                    xAxis: {
                        data: title
                    },
                    series: dataArr
                });
            }

        })
    };
    // 海区柱状图
    function getColFn() {
        http({
            url: urls.columnar,
            type: "get",
            data: {
                time: year,
                type: type
            },
            success: function (res) {
                var title = res.title;
                var data = res.data;
                bar.setOption({
                    xAxis: {
                        data: title
                    },
                    series: [{
                        type: 'bar',
                        barWidth: 30,
                        data: data
                    }]
                })
            }
        });
        //中心站柱状图
        // http({
        // 	url: urls.columnar,
        // 	type: "post",
        // 	data: {
        // 		time: year,
        // 		type: type
        // 	},
        // 	success: function (res) {
        // 		var title = res.title;
        // 		var data = res.data;
        // 		bars.setOption({
        // 			xAxis: {
        // 				data: title
        // 			},
        // 			series: [{
        // 				type: 'bar',
        // 				barWidth: 30,
        // 				data: data
        // 			}
        // 			]
        // 		})
        // 	}
        // });
    };

    var line = echarts.init(document.getElementById('line'));
    function initLineFn() {
        var option = {
            backgroundColor: "#091c42",
            color: ['#e064e8', '#73DEB3', '#FFB761', '#24c864', '#b4badd'],
            title: {
                text: "海区接收率折线图",
                textStyle: {
                    color: "#07a6ff"
                },
                left: "center",
                top: 5
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    },
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                formatter: function (e) {
                    var str = '';
                    for (var i = 0; i < e.length; i++) {
                        str += e[i].marker + e[i].seriesName + ':' + e[i].data + '%</br>';
                    };
                    return str;
                }
            },
            grid: {
                left: '25',
                right: '25',
                bottom: '30',
                top: '50',
                containLabel: true
            },
            legend: {
                data: ['北海', '地方站', '全局情况'],
                icon: "circle",
                right: 20,
                top: 5,
                textStyle: {
                    color: "#fff"
                }
            },
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        color: "#07a6ff"
                    }
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#07a6ff"
                    }
                },
            },
            yAxis: {
                min: 0,
                max: 120,
                axisLabel: {
                    color: '#07a6ff',
                    textStyle: {
                        fontSize: 12
                    },
                    formatter: function (value) {
                        return value + '%'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#07a6ff"
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#07a6ff"
                    }
                }
            },
            // series: [{
            // 		name: '北海',
            // 		type: 'line',
            // 		smooth: true,
            // 		data: [6.53, 6.53]
            // 	},
            // 	{
            // 		name: '地方站',
            // 		type: 'line',
            // 		smooth: true,
            // 		data: [100, 100]
            // 	},
            // 	{
            // 		name: '全局情况',
            // 		type: 'line',
            // 		smooth: true,
            // 		data: [6.53, 6.53]
            // 	}
            // ]
        };
        line.setOption(option);
    };
    initLineFn();


    var bar = echarts.init(document.getElementById('bar'));

    function initBarFn() {
        var option = {
            backgroundColor: '#091c42',
            color: '#38b8f2',
            // color: ['#73A0FA', '#73DEB3', '#FFB761'],
            title: {
                text: "海区接收率柱状图",
                textStyle: {
                    color: "#07a6ff"
                },
                left: "center",
                top: 5
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#07a6ff'
                    },
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                formatter: function (e) {
                    var str = '';
                    for (var i = 0; i < e.length; i++) {
                        str += e[i].marker + e[i].name + ':' + e[i].data + '%</br>';
                    };
                    return str;
                }
            },
            grid: {
                left: '25',
                right: '25',
                bottom: '40',
                top: '75',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['北海', '东海', '南海', '地方站', '全局'],
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#07a6ff"
                    }
                },
            },
            yAxis: {
                min: 0,
                max: 100,
                axisLabel: {
                    color: '#07a6ff',
                    textStyle: {
                        fontSize: 12
                    },
                    formatter: function (value) {
                        return value + '%'
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#07a6ff"
                    }
                }
            },
            // series: [{
            // 		type: 'bar',
            // 		barWidth: 30,
            // 		data: [20, 40, 60, 80, 50]
            // 	}
            // ]
        };
        bar.setOption(option);
    };
    initBarFn();




    // var bars = echarts.init(document.getElementById('bars'));

    function initBarsFn() {
        var option = {
            backgroundColor: '#091c42',
            color: ['#73A0FA', '#73DEB3', '#FFB761'],
            title: {
                text: "中心站接收率柱状图",
                textStyle: {
                    color: "#07a6ff"
                },
                left: "center",
                top: 5
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#07a6ff'
                    },
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                formatter: function (e) {
                    var str = '';
                    for (var i = 0; i < e.length; i++) {
                        str += e[i].marker + e[i].name + ':' + e[i].data + '%</br>';
                    };
                    return str;
                }
            },
            grid: {
                left: '25',
                right: '25',
                bottom: '24',
                top: '75',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['北海', '东海', '南海', '地方站', '全局'],
                axisLabel: {
                    formatter: function (val) {
                        return val.split("").join("\n");
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#07a6ff"
                    }
                },
            },
            yAxis: {
                min: 0,
                max: 100,
                axisLabel: {
                    color: '#07a6ff',
                    textStyle: {
                        fontSize: 12
                    },
                    formatter: function (value) {
                        return value + '%'
                    }
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#07a6ff"
                    }
                }
            },
            // series: [{
            // 		type: 'bar',
            // 		barWidth: 30,
            // 		data: [20, 40, 60, 80, 50]
            // 	}
            // ]
        };
        bars.setOption(option);
    };
    // initBarsFn();


    form.verify({
        date: function (val) {
            if (val.length <= 0) {
                return '请选择日期';
            }
        },
    });




    $('#close').click(function () {
        var index = parent.layer.getFrameIndex(window.name)
        parent.layer.close(index);
    });
    e("sum", {})
});

