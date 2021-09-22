layui.define(["http"], function (e) {
	var http = layui.http;
	var isClick = true;

	function load(url, type, data, succFn) {
		var type = type || "post";
		if (!isClick) {
			layer.msg("点太快了,休息一下吧!");
			return false;
		};
		isClick = false;
		http({
			url: url,
			type: type,
			data: data,
			success: function (res) {
				var url = res.url;
				window.location.href = url;
				succFn ? succFn() : "";
			},
			complete: function (r) {
				setTimeout(function () {
					isClick = true;
				}, 5000);
			}
		});
	};
	e('load', load);
});
