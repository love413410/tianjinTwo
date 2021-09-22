layui.define(["http", "load", "getFn"], function (e) {
	var http = layui.http,
		urls = layui.urls,
		load = layui.load,
		getFn = layui.getFn;

	var $ = layui.$,
		form = layui.form,
		table = layui.table;

	var arr = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
	var retr = "", page = 1;

	window.getListFn = function () {
		table.render({
			elem: '#table',
			url: urls.infolist,
			headers: {
				token: sessionStorage.token
			},
			where: {
				name: retr
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
					title: '姓名',
					templet: function (item) {
						return item.fields.personnel
					}
				}, {
					title: '所属站点',
					templet: function (item) {
						return item.fields.hans
					}
				},
				{
					title: '账号',
					templet: function (item) {
						return item.fields.userName
					}
				},
				{
					title: '固定电话',
					templet: function (item) {
						return item.fields.phone
					}
				},
				{
					title: '手机号',
					templet: function (item) {
						return item.fields.mobile
					}
				},
				{
					title: '值班日',
					templet: function (item) {
						var onDuty = item.fields.onDuty;
						var temp = onDuty.split(",");
						var day = [];
						for (var d = 0; d < temp.length; d++) {
							day.push(arr[temp[d] - 1]);
						};
						var html = day.join("，");
						return html;
					},
					minWidth: 400
				}, {
					title: '备注',
					templet: function (item) {
						return item.fields.description
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
			done: function (res, curr) {
				page = curr;
			}
		});
	};
	getListFn();

	// 重载当前页面
	window.ReLoadFn = function () {
		layer.closeAll(function () {
			table.reload('tabReload', {
				page: {
					curr: page
				}
			});
		});
	};
	// 查询
	form.on('submit(subBtn)', function (data) {
		retr = data.field.retr;
		getListFn();
	});

	form.on('submit(expBtn)', function (data) {
		var retr = data.field.retr;
		load(urls.infolist, "post", { name: retr });
	});


	// 操作
	var dataItem, infoId;
	table.on('tool(table)', function (data) {
		var event = Number(data.event);
		dataItem = data.data;
		infoId = data.data.pk;
		switch (event) {
			case 1:
				openFn(infoId);
				break;
			case 2:
				limitFn();
				break;
			case 3:
				deleFn(infoId);
				break;
			case 4:
				resetFn();
				break;
			default:
				console.log('11111')
		}
		// event == 1 ? openFn(id) : deleFn(id);
	});

	// 添加还是修改,有ID则去修改,无ID则去添加
	window.openFn = function (id) {
		if (id) {
			var title = "修改人员信息";
			var url = "./infoChange.html?id=" + id;
		} else {
			var title = "添加人员";
			var url = "./infoAdd.html";
		};
		layer.open({
			type: 2,
			title: title,
			resize: !1,
			skin: "lay-drop lay-drp",
			id: "id",
			shade: 0,
			area: ["680px", "550px"],
			content: url
		});
	};
	// 分配账号
	function limitFn() {
		layer.open({
			type: 1,
			title: "分配",
			resize: !1,
			skin: "lay-drop lay-drops",
			area: ['500px', '300px'],
			shadeClose: false,
			content: $('#limits'),
			success: function () {
				$("#limit")[0].reset();
			}
		});
	};

	var load;
	form.on('submit(addSub)', function (data) {
		var data = data.field;
		data.id = infoId;
		delete data.newPass
		http({
			url: urls.limitAdd,
			data: data,
			type: "post",
			beforeSend: function () {
				load = layer.load(1, {
					shade: [0.1, '#fff']
				});
			},
			success: function (res) {
				layer.msg("分配账号成功!", {
					time: 1500
				}, function () {
					ReLoadFn()
				});
			},
			complete: function () {
				layer.close(load);
			}
		});
		return false;
	});

	function resetFn() {
		var infoMsg = layer.msg('是否重置该用户的密码?', {
			time: 5000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function () {
				http({
					url: urls.reset,
					type: 'post',
					data: {
						userName: dataItem.fields.userName
					},
					success: function () {
						layer.msg('重置成功！');
						layer.close(infoMsg);
					}
				});
			},
			btn2: function () {
				layer.msg('已取消重置。');
			}
		});
	};

	// 删除
	function deleFn(id) {
		var infoMsg = layer.msg('此操作将永久删除该数据, 是否继续?', {
			time: 5000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function () {
				http({
					url: urls.infodele,
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

	// 正则验证
	form.verify({
		userName: function (val) {
			if (!getFn.username(val)) {
				return '请输入4至11位的账号,可包含数字但不可包含特殊字符';
			}
		},
		passWord: function (val) {
			if (!getFn.password(val)) {
				return '请输入4至16位的密码,字母开头包含数字和特殊字符';
			};
		},
		newPass: function (val) {
			var pass = $('#pass').val();
			if (pass != '' && val !== pass) {
				return '两次输入密码不一致';
			}
		},
	});
	e("info", {})
});
