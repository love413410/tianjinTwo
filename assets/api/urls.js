layui.define(function (exports) {
	// var baseUrl = 'http://192.168.1.156:8004';
	// var baseUrl = 'http://192.168.73.247:8004';
	var baseUrl = 'http://169.254.35.19:8004';
	// var baseUrl = window.location.origin;
	exports('urls', {
		login: baseUrl + '/limit/login/',

		search: baseUrl + '/home/search/',
		homeindex: baseUrl + '/home/index/',
		homeclock: baseUrl + '/home/clock/',
		homearea: baseUrl + '/home/bar/area/',
		homeGraph: baseUrl + '/home/bar/graph/',
		receive: baseUrl + '/home/receive/',
		alarms: baseUrl + '/home/alarms/',
		bar: baseUrl + '/home/bar/',
		homeReport: baseUrl + "/report/",
		layer: baseUrl + "/home/layer/",
		people: baseUrl + "/home/people/",
		faultType: baseUrl + "/fault/type/",
		close: baseUrl + '/fault/close/',

		homeEl: baseUrl + '/home/el/',
		// 个人中心
		utype: baseUrl + "/fault/change/type/",
		dtype: baseUrl + "/fault/delete/type/",
		confirm: baseUrl + "/fault/change/confirm/",
		ctitle: baseUrl + "/fault/change/title/",

		// 权限管理
		limitList: baseUrl + '/limit/list/',
		limitAdd: baseUrl + '/limit/add/',
		limitDele: baseUrl + '/limit/dele/',
		climit: baseUrl + '/limit/change/',
		branch: baseUrl + '/limit/branch/',
		limittree: baseUrl + '/limit/tree/',
		pass: baseUrl + '/limit/pass/',
		reset: baseUrl + '/limit/reset/',
		//人员信息
		infolist: baseUrl + '/info/list/',
		infotype: baseUrl + '/info/type/',
		infstype: baseUrl + '/info/stype/',
		infoadd: baseUrl + '/info/add/',
		infodele: baseUrl + '/info/dele/',
		infochange: baseUrl + '/info/change/',
		// 站点管理
		siteotype: baseUrl + '/site/otype/',
		sitentype: baseUrl + '/site/ntype/',
		sitestype: baseUrl + '/site/stype/',
		siteel: baseUrl + '/site/el/',
		sitemain: baseUrl + '/site/main/',
		sitelisttype: baseUrl + '/site/list/type/',
		siteUphold: baseUrl + '/site/uphold/',
		// sitelistsype: baseUrl + '/site/list/stype/',
		siteliststype: baseUrl + '/site/list/stype/',
		sitemtype: baseUrl + '/site/mtype/',
		sitelist: baseUrl + '/site/list/',
		siteType: baseUrl + '/site/type/',
		siteTree: baseUrl + '/site/tree/',
		sitedeta: baseUrl + '/site/data/',
		siteAdd: baseUrl + '/site/add/',
		sitechange: baseUrl + '/site/change/',
		sitedele: baseUrl + '/site/dele/',
		sitedefault: baseUrl + '/site/default/',
		siteDownload: baseUrl + '/site/download/',
		// 观测接口
		buoy: baseUrl + '/data/buoy/',
		radarType: baseUrl + '/radar/type/',
		radar: baseUrl + '/data/radar/',
		gps: baseUrl + '/data/gps/',
		boat: baseUrl + '/data/boat/',
		getType: baseUrl + '/data/getType/',
		
		getDeta: baseUrl + '/data/station/detail/',
		// 台站观测
		dataMenu: baseUrl + '/data/menu/',
		dataType: baseUrl + '/data/type/',
		dataList: baseUrl + '/data/list/',
		dataGraph: baseUrl + '/data/graph/',
		// 汇总统计
		global: baseUrl + '/data/global/',
		columnar: baseUrl + '/data/columnar/',
		dataLoad: baseUrl + '/data/down/',
		// 故障统计
		faultlist: baseUrl + '/fault/list/',
		faultdata: baseUrl + '/fault/data/',
		faultchange: baseUrl + '/fault/change/',
		faultpush: baseUrl + '/fault/push/',
		faultdele: baseUrl + '/fault/dele/',
		faultStation: baseUrl + '/fault/station/',
		faultDelete: baseUrl + '/fault/delete/',
		// 配置页面
		trslist: baseUrl + '/trs/list/',
		trsdele: baseUrl + '/trs/dele/',
		trsadd: baseUrl + '/trs/change/',
		trstree: baseUrl + '/trs/tree/',
		recall: baseUrl + '/trs/recall/',
		config: baseUrl + '/trs/config/',
	});
});
