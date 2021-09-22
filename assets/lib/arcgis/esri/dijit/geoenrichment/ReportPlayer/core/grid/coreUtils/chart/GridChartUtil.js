// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.32/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/grid/coreUtils/chart/GridChartUtil",["dojo/string","../../../charts/utils/ChartTypes","../GridDataUtil","dojo/i18n!esri/nls/jsapi"],function(m,e,n,k){k=k.geoenrichment.dijit.ReportPlayer.Grid;var d={getSupportedChartTypes:function(a){return d._canViewTableAsChart(a)&&[e.COLUMN,e.BAR,e.LINE,e.VERTICAL_LINE,e.PIE,e.DONUT,e.RING]},getTableRowsColumnsInfos:function(a){var b=a.columns[0].field,c=d._hasBigTitleCell(a)?1:0,f=a.store.data[c];if(!f)return null;
var l=[],h=[];a.columns.forEach(function(a,b){0!==b&&h.push({label:f[a.field]||m.substitute(k.columnN,[b+1]),id:b+""})});a.store.data.forEach(function(a,g){g>c&&l.push({label:a[b]||g+1+"",id:g+""})});return{rowInfos:l,columnInfos:h}},_canViewTableAsChart:function(a){return 2>a.columns.length||2>a.store.data.length?!1:a.getFieldCells().length===a.store.data.length*a.columns.length||d._hasBigTitleCell(a)&&a.getFieldCells().length-1===(a.store.data.length-1)*a.columns.length?!0:!1},getChartTitle:function(a){return a.getFieldCells()[0].get("value")},
_hasBigTitleCell:function(a){var b=a.getFieldCells()[0];return n.getColumnSpan(b)===a.columns.length&&!n.getRowSpan(b)},createChartSeriesItems:function(a,b){return b.seriesInRows?d._buildSeriesInRows(a,b):d._buildSeriesInColumns(a,b)},_buildSeriesInColumns:function(a,b){var c=[],f=a.columns[0].field,l=d._hasBigTitleCell(a)?1:0;a.columns.forEach(function(b,d){if(0!==d){var g={label:"",points:[]};c.push(g);a.store.data.forEach(function(c,e){if(!(e<l))if(e===l)g.label=c[b.field]||m.substitute(k.columnN,
[d+1]),g._cIndex=d;else{var h=n.getRenderedValue(a,c,b),p=c.fieldInfos[b.field];g.points.push({label:c[f]||m.substitute(k.rowN,[e+1]),value:{value:h.numericValue||0,formattedValue:h.formattedValue,decimals:p&&p.decimals},_rIndex:e})}})}});e.isSingleSeries(b.chartType)&&0<=b.sourceId&&(c=(b=c[b.sourceId])?[b]:[]);d._resolveSeriesNames(c,!1);return c},_buildSeriesInRows:function(a,b){var c=[],f=d._hasBigTitleCell(a)?1:0,l=a.store.data[f];a.store.data.forEach(function(b,d){if(!(d<f)&&d!==f){var e={label:"",
points:[]};c.push(e);a.columns.forEach(function(c,f){if(0===f)e.label=b[c.field]||m.substitute(k.rowN,[d+1]),e._rIndex=d;else{var g=n.getRenderedValue(a,b,c),h=b.fieldInfos[c.field];e.points.push({label:l[c.field]||f+1+"",value:{value:g.numericValue||0,formattedValue:g.formattedValue,decimals:h&&h.decimals},_cIndex:f})}})}});e.isSingleSeries(b.chartType)&&0<=b.sourceId&&(c=(b=c[b.sourceId])?[b]:[]);d._resolveSeriesNames(c,!0);return c},_resolveSeriesNames:function(a,b){d._resolveItems(a,b);a.forEach(function(a){d._resolveItems(a.points,
!b)})},_resolveItems:function(a,b){var c={};a.forEach(function(a){(c[a.label]=c[a.label]||[]).push(a)});for(var d in c)1<c[d].length&&c[d].forEach(function(a){a.label+=" ("+m.substitute(k[b?"rowN":"columnN"],[a[b?"_rIndex":"_cIndex"]+1])+")"});a.forEach(function(a){delete a[b?"_rIndex":"_cIndex"]})}};return d});