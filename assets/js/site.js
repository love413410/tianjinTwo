layui.define(["http", "load"], function(e) {
	var http = layui.http,
		urls = layui.urls,
		load = layui.load;

	var $ = layui.$,
		form = layui.form,
		table = layui.table,
		upload = layui.upload;
	//乱七八糟的在最下面,监听按钮,验证等

	var page = 1;
	var type = $("#sele").val();
	form.on('select(layFilt)', function(data) {
		type = data.value;
		stationRange();
	});

	stationRange();
	var oneId = "",
		twoId = "",
		threeId = "";
	// 一级检索接口
	function stationRange() {
		http({
			url: urls.stationRange,
			data: {
				type: type
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
				oneId = data.length > 0 ? data[0].pk : "";
				getErFn();
			}
		});
	};
	form.on('select(layOneFilt)', function(data) {
		oneId = data.value;
		getErFn();
	});
	// 二级检索接口
	function getErFn() {
		http({
			url: urls.sitelisttype,
			type: 'post',
			data: {
				type: oneId
			},
			success: function(res) {
				var data = res.data;
				var name = res.name;
				var str = '<option value="" selected>全部</option>';
				for (var i = 0; i < data.length; i++) {
					var id = data[i].pk;
					var title = data[i].fields.title;
					str += '<option value="' + id + '">' + title + '</option>';
				};
				twoId = "";
				// var str = '<option value="">全部</option>';
				// for (var i = 0; i < data.length; i++) {
				// 	var id = data[i].pk;
				// 	var title = data[i].fields.title;
				// 	if (name == title) {
				// 		str += '<option value="' + id + '" selected>' + title + '</option>';
				// 		twoId = id;
				// 	} else {
				// 		str += '<option value="' + id + '">' + title + '</option>';
				// 	};
				// };
				$("#twoId").html(str);
				form.render("select");
				getSanFn();
			}
		});
	};
	form.on('select(layTwoFilt)', function(data) {
		twoId = data.value;
		getSanFn();
	});
	// 三级检索接口
	function getSanFn() {
		http({
			url: urls.siteliststype,
			data: {
				type: oneId,
				ofAreaCenter: twoId
			},
			success: function(res) {
				var data = res.data;
				var name = res.name;
				var str = '<option value="" selected>全部</option>';
				for (var i = 0; i < data.length; i++) {
					var id = data[i].pk;
					var title = data[i].fields.station;
					str += '<option value="' + id + '">' + title + '</option>';
				};
				threeId = "";
				// var str = '<option value="">全部</option>';
				// for (var i = 0; i < data.length; i++) {
				// 	var id = data[i].pk;
				// 	var title = data[i].fields.station;
				// 	if (name == title) {
				// 		str += '<option value="' + id + '" selected>' + title + '</option>';
				// 		threeId = id;
				// 	} else {
				// 		str += '<option value="' + id + '">' + title + '</option>';
				// 	};
				// };
				$("#threeId").html(str);
				form.render("select");
				getSiFn();
			}
		});
	};
	form.on('select(layThrFilt)', function(data) {
		threeId = data.value;
		getSiFn();
	});
	// 四级检索接口
	function getSiFn() {
		http({
			url: urls.siteliststype,
			type: 'post',
			data: {
				type: oneId,
				ofAreaCenter: twoId,
				ofArea: threeId
			},
			success: function(res) {
				var data = res.data;
				var name = res.name;
				var str = '<option value="" selected>全部</option>';
				for (var i = 0; i < data.length; i++) {
					var id = data[i].pk;
					var title = data[i].fields.station;
					str += '<option value="' + id + '">' + title + '</option>';
				};
				// var str = '<option value="">全部</option>';
				// for (var i = 0; i < data.length; i++) {
				// 	var id = data[i].pk;
				// 	var title = data[i].fields.station;
				// 	if (name == title) {
				// 		str += '<option value="' + id + '" selected>' + title + '</option>';
				// 		threeId = id;
				// 	} else {
				// 		str += '<option value="' + id + '">' + title + '</option>';
				// 	};
				// };
				$("#fourId").html(str);
				form.render("select");
			}
		});
	};
	window.getListFn = function() {
		table.render({
			elem: '#table',
			url: urls.sitelist,
			method: "post",
			headers: {
				token: sessionStorage.token
			},
			where: listData,
			// where: {
			// 	type: listData.type,
			// 	ofAreaCenter: listData.ofAreaCenter,
			// 	ofArea: listData.ofArea,
			// 	ofCenter: listData.ofCenter,
			// 	name: listData.name
			// },
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
					title: '站点名',
					templet: function(item) {
						return item.fields.station
					}
				}, {
					title: '站类型',
					templet: function(item) {
						return item.fields.stationType
					}
				}, {
					title: '站代码',
					templet: function(item) {
						return item.fields.stationCode;
					}
				}, {
					title: '站名代码',
					templet: function(item) {
						return item.fields.stationNumCode
					}
				}, {
					title: '区站号',
					templet: function(item) {
						return item.fields.stationNum
					}
				}, {
					title: '观测类型',
					templet: function(item) {
						return item.fields.lookType
					}
				}, {
					title: '经度',
					templet: function(item) {
						return item.fields.lon
					}
				}, {
					title: '纬度',
					templet: function(item) {
						return item.fields.lat
					}
				}, {
					title: '所属站点',
					templet: function(item) {
						return item.fields.hans
					}
				}, {
					title: 'IP',
					templet: function(item) {
						return item.fields.ip
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
		});
	};
	table.on('tool(table)', function(data) {
		var event = data.event;
		var id = data.data.pk;
		event == 1 ? clickFn(id) : event == 2 ? openFn(id) : deleFn(id);
	});
	// 查询按钮调取站点列表接口
	form.on('submit(subBtn)', function(data) {
		// siteName = data.field.name;
		listData = data.field;
		getListFn();
	});
	form.on('submit(expBtn)', function(data) {
		load(urls.siteDownload, "get");
	});
	// 设置默认站点
	function clickFn(id) {
		var infoMsg = layer.msg('是否将该站点设为默认站点?', {
			time: 5000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function() {
				http({
					url: urls.sitedefault,
					type: 'post',
					data: {
						id: id
					},
					success: function(res) {
						layer.msg('设置成功！', {
							time: 1500
						}, function() {
							ReLoadFn();
						});
						layer.close(infoMsg);
					}
				});
			},
			btn2: function() {
				layer.msg('已取消设置。');
			}
		});
	};

	// 添加还是修改,有ID则去修改,无ID则去添加
	window.openFn = function(id) {
		// var url = id ? "./siteChange.html?id=" + id : "./siteAdd.html";
		if (id) {
			var title = "修改站点";
			var url = "./siteChange.html?id=" + id;
		} else {
			var title = "添加站点";
			var url = "./siteAdd.html";
		};
		layer.open({
			type: 2,
			title: title,
			resize: !1,
			skin: "lay-drop lay-drp",
			id: "id",
			shade: 0,
			area: ["880px", "600px"],
			content: url
		});
	};
	//上传数据类型
	window.impFn = function() {
		layer.open({
			type: 1,
			title: "上传数据类型",
			resize: !1,
			skin: "lay-drop lay-drp",
			id: "id",
			shade: 0,
			area: ["280px", "200px"],
			content: $("#impDemo")
		});
	};

	upload.render({
		elem: '#impDemo',
		url: urls.siteUphold,
		headers: {
			"token": sessionStorage.token
		},
		accept: 'file',
		acceptMime: 'application/vnd.ms-excel',
		exts: 'xls|xlsx',
		field: 'myfile',
		done: function(res) {
			layer.msg("上传成功", {}, function() {
				layer.closeAll();
			})
		}
	});
	/*
		@@删除
	*/
	function deleFn(id) {
		var infoMsg = layer.msg('此操作将永久删除该数据, 是否继续?', {
			time: 5000,
			shade: 0.5,
			btn: ['确定', '取消'],
			yes: function() {
				http({
					url: urls.sitedele,
					type: 'post',
					data: {
						id: id
					},
					success: function(res) {
						layer.msg('删除成功！', {
							time: 1500
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
	e("site", {})
});
