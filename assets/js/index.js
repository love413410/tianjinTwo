layui.define(["http"], function (e) {
    var http = layui.http,
        urls = layui.urls;

    var form = layui.form;


    form.on('submit(login)', function (data) {
        data = data.field;
        http({
            url: urls.login,
            type: 'post',
            data: {
                userName: data.username,
                passWord: data.password
            },
            success: function (res) {
                sessionStorage.clear();
                sessionStorage.user = data.username;
                sessionStorage.token = res.token;
                sessionStorage.limit = res.limit;
                window.location.href = './pages/home.html';
            }
        });
        return false;
    });

    function trimFn(name) {
        var reg = /\S/;
        if (!name) {
            return false;
        } else {
            name.trim();
            return reg.test(name);
        }
    };
    form.verify({
        user: function (val) {
            if (!trimFn(val)) {
                return '请输入用户名!';
            }
        },
        pass: function (val) {
            if (!trimFn(val)) {
                return '请输入密码!';
            }
        }
    });

    e("index", {})
});
