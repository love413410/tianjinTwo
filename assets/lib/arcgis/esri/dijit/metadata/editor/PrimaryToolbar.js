// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.32/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/metadata/editor/templates/PrimaryToolbar.html":'\x3cdiv class\x3d"gxePrimaryToolbar" data-dojo-attach-point\x3d"containerNode"\x3e\r\n  \x3cdiv class\x3d"gxeTabs gxeFloatLeft"\x3e\r\n    \x3cdiv data-dojo-type\x3d"esri/dijit/metadata/base/TabButton" data-dojo-attach-point\x3d"viewButton"\r\n      data-dojo-props\x3d"label:\'${i18nBase.editor.primaryToolbar.view}\'"\r\n      data-dojo-attach-event\x3d"onClick: _onViewClick"\x3e\'\r\n    \x3c/div\x3e\x3cdiv data-dojo-type\x3d"esri/dijit/metadata/base/TabButton" data-dojo-attach-point\x3d"viewXmlButton"\r\n      data-dojo-props\x3d"label:\'${i18nBase.editor.primaryToolbar.viewXml}\'"\r\n      data-dojo-attach-event\x3d"onClick: _onViewXmlClick"\x3e\r\n    \x3c/div\x3e\x3cdiv data-dojo-type\x3d"esri/dijit/metadata/base/TabButton" data-dojo-attach-point\x3d"editButton"\r\n      data-dojo-props\x3d"label:\'${i18nBase.editor.primaryToolbar.edit}\'"\r\n      data-dojo-attach-event\x3d"onClick: _onEditClick"\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"gxeMessageArea" data-dojo-attach-point\x3d"messageArea" style\x3d"display:none"\x3e\r\n      \x3cdiv class\x3d"gxeIconWorking" data-dojo-attach-point\x3d"workingIcon" style\x3d"display:none"\x3e\x3c/div\x3e\r\n      \x3cspan class\x3d"gxeWorkingMessage" data-dojo-attach-point\x3d"workingNode"\x3e\x3c/span\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"gxeToolsets gxeFloatRight"\x3e\r\n    \x3cdiv class\x3d"gxeToolset gxeViewToolset" data-dojo-attach-point\x3d"viewToolset" style\x3d"display:none;"\x3e\r\n      \x3cbutton class\x3d"gxeButton gxeDownloadButton simple" data-dojo-attach-event\x3d"onclick: _onDownloadClick"\r\n        data-dojo-attach-point\x3d"downloadButton"\r\n        \x3e\x3cspan class\x3d"gxeBtnIcon"\x3e\x3c/span\x3e${i18nBase.editor.download.caption}\x3c/button\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"gxeToolset gxeEditToolset" data-dojo-attach-point\x3d"editToolset" style\x3d"display:none;"\x3e\r\n      \x3cbutton class\x3d"gxeButton gxeViewHtmlButton simple" data-dojo-attach-event\x3d"onclick: _onViewHtmlClick"\r\n        data-dojo-attach-point\x3d"viewHtmlButton"\r\n        \x3e\x3cspan class\x3d"gxeBtnIcon"\x3e\x3c/span\x3e${i18nBase.editor.viewHtml.caption}\x3c/button\x3e\r\n      \x3cbutton class\x3d"gxeButton gxeValidateButton simple" data-dojo-attach-event\x3d"onclick: _onValidateClick"\r\n        data-dojo-attach-point\x3d"validateButton"\r\n        \x3e\x3cspan class\x3d"gxeBtnIcon"\x3e\x3c/span\x3e${i18nBase.editor.validate.caption}\x3c/button\x3e\r\n      \x3cbutton class\x3d"gxeButton gxeSaveDraftButton simple" data-dojo-attach-event\x3d"onclick: _onSaveDraftClick"\r\n        data-dojo-attach-point\x3d"saveDraftButton"\r\n        \x3e\x3cspan class\x3d"gxeBtnIcon"\x3e\x3c/span\x3e${i18nBase.editor.saveDraft.caption}\x3c/button\x3e\r\n      \x3cspan class\x3d"gxeSeparator"\x3e\x3c/span\x3e\r\n      \x3cbutton class\x3d"gxeButton gxeDeleteButton simple" data-dojo-attach-event\x3d"onclick: _onDeleteClick"\r\n        data-dojo-attach-point\x3d"deleteButton"\r\n        \x3e\x3cspan class\x3d"gxeBtnIcon"\x3e\x3c/span\x3e${i18nBase.editor.del.caption}\x3c/button\x3e\r\n      \x3cbutton class\x3d"gxeButton gxeLoadButton simple" data-dojo-attach-event\x3d"onclick: _onLoadClick"\r\n        data-dojo-attach-point\x3d"loadButton"\r\n        \x3e\x3cspan class\x3d"gxeBtnIcon"\x3e\x3c/span\x3e\x3cspan data-dojo-attach-point\x3d"loadButtonLabel"\x3c/span\x3e${i18nBase.editor.load.caption}\x3c/button\x3e\r\n      \x3cbutton class\x3d"gxeButton gxeTransformButton simple" data-dojo-attach-event\x3d"onclick: _onTransformClick"\r\n        data-dojo-attach-point\x3d"transformButton"\r\n        \x3e\x3cspan class\x3d"gxeBtnIcon"\x3e\x3c/span\x3e${i18nBase.editor.transform.caption}\x3c/button\x3e\r\n      \x3cspan class\x3d"gxeSeparator"\x3e\x3c/span\x3e\r\n      \x3cbutton class\x3d"gxeButton gxeSaveButton prominent" data-dojo-attach-event\x3d"onclick: _onSaveClick"\r\n        data-dojo-attach-point\x3d"saveButton"\r\n        \x3e\x3cspan class\x3d"gxeBtnIcon"\x3e\x3c/span\x3e${i18nBase.editor.save.caption}\x3c/button\x3e\r\n      \x3cbutton class\x3d"gxeButton gxeSaveAndCloseButton" data-dojo-attach-event\x3d"onclick: _onSaveAndCloseClick"\r\n        data-dojo-attach-point\x3d"saveAndCloseButton"\r\n        \x3e\x3cspan class\x3d"gxeBtnIcon"\x3e\x3c/span\x3e${i18nBase.editor.saveAndClose.caption}\x3c/button\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"gxeToolset gxeCommonToolset" data-dojo-attach-point\x3d"commonToolset" style\x3d"display:none;"\x3e\r\n      \x3cbutton class\x3d"gxeButton gxeCloseButton" data-dojo-attach-event\x3d"onclick: _onCloseClick"\r\n        data-dojo-attach-point\x3d"closeButton"\r\n        \x3e\x3cspan class\x3d"gxeBtnIcon"\x3e\x3c/span\x3e${i18nBase.general.close}\x3c/button\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"gxeClear"\x3e\x3c/div\x3e\r\n\x3c/div\x3e\r\n'}});
define("esri/dijit/metadata/editor/PrimaryToolbar","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/Deferred dojo/_base/fx dojo/dom-class dojo/dom-style dojo/has dojo/query ../base/Templated ./PrimaryToolbarMixin dojo/text!./templates/PrimaryToolbar.html dojo/i18n!../nls/i18nBase ../base/TabButton ../base/ValidationTracker ./util/MessageDialog ../../../kernel".split(" "),function(k,f,p,u,n,d,b,v,w,x,y,z,e,B,l,m,A){k=k([x,y],{_disabled:!0,_escapeSingleQuotes:!0,_mode:null,editor:null,lastSavedXml:null,
templateString:z,canDownloadFiles:!1,postCreate:function(){this.inherited(arguments)},initialize:function(){var a=this.editor.gxeAdaptor.getAllowEditMetadata();a||b.set(this.editButton.domNode,"display","none");this.editor.gxeContext.allowViewXml||b.set(this.viewXmlButton.domNode,"display","none");!this.editor.gxeContext.allowView&&a&&(b.set(this.viewButton.domNode,"display","none"),this.editor.gxeContext.allowViewXml||b.set(this.editButton.domNode,"display","none"));this.editor.gxeContext.arcgisMode&&
(this.loadButtonLabel.innerHTML=this.i18nBase.editor.load.portalCaption);this.updateUI()},initializeView:function(){this._initializeView()},_checkForChanges:function(a,b){var c=new u,g=this.editor.getEditDocument();if(!g)return c.resolve(!0),c;var d=new l({ignoreErrors:!0}),g=g.generateXml(d);if(this._compareXmls(g,this.lastSavedXml))return c.resolve(!0),c;(new m({title:a,okLabel:b,onOkClick:function(a){c.resolve(!0)},onCancelClick:function(a){c.resolve(!1)}})).show(e.editor.changesNotSaved.prompt);
return c},_close:function(){this.editor.dialogBroker&&this.editor.dialogBroker.dialog&&this.editor.dialogBroker.hide()},_fadeIn:function(a){b.set(this.messageArea,"display","none");this.workingNode.innerHTML="";n.fadeIn({node:this.editor.canvasNode,onEnd:f.hitch(this,function(){this._disabled=!1;this.updateUI();a&&a()})}).play()},_fadeOut:function(a,c){this._disabled=!0;b.set(this.messageArea,"display","inline-block");this.setNodeText(this.workingNode,a);p.forEach(w("button",this.domNode),function(a){a.disabled=
!0});n.fadeOut({node:this.editor.canvasNode,onEnd:f.hitch(this,function(){c&&c()})}).play()},_onCloseClick:function(){this._disabled||this._checkForChanges(e.editor.changesNotSaved.dialogTitle,e.editor.changesNotSaved.closeButton).then(f.hitch(this,function(a){a&&this._close()}))},_onDeleteClick:function(){this._disabled||(this.lastSavedXml?this._confirmAndDelete():this.editor.gxeContext.arcgisMode&&(new m({title:e.editor.del.caption,cancelLabel:e.general.close,showOk:!1})).show(e.editor.del.portalNone))},
_onDownloadClick:function(){if(!this._disabled){var a=this.editor.xmlPane.xmlString,c=this.editor.xmlPane.xmlTitle;null!==a&&this._download(a,c,!1)}},_onEditClick:function(a){this._disabled||(a=this.editor.getEditDocument(),this._setMode("edit"),a||this._loadEditor())},_onLoadClick:function(){this._disabled||this._showLoadDialog(null)},_onSaveClick:function(){if(!this._disabled){var a={isSaveAsDraft:!1,isSaveAndClose:!1,bPushToItem:!1,showDialog:!1};this.editor.gxeAdaptor.getAllowPushToItem()&&(a.bPushToItem=
!0);this._save(a)}},_onSaveAndCloseClick:function(){if(!this._disabled){var a={isSaveAsDraft:!1,isSaveAndClose:!0,bPushToItem:!1,showDialog:!1};this.editor.gxeAdaptor.getAllowPushToItem()&&(a.bPushToItem=!0);this._save(a)}},_onSaveDraftClick:function(){this._disabled||this._save({isSaveAsDraft:!0,isSaveAndClose:!1,bPushToItem:!1,showDialog:!1})},_onTransformClick:function(){if(!this._disabled){var a=this.editor.getEditDocument();if(a){var c=this._getTransformationTypes(a);0<c.length&&this._showTransformDialog(a,
c)}}},_onValidateClick:function(){this._disabled||this._validate(!1)},_onViewClick:function(){this._disabled||this._loadView()},_onViewHtmlClick:function(){if(!this._disabled){var a=this.editor.getEditDocument();if(a){var c,b=e.editor.viewHtml.savePrompt;this.lastSavedXml||(b=e.editor.viewHtml.portalNone);var g=this.editor.gxeAdaptor.getAllowPushToItem();this.editor.validationPane.clearMessages();var d=new l({isSaveAsDraft:!0,validationPane:this.editor.validationPane}),h=a.generateXml(d);d.hadValidationErrors||
(c=new m({title:e.editor.viewHtml.dialogTitle,okLabel:e.editor.viewHtml.saveButton}),c.show(b),c.okCancelBar.onOkClick=f.hitch(this,function(){c.okCancelBar.disableOk();this.editor.gxeAdaptor.saveXml(a,h,g).then(f.hitch(this,function(){this.lastSavedXml=h;setTimeout(f.hitch(this,function(){this.editor.gxeAdaptor.viewHtml(h).then(function(){});c.hide()}),1500)}),f.hitch(this,function(a){c.okCancelBar.showFatalError(e.editor.save.errorSaving,a)}))}))}}},_onViewXmlClick:function(){if(!this._disabled){var a=
this.editor.getEditDocument();if(a){var b=new l({ignoreErrors:!0}),a=a.generateXml(b);this.editor.xmlPane.setXml(a,b.documentTitle);this._setMode("viewXml");this.updateUI()}else this._setMode("viewXml")}},_setMode:function(a){"viewXml"===a&&(this.editor.gxeContext.allowViewXml||(a="view"));"view"===a?(d.add(this.viewButton.domNode,"current"),d.remove(this.viewXmlButton.domNode,"current"),d.remove(this.editButton.domNode,"current"),b.set(this.editToolset,"display","none"),b.set(this.viewToolset,"display",
""),this.editor.validationPane.clearMessages(),b.set(this.editor.xmlPane.domNode,"display","none"),b.set(this.editor.editDocumentPane.domNode,"display","none"),b.set(this.editor.viewDocumentPane.domNode,"display",""),this.editor.resizeDocument(this.editor.viewDocumentPane)):"viewXml"===a?(d.add(this.viewXmlButton.domNode,"current"),d.remove(this.viewButton.domNode,"current"),d.remove(this.editButton.domNode,"current"),b.set(this.editToolset,"display","none"),b.set(this.viewToolset,"display",""),this.editor.validationPane.clearMessages(),
b.set(this.editor.viewDocumentPane.domNode,"display","none"),b.set(this.editor.editDocumentPane.domNode,"display","none"),b.set(this.editor.xmlPane.domNode,"display",""),this.editor.resizeXmlPane()):"edit"===a&&(d.add(this.editButton.domNode,"current"),d.remove(this.viewButton.domNode,"current"),d.remove(this.viewXmlButton.domNode,"current"),b.set(this.viewToolset,"display","none"),b.set(this.editToolset,"display",""),b.set(this.editor.viewDocumentPane.domNode,"display","none"),b.set(this.editor.xmlPane.domNode,
"display","none"),b.set(this.editor.editDocumentPane.domNode,"display",""),this.editor.resizeDocument(this.editor.editDocumentPane));this._mode=a;this.updateUI()},updateUI:function(){var a=function(a,c){a.disabled=!c;c?b.set(a,"display",""):b.set(a,"display","none")},c=this.editor.xmlPane.xmlString,d=this.editor.xmlPane.xmlTitle,g=this.editor.getEditDocument(),e=this._getTransformationTypes(g),g=null!==g,h=this.editor.gxeAdaptor.getAllowEditMetadata(),f=this.editor.gxeAdaptor.getAllowDeleteMetadata(),
k=this.editor.gxeContext.allowDownload,l=this.editor.gxeContext.allowDraft,m=this.editor.gxeContext.allowSaveAndClose,n=this.editor.gxeContext.showValidateButton,h=h&&g,e=0<e.length,r=f&&null!==this.lastSavedXml,t=this.editor&&this.editor.dialogBroker,p=this.editor.gxeContext.allowViewHtml&&h;f&&this.editor.gxeContext.arcgisMode&&(r=!0);var q=f=!1;try{"undefined"!==typeof FileReader&&"undefined"!==typeof Blob&&(q=f=!0)}catch(C){}a(this.downloadButton,q&&null!==c&&null!==d&&k);a(this.viewHtmlButton,
p);a(this.saveButton,h);a(this.saveAndCloseButton,h&&t&&m);a(this.saveDraftButton,q&&g&&l);a(this.validateButton,h&&n);a(this.loadButton,f);a(this.transformButton,e);a(this.deleteButton,r);a(this.closeButton,t)}});v("extend-esri")&&f.setObject("dijit.metadata.editor.PrimaryToolbar",k,A);return k});