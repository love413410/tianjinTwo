layui.define(function (exports) {
	exports('getFn', {
		locaStr: function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return decodeURI(r[2]);
			return null;
		},
		initDate: function () {
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
			var d = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
			var dateStr = y + '-' + m + '-' + d;
			return dateStr;
		},
		initM: function () {
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
			var init = y + '-' + m;
			return init;
		},
		initH: function () {
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
			var d = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
			var h = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
			var dateStr = y + '-' + m + '-' + d + '-' + h;
			return dateStr;
		},
		reg: function (val) {
			return (/^1[3456789]\d{9}$/.test(val))
		},
		username: function (val) { //账号验证
			return (/^[a-zA-z]\w{4,10}$/.test(val))
		},
		password: function (val) { //密码验证,字母开头,并且包含数字和特殊字符
			var reg = /^([a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{4,16}$/;
			return (reg.test(val))
		},
		trimFn: function (name) {
			var reg = /\S/;
			if (!name) {
				return false;
			} else {
				name.trim();
				return reg.test(name);
			}
		},
		regIp: function (val) {
			var reg = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/;
			return (reg.test(val))
		},

		user: function (val) {
			return (/^[\u4E00-\u9FA5a-zA-Z]*$/.test(val))
		},
		inte: function (val) {
			return (/^\+?[1-9][0-9]*$/.test(val))
		},
		//电话验证
		phone: function(val) { 
			return (/^0\d{2,3}-?\d{7,8}$/.test(val))
		},
		// 验证手机号
		mobile: function(val) {
			return (/^1[3456789]\d{9}$/.test(val))
		},
		isUserFn: function () {
			var user = sessionStorage.user;
			var isUser = user == "admin"||user == "ADMIN";
			return isUser;
		},
		base: function () {
			var curPath = window.document.location.href;
			var pathName = window.document.location.pathname;
			var pos = curPath.indexOf(pathName);
			var localhostPath = curPath.substring(0, pos);
			var projectName = pathName.substring(
				0,
				pathName.substr(1).indexOf("/") + 1
			);
			var url = localhostPath + projectName;
			return url;
		}
	});
});
