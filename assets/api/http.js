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
                if (status == 502) {
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
