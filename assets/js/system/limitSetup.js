layui.define(["http", "getFn", "dtree"], function (e) {
    var http = layui.http,
        urls = layui.urls,
        getFn = layui.getFn,
        dtree = layui.dtree;

    var $ = layui.$,
        form = layui.form;

    var id = getFn.locaStr("id"),
        userName = getFn.locaStr("userName");

    form.val('limitForm', {
        "id": id,
        "userName": userName
    });

    var getTree = function () {
        http({
            url: urls.limittree,
            data: { id: id },
            success: function (res) {
                var data = res.data;
                var ids = res.ids;
                dtree.render({
                    elem: "#elemTree",
                    dataStyle: "layuiStyle",
                    width: 310,
                    data: data,
                    initLevel: 5,
                    skin: "laySimple",
                    nodeIconArray: {
                        "3": {
                            "open": "dtree-icon-jian",
                            "close": "dtree-icon-jia"
                        }
                    },
                    ficon: ["3", "7"],
                    checkbar: true,
                    checkbarType: "all",
                    done: function () {
                        dtree.chooseDataInit("elemTree", ids);
                    }
                });

                var local = res.local;
                var arr = [];
                for (var i = 0; i < local.length; i++) {
                    var id = local[i].id;
                    var title = local[i].title;
                    var checkd = local[i].checkd;
                    if (checkd == 0) {
                        arr[i] = '<div class="layui-inline"><input type="checkbox" lay-skin="primary" value="' + id + '"  title="' + title + '" /></div>';
                    } else {
                        arr[i] = '<div class="layui-inline"><input type="checkbox" lay-skin="primary" checked value="' + id + '"  title="' + title + '" /></div>';
                    };
                };
                var arrs = [];
                for (var b = 0; b < arr.length; b + 2) {
                    var dom = '<div class="check_item">' + arr.slice(b, b += 2) + '</div>';
                    arrs.push(dom);
                };
                var str = arrs.toString().replace(/,/g, "");
                $("#check").html(str);

                var country = res.country;
                var cArr = [];
                for (var i = 0; i < country.length; i++) {
                    var id = country[i].id;
                    var title = country[i].title;
                    var checkd = country[i].checkd;
                    if (checkd == 0) {
                        cArr[i] = '<div class="layui-inline"><input type="checkbox" lay-skin="primary" value="' + id + '"  title="' + title + '" /></div>';
                    } else {
                        cArr[i] = '<div class="layui-inline"><input type="checkbox" lay-skin="primary" checked value="' + id + '"  title="' + title + '" /></div>';
                    };
                };
                var cArrs = [];
                for (var b = 0; b < cArr.length; b + 2) {
                    var dom = '<div class="check_item">' + cArr.slice(b, b += 2) + '</div>';
                    cArrs.push(dom);
                };
                var cStr = cArrs.toString().replace(/,/g, "");
                $("#checks").html(cStr);

                form.render("checkbox", "limitForm");
            }
        });
    };
    getTree();

    form.on('submit(elBtn)', function (data) {
        var dom = dtree.getCheckbarNodesParam("elemTree");
        var arr = [];
        for (var i = 0; i < dom.length; i++) {
            arr.push(dom[i].nodeId)
        };
        var data = data.field;
        data.stations = arr.join(",");

        var t_arr = [];
        $(".check input").each(function () {
            var is = $(this).is(":checked");
            if (is) {
                var val = $(this).val();
                t_arr.push(val)
            };
        });
        data.stationRange = t_arr.join(",");

        delete data.userName;
        http({
            url: urls.limittree,
            type: "post",
            data: data,
            success: function (res) {
                layer.msg("修改成功!", {
                    time: 1500
                }, function () {
                    parent.layer.closeAll();
                });
            }
        })
    });

    e("limitSetup", {})
});