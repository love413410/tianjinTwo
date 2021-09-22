// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.32/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/charts/utils/builder/columnBarLine/_AxisBuilder","dojo/_base/lang dojox/charting/axis2d/Default ../../ThemeCalculator ../../ChartTypes ../../AxisUtil ../../plots/labelsRendering/LabelsUtil ../../ChartDataLabelsTypes ./_PointLabelUtil".split(" "),function(m,v,q,p,t,u,y,w){return{createXAxis:function(k,c,d,a,b,h){c=c.xAxis;b="OtherSide"!==c.placement;var f=m.mixin({},a.xAxis.axisStyle,a.xAxis.style,c.style),e=m.mixin({},a.xAxis.titleStyle,c.titleStyle);
a=c.lineColor||a.xAxis.lineColor;d=p.isXAxisVertical(d);var g={width:c.show&&!c.hideLine?1:0,color:a},n=c.title,l=q.combineFontString(e),e=e.color,r=c.show&&!c.hideLine&&c.showTicks?5:0;c.ticksInside&&(r*=-1);h={type:v,stroke:g,title:n,titleOrientation:!d&&b?"away":"axis",titleFont:l,titleFontColor:e,vertical:d,leftBottom:b,majorTicks:!0,majorTick:{length:r,color:a},majorTickStep:1,minorTicks:!1,microTicks:!1,minorTickStep:.5,microTickStep:.01,font:q.combineFontString(f),fontColor:f.color,dropLabels:!0,
majorLabels:c.show&&!c.hideLabels,minorLabels:!1,labelFunc:w.getXAxisLabelFunc(h),rotation:-c.labelsAngle||0};return m.mixin(h,k)},createYAxis:function(k,c,d,a,b,h){b=c.yAxis;var f="OtherSide"!==b.placement,e=m.mixin({},a.yAxis.axisStyle,a.yAxis.style,b.style),g=m.mixin({},a.yAxis.titleStyle,b.titleStyle);a=b.lineColor||a.yAxis.lineColor;var n=p.isXAxisVertical(d),l=!b.nonZeroInclusive,r={width:b.show&&!b.hideLine?1:0,color:a},t=b.title,u=q.combineFontString(g),g=g.color,x=b.show&&!b.hideLine&&b.showTicks?
5:0;b.ticksInside&&(x*=-1);c={type:v,fixUpper:"major",includeZero:l,stroke:r,title:t,titleOrientation:n&&f?"away":"axis",titleFont:u,titleFontColor:g,vertical:!n,leftBottom:f,majorTicks:!0,majorTick:{length:x,color:a},majorTickStep:200,minorTicks:!1,microTicks:!1,minorTickStep:100,microTickStep:10,font:q.combineFontString(e),fontColor:e.color,dropLabels:!0,majorLabels:b.show&&!b.hideLabels,minorLabels:!1,rotation:-b.labelsAngle||0,labelFunc:w.getYAxisLabelFunc(h,c,d)};return m.mixin(c,k)},prettifyYAxis:function(k,
c,d,a,b,h,f,e,g,n){d.removeAxis("y");var l=g&&this._getDataLabelsSizes(b,d,a,e);d.addAxis("y",this.createYAxis(t.getPrettifyYAxisParameters(k,c,{baseLineValue:a.yAxis.baseLineValue,renderColumnBarsInOppositeDirections:p.isColumnBarLike(b)&&1<e.length&&a.renderColumnBarsInOppositeDirections,previewBelowZero:!f.dynamicReportInfo,dataLabelsSizeBelow:g&&l&&l.below,dataLabelsSizeAbove:g&&l&&l.above,chartSize:n,nonZeroInclusive:a.yAxis.nonZeroInclusive}),a,b,h,f,d))},_getDataLabelsSizes:function(k,c,d,
a){if(!p.isColumnBarLike(k)||d.dataLabels===y.NONE)return null;var b=c.getPlot("default"),h=d.yAxis.baseLineValue||0,f=0,e=0;a.forEach(function(a){a.data.forEach(function(a){var d=u.getLabelInfo(b,a,c.theme,{considerAngle:!0,dataLabelsMaxWidth:c.theme.series.dataLabelsMaxWidth}).box[p.isColumnLike(k)?"h":"w"];a[a.valueProp]<h?f=Math.max(f,d):e=Math.max(e,d)})});return{below:f?f+2*b.opt.labelOffset:0,above:e?e+2*b.opt.labelOffset:0}}}});