layui.define(["http", "dtree"], function (e) {
	var http = layui.http,
		urls = layui.urls,
		dtree = layui.dtree;

	var $ = layui.$,
		layer = layui.layer,
		form = layui.form,
		table = layui.table;

	var retr = '', page = 1;
	window.getListFn = function () {
		table.render({
			elem: '#table',
			url: urls.limitList,
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
					title: '账号',
					templet: function (item) {
						return item.fields.userName
					}
				}, {
					title: '级别',
					templet: function (item) {
						var limit = item.fields.limit == 1 ? "超级管理员" : "普通管理员";
						return limit;
					}
				}, {
					title: '创建日期',
					templet: function (item) {
						return item.fields.Time;
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

	// 操作
	var dataItem;
	table.on('tool(table)', function (data) {
		var event = Number(data.event);
		dataItem = data.data;
		var id = dataItem.pk;
		switch (event) {
			case 1:
				openFn(id);
				break;
			case 2:
				limitFn();
				break;
			case 3:
				deleFn(id);
				break;
			case 4:
				resetFn();
				break;
			default:
				console.log('11111')
		}
	});
	// 添加还是修改,有ID则去修改,无ID则去添加
	window.openFn = function (id) {
		;
		if (id) {
			var title = "修改用户信息";
			var h = "340px";
			var url = "./limitChange.html?id=" + id;
		} else {
			var title = "添加用户";
			var h = "450px";
			var url = "./limitAdd.html";
		};
		layer.open({
			type: 2,
			title: title,
			resize: !1,
			skin: "lay-drop lay-drp",
			id: "id",
			shade: 0,
			area: ["500px", h],
			content: url
		});
	};
	// 站点分配
	window.limitFn = function (x) {
		if (x == 0) {
			layer.closeAll();
			return false;
		};
		getTreeFn();
	};

	function getTreeFn() {
		http({
			url: urls.limittree,
			data: {
				id: dataItem.pk
			},
			success: function (res) {
				var data = res.data;
				var ids = res.ids;
				dtree.render({
					elem: "#elemTree",
					dataStyle: "layuiStyle",
					width: 340,
					data: data,
					initLevel: 5,
					skin: "laySimple",
					nodeIconArray: {
						"3": {
							"open": "dtree-icon-jian",
							"close": "dtree-icon-jia"
						}
					},
					ficon: ["3", "7"],
					checkbar: true,
					checkbarType: "all",
					done: function () {
						dtree.chooseDataInit("elemTree", ids);
					}
				});

				form.val('limitForm', {
					"id": dataItem.pk,
					"userName": dataItem.fields.userName
				});

				var local = res.local;
				var arr = [];
				for (var i = 0; i < local.length; i++) {
					var id = local[i].id;
					var title = local[i].title;
					var checkd = local[i].checkd;
					if (checkd == 0) {
						arr[i] = '<div class="layui-inline"><input type="checkbox" lay-skin="primary" value="' + id + '"  title="' + title + '" /></div>';
					} else {
						arr[i] = '<div class="layui-inline"><input type="checkbox" lay-skin="primary" checked value="' + id + '"  title="' + title + '" /></div>';
					};
				};
				var arrs = [];
				for (var b = 0; b < arr.length; b + 2) {
					var dom = '<div>' + arr.slice(b, b += 2) + '</div>';
					arrs.push(dom);
				};
				var str = arrs.toString().replace(/,/g, "");
				$("#check").html(str);

				var country = res.country;
				var cArr = [];
				for (var i = 0; i < country.length; i++) {
					var id = country[i].id;
					var title = country[i].title;
					var checkd = country[i].checkd;
					if (checkd == 0) {
						cArr[i] = '<div class="layui-inline"><input type="checkbox" lay-skin="primary" value="' + id + '"  title="' + title + '" /></div>';
					} else {
						cArr[i] = '<div class="layui-inline"><input type="checkbox" lay-skin="primary" checked value="' + id + '"  title="' + title + '" /></div>';
					};
				};
				var cArrs = [];
				for (var b = 0; b < cArr.length; b + 2) {
					var dom = '<div>' + cArr.slice(b, b += 2) + '</div>';
					cArrs.push(dom);
				};
				var cStr = cArrs.toString().replace(/,/g, "");
				$("#checks").html(cStr);

				form.render("checkbox", "limitForm");

				layer.open({
					type: 1,
					title: "分配",
					resize: !1,
					skin: "lay-drop",
					id: "id",
					area: ["400px", '600px'],
					content: $('#limitForm')
				});
			}
		});
	};
	form.on('submit(elBtn)', function (data) {
		var dom = dtree.getCheckbarNodesParam("elemTree");
		var arr = [];
		for (var i = 0; i < dom.length; i++) {
			arr.push(dom[i].nodeId)
		};
		var data = data.field;
		data.stations = arr.join(",");

		var t_arr = [];
		$(".check input").each(function () {
			var is = $(this).is(":checked");
			if (is) {
				var val = $(this).val();
				t_arr.push(val)
			};
		});
		data.stationRange = t_arr.join(",");

		delete data.userName;
		http({
			url: urls.limittree,
			type: "post",
			data: data,
			success: function (res) {
				layer.msg("修改成功!", {
					time: 1500
				}, function () {
					limitFn('0');
					ReLoadFn();
				});
			}
		})
	});
	// 删除
	window.deleFn = function (id) {
		var infoMsg = layer.msg('此操作将永久删除该数据, 是否继续?', {
			time: 5000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function () {
				http({
					url: urls.limitDele,
					type: 'post',
					data: {
						id: id
					},
					success: function (res) {
						layer.msg('删除成功！', {
							time: 1500
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
	e("limit", {})
});
