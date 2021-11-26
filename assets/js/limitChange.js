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

	var limitId = getFn.locaStr("id"), is = 1;
	var para = { ofCountry: "", ofArea: "", ofCenter: "" };

	// 获取用户详情
	var liminData = null;

	function getUserFn() {
		http({
			url: urls.climit,
			data: {
				id: limitId
			},
			async: false,
			type: "get",
			success: function (res) {
				liminData = res.data;
				var data = liminData.fields;
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
			async: false,
			success: function (res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
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
			async: false,
			success: function (res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
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
			data: {
				type: para.ofArea
			},
			async: false,
			success: function (res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.station + '</option>'
				};
				$("#ofCenter").html(str);
				form.render("select");
				is == 1 ? setDataFn() : "";
			}
		});
	};

	function setDataFn() {
		var data = liminData.fields;
		form.val('layForm', {
			"id": liminData.pk,
			"userName": data.userName,
			"limit": data.limit,
			"ofCountry": data.ofCountry,
			"ofArea": data.ofArea,
			"ofCenter": data.ofCenter
		});
		is = 2;
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
	});

	form.on('submit(addSub)', function (data) {
		var data = data.field;
		data.ofStation = data.ofCenter ? data.ofCenter : data.ofArea ? data.ofArea : data.ofCountry;
		delete data.userName;
		http({
			url: urls.climit,
			data: data,
			type: "post",
			success: function (res) {
				layer.msg("修改成功!", {
					time: 1500
				}, function () {
					parent.ReLoadFn();
				});
			}
		});
	});
	e("limitChange", {})
});
