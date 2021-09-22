layui.define(["http", "load", "getFn"], function (e) {
	var http = layui.http,
		urls = layui.urls,
		load = layui.load,
		getFn = layui.getFn;

	var $ = layui.$,
		form = layui.form,
		table = layui.table;

	var is = getFn.locaStr("is");

	var look = "", type = 0, page = 1;

	function getListFn() {
		table.render({
			elem: '#table',
			url: urls.faultlist,
			headers: {
				token: sessionStorage.token
			},
			where: {
				name: look,
				type: type,
				style: is
			},
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
					fixed: 'left',
					title: '站名',
					templet: function (item) {
						return item.fields.station
					}
				}, {
					title: '数据类型',
					templet: function (item) {
						return item.fields.dataType
					}
				}, {
					title: '故障类型',
					templet: function (item) {
						return item.fields.faultType
					}
				}, {
					title: '推断故障',
					templet: function (item) {
						return item.fields.faultReason
					}
				}, {
					title: '确认故障',
					templet: function (item) {
						return item.fields.faulCconfirm
					}
				}, {
					title: '缺失开始时间',
					templet: function (item) {
						return item.fields.startTime
					}
				}, {
					title: '缺失结束时间',
					templet: function (item) {
						return item.fields.endTime
					}
				}, {
					title: '故障处理人',
					templet: function (item) {
						return item.fields.handler
					}
				}, {
					title: '状态',
					templet: function (item) {
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
					title: '备注',
					templet: function (item) {
						return item.fields.description
					}
				},
				{
					fixed: 'right',
					align: "center",
					title: '操作',
					toolbar: '#toolbar'
				}
				]
			],
			page: {
				layout: ['prev', 'page', 'next', 'skip', 'count']
			},
			id: 'tabReload',
			height: 535,
			cellMinWidth: 80,
			done: function (res, curr) {
				page = curr;
			}
		});
	};
	getListFn();

	// 重载当前页面
	window.ReLoadFn = function () {
		table.reload('tabReload', {
			page: {
				curr: page
			}
		});
	};

	table.on('tool(table)', function (data) {
		var event = data.event;
		var id = data.data.pk;
		event == 1 ? openFn(id) : deleFn(id);
	});
	// 查询
	form.on('submit(subBtn)', function (data) {
		page = 1;
		look = data.field.look;
		type = data.field.type;
		getListFn();
	});
	form.on('submit(expBtn)', function (data) {
		var look = data.field.look;
		var type = data.field.type;
		load(urls.faultlist, "post", {
			name: look,
			type: type,
			style: is
		});
	});

	function openFn(id) {
		var url = "./faultChange.html?id=" + id;
		layer.open({
			type: 2,
			title: false,
			shade: 0.5,
			closeBtn: 0,
			id: "site",
			area: ["760px", "502px"],
			content: url
		});
	};

	function deleFn(id) {
		var infoMsg = layer.msg('此操作将永久删除该数据, 是否继续?', {
			time: 5000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function () {
				http({
					url: urls.faultdele,
					type: 'post',
					data: {
						id: id
					},
					success: function (res) {
						layer.msg('删除成功！', {
							time: 1000
						}, function () {
							ReLoadFn();
						});
						layer.close(infoMsg);
					}
				});
			},
			btn2: function () {
				layer.msg('已取消删除。');
			}
		});
	};

	$('#close').click(function () {
		parent.alrFns();
		var index = parent.layer.getFrameIndex(window.name)
		parent.layer.close(index);
	});
	e("fault", {})
});
