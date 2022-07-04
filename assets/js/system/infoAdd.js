layui.define(["http", "getFn"], function (e) {
	var http = layui.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.$,
		layForm = layui.form;

	var para = {
		oneId: "",
		twoId: "",
		threeId: ""
	};
	// 一级所属站
	window.getYiFn = function () {
		http({
			url: urls.infotype,
			success: function (res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
				};
				$("#oneId").html(str);
				layForm.render("select");
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
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
				};
				$("#twoId").html(str);
				layForm.render("select");
				para.twoId = data.length > 0 ? data[0].pk : "";
				getSanFn();
			}
		});
	};

	// 三级所属站
	window.getSanFn = function () {
		http({
			url: urls.infstype,
			data: {
				type: para.twoId
			},
			success: function (res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
				};
				$("#threeId").html(str);
				layForm.render("select");
			}
		});
	};
	// 检索框选择
	layForm.on('select(filt)', function (data) {
		infoDeta = null;
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
	layForm.on('submit(sub)', function (data) {
		var data = data.field;
		data.ofStation = data.ofCenter ? data.ofCenter : data.ofArea ? data.ofArea : data.ofCountry;
		var arr = [];
		$("#duty").find("input[type=checkbox]").each(function () {
			var is = $(this).is(":checked");
			if (is) {
				var val = $(this).val();
				arr.push(val);
			}
		});
		var str = arr.join(",");
		data.onDuty = str;
		http({
			url: urls.infoadd,
			type: 'post',
			data: data,
			success: function (res) {
				layer.msg("添加人员成功", {
					time: 1500
				}, function () {
					parent.ReLoadFn();
				});
			}
		});
		return false;
	});
	layForm.verify({
		personnel: function (val) {
			if (!getFn.user(val) || val.length <= 0) {
				return '请输入正确的人员姓名!';
			}
		},
		phone: function (val) { //电话验证
			if (!getFn.phone(val) && !getFn.user(val)) {
				return '请输入正确的固定电话!';
			}
		},
		mobile: function (val) {
			if (!getFn.mobile(val)) {
				return '请输入正确的手机号!';
			}
		},
	});
	e("infoAdd", {})
});
