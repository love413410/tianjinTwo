
layui.define(['http', "getFn"], function (e) {
    var http = layui.http,
        urls = layui.urls,
        getFn = layui.getFn;

    var $ = layui.$,
        form = layui.form;
    var id = getFn.locaStr('id');
    http({
        url: urls.homeclock,
        data: {
            id: id
        },
        success: function (res) {
            type = res.type;
            alarmId = res.alarmId;
            var data = res.data;
            form.val('layForm', {
                "station": data.station,
                "seat": data.seat,
                "ip": data.ip,
                "newTime": data.newTime,
                "minuteFile": data.minuteFile,
                "hourFile": data.hourFile,
                "punctualityFile": data.punctualityFile,
                "linkTime": data.linkTime,
                "description": data.description
            });

            $("#station").attr("title", data.station);
            $("#seat").attr("title", data.seat);
            $("#ip").attr("title", data.ip);
            $("#newTime").attr("title", data.newTime);
            $("#minuteFile").attr("title", data.minuteFile);
            $("#hourFile").attr("title", data.hourFile);
            $("#punctualityFile").attr("title", data.punctualityFile);
            $("#linkTime").attr("title", data.linkTime);
            $("#description").attr("title", data.description);
            form.render();
        }
    });
    e("layHome", {})
});
