//>>built
define("dojox/encoding/easy64",["dojo/_base/lang"],function(c){c=c.getObject("dojox.encoding.easy64",!0);var g=function(a,e,f){for(var b=0;b<e;b+=3)f.push(String.fromCharCode((a[b]>>>2)+33),String.fromCharCode(((a[b]&3)<<4)+(a[b+1]>>>4)+33),String.fromCharCode(((a[b+1]&15)<<2)+(a[b+2]>>>6)+33),String.fromCharCode((a[b+2]&63)+33))};c.encode=function(a){var e=[],f=a.length%3,b=a.length-f;g(a,b,e);if(f){for(a=a.slice(b);3>a.length;)a.push(0);g(a,3,e);for(a=3;a>f;e.pop(),--a);}return e.join("")};c.decode=
function(a){var e=a.length,f=[],b=[0,0,0,0],c,d,g;for(c=0;c<e;c+=4){for(d=0;4>d;++d)b[d]=a.charCodeAt(c+d)-33;for(d=g=e-c;4>d;b[++d]=0);f.push((b[0]<<2)+(b[1]>>>4),((b[1]&15)<<4)+(b[2]>>>2),((b[2]&3)<<6)+b[3]);for(d=g;4>d;++d,f.pop());}return f};return c});