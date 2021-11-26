layui.define(["http"], function (e) {
	var http = layui.http,
		urls = layui.urls;
	var $ = layui.$,
		layForm = layui.form;
	function getDataFn() {
		http({
			url: urls.config,
			success: function (res) {
				var data = res.data;
				layForm.val('filePath', {
					"receivePath": data.receivePath,
					"commandPath": data.commandPath,
					"logPath": data.logPath
				});
			}
		});
	};
	getDataFn();


	layForm.on('submit(change)', function (data) {
		var data = data.field;
		http({
			url: urls.config,
			type: 'post',
			data: data,
			success: function (res) {
				layer.msg("修改成功");
				getDataFn();
			}
		});
	});

	$('#close').click(function () {
		var index = parent.layer.getFrameIndex(window.name)
		parent.layer.close(index);
	});
	e("filePath", {})
});
