layui.define(["http", "load", "getFn"], function(e) {
	//台站查询
	function rateLayFn(id, style, startTime, endTime) {
		var url = "./dataDeta.html?id=" + id + "&style=" + style + "&startTime=" + startTime + "&endTime=" + endTime;
		layFn(url);
	};
	//浮标查询
	function buoyLayFn(id, startTime, endTime) {
		var url = "./dataDeta.html?id=" + id + "&startTime=" + startTime + "&endTime=" + endTime;
		layFn(url);
	};
	//雷达查询
	function radarLayFn(id, startTime, endTime) {
		var url = "./dataDeta.html?id=" + id + "&startTime=" + startTime + "&endTime=" + endTime;
		layFn(url);
	};
	//gps查询
	function gpsLayFn(id, startTime, endTime) {
		var url = "./dataDeta.html?id=" + id + "&startTime=" + startTime + "&endTime=" + endTime;
		layFn(url);
	};
	//志愿船查询
	function shpiLayFn(id, startTime, endTime) {
		var url = "./dataDeta.html?id=" + id + "&startTime=" + startTime + "&endTime=" + endTime;
		layFn(url);
	};
	//志愿船查询
	function prteLayFn(id, startTime, endTime) {
		var url = "./dataDeta.html?id=" + id + "&startTime=" + startTime + "&endTime=" + endTime;
		layFn(url);
	};

	function layFn(id, startTime, endTime,style) {
		var style = style || 2;
		var url = "./dataDeta.html?id=" + id + "&style=" + style + "&startTime=" + startTime + "&endTime=" + endTime;
		layer.open({
			type: 2,
			title: "详情",
			resize: !1,
			skin: "lay-drop lay-drp",
			id: "id",
			area: ["860px", "595px"],
			content: url
		});
	};
	e("query", {
		layFn:layFn,
		rateLayFn: rateLayFn,
		buoyLayFn: buoyLayFn,
		radarLayFn: radarLayFn,
		gpsLayFn: gpsLayFn,
		shpiLayFn: shpiLayFn
	});
});
