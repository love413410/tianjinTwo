// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.32/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/utils/DateUtil",["dojo/date/locale","esri/moment"],function(d,e){var b={formatDate:function(a,c){return(a=b.objectToDate(a))?d.format(a,c):""},formatMoment:function(a,c){return(a=b.objectToTime(a))?e(a).format(c):""},formatDateShort:function(a){return b.formatMoment(a,"L")},formatDateTimeShort:function(a){return b.formatMoment(a,"L LT")},formatLiveTime:function(a){var c=b.formatMoment(a,"l, LT").replace(/\d\d\d\d/,function(a){return a.substr(2)});return c?c+" "+b.formatDate(a,
{datePattern:"ZZZZ",selector:"date"}):""},formatTypicalTime:function(a){return b.formatMoment(a,"ddd LT")},parseDateShort:function(a){return(a=+e(a,"L"))?new Date(a):null},getReportFooterDate:function(a){return d.format(a||new Date,{datePattern:"MMMM d, yyyy",selector:"date"})},getFullYear:function(){return(new Date).getFullYear()},objectToTime:function(a){if(!a)return null;a="string"===typeof a?new Date(a):a;return a.getTime?a.getTime():Number(a)||null},objectToDate:function(a){return a?a.getTime?
a:new Date(a):null}};return b});