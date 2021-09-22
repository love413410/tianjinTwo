// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.32/esri/copyright.txt for details.
//>>built
define("esri/OAuthCredential",["./kernel","dojo/_base/declare","dojo/has","dojo/json"],function(g,e,h,f){e=e(null,{declaredClass:"esri.OAuthCredential",oAuthInfo:null,storage:null,expires:null,ssl:null,token:null,userId:null,constructor:function(b,a){this.oAuthInfo=b;this.storage=a;this._init()},isValid:function(){var b=!1;if(this.oAuthInfo&&this.token&&this.userId){var a=(new Date).getTime();this.expires>a&&(this.expires-a)/1E3>60*this.oAuthInfo.minTimeUntilExpiration&&(b=!0)}return b},save:function(){if(this.storage){var b=
this._load(),a=this.oAuthInfo;if(a&&a.authNamespace&&a.portalUrl){var c=b[a.authNamespace];c||(c=b[a.authNamespace]={});c[a.portalUrl]={expires:this.expires,ssl:this.ssl,token:this.token,userId:this.userId};try{this.storage.setItem("esriJSAPIOAuth",f.stringify(b))}catch(d){console.log(d)}}}},destroy:function(){var b=this._load(),a=this.oAuthInfo;if(a&&a.appId&&a.portalUrl&&this.token&&this.expires>Date.now()){var c=a.portalUrl.replace(/^http:/i,"https:")+"/sharing/rest/oauth2/revokeToken",d=new FormData;
d.append("f","json");d.append("auth_token",this.token);d.append("client_id",a.appId);d.append("token_type_hint","access_token");if("function"===typeof navigator.sendBeacon)navigator.sendBeacon(c,d);else{var e=new XMLHttpRequest;e.open("POST",c);e.send(d)}}if(a&&a.authNamespace&&a.portalUrl&&this.storage&&(c=b[a.authNamespace])){delete c[a.portalUrl];try{this.storage.setItem("esriJSAPIOAuth",f.stringify(b))}catch(k){console.log(k)}}a&&(this.oAuthInfo=a._oAuthCred=null)},_init:function(){var b=this._load(),
a=this.oAuthInfo;a&&a.authNamespace&&a.portalUrl&&(b=b[a.authNamespace])&&(b=b[a.portalUrl])&&(this.expires=b.expires,this.ssl=b.ssl,this.token=b.token,this.userId=b.userId)},_load:function(){var b={};if(this.storage){var a=this.storage.getItem("esriJSAPIOAuth");if(a)try{b=f.parse(a)}catch(c){console.log(c)}}return b}});h("extend-esri")&&(g.OAuthCredential=e);return e});