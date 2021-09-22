layui.define(["http", "getFn"], function (e) {
    var http = layui.http,
        urls = layui.urls,
        getFn = layui.getFn;

    var $ = layui.$,
        form = layui.form;

    var id = getFn.locaStr("id");
    var is = 1;

    var data,dataItem;
    function getDetaFn() {
        http({
            url: urls.faultdata,
            type: 'get',
            data: {
                id: id
            },
            success: function (res) {
                // data = res.data.fields;
                dataItem = res.data.fields;
                getSeleFn();
            }
        });
    };
    getDetaFn();

    var a_cId, b_cId, c_cId;
    function getSeleFn() {
        http({
            url: urls.people,
            type: 'get',
            data: {
                type: 'type',
                id: id
            },
            success: function (a_res) {
                var a_data = a_res.data;
                a_cId = a_res.name;
                var a_arr = [];
                for (var a = 0; a < a_data.length; a++) {
                    var a_id = a_data[a].pk;
                    var a_title = a_data[a].fields.personnel;
                    a_arr[a] = '<option value="' + a_id + '">' + a_title + '</option>';
                };
                $("#handler").html(a_arr.join(","));

                http({
                    url: urls.faultType,
                    type: 'get',
                    data: {
                        type: 'type',
                        stationId: id
                    },
                    success: function (b_res) {
                        var b_data = b_res.data;
                        b_cId = b_res.id;
                        var b_arr = [];
                        for (var b = 0; b < b_data.length; b++) {
                            var b_id = b_data[b].pk;
                            var b_title = b_data[b].fields.Title;
                            b_arr[b] = '<option value="' + b_id + '">' + b_title + '</option>';
                        };
                        $("#faultType").html(b_arr.join(","));

                        b_cId != 7 ? getFtypeFn(b_cId) : is ? setValFn() : "";;
                    }
                });
            }
        });
    };

    form.on('select(faultType)', function (data) {
        var id = data.value;
        if (id == 7) {
            $("#addForm").removeClass("layForm");
            $("#layItem").addClass("layui-hide");
            $("#layItem").next().removeClass("layui-hide");
            return false;
        };
        $("#addForm").addClass("layForm");
        $("#layItem").removeClass("layui-hide");
        $("#layItem").next().addClass("layui-hide");
        getFtypeFn(id);
    });

    function getFtypeFn(cid) {
        http({
            url: urls.faultType,
            type: 'post',
            data: {
                type: 'type',
                stationId: id,
                id: cid
            },
            success: function (c_res) {
                var c_data = c_res.data;
                c_cId = c_res.id;
                var c_arr = [];
                for (var c = 0; c < c_data.length; c++) {
                    var c_id = c_data[c].pk;
                    var c_title = c_data[c].fields.Title;
                    c_arr[c] = '<option value="' + c_id + '">' + c_title + '</option>';
                };
                $("#faulCconfirm").html(c_arr.join(","));
                form.render("select");
                is ? setValFn() : "";
            }
        });
    };

    function setValFn() {
        var formVal = {
            "id": id,
            "station": dataItem.station,
            "faultType": b_cId,
            "faulCconfirm": c_cId,
            "faulCconfirms": dataItem.faulCconfirm,
            
            "startTime": dataItem.startTime,
            "handler": a_cId,
            "faultReason": dataItem.faultReason
        };
        var key = '';
        if (b_cId == 7) {
            key = 'faulCconfirms';
            $("#addForm").removeClass("layForm");
            $("#layItem").addClass("layui-hide");
            $("#layItem").next().removeClass("layui-hide");
        } else {
            key = 'faulCconfirm';
            $("#addForm").addClass("layForm");
            $("#layItem").removeClass("layui-hide");
            $("#layItem").next().addClass("layui-hide");
        };
        // formVal[key] = data.faulCconfirm;
        form.val('addForm', formVal);

        is = !is;
    };

    form.on('submit(sub)', function (data) {
        var data = data.field;
        var type = data.faultType;
        data.faulCconfirm = type == 7 ? data.faulCconfirms : data.faulCconfirm;
        delete data.faulCconfirms;

        http({
            url: urls.faultchange,
            type: 'post',
            data: data,
            success: function (res) {
                layer.msg('修改成功', {
                    time: 1500
                }, function () {
                    parent.ReLoadFn();
                });
            }
        });
    });
    
    e("faultChange", {})
});
