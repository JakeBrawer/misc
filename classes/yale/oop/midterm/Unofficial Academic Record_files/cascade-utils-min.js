
function stringToDoc(s){var doc;if(window.ActiveXObject){doc=new ActiveXObject('Microsoft.XMLDOM');doc.async='false';doc.loadXML(s);}
else
doc=(new DOMParser()).parseFromString(s,'text/xml');return(doc&&doc.documentElement&&doc.documentElement.tagName!='parsererror')?doc:null;}
function deparam(s,coerce){var query={};coerce_types={'true':!0,'false':!1,'null':null};s.replace(/\b([^&=]*)=([^&=]*)\b/g,function(m,a,d){if(coerce){d=d&&!isNaN(d)?+d:d==='undefined'?undefined:coerce_types[d]!==undefined?coerce_types[d]:d;}
if(typeof query[a]!='undefined'){query[a]+=','+d;}
else{query[a]=d;}});return query;}
function truncateText(str,len,truncateWord){var TRUNCATION_INDICATOR="...";var originalText=str;if(originalText.length>len){originalText=originalText.substring(0,len);if(typeof(truncateWord)!='undefined'&&truncateWord==true){originalText=originalText.replace(/\w+$/,'');}
originalText+=TRUNCATION_INDICATOR;}
return originalText;}
var Url={encode:function(string){if(typeof string=='undefined'){return'';}
return escape(this._utf8_encode(string));},decode:function(string,doConvertHTML){if(typeof string=='undefined'){return'';}
if(typeof doConvertHTML=='undefined'){doConvertHTML=true;}
var val=this._utf8_decode(unescape(string));if(doConvertHTML){val=escapeHTML(val);}
return val;},_utf8_encode:function(string){string=string.replace(/\r\n/g,"\n");var utftext="";for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}
else
if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}
else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}
return utftext;},_utf8_decode:function(utftext){var string="";var i=0;var c=c1=c2=0;while(i<utftext.length){c=utftext.charCodeAt(i);if(c<128){string+=String.fromCharCode(c);i++;}
else
if((c>191)&&(c<224)){c2=utftext.charCodeAt(i+1);string+=String.fromCharCode(((c&31)<<6)|(c2&63));i+=2;}
else{c2=utftext.charCodeAt(i+1);c3=utftext.charCodeAt(i+2);string+=String.fromCharCode(((c&15)<<12)|((c2&63)<<6)|(c3&63));i+=3;}}
return string;}}
function deleteAllCookies(){var cookies=document.cookie.split(";");for(var i=0;i<cookies.length;i++){var cookie=cookies[i];var eqPos=cookie.indexOf("=");var name=eqPos>-1?cookie.substr(0,eqPos):cookie;document.cookie=name+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT";}}
function getCookie(name){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=cookies[i];var eqPos=cookie.indexOf("=");if(eqPos>-1){var data=cookie.split("=");if(name==$.trim(data[0])){return data[1];}}}
return null;}
function setCookie(name,value){var ttl=7200;var date=new Date();date.setTime(date.getTime()+(ttl*60*1000));var expires="expires="+date.toGMTString();document.cookie=name+"="+value+"; "+expires+"; path=/";}
function removeCookie(name){var expires="expires=Thu, 01 Jan 1970 00:00:00 GMT";document.cookie=name+"=;"+expires+"; path=/";}
var TimeDiff={setStartTime:function(){d=new Date();time=d.getTime();},getDiff:function(){d=new Date();return(d.getTime()-time);}}
function findPosX(obj){var curleft=0;if(obj.offsetParent)
while(1){curleft+=obj.offsetLeft;if(!obj.offsetParent)
break;obj=obj.offsetParent;}
else
if(obj.x)
curleft+=obj.x;return curleft;}
function findPosY(obj){var curtop=0;if(obj.offsetParent)
while(1){curtop+=obj.offsetTop;if(!obj.offsetParent)
break;obj=obj.offsetParent;}
else
if(obj.y)
curtop+=obj.y;return curtop;}
$.fn.unwrap=function(){this.parent(':not(body)').each(function(){$(this).replaceWith(this.childNodes);});return this;};StylesheetFormatter={targetWin:this,styleSheet:0,sheets:(document.styleSheets)?document.styleSheets:undefined,getSheets:function(){var win=StylesheetFormatter.targetWin;return(win.document.styleSheets)?win.document.styleSheets:undefined},getCssRules:function(val){if(val=='undefined')
return this;if(this.getSheets()=='undefined')
return undefined;if(typeof val=='number'){this.styleSheet=val;if(val>this.getSheets().length)
return;if(jQuery.browser.msie){return this.getSheets()[val].rules;}
else{return this.getSheets()[val].cssRules;}}
var regex=new RegExp(val);for(i in this.getSheets()){if(regex.test(this.getSheets()[i].href)){this.styleSheet=i;if(jQuery.browser.msie){return this.getSheets()[i].rules;}
else{return this.getSheets()[i].cssRules;}}}},getContents:function(val){if(val=='undefined')
return this;if(this.getSheets()=='undefined')
return undefined;if(typeof val=='number'){this.styleSheet=val;if(val>this.getSheets().length)
return;if(typeof this.getSheets()[val].cssText!='undefined'){return this.getSheets()[val].cssText;}}
var regex=new RegExp(val);for(i in this.getSheets()){if(regex.test(this.getSheets()[i].href)){this.styleSheet=i;if(typeof this.getSheets()[i].cssText!='undefined'){return this.getSheets()[i].cssText;}}}},getStylesheet:function(val){if(val=='undefined')
return this;if(this.getSheets()=='undefined')
return undefined;if(typeof val=='number'){this.styleSheet=val;if(val>this.getSheets().length)
return;if(typeof this.getSheets()[val]!='undefined'){return this.getSheets()[val];}}
var regex=new RegExp(val);for(i in this.getSheets()){if(regex.test(this.getSheets()[i].href)){this.styleSheet=i;if(typeof this.getSheets()[i]!='undefined'){return this.getSheets()[i];}}}},toggle:function(file){var exceptions=['prefwindow','errorwindow','.browsebutton div','.browsebutton div div','.htmlbutton','.menu','.menu div','.menusmall div','.items li a','.defaultbuttonsmall','.defaultbuttonsmall div','.defaultbuttonsmall div div','table td.dedefault','table td.delabel','div.infotextdiv','.defaultbutton','.defaultbutton div','.defaultbutton div div','table th.ddheader','div.pagebodydiv','.captiontext','table td.dddefault','table td.dbheader','table td.dbdefault','table td.dbdead','table th.dedefault','table td.ddseparator','table td.indefault','table th.ddlabel','table td.dbtitle','table td.ddheader','table th.ddtitle','table td.deheader','table th.deheader','table th.delabel','table td.deseparator','table td.dehighlight','table td dedefault','table td.detitle','table th.detitle','table td.dedead','table td.dewhite','table td.deborder','table td.ddtitle','table td.ddlabel','table td.ddhighlight','table td.dddead','table td.ddnontabular','table td.ddwhite','table td.mptitle','table td.mpheader','table th.mplabel','table td.mpwhite','table td.mpdefault','table td.ntwhite','table td.dblabel','table th.dblabel','table td.ntheader','table th.ntheader','table td.nttitle','table th.nttitle','table td.ntlabel','table th.ntlabel','table td.ntseparator','table td.ntdead','table td.ntdefault','table td.nthighlight'];if(jQuery.browser.msie){var stylesheet=this.getStylesheet(file);if(!stylesheet)
return this;var set1=stylesheet.cssText.split('}');for(var k=0;k<set1.length;k++){var t=trim(set1[k]);if(t=='')
continue;var set2=t.split('{');var selector=trim(set2[0]);if($.inArray(selector.toLowerCase(),exceptions)>-1)
continue;var props=trim(set2[1]);if(props.length==0)
continue;var newCssStr=this.toggleStyle(props);set2[1]=newCssStr;set1[k]=set2.join('{\n');}
stylesheet.cssText=set1.join('}\n');return;}
var css=this.getCssRules(file);if(!css)
return this;var clen=css.length;for(var i=0;i<clen;i++){if(!css[i].style)
continue;var style=css[i].style;var selector=css[i].selectorText;if($.inArray(selector.toLowerCase(),exceptions)>-1)
continue;var cssStr=css[i].style.cssText;var newCssStr=this.toggleStyle(cssStr);if(jQuery.browser.safari){newCssStr=newCssStr.replace(/:\s/g,':')}
css[i].style.cssText=newCssStr;}},toggleStyle:function(str){var csss=str.split(';');var propStr='';var len=csss.length;for(var j=0;j<len;j++){if(trim(csss[j]).length==0)
continue;var s=trim(csss[j]).split(/\s*:\s*/);switch(trim(s[0]).toLowerCase()){case'float':if(trim(s[1]).toLowerCase()=='left'){s[1]='right';}
else if(trim(s[1]).toLowerCase()=='right'){s[1]='left';}
break;case'margin':var t=trim(s[1]).split(/\s+/);if(t.length==4){var r=t[1];var l=t[3];t[1]=l;t[3]=r;}
s[1]=t.join(' ');break;case'margin-left':s[0]='margin-right';break;case'margin-right':s[0]='margin-left';break;case'padding':var t=trim(s[1]).split(/\s+/);if(t.length==4){var r=t[1];var l=t[3];t[1]=l;t[3]=r;}
s[1]=t.join(' ');break;case'padding-left':s[0]='padding-right';break;case'padding-right':s[0]='padding-left';break;case'text-align':if(trim(s[1]).toLowerCase()=='left'){s[1]='right';}
else if(trim(s[1]).toLowerCase()=='right'){s[1]='left';}
break;case'left':s[0]='right';break;case'right':s[0]='left';break;case'border-left':s[0]='border-right';break;case'border-right':s[0]='border-left';break;case'background':var t=trim(s[0]).split(/\s+/);if(trim(s[1]).indexOf('icon-close-popup.png')!=-1){s[1]=StyleManager.getStyle('helpWindowHeader_close_ar','background');}
if(trim(s[1]).indexOf('icon-help-popup.png')!=-1){s[1]=StyleManager.getStyle('helpWindowHeader_help_ar','background');}
break;case'border-left-width':s[0]='border-right-width';break;case'border-right-width':s[0]='border-left-width';break;case'border-left-style':s[0]='border-right-style';break;case'border-right-style':s[0]='border-left-style';break;case'border-left-color':s[0]='border-right-color';break;case'border-right-color':s[0]='border-left-color';break;case'background-position':if(jQuery.inArray(' background-image: url('+window.document.location.protocol+'//'+window.document.location.host+'/css/images/icon-close-popup.png)',csss)!=-1)
s[1]='left center';else if(jQuery.inArray(' background-image: url('+window.document.location.protocol+'//'+window.document.location.host+'/css/images/icon-help-popup.png)',csss)!=-1)
s[1]='right center';break;default:break;}
propStr+=s.join(': ')+';\n';}
return propStr;}};function camelize(val){return val.replace(/-(.)/g,function(m,l){return l.toUpperCase()});};function trim(val){var val=val.replace(/^\s+/,'');return val.replace(/\s+$/,'');};function escapeHTML(val){if(val==null||typeof val=='undefined'){return null;}
var val=val.replace(/&(?!amp;)/g,'&amp;');val=val.replace(/</,'&lt;');return val.replace(/>/,'&gt;');}
function UnEscapeHTML(val){var label=unescape(decodeURIComponent(val));if(label==null||typeof(label)=="undefined"||label=="undefined"){label="";}
return label;}
function redrawObject(obj){if(obj){$(obj).css('display','none');$(obj).css('display','block');}}
var FontResizeDetector={checkDiv:'<div id="checkdiv" style="left:1%;line-height:1;font-family:monospace;width:0px;position:absolute;">&nbsp;</div>',stop:false,initialize:function(){if(CommonContext.locale.substr(0,2)=="ar"){FontResizeDetector.checkDiv='<div id="checkdiv" style="right:1%;line-height:1;font-family:monospace;position:absolute;">&nbsp;</div>';}
$("body").prepend(FontResizeDetector.checkDiv);FontResizeDetector.fontCheck(FontResizeDetector.receivechange);},fontCheck:function(resultHandler){var checkdiv=document.getElementById("checkdiv");var height=checkdiv.offsetHeight;var width=checkdiv.offsetWidth;var left=checkdiv.offsetLeft;var right=checkdiv.offsetRight;repeat();function repeat(){if(checkdiv.offsetHeight!=height||checkdiv.offsetLeft!=left||checkdiv.offsetWidth!=width){height=checkdiv.offsetHeight;width=checkdiv.offsetWidth;left=checkdiv.offsetLeft;right=checkdiv.offsetRight;resultHandler();}
if(!FontResizeDetector.stop)
setTimeout(repeat,500);}},receivechange:function(){if(pageDepth>3||pageDepth==0){IE6Patch.apply();}else{window.location.reload();}}}
function extractText(label){if(label==null||typeof(label)=="undefined"||label=="undefined")
return"";$temp=$("<div>");$temp.append(label);return $temp.text();};