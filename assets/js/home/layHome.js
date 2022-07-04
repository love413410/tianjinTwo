
layui.define(['http', "getFn"], function (e) {
    var http = layui.http,
        urls = layui.urls,
        getFn = layui.getFn;

    var $ = layui.$;
    var id = getFn.locaStr('id');
    http({
        url: urls.homeclock,
        data: {
            id: id
        },
        success: function (res) {
            var data = res.data, str = '';
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                str += '<div class="layui-form-item">' +
                    '<label class="layui-form-label">' + dataItem.name + ':</label>' +
                    '<div class="layui-input-block">' +
                    '<p class="layui-input">' + dataItem.value + '<p/>' +
                    '</div>' +
                    '</div>';
            };
            $("#content").html(str);
        }
    });
    e("layHome", {})
});
