function load() {
	window.location.reload();
};

function outFn() {
	window.location.href = '../index.html';
};

layui.define(["http", "getFn", "homeGetLeft", "homeGetRight", "homeFun"], function(e) {
	require(
		[
			"esri/map",
			"esri/graphic",
			"esri/geometry/Point",
			"esri/layers/GraphicsLayer",
			"esri/Color",
			"esri/symbols/TextSymbol",
			"esri/symbols/SimpleLineSymbol",
			"esri/symbols/SimpleFillSymbol",
			"esri/geometry/Polyline",
			"esri/symbols/PictureMarkerSymbol",
			"esri/layers/ArcGISTiledMapServiceLayer",
			"dojo/domReady!",
		],
		function(
			Map,
			graphic,
			Point,
			GraphicsLayer,
			Color,
			TextSymbol,
			SimpleLineSymbol,
			SimpleFillSymbol,
			Polyline,
			PictureMarkerSymbol,
			ArcGISTiledMapServiceLayer
		) {
			var http = layui.http,
				urls = layui.urls,
				getFn = layui.getFn,
				homeGetLeft = layui.homeGetLeft,
				homeGetRight = layui.homeGetRight,
				homeFun = layui.homeFun;

			var $ = layui.jquery,
				layForm = layui.form,
				carousel = layui.carousel;

			var station, zoom = 6,
				center = [120.81, 32.026];
			var map = new Map("maps", {
				zoom: zoom,
				minZoom: 3,
				maxZoom: 9,
				center: center
			});
			var baseUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer";
			// var url = "http://71.3.251.104:8066/arcgis/rest/services/6199/0/MapServer?token=";
			// var token =
			// 	"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNjN8NjE5OXw3MS4zLjAuMTB8fHx8MSIsImlhdCI6MTYyOTk0NDUyNywiZXhwIjoxNjMwMzA0NTI3fQ.qh-q9Xq66jwPqR1TatApz6f79Xe4mziSJvJ6Ehhm9dPXSR3T5yRuiFPcmfHEKxPLn2gJRR6htRRR75HfS1RyoQ";
			// var baseUrl = url + token;
			var layer = new ArcGISTiledMapServiceLayer(baseUrl);
			map.addLayer(layer);
			var mapTimeOut = null;
			map.on("extent-change", function(e) {
				zoom = e.lod.level;
				clearTimeout(mapTimeOut);
				mapTimeOut = setTimeout(function() {
					mapDataFn();
				}, 500)
			});

			var carIdex = 0,
				carTime;
			carousel.render({
				elem: '#carousel',
				autoplay: false,
				arrow: 'always',
				// width: '440px',
				width: '440px',
				height: '100%',
				indicator: 'none',
				index: carIdex
			});
			carousel.on('change(carousel)', function(obj) {
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

			$("#user").click(function() {
				var isUser = getFn.isUserFn();
				isUser ? alrFn('./user.html', '个人中心管理', '600px', '480px') : alrFn('./users.html', '个人中心管理', '600px', '380px');
			});
			// 右侧水文或气象的切换
			var siteHtml = $("span.type").eq(0).html();
			$("span.type").eq(0).addClass("add");
			$("span.type").click(function() {
				siteHtml = $(this).html();
				$(this).addClass("add");
				$(this).siblings().removeClass("add");
				homeGetRight.getGaugeFn(siteId, siteHtml);
			});
			// 折线图要素选择
			var siteEl = $("#homeEl").val();
			layForm.on('select(homeEl)', function(data) {
				siteEl = data.value;
				homeGetRight.getLineFn(siteId, siteEl);
			});
			// 获取默认站点
			var siteId = null,
				latlog = [];

			function getSiteFn() {
				http({
					url: urls.search,
					type: 'get',
					data: {},
					success: function(res) {
						var data = res.data;
						var str = '';
						for (var i = 0; i < data.length; i++) {
							str += '<option value="' + data[i].id + '">' + data[i].station + '</option>';
						};
						$("#laySearch").html(str);

						http({
							url: urls.sitedefault,
							type: 'get',
							data: {},
							success: function(res) {
								siteId = res.id;
								layForm.val("layForm", {
									site: siteId
								});
								homeGetLeft.getFileFn(siteId);
								getTypeFn(); //获取左下角的类型
								getDetaFn(); //获取站点详情
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
					success: function(res) {
						var data = res.data.fields;
						latlog = [data.lon, data.lat];
						//setImgFn();添加圈圈
						homeGetLeft.getFileFn(siteId); //获取文件传输量
						getEchartsFn();
					}
				});
			};
			//监听右侧站点下拉选择
			layForm.on('select(laySearch)', function(data) {
				siteId = data.value;
				getDetaFn();
			});
			// 获取右侧站类型
			var type = "",
				checkArr = [];

			function getTypeFn() {
				http({
					url: urls.layer,
					type: 'get',
					success: function(res) {
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
			layForm.on('checkbox(check)', function(data) {
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
				delaTime = setTimeout(function() {
					mapDataFn();
					homeGetLeft.getStateFn(type);
				}, 1000)
			});

			function mapDataFn() {
				http({
					url: urls.homeindex,
					type: 'get',
					data: {
						type: type,
						num: zoom
					},
					success: function(res) {
						setMapDataFn(res.data);
						setLineDataFn(res.line);
					},
					complete: function() {
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
			function setMapDataFn(data) {
				if (data.length <= 0) {
					return false;
				};
				var mapLayers = map.getLayer('mapLayer');
				if (mapLayers != undefined) {
					map.removeLayer(mapLayers)
				};
				var mapLayer = new GraphicsLayer({
					id: "mapLayer"
				});
				map.addLayer(mapLayer, 9);
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];
					var log = dataItem.from[0],
						lat = dataItem.from[1];
					var area = zoom * 3 >= 38 ? 38 : zoom * 3 <= 16 ? 16 : zoom * 3;
					var point = new Point(log, lat);
					var pic = new PictureMarkerSymbol({
						url: "../static/icon" + dataItem.type + dataItem.val + ".png",
						width: area,
						height: area,
						item: dataItem
					});
					var gp = new graphic(point, pic);
					mapLayer.add(gp);

					var text = new TextSymbol({
						text: dataItem.name,
						xoffset: 0,
						yoffset: -20,
						color: new Color("#000"),
						item: dataItem
					});
					var siteName = new graphic(point, text);
					mapLayer.add(siteName);

					var isClick = null;
					mapLayer.on('click', function(e) {
						clearTimeout(isClick);
						isClick = setTimeout(function() {
							var item = e.graphic.symbol.item;

							siteId = item.id;
							layForm.val("layForm", {
								site: siteId
							});
							clearTimeout(mapTime);
							mapTime = setTimeout(function() {
								homeFun.clickFn(siteId);
								homeGetLeft.getFileFn(siteId);
								getEchartsFn();
								// setImgFn();
							}, 500);
						}, 250);
					});
				};
			};
			// 添加框
			function setSeleFn() {

			};
			// 添加线
			function setLineDataFn(data) {
				if (data.length <= 0) {
					return false;
				};
				var mapLayers = map.getLayer('lineId');
				if (mapLayers != undefined) {
					map.removeLayer(mapLayers)
				};

				var layer = new GraphicsLayer({
					id: "lineId"
				});
				map.addLayer(layer);
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i].coords;
					var paths = [
						dataItem[0],
						dataItem[1]
					];
					var geos = new Polyline({
						"paths": [paths]
					});

					var line = data[i].line;
					var color = line == 0 ? new Color("#32CD32") : new Color("#F0E68C");
					var lines = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, color, 1);
					var sls = new graphic(geos, lines);
					layer.add(sls);
				};
			};

			// 弹出页面调取封装的
			window.alrFn = function(u, t, w, h) {
				var url = u || '',
					title = t || !1,
					width = w || "100%",
					height = h || "635px";
				homeFun.layAlertFn(url, title, width, height);
			};
			// 只为了弹出配置页面  目前好像没用上
			window.alrFns = function(url) {
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
		});
	e("map", {})
});
