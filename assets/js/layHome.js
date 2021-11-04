
layui.define(['http', "getFn"], function (e) {
    var http = layui.http,
        urls = layui.urls,
        getFn = layui.getFn;

    var form = layui.form;
    var id = getFn.locaStr('id');
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
            console.log(data)
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
        }
    });
    e("layHome", {})
});
