layui.define(["http", "load", "getFn"], function(e) {
	var http = layui.http,
		urls = layui.urls,
		load = layui.load,
		getFn = layui.getFn;

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

	var type = $("#sele").val();
	form.on('select(layFilt)', function(data) {
		type = data.value;
		stationRange();
	});
	stationRange();

	// 一级检索接口
	function stationRange() {
		http({
			url: urls.stationRange,
			data: {
				type: type,
				num:1
			},
			success: function(res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.Name + '</option>'
				};
				$("#oneId").html(str);
				form.render("select");
				getErFn();
			}
		});
	};
	// 二级检索接口
	function getErFn() {
		http({
			url: urls.faultCenter,
			success: function(res) {
				var data = res.data;
				var str = '<option value="" selected>全部</option>';
				for (var i = 0; i < data.length; i++) {
					var id = data[i].pk;
					var title = data[i].fields.station;
					str += '<option value="' + id + '">' + title + '</option>';
				};
				twoId = "";
				$("#twoId").html(str);
				form.render("select");
			}
		});
	};
	getErFn();

	// 故障类型检索接口
	function getLiuFn() {
		http({
			url: urls.faultType,
			type: 'get',
			success: function(res) {
				var data = res.data;
				var arr = [];
				for (var t = 0; t < data.length; t++) {
					var id = data[t].pk;
					var title = data[t].fields.Title;
					arr[t] = '<option value="' + id + '">' + title + '</option>';
				};
				arr.unshift('<option value="" selected>全部</option>');
				$("#faultType").html(arr.join(","));
				form.render("select");
			}
		});
	};
	getLiuFn();

	// 列表接口
	var where, page = 1;

	function getListFn() {
		table.render({
			elem: '#table',
			url: urls.faultlist,
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
					fixed: 'left',
					title: '站名',
					templet: function(item) {
						return item.fields.station
					}
				}, {
					title: 'ip',
					templet: function(item) {
						return item.fields.ip
					}
				}, {
					title: '故障类型',
					templet: function(item) {
						return item.fields.faultType
					}
				}, {
					title: '推断故障',
					minWidth: 260,
					templet: function(item) {
						return item.fields.faultReason
					}
				}, {
					title: '确认故障',
					templet: function(item) {
						return item.fields.faulCconfirm
					}
				}, {
					title: '缺失开始时间',
					templet: function(item) {
						return item.fields.startTime
					}
				}, {
					title: '缺失结束时间',
					templet: function(item) {
						return item.fields.endTime
					}
				}, {
					title: '持续时间',
					templet: function(item) {
						return item.fields.durTime
					}
				}, {
					title: '故障处理人',
					templet: function(item) {
						return item.fields.handler
					}
				}, {
					title: '状态',
					templet: function(item) {
						var is = item.fields.state;
						if (is == 0) {
							var html = "待推送";
						} else if (is == 1) {
							var html = "待处理";
						} else {
							var html = "已处理";
						};
						return html
					}
				}, {
					fixed: 'right',
					align: "center",
					title: '操作',
					toolbar: '#toolbar'
				}]
			],
			page: {
				layout: ['prev', 'page', 'next', 'skip', 'count']
			},
			id: 'tabReload',
			height: 535,
			cellMinWidth: 80,
			done: function(res, curr) {
				page = curr;
			}
		});
	};

	// 重载当前页面
	window.ReLoadFn = function() {
		layer.closeAll(function() {
			table.reload('tabReload', {
				page: {
					curr: page
				}
			});
		})
	};

	table.on('tool(table)', function(data) {
		var event = data.event;
		var id = data.data.pk;
		event == 1 ? openFn(id) : deleFn(id);
	});
	// 查询
	form.on('submit(subBtn)', function(data) {
		page = 1;
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
		load(urls.faultlist, "post", where);
	});
	$("#deleBtn").click(function() {
		var infoMsg = layer.msg('此操作将永久清除历史故障, 是否继续?', {
			time: 5000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function() {
				http({
					url: urls.faultDelete,
					success: function(res) {
						layer.msg('清除成功！', {
							time: 1000
						}, function() {
							ReLoadFn();
						});
						layer.close(infoMsg);
					}
				});
			},
			btn2: function() {
				layer.msg('已取消删除。');
			}
		});
	});

	function openFn(id) {
		var url = "./faultChange.html?id=" + id;
		layer.open({
			type: 2,
			title: "修改",
			resize: !1,
			shade: 0.3,
			skin: "lay-drop lay-drp",
			id: "site",
			area: ["760px", "540px"],
			content: url
		});
	};

	function deleFn(id) {
		var infoMsg = layer.msg('此操作将永久删除该数据, 是否继续?', {
			time: 5000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function() {
				http({
					url: urls.faultdele,
					type: 'post',
					data: {
						id: id
					},
					success: function(res) {
						layer.msg('删除成功！', {
							time: 1000
						}, function() {
							ReLoadFn();
						});
						layer.close(infoMsg);
					}
				});
			},
			btn2: function() {
				layer.msg('已取消删除。');
			}
		});
	};
	form.verify({
		date: function(val) {
			if (val.indexOf('~') == -1) {
				return '请选择日期范围';
			}
		},
		time: function(val) {
			if (val) {
				if (val < 0 || isNaN(Number(val))) {
					return '请输入大于0的数字';
				}
			}
		}
	});
	e("fault_d", {})
});
