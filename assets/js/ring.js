layui.define(["http"], function (e) {
	var http = layui.http,
		urls = layui.urls;

	var $ = layui.$,
		form = layui.form,
		table = layui.table;

	var type = '', areaId = '';
	function getTypeFn() {
		http({
			url: urls.getType,
			type: 'get',
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
				type = data.length > 0 ? data[0].pk : "";
				getAreaFn();
			}
		});
	};
	getTypeFn();

	form.on('select(laySele)', function (data) {
		type = data.value;
		getAreaFn();
	});

	function getAreaFn() {
		http({
			url: urls.homearea,
			type: 'get',
			data: {
				type: type
			},
			success: function (res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.title + '</option>'
				};
				$("#area").html(str);
				form.render("select");
				areaId = data.length > 0 ? data[0].pk : "";
				// getListFn();
			}
		})
	};
	// getAreaFn();
	// 查询
	form.on('submit(subBtn)', function (data) {
		areaId = data.field.id;
		getListFn();
		getHomeGraph();
	});

	window.getListFn = function () {
		table.render({
			elem: '#table',
			url: urls.homearea,
			method: "post",
			headers: {
				token: sessionStorage.token
			},
			where: {
				type: type,
				id: areaId
			},
			request: {
				pageName: 'pageNum',
				limitName: 'pageSize'
			},
			parseData: function (res) {
				return {
					"code": 0,
					"count": res.data.length,
					"data": res.data
				};
			},
			cols: [
				[{
					field: 'name',
					title: '站点名'
				}, {
					field: 'total',
					title: '应到'
				}, {
					field: 'relay',
					title: '实到'
				}, {
					field: 'obtain',
					title: '到报率(%)'
				}]
			],
			page: false,
			id: 'tabReload',
			// height: 535,
			cellMinWidth: 80
		});
	};

	function getHomeGraph() {
		http({
			url: urls.homeGraph,
			type: 'get',
			data: {
				type: type,
				id: areaId
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
						data: data,
						barMaxWidth: 30
					}]
				})
			}
		})
	};

	var bar = echarts.init(document.getElementById('bar'));
	function initFn() {
		var option = {
			backgroundColor: '#091c42',
			color: '#38b8f2',
			title: {
				text: "各中心站接收率柱状图",
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
				bottom: '35',
				top: '75',
				containLabel: true
			},
			// dataZoom: [
			// 	{
			// 		type: "slider",
			// 		height: 15,
			// 		xAxisIndex: [0],
			// 		bottom: 10,
			// 		start: 0,
			// 		end: 30,
			// 		minSapn:30,
			// 		maxSpan:30,
			// 		fillerColor:'#5a98de',
			// 		textStyle: {
			// 			color: "transparent"
			// 		}
			// 	},
			// ],
			xAxis: {
				type: 'category',
				// data: [
				// 	'北海', '东海', '南海', '地方站', '全局',
				// 	'北海', '东海', '南海', '地方站', '全局',
				// 	'北海', '东海', '南海', '地方站', '全局',
				// 	'北海', '东海', '南海', '地方站', '全局',
				// 	'北海', '东海', '南海', '地方站', '全局',
				// 	'北海', '东海', '南海', '地方站', '全局',
				// 	'北海', '东海', '南海', '地方站', '全局',
				// 	'北海', '东海', '南海', '地方站', '全局',
				// 	'北海', '东海', '南海', '地方站', '全局'
				// ],
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
			series: [{
				type: 'bar',
				barWidth: 30,
				// data: [
				// 	20, 40, 60, 80, 50,
				// 	20, 40, 60, 80, 50,
				// 	20, 40, 60, 80, 50,
				// 	20, 40, 60, 80, 50,
				// 	20, 40, 60, 80, 50,
				// 	20, 40, 60, 80, 50,
				// 	20, 40, 60, 80, 50,
				// 	20, 40, 60, 80, 50,
				// 	20, 40, 60, 80, 50,
				// ]
			}]
		};
		bar.setOption(option);
	};
	initFn();
	e("ring", {})
});
