// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.32/esri/copyright.txt for details.
//>>built
define("esri/layers/labelLayerUtils/StaticLabelClass","dojo/_base/declare dojo/_base/lang dojo/has ../../kernel ../../geometry/Extent ../../geometry/Point ../../geometry/Polygon".split(" "),function(C,E,F,G,A,D,B){return C(null,{declaredClass:"esri.layers.labelLayerUtils.StaticLabel",constructor:function(){this._preparedLabels=[];this._placedLabels=[];this._extent=null;this._ymax=this._ymin=this._xmax=this._xmin=0;this._scale=1;this._LINE_STEP_CONST=1.5;this._POLYGON_X_STEP_CONST=1;this._POLYGON_Y_STEP_CONST=
.75;this._OVERRUN=2},setMap:function(c,d){this._labelLayer=d;this._map=c;this._xmin=c.extent.xmin;this._xmax=c.extent.xmax;this._ymin=c.extent.ymin;this._ymax=c.extent.ymax;this._scale=(this._xmax-this._xmin)/c.width},_process:function(c){var d,a,l,b,g,k,e,f,n;this._preparedLabels=c;this._placedLabels=[];for(c=this._preparedLabels.length-1;0<=c;c--){d=this._preparedLabels[c];g=d.labelWidth;k=d.labelHeight;f=(e=d.options)&&e.lineLabelPlacement?e.lineLabelPlacement:"PlaceAtCenter";n=e&&e.lineLabelPosition?
e.lineLabelPosition:"Above";a=e&&e.labelRotation?e.labelRotation:!0;l=Math.PI/180*d.angle;b=e&&e.howManyLabels?e.howManyLabels:"OneLabel";var p=[];if("point"===d.geometry.type)this._generatePointPositions(d.geometry.x,d.geometry.y,d.text,l,g,k,d.symbolWidth,d.symbolHeight,e,p);else if("multipoint"===d.geometry.type)for(a=0;a<d.geometry.points.length;a++)this._generatePointPositions(d.geometry.points[a][0],d.geometry.points[a][1],d.text,l,g,k,d.symbolWidth,d.symbolHeight,e,p);else if("polyline"===
d.geometry.type)if("PlaceAtStart"===f)this._generateLinePositionsPlaceAtStart(d.geometry,!0,d.text,g,k,2*d.symbolHeight+k,f,n,a,p);else if("PlaceAtEnd"===f)this._generateLinePositionsPlaceAtEnd(d.geometry,!0,d.text,g,k,2*d.symbolHeight+k,f,n,a,p);else{e=[];var h=d.geometry.getExtent(),q=this._map.extent;if(h.getWidth()<g*this._scale/this._OVERRUN&&h.getHeight()<g*this._scale/this._OVERRUN)continue;else.5*h.getWidth()<q.getWidth()&&.5*h.getHeight()<q.getHeight()?this._generateLinePositionsPlaceAtCenter(d.geometry,
!1,.1*Math.min(this._map.width,this._map.height)*this._scale,d.text,g,k,2*d.symbolHeight+k,f,n,a,e):this._generateLinePositionsPlaceAtCenter(d.geometry,!0,.2*Math.min(this._map.width,this._map.height)*this._scale,d.text,g,k,2*d.symbolHeight+k,f,n,a,e);this._postSorting(q,e,p)}else if("polygon"===d.geometry.type){f=[];for(a=0;a<d.geometry.rings.length;a++)n=d.geometry.rings[a],1<d.geometry.rings.length&&!B.prototype.isClockwise(n)||(e=this._calcRingExtent(n),e.xmax-e.xmin<4*g*this._scale/this._OVERRUN&&
e.ymax-e.ymin<4*k*this._scale/this._OVERRUN||f.push(n));f.sort(function(a,b){return b.length-a.length});for(a=0;a<f.length;a++)this._generatePolygonPositionsForManyLabels(f[a],d.geometry.spatialReference,d.text,l,g,k,p)}for(a=0;a<p.length&&(f=p[a].x,n=p[a].y,void 0!==p[a].angle&&(l=p[a].angle),e=this._findPlace(d,d.text,f,n,l,g,k),"OneLabel"!==b||!e||!this._labelLayer._isWithinScreenArea(new D(f,n,d.geometry.spatialReference)));a++);}return this._placedLabels},_generatePointPositions:function(c,d,
a,l,b,g,k,e,f,n){a=f&&f.pointPriorities?f.pointPriorities:"AboveRight";b=(k+b)*this._scale;g=(e+g)*this._scale;switch(a.toLowerCase()){case "aboveleft":c-=b;d+=g;break;case "abovecenter":d+=g;break;case "aboveright":c+=b;d+=g;break;case "centerleft":c-=b;break;case "centercenter":break;case "centerright":c+=b;break;case "belowleft":c-=b;d-=g;break;case "belowcenter":d-=g;break;case "belowright":c+=b;d-=g;break;default:return}n.push({x:c,y:d})},_generateLinePositionsPlaceAtStart:function(c,d,a,l,b,
g,k,e,f,n){k=l*this._scale;var p=this._LINE_STEP_CONST*Math.min(this._map.width,this._map.height)*this._scale,h,q,t,r,v,w,m,x;for(h=0;h<c.paths.length;h++){var u=c.paths[h],y=k,z=0;for(q=0;q<u.length-1;q++)t=u[q][0],r=u[q][1],v=u[q+1][0],w=u[q+1][1],m=v-t,x=w-r,m=Math.sqrt(m*m+x*x),z+m>y?(z=this._generatePositionsOnLine(c.spatialReference,d,y,p,z,t,r,v,w,a,l,b,g,e,f,n),y=p):z+=m}},_generateLinePositionsPlaceAtEnd:function(c,d,a,l,b,g,k,e,f,n){k=l*this._scale;var p=this._LINE_STEP_CONST*Math.min(this._map.width,
this._map.height)*this._scale,h,q,t,r,v,w,m,x;for(h=0;h<c.paths.length;h++){var u=c.paths[h],y=k,z=0;for(q=u.length-2;0<=q;q--)t=u[q+1][0],r=u[q+1][1],v=u[q][0],w=u[q][1],m=v-t,x=w-r,m=Math.sqrt(m*m+x*x),z+m>y?(z=this._generatePositionsOnLine(c.spatialReference,d,y,p,z,t,r,v,w,a,l,b,g,e,f,n),y=p):z+=m}},_generateLinePositionsPlaceAtCenter:function(c,d,a,l,b,g,k,e,f,n,p){var h,q,t,r,v,w,m,x;for(e=0;e<c.paths.length;e++){var u=c.paths[e];if(!(2>u.length)){if(2==u.length){r=u[0];h=u[1];t=r[0];r=r[1];
u=h[0];w=h[1];v=(u-t)*(u-t)+(w-r)*(w-r);m=Math.atan2(w-r,u-t);w=Math.cos(m);m=Math.sin(m);u=[];x=t;for(var y=r;(x-t)*(x-t)+(y-r)*(y-r)<v;)u.push([x,y]),x+=a/2*w,y+=a/2*m;u.push(h)}var z=0;for(h=0;h<u.length-1;h++)t=u[h][0],r=u[h][1],v=u[h+1][0],w=u[h+1][1],m=v-t,x=w-r,z+=Math.sqrt(m*m+x*x);for(h=y=0;h<u.length-1;h++){t=u[h][0];r=u[h][1];v=u[h+1][0];w=u[h+1][1];m=v-t;x=w-r;m=Math.sqrt(m*m+x*x);if(y+m>z/2)break;y+=m}h==u.length-1&&h--;t=u[h][0];r=u[h][1];v=u[h+1][0];w=u[h+1][1];m=v-t;x=w-r;y=z/2-y;
m=Math.atan2(x,m);x=t+y*Math.cos(m);m=r+y*Math.sin(m);t=this._angleAndShifts(t,r,v,w,k,f,n);p.push({x:x+t.shiftX,y:m+t.shiftY,angle:t.angle});var z=x,A=m,y=0;for(q=h;q<u.length-1;q++)q==h?(t=z,r=A):(t=u[q][0],r=u[q][1]),v=u[q+1][0],w=u[q+1][1],m=v-t,x=w-r,m=Math.sqrt(m*m+x*x),y=y+m>a?this._generatePositionsOnLine(c.spatialReference,d,a,a,y,t,r,v,w,l,b,g,k,f,n,p):y+m;y=0;for(q=h;0<=q;q--)q==h?(t=z,r=A):(t=u[q+1][0],r=u[q+1][1]),v=u[q][0],w=u[q][1],m=v-t,x=w-r,m=Math.sqrt(m*m+x*x),y=y+m>a?this._generatePositionsOnLine(c.spatialReference,
d,a,a,y,t,r,v,w,l,b,g,k,f,n,p):y+m}}},_generatePositionsOnLine:function(c,d,a,l,b,g,k,e,f,n,p,h,q,t,r,v){n=Math.atan2(f-k,e-g);p=g;h=k;var w=p,m=h;do if(b=a-b,p+=b*Math.cos(n),h+=b*Math.sin(n),this._belongs(p,h,g,k,e,f))b=this._angleAndShifts(g,k,e,f,q,t,r),a=p+b.shiftX,m=h+b.shiftY,d?this._labelLayer._isWithinScreenArea(new A(a,m,a,m,c))&&v.push({x:a,y:m,angle:b.angle}):v.push({x:a,y:m,angle:b.angle}),w=p,m=h,b=0,a=l;else return c=e-w,f-=m,Math.sqrt(c*c+f*f);while(1)},_postSorting:function(c,d,a){if(c&&
0<d.length){var l=.5*(c.xmin+c.xmax);c=.5*(c.ymin+c.ymax);for(var b=d[0].x,g=d[0].y,k=Math.sqrt((b-l)*(b-l)+(g-c)*(g-c)),e=d[0].angle,f=0;f<d.length;f++){var n=d[f].x,p=d[f].y,h=Math.sqrt((n-l)*(n-l)+(p-c)*(p-c));h<k&&(b=n,g=p,k=h,e=d[f].angle)}a.push({x:b,y:g,angle:e})}},_belongs:function(c,d,a,l,b,g){if(b==a&&g==l)return!1;if(b>a){if(c>b||c<a)return!1}else if(c<b||c>a)return!1;if(g>l){if(d>g||d<l)return!1}else if(d<g||d>l)return!1;return!0},_angleAndShifts:function(c,d,a,l,b,g,k){for(c=Math.atan2(l-
d,a-c);c>Math.PI/2;)c-=Math.PI;for(;c<-(Math.PI/2);)c+=Math.PI;l=Math.sin(c);var e=Math.cos(c);a=d=0;"Above"==g&&(d=b*l*this._scale,a=b*e*this._scale);"Below"==g&&(d=-b*l*this._scale,a=-b*e*this._scale);b=[];b.angle=k?-c:0;b.shiftX=-d;b.shiftY=a;return b},_generatePolygonPositionsForManyLabels:function(c,d,a,l,b,g,k){b=this._findCentroidForRing(c);l=b[0];var e=b[1],f=this._calcRingExtent(c);b=f.xmin;g=f.ymin;var n=f.xmax,f=f.ymax,p=(f-g)/(this._map.height*this._scale);if(!(10<(n-b)/(this._map.width*
this._scale)&&10<p)){var h=!0;if(n-b>this._map.width*this._scale||f-g>this._map.height*this._scale)h=!1;var p=this._map.width*this._scale*(h?.1875:.5),h=this._map.height*this._scale*(h?.1875:.5),q=!0,t=!0,r=0;do{e+=(r%2?-1:1)*r*h;if(this._scanRingByX(a,d,c,l,e,b,n,p,k))break;e<g&&(q=!1);e>f&&(t=!1);r++}while(q||t)}},_scanRingByX:function(c,d,a,l,b,g,k,e,f){var n=!0,p=!0,h=0,q=1E3;do{l+=(h%2?-1:1)*h*e;var t=this._movePointInsideRing(a,l,b),r=this._labelLayer._isWithinScreenArea(new A(t,b,t,b,d)),v=
this._isPointWithinRing(c,a,t,b);if(r&&v)return f.push({x:t,y:b}),!0;l<g&&(n=!1);l>k&&(p=!1);h++;q--;if(0>=q)return!0}while(n||p);return!1},_movePointInsideRing:function(c,d,a){for(var l=[],b=c.length-1,g=c[0][1]>=c[b][1]?1:-1,k=0;k<=b;k++){var e=k,f=k+1;k==b&&(f=0);var n=c[e][0],e=c[e][1],p=c[f][0],f=c[f][1],h=f>=e?1:-1;if(e<=a&&a<=f||f<=a&&a<=e)a!=e&&a!=f?(l.push((a-e)*(p-n)/(f-e)+n),g=h):a==e&&a!=f?(g!=h&&l.push(n),g=h):a!=e&&a==f?(l.push(p),g=h):a==e&&a==f&&(1==g&&l.push(n),l.push(p),g=h)}l.sort(function(a,
b){return a-b});c=l.length;if(0<c){for(k=a=d=0;k<c-1;k+=2)b=Math.abs(l[k+1]-l[k]),b>d&&(d=b,a=k);d=(l[a]+l[a+1])/2}return d},_calcRingExtent:function(c){var d,a;a=new A;for(d=0;d<c.length-1;d++){var l=c[d][0],b=c[d][1];if(void 0===a.xmin||l<a.xmin)a.xmin=l;if(void 0===a.ymin||b<a.ymin)a.ymin=b;if(void 0===a.xmax||l>a.xmax)a.xmax=l;if(void 0===a.ymax||b>a.ymax)a.ymax=b}return a},_isPointWithinPolygon:function(c,d,a,l){var b;for(b=0;b<d.rings.length;b++)if(this._isPointWithinRing(c,d.rings[b],a,l))return!0;
return!1},_isPointWithinRing:function(c,d,a,l){var b,g,k,e,f=[],n=d.length;for(c=0;c<n-1;c++)if(b=d[c][0],g=d[c][1],k=d[c+1][0],e=d[c+1][1],b!=k||g!=e){if(g==e)if(l==g)f.push(b);else continue;b==k?(g<e&&l>=g&&l<e&&f.push(b),g>e&&l<=g&&l>e&&f.push(b)):(g=(k-b)/(e-g)*(l-g)+b,b<k&&g>=b&&g<k&&f.push(g),b>k&&g<=b&&g>k&&f.push(g))}f.sort(function(a,b){return a-b});for(c=0;c<f.length-1;c++)if(b=f[c],k=f[c+1],a>=b&&a<k)if(c%2)break;else return!0;return!1},_findCentroidForRing:function(c){for(var d=c.length,
a=[0,0],l=0,b=c[0][0],g=c[0][1],k=1;k<d-1;k++){var e=c[k][0],f=c[k][1],n=c[k+1][0],p=c[k+1][1],h=(e-b)*(p-g)-(n-b)*(f-g);a[0]+=h*(b+e+n);a[1]+=h*(g+f+p);l+=h}a[0]/=3*l;a[1]/=3*l;return a},_findCentroidForFeature:function(c){for(var d=0,a=[0,0],l=0;l<c.rings.length;l++)for(var b=c.rings[l],g=b.length,k=b[0][0],e=b[0][1],f=1;f<g-1;f++){var n=b[f][0],p=b[f][1],h=b[f+1][0],q=b[f+1][1],t=(n-k)*(q-e)-(h-k)*(p-e);a[0]+=t*(k+n+h);a[1]+=t*(e+p+q);d+=t}a[0]/=3*d;a[1]/=3*d;return a},_findPlace:function(c,d,
a,l,b,g,k){if(isNaN(a)||isNaN(l))return!1;for(var e=0;e<this._placedLabels.length;e++){var f=this._placedLabels[e].angle,n=this._placedLabels[e].width*this._scale,p=this._placedLabels[e].height*this._scale,h=this._placedLabels[e].x-a,q=this._placedLabels[e].y-l;if(0===b&&0===f){if(this._findPlace2(-g*this._scale,-k*this._scale,g*this._scale,k*this._scale,h-n,q-p,h+n,q+p))return!1}else{var t=new A(-g*this._scale,-k*this._scale,g*this._scale,k*this._scale,null),r=0,v=1;0!==b&&(r=Math.sin(b),v=Math.cos(b));
var w=h*v-q*r,h=h*r+q*v,f=f-b,r=Math.sin(f),v=Math.cos(f),m=-n*v- -p*r,q=-n*r+-p*v,f=+n*v- -p*r,x=+n*r+-p*v,n=w+m,p=h-q,r=w+f,v=h-x,m=w-m,q=h+q,w=w-f,h=h+x,f=new B;f.addRing([[n,p],[r,v],[m,q],[w,h],[n,p]]);if(t.intersects(f))return!1}}for(;b>Math.PI/2;)b-=Math.PI;for(;b<-(Math.PI/2);)b+=Math.PI;e={};e.layer=c;e.text=d;e.angle=b;e.x=a;e.y=l;e.width=g;e.height=k;this._placedLabels.push(e);return!0},_findPlace2:function(c,d,a,l,b,g,k,e){return(c>=b&&c<=k||a>=b&&a<=k||c<=b&&a>=k)&&(d>=g&&d<=e||l>=g&&
l<=e||d<=g&&l>=e)?!0:!1}})});