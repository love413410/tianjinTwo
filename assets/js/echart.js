layui.define(["http", "getFn"], function (e) {
	var http = layui.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.$,
		form = layui.form,
		laydate = layui.laydate;

	var initTime = getFn.initDate();
	laydate.render({
		elem: '#date',
		value: initTime + "\xa0" + "~" + "\xa0" + initTime,
		format: 'yyyy-MM-dd',
		max: getFn.initDate(),
		range: "~",
		btns: ['confirm']
	});

	var where = {
		type: "",
		ofAreaCenter: "",
		ofArea: "",
		ofCenter: "",
		style: "",
		startTime: "",
		endTime: ""
	};

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
				data.length > 0 ? where.type = data[0].pk : "";
				getSeaFn();
			}
		});
	};
	getTypeFn();


	function getSeaFn() {
		http({
			url: urls.sitelisttype,
			type: 'post',
			data: {
				type: where.type
			},
			success: function (res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var id = data[i].pk;
					var title = data[i].fields.title;
					str += '<option value="' + id + '">' + title + '</option>';
				};
				$("#laySeleA").html(str);
				data.length > 0 ? where.ofAreaCenter = data[0].pk : "";
				getSeaCenterFn();
			}
		});
	};

	form.on('select(laySeleA)', function (data) {
		where.ofAreaCenter = data.value;
		getSeaCenterFn();
	});

	function getSeaCenterFn() {
		http({
			url: urls.siteliststype,
			data: {
				type: where.type,
				ofAreaCenter: where.ofAreaCenter
			},
			success: function (res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var id = data[i].pk;
					var title = data[i].fields.station;
					str += '<option value="' + id + '">' + title + '</option>';
				};
				$("#laySeleB").html(str);
				data.length > 0 ? where.ofArea = data[0].pk : "";
				getCenterFn();
			}
		});
	};
	form.on('select(laySeleB)', function (data) {
		where.ofArea = data.value;
		getCenterFn();
	});
	function getCenterFn() {
		http({
			url: urls.siteliststype,
			type: 'post',
			data: {
				type: where.type,
				ofAreaCenter: where.ofAreaCenter,
				ofArea: where.ofArea
			},
			success: function (res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var id = data[i].pk;
					var title = data[i].fields.station;
					str += '<option value="' + id + '">' + title + '</option>';
				};
				$("#laySeleC").html(str);
				data.length > 0 ? where.ofCenter = data[0].pk : "";
				getDataTypeFn();
			}
		});
	};

	function getDataTypeFn() {
		http({
			url: urls.dataType,
			success: function (res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					str += '<option value=' + dataItem.pk + '>' + dataItem.fields.Type + '</option>';
				};
				$("#type").html(str);
				form.render("select");
			}
		})
	};
	// 查询按钮调取站点列表接口
	form.on('submit(subBtn)', function (data) {
		where = data.field;
		var date = where.date;
		var idx = date.indexOf("~");
		var startTime = date.substring(0, idx).trim();
		var endTime = date.substring(idx + 1).trim();
		where.startTime = startTime;
		where.endTime = endTime;
		delete where.date;
		getDataFn();
	});
	function getDataFn() {
		http({
			url: urls.dataGraph,
			data: where,
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
				text: "中心站各站点接收率柱状图",
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
				// data: ['北海', '东海', '南海', '地方站', '全局'],
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
			// 	type: 'bar',
			// 	barWidth: 30,
			// 	data: [20, 40, 60, 80, 50]
			// }]
		};
		bar.setOption(option);
	};
	initFn();

	form.verify({
		date: function (val) {
			if (val.indexOf('~') == -1) {
				return '请选择日期范围';
			}
		},
	});
	$('#close').click(function () {
		var index = parent.layer.getFrameIndex(window.name)
		parent.layer.close(index);
	});
	e("echart", {})
});
