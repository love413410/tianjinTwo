// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.32/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/charts/utils/plots/_ClusteredBarsBase","dojo/_base/lang dojo/_base/array dojo/_base/declare dojox/charting/plot2d/CartesianBase dojox/charting/plot2d/_PlotEvents dojox/charting/plot2d/common dojox/lang/utils dojox/lang/functional dojox/lang/functional/reversed ./labelsRendering/_BarsLabelRenderingFix ./animation/_ClusteredBarsAnimation ./_MinVisibleBar".split(" "),function(n,z,D,E,F,u,x,G,H,I,J,K){var L=H.lambda("item.purgeGroup()");return D("dojox.charting.plot2d.Bars",
[E,F,I,J,K],{_mainShapes:null,_animationInfos:null,_noCrispEdges:!1,defaultParams:{gap:0,animate:null},optionalParams:{minBarSize:1,maxBarSize:1},constructor:function(a,b){this.opt=n.clone(n.mixin(this.opt,this.defaultParams));x.updateWithObject(this.opt,b);x.updateWithPattern(this.opt,b,this.optionalParams);this.animate=this.opt.animate;this.renderingOptions=this._noCrispEdges?null:{"shape-rendering":"crispEdges"}},getSeriesStats:function(){var a=u.collectSimpleStats(this.series,function(a){return null==
a}),b;a.hmin-=.5;a.hmax+=.5;b=a.hmin;a.hmin=a.vmin;a.vmin=b;b=a.hmax;a.hmax=a.vmax;a.vmax=b;return a},render:function(a,b){if(!this.chart.isPreRenderMode){this.dirty=this.isDirty();this.resetEvents();var d;this.dirty&&(z.forEach(this.series,L),this._eventSeries={},this.cleanGroup(),d=this.getGroup(),G.forEachRev(this.series,function(a){a.cleanGroup(d)}));var c=this.chart.theme,g=this._hScaler.scaler.getTransformerFromModel(this._hScaler),f=this._vScaler.scaler.getTransformerFromModel(this._vScaler),
h=Math.max(c.series.baseLineValue||0,this._hScaler.bounds.lower),k=g(h),C=this.events(),y=this.getBarProperties();this._mainShapes=[];this._animationInfos=[];for(var A=this.extractValues(this._vScaler),A=this.rearrangeValues(A,g,k),r=this.series.length-1;0<=r;--r){var e=this.series[r];if(this.dirty||e.dirty){e.cleanGroup();var n=c.next("bar",[this.opt,e]),u=Array(e.data.length);d=e.group;for(var v=z.some(e.data,function(a){return"number"===typeof a||a&&!a.hasOwnProperty("x")}),x=v?Math.min(e.data.length,
Math.ceil(this._vScaler.bounds.to)):e.data.length,l=v?Math.max(0,Math.floor(this._vScaler.bounds.from-1)):0;l<x;++l){var m=e.data[l];if(null!=m){var q=this.getValue(m,l,r,v);g(q.y);var B=A[r][l],p;this.opt.styleFunc||"number"!==typeof m?(p="number"!==typeof m?[m]:[],this.opt.styleFunc&&p.push(this.opt.styleFunc(m)),p=c.addMixin(n,"bar",p,!0)):p=c.post(n,"bar");if(1<=y.height){var t={x:b.l+k+Math.min(B,0),y:a.height-b.b-f(q.x+1.5)+y.gap+y.thickness*this._getYShift(r,c),width:Math.abs(B),height:y.height},
t=this._drawBar(d,m,t,p,a,b,e,k,l),w=t.shape;c.series.isEditMode&&(w.rawNode.style.cursor="pointer");w.value=m;this._mainShapes.push(w);t=t.rect;C&&(q={element:"bar",index:l,run:e,shape:w,cx:q.y,cy:q.x+1.5,x:v?l:e.data[l].x,y:v?e.data[l]:e.data[l].y},this._connectEvents(q),u[l]=q);this.createLabel(d,m,t,p,a,b,h);this.animate&&(m={shape:w,hoffset:b.l+k,hsize:-B},this._animationInfos.push(m),this._animateBar(m))}}}this._eventSeries[e.name]=u;e.dirty=!1}else c.skip(),this._reconnectEvents(e.name)}this._renderLabels(p,
a,b,d);this.dirty=!1;return this}},getMainShapes:function(){return this._mainShapes},_drawBar:function(a,b,d,c,g,f,h,k,C){},_getYShift:function(a,b){return b.series.renderColumnBarsInOppositeDirections?a>=this.series.length/2?a-this.series.length/2:a:a},getValue:function(a,b,d,c){c?(d="number"===typeof a?a:a.y,a=b):(d=a.y,a=a.x-1);return{y:d,x:a}},extractValues:function(a){for(var b=[],d=this.series.length-1;0<=d;--d){var c=this.series[d];if(this.dirty||c.dirty){var g=z.some(c.data,function(a){return"number"==
typeof a||a&&!a.hasOwnProperty("x")}),f=g?Math.max(0,Math.floor(a.bounds.from-1)):0,g=g?Math.min(c.data.length,Math.ceil(a.bounds.to)):c.data.length,h=b[d]=[];h.min=f;for(h.max=g;f<g;++f){var k=c.data[f];h[f]=this.isNullValue(k)?0:"number"==typeof k?k:k.y}}}return b},rearrangeValues:function(a,b,d){for(var c=0,g=a.length;c<g;++c){var f=a[c];if(f)for(var h=f.min,k=f.max;h<k;++h){var n=f[h];f[h]=this.isNullValue(n)?0:b(n)-d}}return a},getBarProperties:function(){var a=u.calculateBarSize(this._vScaler.bounds.scale,
this.opt,this._getClusterSize());return{gap:a.gap,height:a.size,thickness:a.size}},_getClusterSize:function(){var a=this.series.length;return this.chart.theme.series.renderColumnBarsInOppositeDirections?Math.round(a/2):a}})});