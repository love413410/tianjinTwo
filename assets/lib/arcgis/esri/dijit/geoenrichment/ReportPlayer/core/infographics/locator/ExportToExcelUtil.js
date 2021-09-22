// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.32/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/infographics/locator/ExportToExcelUtil",["esri/dijit/geoenrichment/when","esri/dijit/geoenrichment/promise/all","../../../dataProvider/commands/mapToImage/MapToImageUtil","esri/dijit/geoenrichment/utils/FileUtil","dojo/i18n!esri/nls/jsapi"],function(k,l,m,g,f){f=f.geoenrichment.dijit.ReportPlayer.LocatorTableInfographic;var d={},n={convert:function(a){return a.data.columns.map(function(b,c){var e,h=[];a.data.data.forEach(function(a,c){a={value:a[b.field]||
"",alignment:{horizontal:a.style.fields[b.field].horizontalAlign||"center"}};0===c?e=a:h.push(a)});return{header:e,values:h}})}};d.prepareExportParameters=function(a){var b=f.locatorExportTitle,c={documentName:g.validateName((a.areaName?a.areaName+", ":"")+(a.layerName||b)),shortName:g.validateName((a.areaShortName?a.areaShortName+", ":"")+(a.layerName||b)),sheets:[{name:a.layerName||b,columns:n.convert(a.sectionJson.stack[0]),floatingImages:[]}],sourceInfos:[]};a.layerID&&c.sourceInfos.push({layerID:a.layerID,
numFeatures:c.sheets[0].columns[0].values.length-1});return k(a.exportMaps&&d._exportMaps(c,a.mapInfos),function(){return c})};d._exportMaps=function(a,b){var c={},e=0;return l(b.map(function(b,d){c[d]=Math.round(e/18);e+=b.node.clientHeight+50;return m.mapInfoToDataUrl(b,{saveImagesAsDataUrl:!0}).then(function(e){a.sheets[0].floatingImages.push({fromColumnIndex:a.sheets[0].columns.length+2,fromRowIndex:1+c[d],width:b.node.clientWidth,height:b.node.clientHeight,dataUrl:e})})}))};return d});