layui.define(["http", "getFn"], function (e) {
    var http = layui.http,
        urls = layui.urls,
        getFn = layui.getFn;

    var $ = layui.$,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate;


    var id = '',
        startTime = getFn.initDate(),
        endTime = getFn.initDate();

    laydate.render({
        elem: '#date',
        range: "~",
        value: startTime + "\xa0" + "~" + "\xa0" + endTime,
        max: startTime,
        btns: ['confirm']
    });
    // 一级检索接口
    function getUser() {
        http({
            url: urls.limitUsers,
            type: "post",
            success: function (res) {
                console.log(res)
                var data = res.data;
                var str = '';
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    str += '<option value="' + dataItem.id + '">' + dataItem.name + '</option>'
                };
                $("#sele").html(str);
                form.render("select");
            }
        });
    };
    getUser();



    function getListFn() {

        table.render({
            elem: '#table',
            url: urls.limitLog,
            method: "post",
            headers: {
                token: sessionStorage.token
            },
            where: {
                id: id,
                startTime: startTime,
                endTime: endTime
            },
            request: {
                pageName: 'pageNum',
                limitName: 'pageSize'
            },
            parseData: function (res) {
                return {
                    "code": 0,
                    "count": res.count,
                    "data": res.data
                };
            },
            cols: [
                [{
                    title: '操作日期',
                    templet: function (item) {
                        return item.fields.actionTime
                    }
                }, {
                    title: '操作内容',
                    templet: function (item) {
                        return item.fields.Action
                    }
                }]
            ],
            page: {
                layout: ['prev', 'page', 'next', 'skip', 'count']
            },
            id: 'tabReload',
            height: 535,
            cellMinWidth: 80,
            done: function (res, curr) {
                page = curr;
            }
        });
    };

    // 查询按钮调取站点列表接口
    form.on('submit(subBtn)', function (data) {
        // siteName = data.field.name;
        data = data.field;
        id = data.id;
        var date = data.date;
        var idx = date.indexOf("~");
        startTime = date.substring(0, idx).trim();
        endTime = date.substring(idx + 1).trim();
        getListFn();
    });

    e("log", {})
});