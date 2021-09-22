layui.extend({
    urls: "api/urls",
}).define(["urls", "jquery", "layer"], function (exports) {
    var $ = layui.$,
        layer = layui.layer;
    function http(val) {
        if (val.type == 'post') {
            val.contentType = 'application/x-www-form-urlencoded';
        };
        var url = val.url || '';
        var type = val.type || 'get';
        var data = val.data || {};
        var dataType = val.dataType || 'json';
        var async = val.async || true;
        var token = sessionStorage.token || '';
        $.ajax({
            url: url,
            type: type,
            headers: {
                'Content-Type': val.contentType,
                'token': token
            },
            data: data,
            dataType: dataType,
            async: async,
            beforeSend: function (bef) {
                val.beforeSend && val.beforeSend();
            },
            success: function (res) {
                if (res.code == 0) {
                    layer.msg(res.msg);
                    return false;
                };
                val.success && val.success(res);
            },
            error: function (err) {
                var status = err.status;
                if (status == 400) {
                    val.error && val.error(status);
                    layer.msg(err.responseJSON.msg);
                    return false;
                } else if (status == 404) {
                    val.error && val.error(status);
                    layer.msg("请求地址不存在");
                    return false;
                } else if (status == 502) {
                    // var url = window.location.origin + '/static/dist/index.html';
					var url = window.location.origin + '/dist/index.html';
                    window.top.location.href = url;
                } else {
                    val.error && val.error(status);
                };
            },
            complete: function (r) {
                val.complete && val.complete(r);
            }
        });
    };
    exports('http', http);
});
