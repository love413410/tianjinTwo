// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.32/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/sections/dynamicSettings/SectionDynamicFilter","dojo/_base/declare dojo/aspect dojo/dom-construct dijit/_WidgetBase dijit/_TemplatedMixin esri/dijit/geoenrichment/utils/MouseUtil ./chart/ChartFilter ./locator/LocatorFilter ./areaDetails/AreaDetailsFilter ./comparison/ComparisonFilter ./dynamicInfographic/DynamicInfographicFilter ./table/TableFilter".split(" "),function(e,d,c,n,p,q,f,g,h,k,l,m){e=e([n,p],{templateString:"\x3cdiv class\x3d'esriGEReportPlayer_sectionDynamicFilter'\x3e\x3c/div\x3e",
areaDetailsFilter:null,chartFilter:null,comparisonFilter:null,dynamicInfographicFilter:null,locatorFilter:null,tableFilter:null,_areaDetailsFilterWidget:null,_chartFilterWidget:null,_comparisonFilterWidget:null,_dynamicInfographicFilterWidget:null,_locatorFilterWidget:null,_tableFilterWidget:null,postCreate:function(){this._tryInitAreaDetailsFilter();this._tryInitChartFilter();this._tryInitComparisonFilter();this._tryInitDynamicInfographicFilter();this._tryInitLocatorFilter();this._tryInitTableFilter()},
_tryInitAreaDetailsFilter:function(){function a(){b._areaDetailsFilterWidget.setNumItems(b.areaDetailsFilter.getNumItemsTotal(),b.areaDetailsFilter.getNumItemsShown())}var b=this;this.areaDetailsFilter&&(this._areaDetailsFilterWidget=(new h({onAreaDetailsFilterChanged:this.onAreaDetailsFilterChanged.bind(this)})).placeAt(c.create("div",{"class":"sectionDynamicFilter_row"},this.domNode)),this.own(this._areaDetailsFilterWidget),a(),this.own(d.after(this.areaDetailsFilter,"onContentUpdated",a)))},_tryInitChartFilter:function(){function a(){b._chartFilterWidget.setNumElements(b.chartFilter.getNumElementsTotal(),
b.chartFilter.getNumElementsShown())}var b=this;this.chartFilter&&(this._chartFilterWidget=(new f({onFilterRangesChanged:this.onChartFilterChanged.bind(this)})).placeAt(c.create("div",{"class":"sectionDynamicFilter_row"},this.domNode)),this.own(this._chartFilterWidget),this._chartFilterWidget.setSettings(this.chartFilter),a(),this.own(d.after(this.chartFilter,"onContentUpdated",a)))},_tryInitComparisonFilter:function(){function a(){b._comparisonFilterWidget.setNumAreas(b.comparisonFilter.getNumAreasTotal(),
b.comparisonFilter.getNumAreasShown())}var b=this;this.comparisonFilter&&(this._comparisonFilterWidget=(new k({onComparisonFilterChanged:this.onComparisonFilterChanged.bind(this)})).placeAt(c.create("div",{"class":"sectionDynamicFilter_row"},this.domNode)),this.own(this._comparisonFilterWidget),this._comparisonFilterWidget.setFilter(this.comparisonFilter),a(),this.own(d.after(this.comparisonFilter,"onContentUpdated",a)))},_tryInitDynamicInfographicFilter:function(){function a(){b._dynamicInfographicFilterWidget.setNumAreas(b.dynamicInfographicFilter.getNumAreasTotal(),
b.dynamicInfographicFilter.getNumAreasShown())}var b=this;this.dynamicInfographicFilter&&(this._dynamicInfographicFilterWidget=(new l({onDynamicInfographicFilterChanged:this.onDynamicInfographicFilterChanged.bind(this)})).placeAt(c.create("div",{"class":"sectionDynamicFilter_row"},this.domNode)),this.own(this._dynamicInfographicFilterWidget),this._dynamicInfographicFilterWidget.setFilter(this.dynamicInfographicFilter),a(),this.own(d.after(this.dynamicInfographicFilter,"onContentUpdated",a)))},updateDynamicInfographicFilter:function(a){if(this.dynamicInfographicFilter){var b=
this._dynamicInfographicFilterWidget.domNode.parentNode;this._dynamicInfographicFilterWidget.destroy();c.destroy(b);this.dynamicInfographicFilter=a;this._tryInitDynamicInfographicFilter()}},_tryInitLocatorFilter:function(){function a(){b._locatorFilterWidget.setNumPoints(b.locatorFilter.getNumPointsTotal(),b.locatorFilter.getNumPointsShown())}var b=this;this.locatorFilter&&(this._locatorFilterWidget=(new g({onLocatorFilterChanged:this.onLocatorFilterChanged.bind(this)})).placeAt(c.create("div",{"class":"sectionDynamicFilter_row"},
this.domNode)),this.own(this._locatorFilterWidget),this._locatorFilterWidget.setFilterRanges(this.locatorFilter.filterRanges),a(),this.own(d.after(this.locatorFilter,"onContentUpdated",a)))},_tryInitTableFilter:function(){function a(){b._tableFilterWidget.setNumElements(b.tableFilter.getNumElementsTotal(),b.tableFilter.getNumElementsShown())}var b=this;this.tableFilter&&(this._tableFilterWidget=(new m({onFilterRangesChanged:this.onTableFilterChanged.bind(this)})).placeAt(c.create("div",{"class":"sectionDynamicFilter_row"},
this.domNode)),this.own(this._tableFilterWidget),this._tableFilterWidget.setSettings(this.tableFilter),a(),this.own(d.after(this.tableFilter,"onContentUpdated",a)))},hasFiltersOn:function(){return[this._chartFilterWidget,this._locatorFilterWidget,this._areaDetailsFilterWidget,this._comparisonFilterWidget,this._dynamicInfographicFilterWidget,this._tableFilterWidget].some(function(a){return a&&a.hasFiltersOn()})},setVisualState:function(a){a&&(a=(a=a.stackElements[0])&&a.filterRanges?a:a&&a.cells&&
a.cells[0]);this._chartFilterWidget&&this._chartFilterWidget.setVisualState(a);this._locatorFilterWidget&&this._locatorFilterWidget.setVisualState(a);this._areaDetailsFilterWidget&&this._areaDetailsFilterWidget.setVisualState(a);this._comparisonFilterWidget&&this._comparisonFilterWidget.setVisualState(a);this._dynamicInfographicFilterWidget&&this._dynamicInfographicFilterWidget.setVisualState(a);this._tableFilterWidget&&this._tableFilterWidget.setVisualState(a)},isMouseOver:function(a){return q.isMouseOver(this.domNode,
{event:a})||[this._chartFilterWidget,this._locatorFilterWidget,this._areaDetailsFilterWidget,this._comparisonFilterWidget,this._dynamicInfographicFilterWidget,this._tableFilterWidget].some(function(b){return b&&b.isMouseOver&&b.isMouseOver(a)})},onAreaDetailsFilterChanged:function(a){},onChartFilterChanged:function(a){},onComparisonFilterChanged:function(a){},onLocatorFilterChanged:function(a){},onDynamicInfographicFilterChanged:function(a){},onTableFilterChanged:function(a){},onClosePopup:function(){}});
e.hasFiltersOn=function(a){return f.hasFiltersOn(a)||g.hasFiltersOn(a)||h.hasFiltersOn(a)||k.hasFiltersOn(a)||l.hasFiltersOn(a)||m.hasFiltersOn(a)};return e});