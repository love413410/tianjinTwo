layui.define(["http", "load", "getFn"], function(e) {
	var http = layui.http,
		urls = layui.urls,
		load = layui.load,
		getFn = layui.getFn;

	var $ = layui.$,
		form = layui.form,
		table = layui.table;

	var style = getFn.locaStr("style") || 2;
	var where = {
		id: getFn.locaStr("id"),
		style: style,
		startTime: getFn.locaStr("startTime"),
		endTime: getFn.locaStr("endTime")
	};
	// 查询
	form.on('submit(subBtn)', function(data) {
		var percent = data.field.percent;
		where.percent = percent;
		getListFn();
	});
	//下载
	form.on('submit(expBtn)', function(data) {
		var percent = data.field.percent;
		where.percent = percent;
		load(urls.getDeta, "post", where);
	});

	function getListFn() {
		table.render({
			elem: '#table',
			url: urls.getDeta,
			headers: {
				token: sessionStorage.token
			},
			where: where,
			request: {
				pageName: 'pageNum',
				limitName: 'pageSize'
			},
			parseData: function(res) {
				return {
					"code": 0,
					"count": res.count,
					"data": res.data
				};
			},
			cols: [
				[{
					fixed: 'left',
					title: '站名',
					minWidth: 230,
					field: 'station'
				}, {
					title: '时间',
					field: 'time'
				}, {
					title: '应收文件(个)',
					field: 'total'
				}, {
					title: '实收文件(个)',
					field: 'relay'
				}, {
					title: '接收率(%)',
					field: 'obtain'
				}]
			],
			page: {
				layout: ['prev', 'page', 'next', 'skip', 'count']
			},
			id: 'tabReload',
			height: 490,
			cellMinWidth: 80,
			done: function(res, curr) {
				page = curr;
			}
		});
	};
	form.verify({
		percent: function(val) {
			if (!getFn.trimFn(val) || val < 0 || val > 100) {
				return '请输入0-100的数字';
			}
		},
	});
	e("dataDeta", {})
});
