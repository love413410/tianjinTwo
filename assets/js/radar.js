layui.define(['http', "load", "getFn", "query"], function(e) {
	var http = layui.http,
		urls = layui.urls,
		load = layui.load,
		getFn = layui.getFn,
		query = layui.query;

	var $ = layui.$,
		form = layui.form,
		laydate = layui.laydate,
		table = layui.table;


	var initTime = getFn.initDate();
	laydate.render({
		elem: '#date',
		range: "~",
		value: initTime + "\xa0" + "~" + "\xa0" + initTime,
		max: initTime,
		btns: ['confirm']
	});

	var where = {
		type: "",
		ofAreaCenter: "",
		ofArea: "",
		ofCenter: "",
		startTime: "",
		endTime: "",
	};

	function getTypeFn() {
		http({
			url: urls.getType,
			type: 'get',
			data: {
				id: 3
			},
			success: function(res) {
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
			success: function(res) {
				var data = res.data;
				var name = res.name;
				var str = '<option value="">全部</option>';
				for (var i = 0; i < data.length; i++) {
					var id = data[i].pk;
					var title = data[i].fields.title;
					if (name == title) {
						str += '<option value="' + id + '" selected>' + title + '</option>';
						where.ofAreaCenter = id;
					} else {
						str += '<option value="' + id + '">' + title + '</option>';
					};
				};
				$("#laySeleA").html(str);
				getSeaCenterFn();
			}
		});
	};

	form.on('select(laySeleA)', function(data) {
		where.ofAreaCenter = data.value;
		getSeaCenterFn();
	});

	function getSeaCenterFn() {
		http({
			url: urls.siteliststype,
			type: 'get',
			data: {
				type: where.type,
				ofAreaCenter: where.ofAreaCenter
			},
			success: function(res) {
				var data = res.data;
				var name = res.name;
				var str = '<option value="">全部</option>';
				for (var i = 0; i < data.length; i++) {
					var id = data[i].pk;
					var title = data[i].fields.station;
					if (name == title) {
						str += '<option value="' + id + '" selected>' + title + '</option>';
						where.ofArea = id;
					} else {
						str += '<option value="' + id + '">' + title + '</option>';
					};
				};
				$("#laySeleB").html(str);
				getCenterFn();
			}
		});
	};
	form.on('select(laySeleB)', function(data) {
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
			success: function(res) {
				var data = res.data;
				var name = res.name;
				var str = '<option value="">全部</option>';
				for (var i = 0; i < data.length; i++) {
					var id = data[i].pk;
					var title = data[i].fields.station;
					if (name == title) {
						str += '<option value="' + id + '" selected>' + title + '</option>';
						where.ofCenter = id;
					} else {
						str += '<option value="' + id + '">' + title + '</option>';
					};
				};
				$("#laySeleC").html(str);
				form.render("select");
				// getListFn();
			}
		});
	};

	function getListFn() {
		table.render({
			elem: '#table',
			url: urls.radar,
			method: "post",
			headers: {
				token: sessionStorage.token
			},
			where: where,
			request: {
				pageName: 'pageNum',
				limitName: 'pageSize'
			},
			parseData: function(res) {
				return {
					"code": 0,
					"count": res.count,
					"data": res.data
				};
			},
			cols: [
				[{
					title: '站名',
					templet: function(item) {
						var html = '<div onclick="layFn(' + item.stationId + ')" style="color: #5a98de;cursor: pointer;">' +
							item.station +
							'</div>';
						return html;
					}
				}, {
					field: 'total',
					title: '应收文件(个)'
				}, {
					field: 'relay',
					title: '实收文件(个)'
				}, {
					field: 'obtain',
					title: '接收率(%)'
				}]
			],
			page: {
				layout: ['prev', 'page', 'next', 'skip', 'count']
			},
			id: 'tabReload',
			height: 535,
			cellMinWidth: 80
		});
	};

	// 查询按钮调取站点列表接口
	form.on('submit(subBtn)', function(data) {
		where = data.field;
		var date = where.date;
		var idx = date.indexOf("~");
		var startTime = date.substring(0, idx).trim();
		var endTime = date.substring(idx + 1).trim();
		where.startTime = startTime;
		where.endTime = endTime;
		delete where.date;
		getListFn();
	});
	form.on('submit(expBtn)', function(data) {
		where = data.field;
		var date = where.date;
		var idx = date.indexOf("~");
		var startTime = date.substring(0, idx).trim();
		var endTime = date.substring(idx + 1).trim();
		where.startTime = startTime;
		where.endTime = endTime;
		delete where.date;
		load(urls.radar, "get", where);
	});
	window.layFn = function(id) {
		var startTime = where.startTime,
			endTime = where.endTime;
		query.layFn(id, startTime, endTime);
	};
	form.verify({
		date: function(val) {
			if (val.indexOf('~') == -1) {
				return '请选择日期范围';
			}
		},
	});
	e("radar", {})
});
