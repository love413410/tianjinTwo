layui.define(["http", "load", "getFn", "query"], function (e) {
	var http = layui.http,
		urls = layui.urls,
		load = layui.load,
		getFn = layui.getFn,
		query = layui.query;

	var $ = layui.$,
		form = layui.form,
		table = layui.table,
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
				id: 7
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
				where.type = data.length > 0 ? data[0].pk : "";
				getSeaFn();
			}
		});
	};
	getTypeFn();
	form.on('select(laySele)', function (data) {
		where.type = data.value;
		getSeaFn();
	});

	function getSeaFn() {
		http({
			url: urls.sitelisttype,
			type: 'post',
			data: {
				type: where.type
			},
			success: function (res) {
				var data = res.data;
				// var name = res.name;
				var str = '<option value="">全部</option>';
				// var str = '';
				for (var i = 0; i < data.length; i++) {
					var id = data[i].pk;
					var title = data[i].fields.title;
					// if (name == title) {
					// 	str += '<option value="' + id + '" selected>' + title + '</option>';
					// 	where.ofAreaCenter = id;
					// } else {
					// 	str += '<option value="' + id + '">' + title + '</option>';
					// };
					str += '<option value="' + id + '">' + title + '</option>';
				};
				$("#laySeleA").html(str);
				where.ofAreaCenter = data.length > 0 ? data[0].pk : "";
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
				// var name = res.name;
				var str = '<option value="">全部</option>';
				// var str = '';
				for (var i = 0; i < data.length; i++) {
					var id = data[i].pk;
					var title = data[i].fields.station;
					// if (name == title) {
					// 	str += '<option value="' + id + '" selected>' + title + '</option>';
					// 	where.ofArea = id;
					// } else {
					// 	str += '<option value="' + id + '">' + title + '</option>';
					// };
					str += '<option value="' + id + '">' + title + '</option>';
				};
				$("#laySeleB").html(str);
				where.ofArea = data.length > 0 ? data[0].pk : "";
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
				// var name = res.name;
				var str = '<option value="">全部</option>';
				// var str = '';
				for (var i = 0; i < data.length; i++) {
					var id = data[i].pk;
					var title = data[i].fields.station;
					// if (name == title) {
					// 	str += '<option value="' + id + '" selected>' + title + '</option>';
					// 	where.ofCenter = id;
					// } else {
					// 	str += '<option value="' + id + '">' + title + '</option>';
					// };
					str += '<option value="' + id + '">' + title + '</option>';
				};
				$("#laySeleC").html(str);
				where.ofCenter = data.length > 0 ? data[0].pk : "";
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

	function getListFn() {
		table.render({
			elem: '#table',
			url: urls.petr,
			headers: {
				token: sessionStorage.token
			},
			where: where,
			request: {
				pageName: 'pageNum',
				limitName: 'pageSize'
			},
			parseData: function (res) {
				return {
					"code": 0,
					"count": res.count,
					"data": res.data
				};
			},
			cols: [
				[{
					field: 'area',
					title: '海区'
				}, {
					field: 'center',
					title: '中心站'
				}, {
					title: '台站',
					templet: function (item) {
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
	form.on('submit(subBtn)', function (data) {
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

	form.on('submit(expBtn)', function (data) {
		where = data.field;
		var date = where.date;
		var idx = date.indexOf("~");
		var startTime = date.substring(0, idx).trim();
		var endTime = date.substring(idx + 1).trim();
		where.startTime = startTime;
		where.endTime = endTime;
		delete where.date;
		// where.type =
		load(urls.petr, "post", where);
	});

	window.layFn = function (id) {
		var style = where.style,
			startTime = where.startTime,
			endTime = where.endTime;
		query.layFn(id, startTime, endTime, style,);
	};


	form.verify({
		date: function (val) {
			if (val.indexOf('~') == -1) {
				return '请选择日期范围';
			}
		},
		num: function (val) {
			if (val) {
				if (val <= 0 || isNaN(Number(val))) {
					return '请输入大于0的数字';
				}
			}
		}
	});
	e("petr", {})
});