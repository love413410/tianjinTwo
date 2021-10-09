function load() {
	window.location.reload();
};

function outFn() {
	window.location.href = '../index.html';
};

layui.define(["http", "getFn", "homeGetLeft", "homeGetRight", "homeFun"], function (e) {
	var http = layui.http,
		urls = layui.urls,
		getFn = layui.getFn,
		homeGetLeft = layui.homeGetLeft,
		homeGetRight = layui.homeGetRight,
		homeFun = layui.homeFun;

	var $ = layui.jquery,
		layForm = layui.form,
		carousel = layui.carousel;

	var carIdex = 0;
	carousel.render({
		elem: '#carousel',
		autoplay: false,
		arrow: 'always',
		width: '440px',
		height: '100%',
		indicator: 'none',
		index: carIdex
	});
	carousel.on('change(carousel)', function (obj) {
		carIdex = obj.index;
		getEchartsFn();
	});

	function getEchartsFn() {
		if (carIdex == 1) {
			homeGetRight.getGaugeFn(siteId, siteHtml); //获取仪表盘数据
			homeGetRight.getLineFn(siteId, siteEl); //获取折线图

		} else {
			homeGetRight.stopFn();
		}
	};

	$("#user").html(sessionStorage.user);
	var level = sessionStorage.limit;
	$("[name=level" + level + "]").hide();

	$("#toFn").click(function () {
		window.location.href = '../pages/home.html';
	});
	$("#user").click(function () {
		var isUser = getFn.isUserFn();
		isUser ? alrFn('./user.html', '个人中心管理', '600px', '480px') : alrFn('./users.html', '个人中心管理', '600px', '380px');
	});

	// 右侧水文或气象的切换
	var siteHtml = $("span.type").eq(0).html();
	$("span.type").eq(0).addClass("add");
	$("span.type").click(function () {
		siteHtml = $(this).html();
		$(this).addClass("add");
		$(this).siblings().removeClass("add");
		homeGetRight.getGaugeFn(siteId, siteHtml);
	});
	// 折线图要素选择
	var siteEl = $("#homeEl").val(),siteType="月";
	layForm.on('select(homeEl)', function (data) {
		siteEl = data.value;
		homeGetRight.getLineFn(siteId, siteEl,siteType);
	});
	$(".lay_type").click(function(){
		$(".lay_type").removeClass("add");
		$(this).addClass("add");
		siteType=$(this).html();
		homeGetRight.getLineFn(siteId, siteEl,siteType);
	});


	// 获取默认站点
	var siteId = null,
		latlog = [];

	var xm;
	function getSiteFn() {
		http({
			url: urls.search,
			success: function (res) {

				var data = res.data;
				xm = xmSelect.render({
					el: '#xmSelect',
					radio: true, clickClose: true,
					prop: { name: 'station', value: 'id' },
					model: { icon: 'hidden', label: { type: 'text' } },
					filterable: true, data: data,
					on: (e) => { siteId = e.change[0].id; getDetaFn(); }
				});
				http({
					url: urls.sitedefault,
					type: 'get',
					data: {},
					success: (res) => {
						siteId = res.id;
						xm.setValue([res.id]);
						homeGetLeft.getFileFn(siteId);
						getTypeFn();
					}
				});
			}
		});
	};
	getSiteFn();
	// 获取站点详情
	function getDetaFn() {
		http({
			url: urls.sitedeta,
			type: 'post',
			data: {
				id: siteId
			},
			success: function (res) {
				var data = res.data.fields;
				latlog = [data.lon, data.lat];
				setImgFn(); //添加圈圈
				homeGetLeft.getFileFn(siteId); //获取文件传输量
			}
		});
	};
	// 获取右侧站类型
	var type = "",
		checkArr = [];

	function getTypeFn() {
		http({
			url: urls.layer,
			type: 'get',
			success: function (res) {
				var data = res.data;
				var str = '';
				for (var i = 0; i < data.length; i++) {
					var id = data[i].id;
					var title = data[i].title;
					var is = data[i].checkd;
					if (is == 1) {
						str += '<div class="layui-inline">' +
							'<div class="layui-input-inline">' +
							'<input type="checkbox" value="' + id + '" lay-skin="primary" lay-filter="check" title="' +
							title + '" checked />' +
							'</div>' +
							'</div>';
						checkArr.push(id);
					} else {
						str += '<div class="layui-inline">' +
							'<div class="layui-input-inline">' +
							'<input type="checkbox" value="' + id + '" lay-skin="primary" lay-filter="check" title="' +
							title + '"/>' +
							'</div>' +
							'</div>';
					};
				};
				$("#check").html(str);
				layForm.render("checkbox");
				type = checkArr.join(',');
				mapDataFn();
				homeGetLeft.getStateFn(type);
			}
		});
	};

	// 监听类型选择
	var mapInt, mapTime, delaTime;
	layForm.on('checkbox(check)', function (data) {
		clearTimeout(mapInt);
		clearTimeout(delaTime);
		var tempVal = Number(data.value);
		var tempIs = data.elem.checked;
		if (tempIs) {
			checkArr.push(tempVal)
		} else {
			var idx = checkArr.indexOf(tempVal);
			checkArr.splice(idx, 1);
		};
		type = checkArr.join(',');
		delaTime = setTimeout(function () {
			mapDataFn();
			homeGetLeft.getStateFn(type);
		}, 1000)
	});

	var station, zoom = 2,
		center = [120.81, 32.026];

	function mapDataFn() {
		http({
			url: urls.homeindex,
			type: 'get',
			data: {
				type: type,
				num: zoom
			},
			success: function (res) {
				station = res.data;
				var lineData = res.line;
				var scatData = scatConvert();
				myChart.setOption({
					series: [{
						data: scatData
					}, {
						data: lineData
					}]
				});
				setImgFn();
			},
			complete: function () {
				mapInt = setTimeout(mapDataFn, 60000);
			}
		});
	};
	/*
		@@字段区分
		name:站点名
		id:站点ID
		type用于区分类别,1-6对应:1台站、2浮标、3雷达、4志愿船、5gps、6管理单位
		val是空值圈的颜色 1:正常(绿色),2维护(灰色),3异常(红色)
		line控制线的颜色	0为绿色 1为红色
	*/
	function scatConvert() {
		var temp = [];
		for (var i = 0; i < station.length; i++) {
			var dataItem = station[i];
			var img = "image://../static/icon" + dataItem.type + dataItem.val + ".png";
			var site = dataItem.fontsize == 0 ? "" : dataItem.name;
			var obj = {
				name: site,
				site: dataItem.name,
				value: dataItem.from,
				val: dataItem.val,
				id: dataItem.id,
				type: dataItem.type,
				symbolSize: dataItem.size,
				symbol: img,
				label: {
					normal: {
						textStyle: {
							fontSize: dataItem.fontsize
						}
					}
				}
			};
			temp.push(obj)
		};
		return temp;
	};

	// 添加选中的圈
	function setImgFn() {

		var c = myChart.convertToPixel('geo', latlog);
		var w = Math.ceil(zoom * 0.6),
			h = Math.ceil(zoom * 0.6);

		var w = w < 30 ? 30 : w,
			h = h < 30 ? 30 : h;

		var ew = Math.ceil(w / 2);
		var eh = Math.ceil(h / 2);

		var mw = c[0],
			mh = c[1];

		var l = mw - ew;
		var t = mh - eh;

		$("#sele").css({
			"width": w + 'px',
			"height": h + 'px',
			"left": l + 'px',
			"top": t + 'px',
		});
	};
	$("#sele").on("click", function () {
		clickFn(siteId);
	});
	//初始化中间地图
	var colorArr = ['#33CC00', '#f00', '#ffde00', '#808080'];
	var myChart = echarts.init(document.getElementById('maps'));

	function initEchartFn() {
		var option = {
			tooltip: {
				trigger: 'item',
				borderColor: '#FFFFCC',
				hideDelay: 0,
				transitionDuration: 0,
				extraCssText: 'z-index:100',
				textStyle: {
					color: '#fff'
				},
				formatter: function (params) {
					var data = params.data;
					return data.site;
				}
			},
			geo: {
				map: 'china',
				zoom: zoom,
				scaleLimit: {
					min: 1,
					max: 56
				},
				center: center,
				label: {
					emphasis: {
						show: false
					}
				},
				roam: true,
				silent: true,
				itemStyle: {
					normal: {
						areaColor: "rgba(0,0,0,0.1)",
						color: '#334559',
						borderColor: '#1422CA',
						shadowColor: '#010B1D',
						borderWidth: 1,
						shadowOffsetX: -2,
						shadowOffsetY: 2,
						shadowBlur: 10
					},
					emphasis: {
						color: '#252b3d'
					}
				},
				regions: [{
					name: '南海诸岛',
					itemStyle: {
						normal: {
							opacity: 0
						}
					}
				}]
			},
			series: [{
				type: 'effectScatter',
				coordinateSystem: 'geo',
				zlevel: 3,
				rippleEffect: {
					period: 3,
					brushType: 'fill',
					scale: 0
				},
				label: {
					normal: {
						show: true,
						position: 'right',
						textStyle: {
							color: '#fff',
							fontStyle: 'normal',
							fontFamily: 'arial'
						},
						formatter: '{b}'
					}
				},
				itemStyle: {
					normal: {
						show: false,
						color: function (item) {
							var val = item.data.val;
							return colorArr[val];
						}
					}
				}
			}, {
				type: 'lines',
				tooltip: {
					formatter: function (e) {
						return '';
					}
				},
				zlevel: 3,
				effect: {
					show: true,
					period: 7,
					symbolSize: 2,
					trailLength: 0.02,
					constantSpeed: 50,
					color: 'rgba(255,255,255,0.1)',
					shadowBlur: 8
				},
				lineStyle: {
					normal: {
						curveness: 0.2,
						color: function (item) {
							var line = item.data.line;
							var clr = line == 0 ? "rgba(51,204,0,0.1)" : "rgba(255,0,0,0.1)";
							return clr;
						}
					}
				}
			}]
		};
		myChart.setOption(option);
		myChart.on('georoam', function (e) {
			var _option = myChart.getOption();
			var _zoom = _option.geo[0].zoom;
			zoom = Math.round(_zoom);
			clearTimeout(mapInt);
			mapInt = setTimeout(mapDataFn, 1000)
		});
		myChart.on('click', function (e) {
			if (e.data) {
				if (e.data.val > -1) {
					siteId = e.data.id;
					xm.setValue([siteId]);
					latlog = e.data.value;
					clearTimeout(mapTime);
					mapTime = setTimeout(function () {
						homeFun.clickFn(siteId);
						homeGetLeft.getFileFn(siteId);
						getEchartsFn();
						setImgFn();
					}, 500);
				}
			};
		});
	};
	initEchartFn();

	// 弹出页面调取封装的
	window.alrFn = function (u, t, w, h) {
		var url = u || '',
			title = t || !1,
			width = w || "100%",
			height = h || "635px";
		homeFun.layAlertFn(url, title, width, height);
	};
	// 只为了弹出配置页面  目前好像没用上
	window.alrFns = function (url) {
		layer.open({
			type: 2,
			title: "传输任务管理",
			shade: 0.8,
			resize: !1,
			moveOut: 1,
			skin: "lay-drop",
			area: ["1320px", "670px"],
			content: url,
		});
	};
	e("test", {})
});
