layui.define(["http", "getFn"], function (e) {
	var http = layui.http,
		urls = layui.urls,
		getFn = layui.getFn;

	var $ = layui.$,
		layForm = layui.form;

	var userId = getFn.locaStr("id"),
		is = 1;

	var para = {
		ofCountry: "",
		ofArea: "",
		ofCenter: ""
	};

	// 获取人员详情
	var userData = null;

	function getUserFn() {
		http({
			url: urls.infochange,
			data: {
				id: userId
			},
			async: false,
			type: "get",
			success: function (res) {
				userData = res.data;
				var data = userData.fields;
				para.ofCountry = data.ofCountry;
				para.ofArea = data.ofArea;
				para.ofCenter = data.ofCenter;
				getYiFn();
			}
		});
	};
	getUserFn();

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
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>';
				};
				$("#ofCountry").html(str);
				getErFn();
			}
		});
	};
	// 二级所属站
	window.getErFn = function () {
		http({
			url: urls.infotype,
			type: 'post',
			data: {
				type: para.ofCountry
			},
			success: function (res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>';
				};
				$("#ofArea").html(str);
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
				type: para.ofArea
			},
			success: function (res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>';
				};
				$("#ofCenter").html(str);
				layForm.render("select");
				is == 1 ? setDataFn() : "";
			}
		});
	};
	// 赋值
	function setDataFn() {
		var data = userData.fields;
		var duty = data.onDuty.split(",");
		var check = $("#duty").find('input[type="checkbox"]');
		for (var d = 0; d < duty.length; d++) {
			var m = duty[d];
			for (var k = 0; k < check.length; k++) {
				var v = check[k].value;
				if (v == m) {
					$(check[k]).attr('checked', true);
				}
			}
		};
		layForm.val('layForm', {
			"id": userData.pk,
			"personnel": data.personnel,
			"phone": data.phone,
			"mobile": data.mobile,
			"ofCountry": data.ofCountry,
			"ofArea": data.ofArea,
			"ofCenter": data.ofCenter,
			"description": data.description
		});
		is = 2;
	}
	// 检索框选择
	layForm.on('select(filt)', function (data) {
		var t = data.othis[0];
		var id = $(t).prev().attr('id');
		para[id] = data.value;
		var fn = $(t).prev().attr('fn');
		if (fn == undefined) {
			return false;
		};
		window[fn]();
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
			url: urls.infochange,
			type: 'post',
			data: data,
			success: function (res) {
				layer.msg("修改人员信息成功", {
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
	e("infoChange", {})
});
