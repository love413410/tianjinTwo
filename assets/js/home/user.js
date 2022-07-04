layui.define(["http", "getFn"], function (e) {
	var http = layui.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.jquery,
		layer = layui.layer,
		element = layui.element,
		form = layui.form,
		transfer = layui.transfer;

	var user = sessionStorage.user;
	$("#user").val(user);

	var isUser = getFn.isUserFn();

	if (isUser) {
		$("#rBtn").removeClass("layui-hide");
	};
	$("#reset").attr("disabled", !isUser);
	form.render();

	element.on('tab(tab)', function (data) {
		var index = data.index;
		index == 1 ? getTab2Fn() : index == 2 ? getTab3Fn() : "";
	});

	//修改密码提交
	form.on('submit(cBtn)', function (data) {
		var data = data.field;
		!isUser ? delete data.reset : "";

		var passWord = data.passWord;
		if (!getFn.trimFn(passWord)) {
			layFn("请输入此账号的当前密码");
			return false;
		};

		var newPass = data.newPass;
		if (!getFn.password(newPass)) {
			layFn("请输入8至16位的新密码,字母开头并包含数字和特殊字符");
			return false;
		};

		var newPass2 = data.newPass2;
		if (newPass2 != newPass) {
			layFn("两次新密码输入不一致");
			return false;
		};

		http({
			url: urls.pass,
			type: "post",
			data: data,
			success: function (res) {
				layer.msg(res.msg, {}, function () {
					closeFn();
				});
			}
		});
	});

	//设置重置密码提交
	form.on('submit(rBtn)', function (data) {
		if (!isUser) {
			layFn("你没有权限设置重置密码!");
			return false;
		};
		var data = data.field;
		var reset = data.reset;
		if (isUser && !getFn.password(reset)) {
			layFn("请输入8至16位的重置密码,字母开头并包含数字和特殊字符");
			return false;
		};
		http({
			url: urls.pass,
			type: "post",
			data: {
				reset: reset
			},
			success: function (res) {
				layer.msg(res.msg, {}, function () {
					closeFn();
				});
			}
		});
	});
	//初始化下拉框
	var xmst, xmsts;
	function getTab2Fn() {
		http({
			url: urls.utype,
			success: function (res) {
				var type = res.type;
				xmst = xmSelect.render({
					el: '#xmst',
					tips: '请选择故障类型',
					name: 'types',
					model: {
						label: {
							type: 'xmselect',
							xmselect: {
								template: function (data, sels) {
									return "已选中 " + sels.length + " 项, 共 " + data.length + " 项"
								}
							}
						}
					},
					toolbar: {
						show: true,
						showIcon: false
					},
					data: type,
					filterable: true
				});
				var confrim = res.confrim;
				xmsts = xmSelect.render({
					el: '#xmsts',
					tips: '请选择确认故障',
					name: 'confirms',
					model: {
						label: {
							type: 'xmselect',
							xmselect: {
								template: function (data, sels) {
									return "已选中 " + sels.length + " 项, 共 " + data.length + " 项"
								}
							}
						}
					},
					toolbar: {
						show: true,
						showIcon: false
					},
					data: confrim,
					filterable: true
				});
				var tArr = [];
				for (var t = 0; t < type.length; t++) {
					tArr[t] = '<option value="' + type[t].value + '">' + type[t].name + '</option>'
				};
				$("#type").html(tArr.join(','));
				var cArr = [];
				for (var c = 0; c < confrim.length; c++) {
					cArr[c] = '<option value="' + confrim[c].value + '">' + confrim[c].name + '</option>'
				};
				$("#confirm").html(cArr.join(','));
				form.render('select');
			}
		});
	};

	// 添加故障类型
	form.on('submit(aType)', function (data) {
		var name = data.field.type;
		if (!getFn.user(name) || !getFn.trimFn(name)) {
			layFn("请输入故障类型(仅支持汉字和英文)");
			return false;
		};
		http({
			url: urls.utype,
			type: 'post',
			data: {
				type: 'type',
				name: name
			},
			success: function (res) {
				layer.msg(res.msg);
				// getTab2Fn();
			}
		})
	});
	// 修改故障类型
	form.on('submit(cType)', function (data) {
		var name = data.field.typeName;
		if (!getFn.user(name) || !getFn.trimFn(name)) {
			layFn("请输入新的故障类型(仅支持汉字和英文)");
			return false;
		};
		var id = data.field.typeId;
		http({
			url: urls.ctitle,
			type: 'post',
			data: {
				type: 'type',
				id: id,
				name: name
			},
			success: function (res) {
				layer.msg('修改成功');
				// getTab2Fn();
			}
		})
	})
	// 添加确认故障
	form.on('submit(aCon)', function (data) {
		var name = data.field.confirm;
		if (!getFn.user(name) || !getFn.trimFn(name)) {
			layFn("请输入确认故障(仅支持汉字和英文)");
			return false;
		};
		http({
			url: urls.utype,
			type: 'post',
			data: {
				type: 'confirm',
				name: name
			},
			success: function (res) {
				layer.msg(res.msg);
				// getTab2Fn();
			}
		})
	});
	// 修改确认故障
	form.on('submit(cCon)', function (data) {
		var name = data.field.conName;
		if (!getFn.user(name) || !getFn.trimFn(name)) {
			layFn("请输入新的故障类型(仅支持汉字和英文)");
			return false;
		};
		var id = data.field.conId;
		http({
			url: urls.ctitle,
			type: 'post',
			data: {
				type: 'confirm',
				id: id,
				name: name
			},
			success: function (res) {
				layer.msg('修改成功');
				// getTab2Fn();
			}
		})
	})
	// 删除故障类型
	form.on('submit(sBtn)', function (data) {
		var name = data.field.types;
		if (name.length < 0) {
			layFn("请选择要删除的故障类型");
			return false;
		};
		http({
			url: urls.dtype,
			type: 'post',
			data: {
				type: 'type',
				name: name
			},
			success: function (res) {
				layer.msg(res.msg);
				// getTab2Fn();
			}
		})
	});
	// 删除确认故障
	form.on('submit(tBtn)', function (data) {
		var name = data.field.confirms;
		if (name.length < 0) {
			layFn("请选择要删除的确认故障");
			return false;
		};
		http({
			url: urls.dtype,
			type: 'post',
			data: {
				type: 'confirm',
				name: name
			},
			success: function (res) {
				layer.msg(res.msg);
				// getTab2Fn();
			}
		})
	});

	// 故障3
	var dataCon, typeId;
	function getTab3Fn() {
		http({
			url: urls.utype,
			success: function (res) {
				var type = res.type;
				var arr = [];
				for (var i = 0; i < type.length; i++) {
					arr[i] = '<option value="' + type[i].value + '">' + type[i].name + '</option>';
				};
				$("#list").html(arr.join(','));
				form.render("select")
				typeId = type.length > 0 ? type[0].value : "";
				dataCon = res.confrim;
				getConFn();
			}
		})
	};
	form.on('select(list)', function (data) {
		typeId = data.value;
		getConFn();
	});
	function getConFn() {
		http({
			url: urls.dtype,
			data: {
				id: typeId
			},
			success: function (res) {
				var value = res.data.split(',');
				transfer.render({
					elem: '#demo',
					title: ["待分配确认故障", "已分配确认故障"],
					width: 250,
					height: 280,
					data: dataCon,
					value: value,
					id: "demo"
				})
			}
		})
	};
	$("#btn").click(function () {
		var data = transfer.getData('demo');
		var arr = [];
		for (var i = 0; i < data.length; i++) {
			arr[i] = data[i].value;
		};
		var str = arr.join(',');
		http({
			url: urls.confirm,
			type: 'post',
			data: {
				type: typeId,
				confirm: str
			},
			success: function () {
				layer.msg("分配成功")
			}
		})
	})

	// 自定义弹出层
	function layFn(text) {
		layer.msg(text, {
			icon: 2, shift: 6,
		});
	};

	e("user", {})
});
