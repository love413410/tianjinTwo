function load() {
    window.location.reload();
};

function outFn() {
    window.location.href = '../index.html';
};

layui.define(['http', "getFn"], function (e) {
    var http = layui.http,
        urls = layui.urls,
        getFn = layui.getFn;

    var $ = layui.jquery,
        form = layui.form;

    var id = getFn.locaStr('id');
    var type, alarmId;

    function getDataFn() {
        http({
            url: urls.homeclock,
            type: 'get',
            data: {
                id: id
            },
            success: function (res) {
                type = res.type;
                alarmId = res.alarmId;
                var data = res.data;

                getSeleFn(data);
                var text = type == 0 ? "推送" : type == 1 ? "提交" : "";
                $("#subbtn").html(text);
                if (type == 2) {
                    $("#subbtn").addClass("layui-hide");
                    $("#subbtn").next().removeClass("layui-hide");
                } else {
                    $("#subbtn").removeClass("layui-hide");
                    $("#subbtn").next().addClass("layui-hide");
                };
                $("#hideBtm").show();
            }
        });
    };
    getDataFn();

    // 获取处理人和故障类型
    function getSeleFn(data) {
        http({
            url: urls.people,
            type: 'get',
            data: {
                type: 'index',
                id: id
            },
            success: function (p_res) {
                var p = p_res.data;
                var p_name = p_res.name;
                var p_arr = [];
                for (var i = 0; i < p.length; i++) {
                    var p_id = p[i].pk;
                    var p_title = p[i].fields.personnel;
                    p_arr[i] = '<option value="' + p_id + '">' + p_title + '</option>';
                };
                $("#handler").html(p_arr.join(","));

                http({
                    url: urls.faultType,
                    type: 'get',
                    data: {
                        type: "index",
                        stationId: id
                    },
                    success: function (f_res) {
                        var f = f_res.data;
                        var f_name = f_res.id;
                        var f_arr = [];
                        for (var t = 0; t < f.length; t++) {
                            var f_id = f[t].pk;
                            var f_title = f[t].fields.Title;
                            f_arr[t] = '<option value="' + f_id + '">' + f_title + '</option>';
                        };
                        $("#faultType").html(f_arr.join(","))
                        form.render("select");

                        if (f_name != 7) {
                            getFtypeFn(id);
                            $("#layHide").removeClass("layui-hide");
                            $("#layHide").next().addClass("layui-hide");
                        } else {
                            $("#layHide").addClass("layui-hide");
                            $("#layHide").next().removeClass("layui-hide");
                        };

                        console.log(f_name)
                        form.val('layForm', {
                            "station": data.station,
                            "seat": data.seat,
                            "ip": data.ip,
                            "newTime": data.newTime,
                            "minuteFile": data.minuteFile,
                            "hourFile": data.hourFile,
                            "punctualityFile": data.punctualityFile,
                            "linkTime": data.linkTime,
                            "description": data.description,

                            "id": alarmId,
                            "type": type,
                            "faultType": f_name,
                            "handler": p_name,
                            "endTime": data.endTime,
                            "fault": data.fault,
                        });

                        getFtypeFn(f_name);
                    }
                });
            }
        });
    };
    form.on('select(faultType)', function (data) {
        var id = data.value;
        if (id != 7) {
            getFtypeFn(id);
            $("#layHide").removeClass("layui-hide");
            $("#layHide").next().addClass("layui-hide");
        } else {
            $("#layHide").addClass("layui-hide");
            $("#layHide").next().removeClass("layui-hide");
        };
    });
    // 获取确认故障
    function getFtypeFn(cid) {
        http({
            url: urls.faultType,
            type: 'post',
            data: {
                type: "index",
                stationId: id,
                id: cid
            },
            success: function (res) {

                var data = res.data;
                var ctedId = res.id;
                var c_arr = [];

                for (var t = 0; t < data.length; t++) {
                    var id = data[t].pk;
                    var title = data[t].fields.Title;

                    var str = id == ctedId ?
                        '<option value="' + id + '" selected>' + title + '</option>' :
                        '<option value="' + id + '">' + title + '</option>';
                    c_arr[t] = str;
                };
                $("#faulCconfirm").html(c_arr.join(","));
                form.render("select");
            }
        });
    };

    form.on('submit(sub)', function (data) {
        var data = data.field;
        data.faulCconfirm = data.faultType == 7 ? data.faul : data.faulCconfirm;
        delete data.faul;
        http({
            url: urls.homeclock,
            type: 'post',
            data: data,
            success: function (res) {
                parent.vm.childFn();
            }
        });
    });

    form.verify({
        handler: function (val) {
            if (!/^[\u4E00-\u9FA5a-zA-Z]*$/.test(val)) {
                return '请输入正确的故障处理人!';
            }
        }
    });

    e("layHomes", {})
});
