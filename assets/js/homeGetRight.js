layui.define(['http', "getFn"], function (e) {
	var $ = layui.jquery;
	var http = layui.http,
		urls = layui.urls;
	// 右侧海区到报显示
	var barTime = null;
	function getSeaDataFn() {
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
					getSeaDataFn();
				}, 60000);
			}
		});
	};
	getSeaDataFn();
	// 右侧仪表盘
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
	// 右侧折线图
	function initLineFn(siteEl, xData, data, unit, max, min) {
		var option = {
			grid: { top: 20, bottom: 80, right: 0 },
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
	//获取仪表盘数据
	var gaugeTimout, gaugeArr = [], time = 60000;

	function getGaugeFn(siteId, siteHtml) {
		clearTimeout(gaugeTimout);
		http({
			url: urls.homeEl,
			type: 'get',
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
				}, time);
			}
		});
	};
	// 获取折线图数据
	var lineTimout, myLine = echarts.init(document.getElementById("line"));

	function getLineFn(siteId, siteEl, siteType) {
		clearTimeout(lineTimout);
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
				var max_mult = max > 0 ? 1.2 : max < 0 ? 0.8 : 0,
					min_mult = min > 0 ? 0.8 : 1.2;
				var max_val = Math.floor(max * max_mult),
					min_val = Math.ceil(min * min_mult);
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

	function stopFn() {
		clearTimeout(gaugeTimout);
		clearTimeout(lineTimout);
	};
	var homeInit = {
		getGaugeFn: getGaugeFn,
		getLineFn: getLineFn,
		stopFn: stopFn
	};
	e("homeGetRight", homeInit)
});
