layui.define(["http", "getFn", "dtree"], function (e) {
	var http = layui.http,
		urls = layui.urls,
		getFn = layui.getFn,
		dtree = layui.dtree;

	var $ = layui.$,
		layForm = layui.form;

	var siteId = getFn.locaStr("id"), is = 1;

	var para = {
		lookType: "",
		stationType: "",
		ofCountry: "",
		ofAreaCenter: "",
		ofArea: "",
		ofCenter: "",
		stationRange: ""
	};

	//获取站点详情
	var siteData = null;

	function getDataFn() {
		http({
			url: urls.sitedeta,
			type: 'post',
			data: {
				id: siteId
			},
			success: function (res) {
				siteData = res.data;
				var data = siteData.fields;
				para.lookType = data.lookType;
				para.stationType = data.stationType;
				para.ofCountry = data.ofCountry;
				para.ofAreaCenter = data.ofAreaCenter;
				para.ofArea = data.ofArea;
				para.ofCenter = data.ofCenter;
				stationRange = data.stationRange;
				para.lookType == 1 ? $("#isType").show() : $("#isType").hide();
				getLookFn();
			}
		});
	};
	getDataFn();

	// 获取观测类型
	function getLookFn() {
		http({
			url: urls.siteType,
			success: function (res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.title + '</option>'
				};
				$("#lookType").html(str);
				layForm.render("select");
				getTy();
				getSiteTypeFn();
			}
		});
	};
	layForm.on('select(filtLook)', function (data) {
		para.lookType = data.value;
		para.lookType == 1 ? $("#isType").show() : $("#isType").hide();
		getSiteTypeFn();
		getTy();
	});

	// 站点范围
	function getTy() {
		$("#eid").empty();
		http({
			url: urls.sitestype,
			type: 'post',
			data: {
				id: para.lookType
			},
			success: function (res) {
				var data = res.data;
				var str = '';
				for (var e = 0; e < data.length; e++) {
					var dataItem = data[e].fields;
					str += '<option value=' + data[e].pk + '>' + dataItem.title + '</option>';
				};
				$("#eid").html(str);
				layForm.render("select");
			}
		})
	};

	//获取站点类型接口
	function getSiteTypeFn() {
		http({
			url: urls.sitestype,
			data: {
				id: para.lookType
			},
			success: function (res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<option value="' + data[i].pk + '">' + dataItem.title + '</option>'
				};
				$("#stationType").html(str);
				para.stationType = data.length > 0 ? data[0].pk : "";
				getType();
			}
		});
	};

	// 所属站一级
	window.getType = function () {
		http({
			url: urls.siteotype,
			data: para,
			success: function (res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				// for (var a = 0; a < data.length; a++) {
				// 	var dataItem = data[a].fields;
				// 	str += '<option value=' + data[a].pk + '>' + dataItem.station + '</option>';
				// };
				for (var a = 0; a < data.length; a++) {
					var dataItem = data[a].fields;
					if (a == 0) {
						str += '<option selected value=' + data[a].pk + '>' + dataItem.station + '</option>';
					} else {
						str += '<option value=' + data[a].pk + '>' + dataItem.station + '</option>';
					};
				};
				$("#ofCountry").html(str);
				is == 2 && data.length > 0 ? para.ofCountry = data[0].pk : "";
				postType();
			}
		})
	};
	// 所属站二级
	window.postType = function () {
		$("#ofAreaCenter").empty();
		http({
			url: urls.siteotype,
			type: 'post',
			data: para,
			success: function (res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				// for (var b = 0; b < data.length; b++) {
				// 	var dataItem = data[b].fields;
				// 	str += '<option value=' + data[b].pk + '>' + dataItem.title + '</option>';
				// };
				for (var b = 0; b < data.length; b++) {
					var dataItem = data[b].fields;
					if (b == 0) {
						str += '<option selected value=' + data[b].pk + '>' + dataItem.title + '</option>';
					} else {
						str += '<option value=' + data[b].pk + '>' + dataItem.title + '</option>';
					};
				};
				$("#ofAreaCenter").html(str);
				is == 2 && data.length > 0 ? para.ofAreaCenter = data[0].pk : "";
				getTypes();
			}
		})
	};
	// 所属站三级
	window.getTypes = function () {
		$("#ofArea").empty();
		http({
			url: urls.sitentype,
			data: para,
			success: function (res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				// for (var c = 0; c < data.length; c++) {
				// 	var dataItem = data[c].fields;
				// 	str += '<option value=' + data[c].pk + '>' + dataItem.station + '</option>';
				// };
				for (var c = 0; c < data.length; c++) {
					var dataItem = data[c].fields;
					if (c == 0) {
						str += '<option selected value=' + data[c].pk + '>' + dataItem.station + '</option>';
					} else {
						str += '<option value=' + data[c].pk + '>' + dataItem.station + '</option>';
					};
				};
				$("#ofArea").html(str);
				is == 2 && data.length > 0 ? para.ofArea = data[0].pk : "";
				postTypes();
			}
		})
	};
	// 所属站四级
	window.postTypes = function () {
		$("#ofCenter").empty();
		http({
			url: urls.sitentype,
			type: 'post',
			data: {
				stationType: para.stationType,
				ofCountry: para.ofCountry,
				ofAreaCenter: para.ofAreaCenter,
				ofArea: para.ofArea,
				ofCenter: ""
			},
			success: function (res) {
				var data = res.data;
				var str = '<option value="">无</option>';
				// for (var d = 0; d < data.length; d++) {
				// 	var dataItem = data[d].fields;
				// 	str += '<option value=' + data[d].pk + '>' + dataItem.station + '</option>';
				// };
				for (var d = 0; d < data.length; d++) {
					var dataItem = data[d].fields;
					if (d == 0) {
						str += '<option selected value=' + data[d].pk + '>' + dataItem.station + '</option>';
					} else {
						str += '<option value=' + data[d].pk + '>' + dataItem.station + '</option>';
					};
				};
				$("#ofCenter").html(str);
				layForm.render("select");
				is == 1 ? setDataFn() : "";
			}
		})
	};

	// 表单赋值
	var strNodeTree = null, //上传节点
		strLine = null, //主线路
		strEl = null; //要素选择

	function setDataFn() {
		var data = siteData.fields;
		strNodeTree = data.uid;
		strEl = data.element;
		strLine = data.Main;
		layForm.val('layForm', {
			"id": siteData.pk,
			"lookType": data.lookType,
			"station": data.station,
			"stationType": data.stationType,
			"stationCode": data.stationCode,
			"stationNum": data.stationNum,
			"stationNumCode": data.stationNumCode,
			"ip": data.ip,
			"lon": data.lon,
			"lat": data.lat,
			"dtime": data.dtime,
			"htime": data.htime,
			"mustFile": data.mustFile,

			"ofCountry": data.ofCountry,
			"ofAreaCenter": data.ofAreaCenter,
			"ofArea": data.ofArea,
			"ofCenter": data.ofCenter,

			"stationRange": data.stationRange,
			"control": data.control,
			"resident": data.resident,
			"uphold": data.uphold,
			"description": data.description,
			
		});
		is = 2;
	};

	// 检索框选择
	layForm.on('select(filts)', function (data) {
		var t = data.othis[0];
		var fn = $(t).prev().attr('fn');
		var id = $(t).prev().attr('id');
		para[id] = data.value;
		if (fn == undefined) {
			return false;
		};
		window[fn]();
	});

	//获取节点接口
	var layNodeTree = null, //弹出层
		tempNode = null, //全部的节点ID,全选时用到
		nodeData = null; //节点数据
	window.layNodeFn = function () {
		http({
			url: urls.siteTree,
			success: function (res) {
				nodeData = res.data;
				tempNode = res.ids;
				var DTree = dtree.render({
					elem: "#nodeTree",
					dataStyle: "layuiStyle",
					width: 320,
					data: nodeData,
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
					checkbarType: "self",
					done: function () {
						dtree.chooseDataInit("nodeTree", strNodeTree);
					}
				});
				layNodeTree = layer.open({
					type: 1,
					title: false,
					closeBtn: 0,
					resize: false,
					shade: 0.5,
					area: ['300px', '400px'],
					shadeClose: false,
					content: $('#nodeTreeBox')
				});
			}
		});
	};
	// 监听上传节点全选
	layForm.on('checkbox(treeChek)', function (data) {
		var is = data.elem.checked;
		if (is) {
			dtree.chooseDataInit("nodeTree", tempNode);
		} else {
			dtree.reload("nodeTree", {
				data: nodeData,
				done: function () {
					dtree.chooseDataInit("nodeTree", "");
				}
			});
		};
		return false;
	});

	$("#treeBtn").click(function () {
		var dom = dtree.getCheckbarNodesParam("nodeTree");
		var arr = [];
		for (var i = 0; i < dom.length; i++) {
			arr.push(dom[i].nodeId)
		};
		strNodeTree = arr.join(",");
		layer.close(layNodeTree);
	});
	// 关闭上传节点弹窗
	$("#layNodeTree").click(function () {
		layer.close(layNodeTree);
	});

	// 获取主线路
	var layLineTree = null; //主线路弹出层
	window.layLineFn = function () {
		http({
			url: urls.sitemain,
			success: function (res) {
				var data = res.data;
				var lineTree = dtree.render({
					elem: "#LineTree",
					dataStyle: "layuiStyle",
					width: 320,
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
					checkbarType: "only",
					done: function () {
						dtree.chooseDataInit("LineTree", strLine.toString());
					}
				});
				layLineTree = layer.open({
					type: 1,
					title: false,
					closeBtn: 0,
					resize: false,
					shade: 0.5,
					area: ['300px', '400px'],
					shadeClose: false,
					content: $('#lineTreeBox')
				});
			}
		});
	};

	//监听主线路点确定
	$("#lineBtn").click(function () {
		var dom = dtree.getCheckbarNodesParam("LineTree");
		var arr = [];
		for (var i = 0; i < dom.length; i++) {
			arr.push(dom[i].nodeId)
		};
		strLine = arr.join(",");
		layer.close(layLineTree);
	});
	//关闭主线路弹窗
	$("#layLineTree").click(function () {
		layer.close(layLineTree);
	});

	//获取要素接口
	var layEl = null; //要素弹出层

	window.layElFn = function () {
		http({
			url: urls.siteel,
			success: function (res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].fields;
					str += '<p><input type="checkbox" class="elItem" lay-skin="primary" value=' + dataItem.element + ' title=' +
						dataItem.elName + '></p>';
				};
				$("#elemBox").html(str);
				if (strEl.length > 0) {
					var fdata = strEl.split(",");
					var check = $("#elemBox").find('[type="checkbox"]');
					for (var c = 0; c < fdata.length; c++) {
						var m = fdata[c];
						for (var k = 0; k < check.length; k++) {
							var v = check[k].value;
							if (v == m) {
								$(check[k]).attr('checked', true)
							}
						}
					}
				};
				layForm.render("checkbox");
				layEl = layer.open({
					type: 1,
					title: false,
					closeBtn: 0,
					resize: false,
					shade: 0.5,
					area: ['400px', '400px'],
					shadeClose: false,
					content: $('#elBox')
				});
			}
		});
	};
	// 监听要素全选
	layForm.on('checkbox(elChek)', function (data) {
		var is = data.elem.checked;
		$(".elItem").prop("checked", is);
		layForm.render("checkbox");
		return false;
	});
	// 要素选择后确定
	$("#elBtn").click(function () {
		var arr = [];
		$(".elItem").each(function () {
			var is = $(this).is(":checked");
			if (is) {
				var val = $(this).val();
				arr.push(val)
			}
		});
		strEl = arr.join(",");
		layer.close(layEl);
	});
	// 关闭要素弹窗
	$("#layEl").click(function () {
		layer.close(layEl);
	});

	layForm.on('submit(sub)', function (data) {
		var data = data.field;
		data.uid = strNodeTree;
		data.element = strEl;
		data.Main = strLine || 0;
		var t = data.lookType;
		if (t != 1) {
			delete data.stationCode;
			delete data.stationNum;
		};
		var s = data.stationType;
		if (s == 5) {
			delete data.ofId;
			delete data.ofStation;
		};
		http({
			url: urls.sitechange,
			type: 'post',
			data: data,
			success: function (res) {
				layer.msg("修改站点成功!", {
					time: 1500
				}, function () {
					parent.ReLoadFn();
				});
			}
		});
		return false;
	});
	/*
		@@修改站点时的验证
	*/
	layForm.verify({
		station: function (val) {
			if (!getFn.trimFn(val)) {
				return '请输入站点名';
			}
		},
		stationCode: function (val) {
			if (!getFn.trimFn(val)) {
				return '请输入站名代码';
			}
		},
		ip: function (val) {
			var reg = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
			if (!reg.test(val)) {
				return '请输入正确的IP';
			}
		},
		lon: function (val) {
			if (!getFn.trimFn(val)) {
				return '请输入经度';
			}
		},
		lat: function (val) {
			if (!getFn.trimFn(val)) {
				return '请输入经度';
			}
		},
		dtime: function (val) {
			if (!getFn.trimFn(val)) {
				return '请输入延时时间';
			}
		},
		htime: function (val) {
			if (!getFn.trimFn(val)) {
				return '请输入接收时间';
			}
		},
		mustFile: function (val) {
			if (!getFn.inte(val)) {
				return '请输入应收文件数量,只可输入大于0的正整数';
			}
		},
		ofStation: function (val) {
			var p = $("#lookType").val();
			if (p != 6 && !val) {
				return '请选择所属站点';
			}
		}
	});
	e("siteChange", {})
});
