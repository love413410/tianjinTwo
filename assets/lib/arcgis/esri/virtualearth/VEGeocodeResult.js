// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.32/esri/copyright.txt for details.
//>>built
define("esri/virtualearth/VEGeocodeResult","dojo/_base/declare dojo/_base/lang dojo/has ../kernel ../geometry/Point ../geometry/Extent ./VEAddress".split(" "),function(a,b,c,d,e,f,g){a=a(null,{declaredClass:"esri.virtualearth.VEGeocodeResult",constructor:function(a){b.mixin(this,{address:null,bestView:null,calculationMethod:null,confidence:null,displayName:null,entityType:null,location:null,matchCodes:null},a);this.address&&(this.address=new g(this.address));this.bestView&&(this.bestView=new f(this.bestView));
this.locationArray&&(this.calculationMethod=this.locationArray[0].calculationMethod,this.location=new e(this.locationArray[0]))}});c("extend-esri")&&b.setObject("virtualearth.VEGeocodeResult",a,d);return a});