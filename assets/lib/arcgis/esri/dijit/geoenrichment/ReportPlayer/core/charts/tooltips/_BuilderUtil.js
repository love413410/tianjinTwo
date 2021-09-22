// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.32/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/charts/tooltips/_BuilderUtil","dojo/string dojo/dom-class dojo/dom-construct dojo/dom-style ../legends/ChartLegendSymbols ../legends/LegendSymbolRenderer dojo/i18n!esri/nls/jsapi".split(" "),function(h,k,f,g,n,p,c){var q=c.geoenrichment.dijit.ReportPlayer.ChartContainer;c=c.geoenrichment.dijit.ReportPlayer.ChartTooltip;return{addTitle:function(a,b,e){a=f.create("div",{"class":"chartTooltip_title esriGERowHigh"},a,"first");e&&this.addColor(e,a);this.addLabel(b,
a)},addColor:function(a,b){a=a||{};a=p.renderSymbol({defaultSymbol:n.CIRCLE,fill:a.fill,stroke:a.stroke,marker:a.marker,width:8,height:10});k.add(a,"esriGESpaceAfterBig");f.place(a,b)},addRowOffset:function(a){this.addColor(null,a)},addLabel:function(a,b){return f.create("div",{"class":"chartTooltip_label dijitInline esriGESpaceAfterBig",innerHTML:a},b)},addValue:function(a,b){return f.create("div",{"class":"chartTooltip_value dijitInline esriGESpaceAfterBig",innerHTML:a},b)},buildStatLabels:function(a,
b,e,c,g,h,k){function d(e,c){if(a[e]&&c){var d=f.create("div",{"class":"chartTooltip_row esriGERowHigh"},b);l.addColor(null,d);m.push(l.addLabel(c,d));l.addValue(a[e],d)}}var l=this,m=[];d("weightValueLabel",e);d("minValueLabel",c);d("maxValueLabel",g);d("avgValueLabel",h);d("weightInStackLabel",k);return m},formatTable:function(a){var b=0;a.forEach(function(a){b=Math.max(b,g.get(a,"width"))});a.forEach(function(a){g.set(a,"width",b+"px")})},buildSeriesLabel:function(a){return!0===a.isThisAreaSpecific?
a.seriesLabel&&!a.isThisAreaSingleSeries?h.substitute(c.thisAreaSeries,{seriesName:a.seriesLabel}):q.thisArea:a.seriesLabel},addBenchmarkValue:function(a,b){return this.addValue(a.unbenchmarkedValueLabel+" ("+(0<a.value?"+":"")+a.valueLabel+")",b)}}});