layui.define(["http", "getFn"], function (e) {
    var http = layui.http,
        urls = layui.urls,
        getFn = layui.getFn;

    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form;

    var user = sessionStorage.user;
    $("#user").val(user);
    form.render();
    //修改密码提交
    form.on('submit(cBtn)', function (data) {
        var data = data.field;

        http({
            url: urls.pass,
            type: "post",
            data: data,
            success: function (res) {
                layer.msg(res.msg, {}, function () {
                    closeFn();
                });
            }
        });
    });
    // 验证
    form.verify({
        passWord: function (val) {
            if (!getFn.trimFn(val)) {
                return "请输入此账号的当前密码";
            };
        },
        newPass: function (val) {
            if (!getFn.password(val)) {
                return "请输入8至16位的新密码,字母开头并包含数字和特殊字符";
            };
        },
        newPass2: function (val) {
            var oVal = $("#newPass").val();
            if (val != oVal) {
                return "两次新密码输入不一致";
            };
        },
    });

    e("users", {})
});
