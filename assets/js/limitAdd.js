layui.define(["http", "getFn"], function (e) {
	var http = layui.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.$,
		form = layui.form;

	var isUser = getFn.isUserFn();
	var isStr = "";
	if (!isUser) {
		isStr = '<input type="radio" name="limit" value="1" title="超级管理员" disabled/><input type="radio" name="limit" value="2" title="普通管理员" checked/>';
	} else {
		isStr = '<input type="radio" name="limit" value="1" title="超级管理员" checked/><input type="radio" name="limit" value="2" title="普通管理员" />';
	};
	$("#limit").html(isStr);
	form.render();

	var para = {
		oneId: "",
		twoId: "",
		threeId: ""
	};
	// 一级所属站
	window.getYiFn = function () {
		http({
			url: urls.infotype,
			type: 'get',
			data: {},
			success: function (res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					if (i == 0) {
						str += '<option selected value="' + data[i].pk + '">' + dataItem.station + '</option>'
					} else {
						str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
					};
				};
				$("#oneId").html(str);
				para.oneId = data.length > 0 ? data[0].pk : "";
				getErFn();
			}
		});
	};
	getYiFn();
	// 二级所属站
	window.getErFn = function () {
		http({
			url: urls.infotype,
			type: 'post',
			data: {
				type: para.oneId
			},
			success: function (res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					if (i == 0) {
						str += '<option selected value="' + data[i].pk + '">' + dataItem.station + '</option>'
					} else {
						str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
					};
				};
				$("#twoId").html(str);
				para.twoId = data.length > 0 ? data[0].pk : "";
				getSanFn();
			}
		});
	};
	// 三级所属站
	window.getSanFn = function () {
		http({
			url: urls.infstype,
			type: 'get',
			data: {
				type: para.twoId
			},
			success: function (res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					if (i == 0) {
						str += '<option selected value="' + data[i].pk + '">' + dataItem.station + '</option>'
					} else {
						str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
					};
				};
				$("#threeId").html(str);
				form.render("select");
			}
		});
	};
	// 检索框选择
	form.on('select(filt)', function (data) {
		var t = data.othis[0];
		var id = $(t).prev().attr('id');
		para[id] = data.value;
		var fn = $(t).prev().attr('fn');
		if (fn == undefined) {
			return false;
		};
		window[fn]();
		return false;
	});

	form.on('submit(addSub)', function (data) {
		var data = data.field;
		data.ofStation = data.ofCenter ? data.ofCenter : data.ofArea ? data.ofArea : data.ofCountry;
		http({
			url: urls.limitAdd,
			data: data,
			type: "post",
			success: function (res) {
				layer.msg("添加用户成功!", {
					time: 1500
				}, function () {
					parent.ReLoadFn();
				});
			}
		})
	});
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
	e("limitAdd", {})
});
