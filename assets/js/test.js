
layui.define(["http", "getFn"], function (exports) {
    function formatSearch(se) {
        if (typeof se !== "undefined") {
            se = se.substr(1);
            let arr = se.split("&"), obj = {}, newarr = [];
            arr.forEach((item, index) => {
                newarr = item.split("=");
                if (typeof obj[newarr[0]] === "undefined") {
                    obj[newarr[0]] = newarr[1];
                }
            })
            return obj
        }
    };
    let str = window.location.search.replace(/\?/g, '&');
    let obj = formatSearch(str);
    exports('test', {});
});