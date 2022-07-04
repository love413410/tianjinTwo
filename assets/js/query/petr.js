layui.define(["http", "load", "getFn", "query"], function (e) {
    var http = layui.http,
        urls = layui.urls,
        load = layui.load,
        getFn = layui.getFn,
        query = layui.query;

    var $ = layui.$,
        form = layui.form,
        table = layui.table,
        laydate = layui.laydate;

    var style = "", type = "", ofAreaCenter = "", ofArea = "", ofCenter = "", startTime = getFn.initDate(), endTime = getFn.initDate();
    laydate.render({
        elem: '#date',
        range: "~",
        value: startTime + "\xa0" + "~" + "\xa0" + endTime,
        max: 0,
        btns: ['confirm']
    });

    var where = {
        type: "",
        ofAreaCenter: "",
        ofArea: "",
        ofCenter: "",
        style: "",
        startTime: "",
        endTime: ""
    };

    function getTypeFn() {
        http({
            url: urls.getType,
            data: {
                id: 7
            },
            success: function (res) {
                var data = res.data, str = '';
                for (var i = 0; i < data.length; i++) {
                    var id = data[i].pk;
                    var title = data[i].fields.title;
                    str += '<option value="' + id + '">' + title + '</option>';
                };
                $("#laySele").html(str);
                data.length ? type = data[0].pk : "";
                getSeaFn();
            }
        });
    };
    getTypeFn();
    form.on('select(laySele)', function (data) {
        type = data.value;
        getSeaFn();
    });

    function getSeaFn() {
        http({
            url: urls.sitelisttype,
            type: 'post',
            data: { type: type },
            success: function (res) {
                var data = res.data, str = '<option value="">全部</option>';
                for (var i = 0; i < data.length; i++) {
                    var id = data[i].pk;
                    var title = data[i].fields.title;
                    str += '<option value="' + id + '">' + title + '</option>';
                };
                $("#laySeleA").html(str);
                ofAreaCenter = data.length > 0 ? data[0].pk : "";
                getSeaCenterFn();
            }
        });
    };

    form.on('select(laySeleA)', function (data) {
        ofAreaCenter = data.value;
        getSeaCenterFn();
    });

    function getSeaCenterFn() {
        http({
            url: urls.siteliststype,
            data: {
                type: type,
                ofAreaCenter: ofAreaCenter
            },
            success: function (res) {
                var data = res.data, str = '<option value="">全部</option>';
                for (var i = 0; i < data.length; i++) {
                    var id = data[i].pk;
                    var title = data[i].fields.station;
                    str += '<option value="' + id + '">' + title + '</option>';
                };
                $("#laySeleB").html(str);
                ofArea = data.length > 0 ? data[0].pk : "";
                getCenterFn();
            }
        });
    };
    form.on('select(laySeleB)', function (data) {
        ofArea = data.value;
        getCenterFn();
    });

    function getCenterFn() {
        http({
            url: urls.siteliststype,
            type: 'post',
            data: {
                type: type,
                ofAreaCenter: ofAreaCenter,
                ofArea: ofArea
            },
            success: function (res) {
                var data = res.data, str = '<option value="">全部</option>';
                for (var i = 0; i < data.length; i++) {
                    var id = data[i].pk;
                    var title = data[i].fields.station;
                    str += '<option value="' + id + '">' + title + '</option>';
                };
                $("#laySeleC").html(str);
                ofCenter = data.length > 0 ? data[0].pk : "";
                getDataTypeFn();
            }
        });
    };

    function getDataTypeFn() {
        http({
            url: urls.dataType,
            success: function (res) {
                var data = res.data, str = '';
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    str += '<option value=' + dataItem.pk + '>' + dataItem.fields.Type + '</option>';
                };
                $("#style").html(str);
                form.render("select");
            }
        })
    };

    function getListFn() {
        table.render({
            elem: '#table',
            url: urls.petr,
            headers: {
                token: sessionStorage.token
            },
            where: {
                style: style,
                type: type,
                ofAreaCenter: ofAreaCenter,
                ofArea: ofArea,
                ofCenter: ofCenter,
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
                    field: 'area',
                    title: '海区'
                }, {
                    field: 'center',
                    title: '中心站'
                }, {
                    title: '台站',
                    templet: function (item) {
                        var html = '<div onclick="layFn(' + item.stationId + ')" style="color: #5a98de;cursor: pointer;">' +
                            item.station +
                            '</div>';
                        return html;
                    }
                }, {
                    field: 'total',
                    title: '应收文件(个)'
                }, {
                    field: 'relay',
                    title: '实收文件(个)'
                }, {
                    field: 'obtain',
                    title: '接收率(%)'
                }]
            ],
            page: {
                layout: ['prev', 'page', 'next', 'skip', 'count']
            },
            id: 'tabReload',
            height: 535,
            cellMinWidth: 80
        });
    };

    // 查询按钮调取站点列表接口
    form.on('submit(subBtn)', function (data) {
        data = data.field;

        style = data.style;
        type = data.type;
        ofAreaCenter = data.ofAreaCenter;
        ofArea = data.ofArea;
        ofCenter = data.ofCenter;

        var date = data.date;
        var idx = date.indexOf("~");
        startTime = date.substring(0, idx).trim();
        endTime = date.substring(idx + 1).trim();
        delete data.date;
        getListFn();
    });

    form.on('submit(expBtn)', function (data) {
        data = data.field;

        style = data.style;
        type = data.type;
        ofAreaCenter = data.ofAreaCenter;
        ofArea = data.ofArea;
        ofCenter = data.ofCenter;

        var date = data.date;
        var idx = date.indexOf("~");
        startTime = date.substring(0, idx).trim();
        endTime = date.substring(idx + 1).trim();
        delete data.date;
        load(urls.petr, "post", {
            style: style,
            type: type,
            ofAreaCenter: ofAreaCenter,
            ofArea: ofArea,
            ofCenter: ofCenter,
            startTime: startTime,
            endTime: endTime
        });
    });

    window.layFn = function (id) {
        query.layFn(id, startTime, endTime, style);
    };

    form.verify({
        date: function (val) {
            if (val.indexOf('~') == -1) {
                return '请选择日期范围';
            }
        },
        num: function (val) {
            if (val) {
                if (val <= 0 || isNaN(Number(val))) {
                    return '请输入大于0的数字';
                }
            }
        }
    });
    e("petr", {})
});
