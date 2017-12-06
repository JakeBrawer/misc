
var Context={isLocal:false,standalone:false,helpURL:null,extHelpURL:null,logoutURL:null,loginURL:'twbkwbis.P_WWWLogin',homeURL:'twbkwbis.P_GenMenu?name=homepage',disableHome:null,unauthenticatedHomeProc:['unauthenticated_home.html','homepage'],loginProc:['login.html','twbkwbis.P_WWWLogin'],alertMsgs:['A break in attempt has been detected','web session timeout','Authorization Failure - Invalid User ID or PIN'],logoutProc:['logout.html','twbkwbis.P_Logout'],webProspectMainProc:['web_prospect_main.html','bwskwpro.P_WebProspectMain'],level1Page:"home.html",level2Page:"level2.html",level3Page:"level3.html",level4Page:"level4.html",WTAdminPage:"wtadmin.html",siteMapPage:"sitemap.html",level2URL:"xml/cascade.student.xml",level3URL:"xml/cascade.registration.xml",searchURL:"xml/cascade.search.personal.xml",sslTrustStorePassword:"",sslTrustStoreType:"",sslTrustStore:"",locale_settings:"EN",locale_lang:"en_US",helpWinHeight:"500",helpWinWidth:"450"};function errorHandler(XMLHttpRequest,textStatus,errorThrown){Blocker.unblock();var msg="";msg+="readyState:"+XMLHttpRequest.readyState+"\n";msg+="responseBody:"+XMLHttpRequest.responseBody+"\n";msg+="responseText:"+XMLHttpRequest.responseText+"\n";msg+="responseXML:"+XMLHttpRequest.responseXML+"\n";msg+="status:"+XMLHttpRequest.status+"\n";msg+="statusText:"+XMLHttpRequest.statusText+"\n";msg+="timeout:"+XMLHttpRequest.timeout+"\n";msg+="\n";msg+="textStatus:"+textStatus+"\n";msg+="errorThrown:"+errorThrown;}
var Application={appDetails:[],initialize:function(){Application.appDetails=Application.getURL().split("//");},getURL:function(){return window.location.href;},getProtocol:function(){return Application.appDetails[0];},getHost:function(){var end_at=Application.appDetails[1].indexOf('/');return Application.appDetails[1].substring(0,end_at);},getApplicationPath:function(){var end_at=Application.appDetails[1].indexOf('/');var app=Application.appDetails[1].substring(end_at+1,Application.appDetails[1].lastIndexOf('/'));var protocol=Application.getProtocol();var host=Application.getHost();return protocol+"//"+host+"/"+app;},getDadName:function(){var end_at=Application.appDetails[1].indexOf('/');var app=Application.appDetails[1].substring(end_at+1,Application.appDetails[1].lastIndexOf('/'));return app;},getProc:function(){var procDetails=Application.appDetails[1].split('?');if(procDetails[1]){var paramObj=deparam(procDetails[1],true);if(paramObj.name){return paramObj.name;}}
var start_at=procDetails[0].lastIndexOf('/');return procDetails[0].split('#')[0].substring(start_at+1);},isUserAuthenticated:function(){var username=CommonContext.user;if(username){return true;}else{return false;}},navigateToURL:function(url){if(!jQuery.browser.msie){document.location=url;return;}
var a=document.createElement("a");a.setAttribute("href",url);a.style.display="none";$("body").append(a);a.click();}};var UIDGenerator={token:0,identifier:'___UID',dotSeperator:'--',getUIDFromURL:function(url){if(url.indexOf('javascript')!=-1){return'javascript'+this.uniqueID();}
return url.replace('.',this.dotSeperator)+this.uniqueID();},getURLFromUID:function(uid){return uid.substring(0,uid.indexOf(this.identifier)).replace(this.dotSeperator,'.');},uniqueID:function(){return this.identifier+this.token++;}}
function checkAlertMessages(){var alertInd=false;if($('.pagebodydiv').children().hasClass('.plaintable')){var alertMsg=$('.pagebodydiv').find('.plaintable td:eq(1)').html();if(alertMsg!=null){$.each(Context.alertMsgs,function(intIndex,objValue){if(alertMsg.toLowerCase().indexOf(objValue.toLowerCase())>=0){alertInd=true;}});}}
return alertInd;}
function findIEVersion(){var version="NA";var userAgent=navigator.userAgent;if((/msie/i.test(userAgent)||/rv/i.test(userAgent))&&(!window.opera)){version=parseInt((userAgent.match(/.+ie\s([\d.]+)/i)||[])[1]);if(document.documentMode){if(/.+Trident\/([\d.]+)/i.test(userAgent)){var tridenVersion=parseFloat((userAgent.match(/.+Trident\/([\d.]+)/i)||[])[1]);if(tridenVersion==4){version=8;}
if(tridenVersion==5){version=9}
if(tridenVersion==6){version=10}
if(tridenVersion==7){version=11}}}}
return version;}
function beforeSubmit(e){if(jQuery.browser.msie){if(parseInt(jQuery.browser.version)<=6){for(j=0;j<e.form.elements.length;j++)
if(e.form.elements[j].tagName=='BUTTON')
e.form.elements[j].disabled=true;var hiddenField=$('<INPUT TYPE="hidden" NAME="'+e.name+'" VALUE="'+e.attributes['value'].value+'">');if(e.type=='submit'){$(e).before(hiddenField);e.disabled=true;}}else if(findIEVersion()<9){var hiddenField=$('<INPUT TYPE="hidden" NAME="'+e.name+'" VALUE="'+e.attributes['value'].value+'">');if(e.type=='submit'){$(e).before(hiddenField);e.disabled=true;}}else{if(e.name!=undefined&&e.name!=''){if(e.type=='submit'){var hiddenField=$('<INPUT TYPE="hidden" NAME="'+e.name+'" VALUE="'+e.attributes['value'].value+'">');$(e).before(hiddenField);e.disabled=true;}}}}else if(jQuery.browser.safari){var hiddenField=$('<INPUT TYPE="hidden" NAME="'+e.name+'" VALUE="'+e.attributes['value'].value+'">');if(e.type=='submit'){$(e).before(hiddenField);e.disabled=true;}}}
function enableButtonsInForm(f){function _enableBtns(f){if(f.get){f=f.get(0);}
if(f.form){for(j=0;j<f.form.elements.length;j++)
if(f.form.elements[j].tagName=='BUTTON')
f.form.elements[j].disabled=false;}else{if(f.tagName=='BUTTON'){f.disabled=false;}}}
setTimeout(function(){_enableBtns(f);},1000);}
function HTMLButton(options){var target=this;var id=options.id;var name=options.name;var value=escapeHTML(options.value);var url=options.url;var type=options.type;var callback=options.callback;var selected=options.selected;var inputType=options.inputType;var disabled=options.disabled;value=value.replace(/'/g,"&#39;");if(typeof(value)=="undefined"){value="";}
if(typeof(url)=="undefined"){url="";}
if(typeof(type)=="undefined"){type="blank";}
if(typeof(selected)=="undefined"){selected=false;}
if(typeof(inputType)=="undefined"){inputType="button";}
if(typeof(disabled)=="undefined"){disabled=false;}
var buttonString;if(typeof(name)=="undefined"||name==""||name==null){buttonString="<button id='id_"+id+"' type='"+inputType+"' value='"+value+"' onclick='beforeSubmit(this)'"+"' class='htmlButton"+''+"' url='"+url+"'>"}else{buttonString="<button id='id_"+id+"' type='"+inputType+"' name='"+name+"' value='"+value+"' onclick='beforeSubmit(this)'"+"' class='htmlButton"+''+"' url='"+url+"'>"}
var b=$(buttonString
+"<div class='"+type+"'>"
+"<div>"
+"<div>"+value+"</div>"
+"</div>"
+"</div>"
+"</button>");if(disabled){var elem=b.find('.'+type);elem.css('color','#000000');b.css('cursor','default');b.attr('disabled','disabled');}
b.mouseover(function(){if(type=='defaultButton'){$(this).children().css("background-position","0px -108px");$(this).children().children().css("background-position","right -81px");$(this).children().children().children().css("background-position","0px -135px");}else{$(this).children().css("background-position","left -44px");$(this).children().children().css("background-position","right -44px");$(this).children().children().children().css("background-position","0px -66px");}}).mouseout(function(){if(type=='defaultButton'){$(this).children().css("background-position","0px -27px");$(this).children().children().css("background-position","right 0px");$(this).children().children().children().css("background-position","0px -54px");}else{$(this).children().css("background-position","left 0px");$(this).children().children().css("background-position","right 0px");$(this).children().children().children().css("background-position","0px -22px");}});b.click(function(){if(typeof(callback)=="function"){callback({id:id,value:value,url:url,type:type,selected:selected,target:target});}});return b;}
function NavigationButton(options){var target=this;var id=options.id;var name=options.name;var value=escapeHTML(options.value);var label=escapeHTML(options.label);var url=options.url;var type=options.type;var callback=options.callback;var selected=options.selected;var inputType=options.inputType;var disabled=options.disabled;if(typeof(value)=="undefined"){value=label;}
if(typeof(url)=="undefined"){url="";}
if(typeof(type)=="undefined"){type="blank";}
if(typeof(selected)=="undefined"){selected=false;}
if(typeof(inputType)=="undefined"){inputType="button";}
if(typeof(disabled)=="undefined"){disabled=false;}
var buttonString;if(typeof(name)=="undefined"||name==""||name==null){buttonString="<button id='"+id+"' type='"+inputType+"' value='"+value
+"' class='htmlButton "+type+'baseButton'+"' url='"+url+"'>"}else{buttonString="<button id='"+id+"' type='"+inputType+"' name='"+name+"' value='"+value
+"' class='htmlButton "+type+'baseButton'+"' url='"+url+"'>"}
var b=$(buttonString
+"<div class='menu'>"
+"<div><span>"+label+"</span></div>"
+"</div>"
+"</button>");function select(){highlight(true);selected=true;EventDispatcher.dispatchEvent('highlight',{id:id,label:label,url:url,type:type,selected:selected,target:target});}
function highlight(flag){if(flag){b.find('.'+type).css("background-position","0px -50px");if(/chrome/.test(navigator.userAgent.toLowerCase())||/safari/.test(navigator.userAgent.toLowerCase()))
b.find('.'+type).css("margin","1px 11px 5px 5px");if(jQuery.browser.msie&&jQuery.browser.version==8)
$("#navigationcontrol").css("margin-top","-30px");b.find('.'+type).children("div").css("background-position","right -50px");b.find('.'+type).children("div").children("span").css("background-position","right -164px");}else{b.find('.'+type).css("background-position","0px 0px");if(/chrome/.test(navigator.userAgent.toLowerCase())||/safari/.test(navigator.userAgent.toLowerCase()))
b.find('.'+type).css("margin","1px 11px 5px 5px");if(jQuery.browser.msie&&jQuery.browser.version==8)
$("#navigationcontrol").css("margin-top","-30px");b.find('.'+type).children("div").css("background-position","right 0px");b.find('.'+type).children("div").children("span").css("background-position","0px -103px");}}
b.mouseover(function(){highlight(true)}).mouseout(function(){if(selected){return;}
highlight(false);}).click(function(){if(typeof(callback)=="function"){callback({id:id,label:label,url:url,type:type,selected:selected,target:target});}
select();}).select=select;if(selected){highlight(true);}
EventDispatcher.addEventListener('highlight',function(data){if(label!=data.label){highlight(false);selected=false;}});return b;}
function NavigationSmallButton(options){var target=this;var id=options.id;var name=options.name;var value=escapeHTML(options.value);var label=escapeHTML(options.label);var url=options.url;var type=options.type;var callback=options.callback;var selected=options.selected;var inputType=options.inputType;var disabled=options.disabled;if(typeof(value)=="undefined"){value=label;}
if(typeof(url)=="undefined"){url="";}
if(typeof(type)=="undefined"){type="blank";}
if(typeof(selected)=="undefined"){selected=false;}
if(typeof(inputType)=="undefined"){inputType="button";}
if(typeof(disabled)=="undefined"){disabled=false;}
var buttonString;if(typeof(name)=="undefined"||name==""||name==null){buttonString="<button id='"+id+"' type='"+inputType+"' value='"+value
+"' class='htmlButton "+type+'BaseButton'+"' url='"+url+"'>"}else{buttonString="<button id='"+id+"' type='"+inputType+"' name='"+name+"' value='"+value
+"' class='htmlButton "+type+'BaseButton'+"' url='"+url+"'>"}
var b=$(buttonString
+"<div class='"+type+"'>"
+"<div><div>"+label+"</div></div>"
+"</div>"
+"</button>");function select(){b.find('.'+type).addClass(type+'Highlight');selected=true;EventDispatcher.dispatchEvent(type+'Highlight',{id:id,label:label,url:url,type:type,selected:selected,target:target});}
b.mouseover(function(){$(this).find('.'+type).addClass(type+"Over");}).mouseout(function(){$(this).find('.'+type).removeClass(type+"Over");}).click(function(){if(typeof(callback)=="function"){callback({id:id,label:label,url:url,type:type,selected:selected,target:target});}
select();}).select=select;if(selected){b.find('.'+type).addClass(type+'Highlight');}
EventDispatcher.addEventListener(type+'Highlight',function(data){if(label!=data.label){b.find('.'+type).removeClass(type+'Highlight');selected=false;}});return b;}
function Link(options){var target=this;var id=options.id;var label=escapeHTML(options.label);var url=options.url;var styleName=options.styleName;var callback=options.callback;var selected=options.selected;var enabled=options.enabled;if(typeof(url)=="undefined"){url="";}
if(typeof(selected)=="undefined"){selected=false;}
if(typeof(enabled)=="undefined"){enabled=true;}
if(typeof(styleName)=="undefined"){styleName="";}
var b=$(""
+"<a href='javascript:void(0)' class='"+styleName+"'>"
+label
+"</a>");if(!enabled){b.css('cursor','default');}
function select(){b.find('.'+styleName).addClass(styleName+'Highlight');selected=true;EventDispatcher.dispatchEvent(styleName+'Highlight',{id:id,label:label,url:url,styleName:styleName,selected:selected,enabled:enabled,target:target});}
b.hover(function(){}).mouseleave(function(){}).click(function(){if(enabled){if(typeof(callback)=="function"){callback({id:id,label:label,url:url,styleName:styleName,selected:selected,enabled:enabled,target:target});}
select();}
return false;}).select=select;if(selected){b.addClass(styleName+'Highlight');}
EventDispatcher.addEventListener(styleName+'Highlight',function(data){if(label!=data.label){b.removeClass(styleName+'Highlight');selected=false;}});return b;};function level2Button(options){var target=this;var id=options.id;var label=options.label;var description=options.description;var url=options.url;var styleName=options.styleName;var callback=options.callback;var selected=options.selected;var enabled=options.enabled;var hasChildren=options.hasChildren;if(typeof(url)=="undefined"){url="";}
if(typeof(description)=="undefined"){description="";}
if(typeof(selected)=="undefined"){selected=false;}
if(typeof(enabled)=="undefined"){enabled=true;}
if(typeof(styleName)=="undefined"){styleName="";}
if(typeof(hasChildren)=="undefined"){hasChildren=false;}
var b=$("<div id='"+id+"' class='"+styleName+"'>"
+"<h3>"
+label
+"</h3>"
+((description!="")?"<p>"+description+"</p>":"")
+"</div>");if(!hasChildren){b.find('h3').css('background','none');}
function select(){b.addClass("selected");selected=true;EventDispatcher.dispatchEvent('level2ButtonSelected',{id:id,label:label,description:description,url:url,selected:selected,target:target});}
if(!enabled){b.css('cursor','default');}
if(selected){b.addClass("selected");}
b.mouseenter(function(){$(this).addClass("hover");});b.mouseleave(function(){$(this).removeClass("hover");});b.click(function(){if(enabled){if(!selected){select();}
else
{b.removeClass("selected");selected=false;}
if(typeof(callback)=="function"){callback({id:id,label:label,description:description,url:url,styleName:styleName,selected:selected,enabled:enabled,target:target});}}});b.select=select;b.id=id;EventDispatcher.addEventListener('level2ButtonSelected',function(data){if(label!=data.label){b.removeClass("selected");selected=false;b.blur();}});return b;};function subMenuRightButton(options){var target=this;var id=options.id;var label=options.label;var description=options.description;var url=options.url;var styleName=options.styleName;var callback=options.callback;var selected=options.selected;var enabled=options.enabled;var showDesc=options.showDesc;if(typeof(url)=="undefined"){url="";}
if(typeof(description)=="undefined"){description="";}
if(typeof(selected)=="undefined"){selected=false;}
if(typeof(enabled)=="undefined"){enabled=true;}
if(typeof(styleName)=="undefined"){styleName="";}
if(typeof(showDesc)=="undefined"){showDesc=true;}
var b=$("<a id='"+id+"' title='"+description+"' href='javascript:void(0)'>"
+"<h3>"
+label
+"</h3>"
+((showDesc&&description!="")?"<p>"+description+"</p>":"")
+"</a>");if(!enabled){b.css('cursor','default');}
b.click(function(){if(enabled){if(typeof(callback)=="function"){callback({id:id,label:label,description:description,url:url,styleName:styleName,selected:selected,enabled:enabled,target:target});}}
return false;});return b;};function contentHolder(){if(typeof(_contentHolder)=="undefined"){_contentHolder=$("<div id='contentHolder'>"
+"<div id='contentBelt'>"
+"</div>"
+"</div>");}
return _contentHolder;}
function LoginWindow(){return out=$('<div id="loginPanel">'+'<div id="topCap"></div>'
+'<div id="middle">'+'<h1 class="loginHeading">Sign In</h1>'
+'<span id="loginmessage"></span>'+'<ol>'+'<li>'
+'<label for="txtUID">User ID</label>'
+'<input id="txtUID" type="text" />'+'</li>'+'<li>'
+'<label for="txtPIN">PIN</label>'
+'<input id="txtPIN" type="text" />'+'</li>'+'</ol>'
+'<div class="buttonRow">'+'<div class="defaultButton2">'
+'<div>'+'<div>Sign In</div>'+'</div>'+'</div>'
+'<div class="defaultButton2">'+'<div>'
+'<div>Forgot PIN?</div>'+'</div>'+'</div>'+'</div>'
+'</div>'+'<div id="bottomCap"></div>'+'</div>');};function generateFourthLevel(content,type,pageReferrerId,container){if($.inArray(Application.getProc(),CascadeDowngrade.exceptions)==-1){$('#content').addClass('level4');$('#pagebody').addClass('level4');contentHolder().find('#contentBelt').remove();var tabContent=$('body').find('.pagebodydiv table table td[class^="tab"]');if(tabContent.length>0){InnerTabs.initialize(tabContent,$('#pagebody'));$('body').find('.pagebodydiv table table td[class^="tab"]').parent().remove();}
$('body').find('.menuplaintable').removeClass('menuplaintable');contentHolder().append($('body').find('.pagebodydiv:first').contents());var staticHeadersContent=$('body').find('.staticheaders').html();if(staticHeadersContent)
$('#pageheader').append("<div class='staticheaders'>"+staticHeadersContent+"</div>");$('.bgtabon').removeClass();$('body').find('.infotext').find('p').prepend('<br>');$('body').find('.bordertable').after('<br>');var pagefooterlinks=contentHolder().find('.pagefooterlinks');pagefooterlinks.each(function(e,element){var links=$(element).find('a[class!="skiplinks"]');if(links.length>0){ExtraLinks.initialize(links,$(element).parent());}
$(element).remove();});var links=$('body').find('.pagefooterlinks a[class!="skiplinks"]');if(links.length>0){ExtraLinks.initialize(links,contentHolder());links.parent().remove();}
contentHolder().find('th[class="ddlabel"][scope="row"]').css({'background':'none','color':'#000'});}}
function generateThirdLevel(content,type,pageReferrerId,container){pageDepth=3;var btn=null;PageRenderer.selectButton(pageReferrerId);btn=PageRenderer.getSelectedButton()
if(typeof(type)=="undefined"){type='html';}
if(typeof(container)=="undefined"){container=contentHolder();}
var rowId=btn==null?1:btn.data('rowId');var level3Container=container.find('.row'+rowId);if(btn){level3Container.addClass(btn.id);}
var h=level3Container.height();level3Container.empty();function callback(data){if(Context.standalone){Application.navigateToURL(Context.level4Page);return;}
if(data.url.indexOf('mailto')!=-1||data.url.indexOf('http')!=-1){Application.navigateToURL(data.url);return;}else if(data.url.indexOf('javascript')!=-1){if(window.execScript){window.execScript(data.url);}else{eval(data.url);}
return;}else{Application.navigateToURL(Application.getApplicationPath()+"/"+data.url);return;}}
level3Container.append("<ul class='items'/>");var panelHeight=0;if(type=='html'){content.each(function(e,element){var node=$(element).find('td:eq(1)');var label=node.find('a').html();var url=node.find('a').attr('href');if(url.indexOf('http')==-1){url=url.substring(url.lastIndexOf('/')+1,url.length);}
var desc=node.find('.menulinkdesctext').html();var item=new subMenuRightButton({id:'contentItem'+rowId+e,label:label,description:desc,url:url,styleName:'',showDesc:false,callback:callback});var li=$("<li></li>");li.append(item);level3Container.find('ul').append(li);var e=li;var itemHeight=e.height();var marginTop=e.css('margin-top')=='auto'?0:parseInt(e.css('margin-top'),10);var marginBottom=e.css('margin-bottom')=='auto'?0:parseInt(e.css('margin-bottom'),10);var paddingTop=e.css('padding-top')=='auto'?0:parseInt(e.css('padding-top'),10);var paddingBottom=e.css('padding-bottom')=='auto'?0:parseInt(e.css('padding-bottom'),10);panelHeight+=itemHeight+marginTop+marginBottom+paddingTop
+paddingBottom;});}else if(type=='xml'){$(content).find('levelEntries navigationEntryValueObject').each(function(e,element){var label="";var bulletImageDetails=$(element).attr('bulletImageDetails')
if(bulletImageDetails!=undefined&&bulletImageDetails!=''){var imageDetails=bulletImageDetails.split("-;-");var bulletImageTag="<IMG SRC="+imageDetails[0]
+" ALIGN='"+imageDetails[1]+"'"
+" ALT='"+imageDetails[2]+"'"
+" class='headerImg'"
+" TITLE='"+imageDetails[3]+"'"
+" NAME='"+imageDetails[4]+"'"
+" HSPACE=0 VSPACE=0 BORDER=0 "
+" WIDTH="+imageDetails[5]
+" HEIGHT="+imageDetails[6]+"/>";label+=bulletImageTag+"<br/>";}else{var globalImageDetails=$(element).attr('globalImageDetails')
if(globalImageDetails!=undefined&&globalImageDetails!=''){var imageDetails=globalImageDetails.split("-;-");var bulletImageTag="<IMG SRC="+imageDetails[0]
+" ALIGN='"+imageDetails[1]+"'"
+" ALT='"+imageDetails[2]+"'"
+" class='headerImg'"
+" TITLE='"+imageDetails[3]+"'"
+" NAME='"+imageDetails[4]+"'"
+" HSPACE=0 VSPACE=0 BORDER=0 "
+" WIDTH="+imageDetails[5]
+" HEIGHT="+imageDetails[6]+"/>";label+=bulletImageTag+"<br/>";}}
var linkImagDetails=$(element).attr('linkImageDetails')
if(linkImagDetails!=undefined&&linkImagDetails!=''){var imageDetails=linkImagDetails.split("-;-");var linkImageTag="<IMG SRC="+imageDetails[0]
+" ALIGN='"+imageDetails[1]+"'"
+" ALT='"+imageDetails[2]+"'"
+" class='headerImg'"
+" TITLE='"+imageDetails[3]+"'"
+" NAME='"+imageDetails[4]+"'"
+" HSPACE=0 VSPACE=0 BORDER=0 "
+" WIDTH="+imageDetails[5]
+" HEIGHT="+imageDetails[6]+"/>";label+=linkImageTag+"<br/>";}
label+=UnEscapeHTML($(element).attr('menu'));var url=UnEscapeHTML($(element).attr('path'));url=url.replace(/&amp;/gi,'&');var options=$(element).attr('options');if(typeof(options)!='undefined'&&options!=''){options=options.replace('&amp;','&');if(url.indexOf("?")!=-1){url=url+"&"+options;}else{url=url+"?"+options;}}
var desc=UnEscapeHTML($(element).attr('description'));var item=new subMenuRightButton({id:'contentItem'+rowId+e,label:label,description:desc,url:url,styleName:'',showDesc:false,callback:callback});var li=$("<li></li>");li.append(item);level3Container.find('ul').append(li);var e=li;var itemHeight=e.height();var marginTop=e.css('margin-top')=='auto'?0:parseInt(e.css('margin-top'),10);var marginBottom=e.css('margin-bottom')=='auto'?0:parseInt(e.css('margin-bottom'),10);var paddingTop=e.css('padding-top')=='auto'?0:parseInt(e.css('padding-top'),10);var paddingBottom=e.css('padding-bottom')=='auto'?0:parseInt(e.css('padding-bottom'),10);panelHeight+=itemHeight+marginTop+marginBottom
+paddingTop+paddingBottom;});var helpURL=UnEscapeHTML($(content).find('extra').attr('url'));if(helpURL){$('.helpText').css('display','block');if(helpURL.split(" ").length>0){if(helpURL.indexOf('/')===0){helpURL=helpURL.substring(1);}
else{helpURL=Application.getDadName()+"/twbkfrmt.P_DispHelp?pagename_in="+UIDGenerator.getURLFromUID(pageReferrerId);}
Context.helpURL=Application.getProtocol()+"//"+Application.getHost()+"/"+helpURL;Context.extHelpURL='FALSE';}else{Context.helpURL=helpURL;Context.extHelpURL='TRUE';}}else{$('.helpText').css('display','none');}
var rel=$(content).find('extra').attr('release');FooterText.reset(rel);Crumb.generateCrumb(content,pageReferrerId,pageDepth);var infoText=$(content).find('extra').attr('infoText');infoText=UnEscapeHTML(infoText);var imageName=$(content).find('extra').attr('imageName');var imageUrl=$(content).find('extra').attr('imageUrl');var imageAlt=$(content).find('extra').attr('imageAlt');var imageHeight=$(content).find('extra').attr('imageHeight');var imageWidth=$(content).find('extra').attr('imageWidth');var imageTag;if(imageName!=null){imageTag='<IMG SRC="'+imageUrl+'" ALT="'+imageAlt+'" TITLE="'+imageAlt+'" NAME= "'+imageName+'" HEIGHT="'+imageHeight+'" WIDTH="'+imageWidth+'" /> ';}
if(imageTag!=undefined){infoText=imageTag+infoText;}
container.find('#contentBelt').append('<SPAN class="serviceInfotext">'+infoText+'</SPAN>');ConfirmationMessage.show($('#contentBelt'));document.title=$('#'+pageReferrerId+' h3').text();}
level3Container.css({height:'auto',display:'block'});var maxHeight=0;level3Container.find('li').each(function(i,e){var id=$(this).find('a').attr('id');var itemHeight=document.getElementById(id).offsetHeight;if(itemHeight>maxHeight){maxHeight=itemHeight;}});if(maxHeight>0)
level3Container.find('li').css('height',maxHeight)
var newH=level3Container.height()+parseInt(level3Container.css('margin-top'))+parseInt(level3Container.css('margin-bottom'));if(h==0){level3Container.css({display:'none'});level3Container.slideDown();}else{level3Container.css({height:h});level3Container.animate({'height':newH},'normal');}};function searchField(searchURL){var out=$("<div id='searchField'>"
+"<span class='findicon'/>"
+"<input class='searchInput' type='text' value=''/>"
+"<span class='closeicon'/>"
+"</div>");var dataType=null;if(Context.disableHome!=true){function genURL(){keyword=out.find("input").attr('value');searchString=keyword+"/"+sessionToken+"?dadName="+Application.getDadName()+"&locale="+Context.locale_settings;searchURL=DEFAULT_SEARCH_URL+searchString;out.find("input").setOptions({url:searchURL});return 0;}
function parse(data){if(dataType=='json'){data=stringToDoc($.json2xml(data).replace(/\+/g,'%20'));}
var parsed=[];$(data).find('navigationEntryValueObject').each(function(e,element){parsed[parsed.length]={data:[Url.decode($(this).attr('name'))],value:Url.decode($(this).attr('path')),result:[]};});return parsed;}
out.find("input").focus(function(){if(this.value==ResourceManager.getString("find_a_page")){this.value="";}
$("#searchField").css("background-position","left -33px");});out.find("input").blur(function(){$("#searchField").css("background-position","left top");if(this.value==""){this.value=ResourceManager.getString("find_a_page");out.find(".closeicon").removeClass('enabled');$("#searchField span.closeicon").css("visibility","hidden");}});out.find("input").keyup(function(){if($(this).attr('value')!=''){$("#searchField span.closeicon").css("visibility","visible");out.find(".closeicon").addClass('enabled');}else{$("#searchField span.closeicon").css("visibility","hidden");out.find(".closeicon").removeClass('enabled');}});out.find(".closeicon").click(function(){if(out.find(".closeicon").hasClass('enabled')){out.find("input").attr('value','');out.find(".closeicon").removeClass('enabled');out.find("input").focus();out.find("input").hideResults();}});out.find("input").result(function(event,data,formatted){if(Context.standalone){Application.navigateToURL(Context.level4Page);}else{Application.navigateToURL(formatted);}});if(Context.standalone){dataType='xml';out.find("input").autocomplete(Context.searchURL,{max:1000,selectFirst:false,parse:parse,dataType:dataType,minChars:SearchConstants.searchStartLength,highlight:false}).css('width','500px');}
else
{out.find("input").attr('value',ResourceManager.getString("find_a_page"));var DEFAULT_SEARCH_URL=Bannerservice.url+Bannerservice.endpoints[1];var keyword="";var searchString=keyword+"/"+sessionToken+"?dadName="+Application.getDadName()+"&locale="+Context.locale_settings;if(searchURL==null){searchURL=DEFAULT_SEARCH_URL+searchString;}
dataType='json';out.find("input").autocomplete(searchURL,{max:1000,selectFirst:false,parse:parse,extraParams:{id:genURL},dataType:dataType,minChars:SearchConstants.searchStartLength});}
EventDispatcher.addEventListener(Localization.events.localeChange,function(){out.find("input").attr('value',ResourceManager.getString("find_a_page"));});}
return out;}
function generateSecondLevel(content,type,pageReferrerId,container,isHome){if(typeof(isHome)=='undefined'){isHome=false;}
pageDepth=2;PageRenderer.subMenuButtons=[];MenuNavigation.selectButton(pageReferrerId);if(typeof(type)=="undefined"){type='html';}
if(typeof(container)=="undefined"||container==null){container=contentHolder();}
$('.descriptionText').remove();container.find('#contentBelt').empty();$('#contentBelt').css('left',0);$('#contentBelt').addClass('menucontent');function callback(data){if(Context.standalone){$.get(Context.level3URL,"",function(data){generateThirdLevel(data,'xml',container,"Registration");},'xml');return;}
var btn=PageRenderer.getButton(data.id);var rowId=btn.data('rowId');if(!btn.hasClass("selected")){PageRenderer.closeLevel3Container(contentHolder().find('.row'+rowId));}
else
{if(data.url.indexOf('mailto')!=-1||data.url.indexOf('http')!=-1){Application.navigateToURL(data.url);return;}else if(data.url.indexOf('javascript')!=-1){if(window.execScript){window.execScript(data.url);}else{eval(data.url);}
return;}else if(data.url.indexOf('P_GenMenu')==-1||isHome){Application.navigateToURL(Application.getApplicationPath()+"/"+data.url);return;}
var pageName=data.id;var parameters="false";var params={pageName:pageName,pageReferrerId:pageReferrerId,pageDepth:3,options:parameters};HistoryManager.set(params);}}
var maxHeight=0;if(type=='html'){content.each(function(e,element){var node=$(element);var label="";$.each(node.find('a'),function(index,aTag){label+=$(aTag).html();});var url=node.find('a').attr('href');if(url.indexOf('http')==-1){url=url.substring(url.lastIndexOf('/')+1,url.length);}
var id;if(url.indexOf('name=')!=-1){id=UIDGenerator.getUIDFromURL(url.split('name=')[1]);}else{id=UIDGenerator.getUIDFromURL(url);}
var desc=node.find('.menulinkdesctext').html();if(desc==null||typeof(desc)=='undefined'){desc='';}
var selected=false;if(node.hasClass('menulinkSelected')){selected=true;}
var hasChildren=true;if(url.indexOf('P_GenMenu')==-1){hasChildren=false;}
var item=new level2Button({id:id,label:label,description:desc,url:url,selected:selected,styleName:'htmlButtonLevel2-3',hasChildren:hasChildren,callback:callback});PageRenderer.subMenuButtons.push(item);container.find('#contentBelt').append(item);if(document.getElementById(id).offsetHeight>maxHeight)
maxHeight=document.getElementById(id).offsetHeight;});ConfirmationMessage.show($('#contentBelt'));}else if(type=='xml'){$(content).find('navigationEntryValueObject').each(function(e,element){var label="";var bulletImageDetails=$(element).attr('bulletImageDetails');if(bulletImageDetails!=undefined&&bulletImageDetails!=''){var imageDetails=bulletImageDetails.split("-;-");var bulletImageTag="<IMG SRC="+imageDetails[0]
+" ALIGN='"+imageDetails[1]+"'"
+" ALT='"+imageDetails[2]+"'"
+" class='headerImg'"
+" TITLE='"+imageDetails[3]+"'"
+" NAME='"+imageDetails[4]+"'"
+" HSPACE=0 VSPACE=0 BORDER=0 "
+" WIDTH="+imageDetails[5]
+" HEIGHT="+imageDetails[6]+"/>";label+=bulletImageTag+"<br/>";}else{var globalImageDetails=$(element).attr('globalImageDetails')
if(globalImageDetails!=undefined&&globalImageDetails!=''){var imageDetails=globalImageDetails.split("-;-");var bulletImageTag="<IMG SRC="+imageDetails[0]
+" ALIGN='"+imageDetails[1]+"'"
+" ALT='"+imageDetails[2]+"'"
+" class='headerImg'"
+" TITLE='"+imageDetails[3]+"'"
+" NAME='"+imageDetails[4]+"'"
+" HSPACE=0 VSPACE=0 BORDER=0 "
+" WIDTH="+imageDetails[5]
+" HEIGHT="+imageDetails[6]+"/>";label+=bulletImageTag+"<br/>";}}
var linkImagDetails=$(element).attr('linkImageDetails');if(linkImagDetails!=undefined&&linkImagDetails!=''){var imageDetails=linkImagDetails.split("-;-");var linkImageTag="<IMG SRC="+imageDetails[0]
+" ALIGN='"+imageDetails[1]+"'"
+" ALT='"+imageDetails[2]+"'"
+" class='headerImg'"
+" TITLE='"+imageDetails[3]+"'"
+" NAME='"+imageDetails[4]+"'"
+" HSPACE=0 VSPACE=0 BORDER=0 "
+" WIDTH="+imageDetails[5]
+" HEIGHT="+imageDetails[6]+"/>";label+=linkImageTag+"<br/>";}
label+=extractText(UnEscapeHTML($(element).attr('menu')));var options=UnEscapeHTML($(element).attr('options'));var url=UnEscapeHTML($(element).attr('path'));url=url.replace(/&amp;/gi,'&');if(typeof(options)!='undefined'&&options!=''){options=options.replace('&amp;','&');if(url.indexOf("?")!=-1){url=url+"&"+options;}else{url=url+"?"+options;}}
var id;if(url.indexOf('name=')!=-1){id=UIDGenerator.getUIDFromURL(url.split('name=')[1]);}else{id=UIDGenerator.getUIDFromURL(url);}
var desc=UnEscapeHTML($(element).attr('description'));var hasChildren=true;if(url.indexOf('P_GenMenu')==-1){hasChildren=false;}
var item=new level2Button({id:id,label:label,description:desc,url:url,styleName:'htmlButtonLevel2-3',hasChildren:hasChildren,callback:callback});PageRenderer.subMenuButtons.push(item);container.find('#contentBelt').append(item);var elem=document.getElementById(id);if(elem){if(document.getElementById(id).offsetHeight>maxHeight)
maxHeight=document.getElementById(id).offsetHeight;}});var helpURL=UnEscapeHTML($(content).find('extra').attr('url'));if(helpURL){$('.helpText').css('display','block');if(helpURL.split(" ").length>0){if(typeof(helpURL)!='undefined'&&helpURL.indexOf('/')==0){helpURL=helpURL.substring(1);}
else{helpURL=Application.getDadName()+"/twbkfrmt.P_DispHelp?pagename_in="+UIDGenerator.getURLFromUID(pageReferrerId);}
Context.helpURL=Application.getProtocol()+"//"+Application.getHost()+"/"+helpURL;Context.extHelpURL='FALSE';}else{Context.helpURL=helpURL;Context.extHelpURL='TRUE';}}else{$('.helpText').css('display','none');}
var rel=$(content).find('extra').attr('release');FooterText.reset(rel);var infoText=$(content).find('extra').attr('infoText');infoText=UnEscapeHTML(infoText);var imageName=$(content).find('extra').attr('imageName');var imageUrl=$(content).find('extra').attr('imageUrl');var imageAlt=$(content).find('extra').attr('imageAlt');var imageHeight=$(content).find('extra').attr('imageHeight');var imageWidth=$(content).find('extra').attr('imageWidth');var imageTag;if(imageName!=null){imageTag='<IMG SRC="'+imageUrl+'" ALT="'+imageAlt+'" TITLE="'+imageAlt+'" NAME= "'+imageName+'" HEIGHT="'+imageHeight+'" WIDTH="'+imageWidth+'" /> ';}
if(imageTag!=undefined){infoText=imageTag+infoText;}
container.find('#contentBelt').append('<SPAN class="serviceInfotext">'+infoText+'</SPAN>');ConfirmationMessage.show($('#contentBelt'));Crumb.generateCrumb(content,pageReferrerId,pageDepth);document.title=$('#'+pageReferrerId).find('.menu').text();}
for(e in PageRenderer.subMenuButtons){PageRenderer.subMenuButtons[e].css('height',maxHeight);}
$(".level2NavArrow").each(function(i,elem){$(elem).css("height",$(elem).parent().height());});PageRenderer.calculateSecondLevelRows();}
var MenuNavigation={buttons:[],UI:null,type:'',updatingNavigation:false,firstVisibleButtonIndex:0,selectedItem:null,selectedIndex:null,initialize:function(container,type){var pageDepth=typeof(level_depth)=="undefined"||level_depth==""?0:parseInt(level_depth);if(pageDepth>=4){type="small";}
if(type=='small'){MenuNavigation.UI=$("<div id='navigationcontrolSmall'>"
+"<span class='navArrowLeftSmall'/>"
+"<span class='navArrowRightSmall'/>"
+"<span class='menucontainer'>"
+"<span id='menuTrackInst' class='menutrack'/>"
+"</span>"
+"</div>");leftNavBtn=MenuNavigation.UI.find('.navArrowLeftSmall');rightNavBtn=MenuNavigation.UI.find('.navArrowRightSmall');}else{MenuNavigation.UI=$("<div id='navigationcontrol'>"
+"<span class='navArrowLeft'/>"
+"<span class='menucontainer'>"
+"<span id='menuTrackInst' class='menutrack'/>"
+"</span>"
+"<span class='navArrowRight'/>"
+"</div>");leftNavBtn=MenuNavigation.UI.find('.navArrowLeft');rightNavBtn=MenuNavigation.UI.find('.navArrowRight');}
container.prepend(MenuNavigation.UI);var menuTrack=MenuNavigation.UI.find('.menutrack');var menuTrackWidth=0;var content=Parser.menuContent;content.each(function(i,element){var label=jQuery.trim($(element).text());var url=$(element).find('a').attr('href');var selected=$(this).attr('class')=="tabon";var id;if(url.indexOf('name=')!=-1){id=UIDGenerator.getUIDFromURL(url.split('name=')[1]);}else{id=UIDGenerator.getUIDFromURL(url);}
var btn;if(pageDepth<4){btn=new NavigationButton({id:id,label:label,url:url,type:'menu',callback:MenuNavigation.callback,selected:selected});}else{btn=new NavigationSmallButton({id:id,label:label,url:url,type:'menuSmall',callback:MenuNavigation.callback,selected:selected});}
MenuNavigation.buttons.push(btn);if(selected){MenuNavigation.selectedIndex=i;MenuNavigation.selectedItem=btn;}
var seperator=$("<span/>");seperator.addClass('menuItemSeperator');var menuitemElem=$("<span class='menuitem'/>").append(btn);if(i>0){menuTrack.append(seperator);}
menuTrack.append(menuitemElem);var itemWidth=menuitemElem.width()+seperator.width();var margin=menuitemElem.css('margin-left')=='auto'?0:parseInt(menuitemElem.css('margin-left'),10);var padding=menuitemElem.css('padding-left')=='auto'?0:parseInt(menuitemElem.css('padding-left'),10);menuTrackWidth+=itemWidth+(2*margin)+(2*padding);});menuTrackWidth=menuTrackWidth*1.05;menuTrack.css({width:menuTrackWidth});if(menuTrack.css('width')=='0px'){MenuNavigation.UI.css('display','none');}
leftNavBtn.data('enable',true);rightNavBtn.data('enable',true);MenuNavigation.enable(leftNavBtn,false);var left=menuTrack.css('left')=='auto'?0:parseInt(menuTrack.css('left'),10);if(left+menuTrackWidth<=MenuNavigation.UI.width()){MenuNavigation.enable(rightNavBtn,false);}
leftNavBtn.click(MenuNavigation.previous);rightNavBtn.click(MenuNavigation.next);$('body').find('.headerlinksdiv').remove();},callback:function(data){if(typeof(data)=='undefined'){return;}
if(Context.standalone){if(data.type=="blank"){Application.navigateToURL(Context.level2Page);}else{$.get(Context.level2URL,"",function(data){generateSecondLevel(data,'xml',contentHolder());},'xml');}
return;}
if(data.url.indexOf('P_GenMenu')==-1){Application.navigateToURL(data.url);return;}
var pageDepth=typeof(level_depth)=="undefined"||level_depth==""?0:parseInt(level_depth);if(pageDepth==0||pageDepth>=4){Application.navigateToURL(data.url);return;}
var pageName=data.id;var parameters="false";var pageReferrerId="";var params={pageName:pageName,pageReferrerId:pageReferrerId,pageDepth:2,options:parameters};HistoryManager.set(params);},next:function(){if(!$(this).data('enable')||MenuNavigation.updatingNavigation){return;}
MenuNavigation.updatingNavigation=true;var menuTrack=MenuNavigation.UI.find('.menutrack');var tgt=menuTrack.find('.menuitem:eq('+MenuNavigation.firstVisibleButtonIndex+')');var wid=tgt.width();var marginLeft=tgt.css('margin-left')=='auto'?0:parseInt(tgt.css('margin-left'),10);var marginRight=tgt.css('margin-right')=='auto'?0:parseInt(tgt.css('margin-right'),10);var paddingLeft=tgt.css('padding-left')=='auto'?0:parseInt(tgt.css('padding-left'),10);var paddingRight=tgt.css('padding-right')=='auto'?0:parseInt(tgt.css('padding-right'),10);var totalWidth=wid+marginLeft+marginRight+paddingLeft+paddingRight;var seperator=menuTrack.find('.menuItemSeperator:eq('+MenuNavigation.firstVisibleButtonIndex+')');var sepWid=seperator.width();var sepMarginLeft=seperator.css('margin-left')=='auto'?0:parseInt(seperator.css('margin-left'),10);var sepMarginRight=seperator.css('margin-right')=='auto'?0:parseInt(seperator.css('margin-right'),10);var sepPaddingLeft=seperator.css('padding-left')=='auto'?0:parseInt(seperator.css('padding-left'),10);var sepPaddingRight=seperator.css('padding-right')=='auto'?0:parseInt(seperator.css('padding-right'),10);var totalWidth=wid+marginLeft+marginRight+paddingLeft+paddingRight+
sepWid+sepMarginLeft+sepMarginRight+sepPaddingLeft+sepPaddingRight;if(CommonContext.locale.substr(0,2)=="ar"){var right=menuTrack.css('right')=='auto'?0:parseInt(menuTrack.css('right'),10);menuTrack.animate({right:right-totalWidth},300,MenuNavigation.setNavigationButtonStates);if(jQuery.browser.msie){redrawInterval=setInterval("MenuNavigation.reDraw()",2);}}else{var left=menuTrack.css('left')=='auto'?0:parseInt(menuTrack.css('left'),10);menuTrack.animate({left:left-totalWidth},300,MenuNavigation.setNavigationButtonStates);}
MenuNavigation.firstVisibleButtonIndex++;},previous:function(){if(!$(this).data('enable')||MenuNavigation.updatingNavigation){return;}
MenuNavigation.updatingNavigation=true;var menuTrack=MenuNavigation.UI.find('.menutrack');MenuNavigation.firstVisibleButtonIndex--;var tgt=menuTrack.find('.menuitem:eq('+MenuNavigation.firstVisibleButtonIndex+')');var wid=tgt.width();var marginLeft=tgt.css('margin-left')=='auto'?0:parseInt(tgt.css('margin-left'),10);var marginRight=tgt.css('margin-right')=='auto'?0:parseInt(tgt.css('margin-right'),10);var paddingLeft=tgt.css('padding-left')=='auto'?0:parseInt(tgt.css('padding-left'),10);var paddingRight=tgt.css('padding-right')=='auto'?0:parseInt(tgt.css('padding-right'),10);var totalWidth=wid+marginLeft+marginRight+paddingLeft+paddingRight;var seperator=menuTrack.find('.menuItemSeperator:eq('+MenuNavigation.firstVisibleButtonIndex+')');var sepWid=seperator.width();var sepMarginLeft=seperator.css('margin-left')=='auto'?0:parseInt(seperator.css('margin-left'),10);var sepMarginRight=seperator.css('margin-right')=='auto'?0:parseInt(seperator.css('margin-right'),10);var sepPaddingLeft=seperator.css('padding-left')=='auto'?0:parseInt(seperator.css('padding-left'),10);var sepPaddingRight=seperator.css('padding-right')=='auto'?0:parseInt(seperator.css('padding-right'),10);var totalWidth=wid+marginLeft+marginRight+paddingLeft+paddingRight+
sepWid+sepMarginLeft+sepMarginRight+sepPaddingLeft+sepPaddingRight;if(CommonContext.locale.substr(0,2)=="ar"){var right=menuTrack.css('right')=='auto'?0:parseInt(menuTrack.css('right'),10);menuTrack.animate({right:right+totalWidth},300,MenuNavigation.setNavigationButtonStates);if(jQuery.browser.msie){redrawInterval=setInterval("MenuNavigation.reDraw()",2);}}else{var left=menuTrack.css('left')=='auto'?0:parseInt(menuTrack.css('left'),10);menuTrack.animate({left:left+totalWidth},300,MenuNavigation.setNavigationButtonStates);}},setNavigationButtonStates:function(){var menuTrack=MenuNavigation.UI.find('.menutrack');if(CommonContext.locale.substr(0,2)=="ar"){if(parseInt(menuTrack.css('right'),10)<0){MenuNavigation.enable(leftNavBtn,true);}else{MenuNavigation.enable(leftNavBtn,false);menuTrack.css({left:0});}
if(parseInt(menuTrack.css('right'),10)+parseInt(menuTrack.width(),10)>parseInt(MenuNavigation.UI.width(),10)){MenuNavigation.enable(rightNavBtn,true);}else{MenuNavigation.enable(rightNavBtn,false);}}else{if(parseInt(menuTrack.css('left'),10)<0){MenuNavigation.enable(leftNavBtn,true);}else{MenuNavigation.enable(leftNavBtn,false);menuTrack.css({left:0});}
if(parseInt(menuTrack.css('left'),10)+parseInt(menuTrack.width(),10)>parseInt(MenuNavigation.UI.width(),10)){MenuNavigation.enable(rightNavBtn,true);}else{MenuNavigation.enable(rightNavBtn,false);}}
MenuNavigation.updatingNavigation=false;if(typeof(redrawInterval)!='undefined')
clearInterval(redrawInterval);},enable:function(btn,flag){var style=btn.attr('class');var className=style.indexOf(' ')>-1?style.split(' '):style;if(flag){if($.isArray(className)){for(e in className){if(className[e].indexOf('Disabled')>-1){btn.removeClass(className[e]);btn.data('enable',true);btn.css('cursor','pointer');}}}else{if(className.indexOf('Disabled')>-1){btn.removeClass(className);btn.data('enable',true);btn.css('cursor','pointer');}}}
else{className=$.isArray(className)?className[0]:className;if(className.indexOf('Disabled')==-1){btn.addClass(className+'Disabled');btn.data('enable',false);btn.css('cursor','default');}}},selectedButton:function(){for(var i=0;i<MenuNavigation.buttons.length;i++){var btn=MenuNavigation.buttons[i];if(btn.children().hasClass('selected')){return btn;}}
return null;},selectButton:function(id){for(var i=0;i<MenuNavigation.buttons.length;i++){var btn=MenuNavigation.buttons[i];if(btn.attr('id')==id){btn.select();return true;}}
return false;},deselectAllButtons:function(){EventDispatcher.dispatchEvent('highlight',{id:null,label:null});},trackWidth:function(){var menuTrack=MenuNavigation.UI.find('.menutrack');return menuTrack.width();},reDraw:function(){$('body').css('display','none');$('body').css('display','block');},reInitialize:function(){MenuNavigation.initialize($('#content'),pageDepth);}};function generateDescriptions(content,type,container){pageDepth=1;if(typeof(content)=="undefined"){return;}
if(typeof(type)=="undefined"){type='html';}
if(typeof(container)=="undefined"){container=contentHolder();}
$('.descriptionText').remove();container.find('#contentBelt').empty();$('#contentBelt').removeClass('menucontent');$('#contentBelt').css('left',0);MenuNavigation.deselectAllButtons();var navigationList=MenuNavigation.UI.find(':button');var panelwidth=0;if(type=='html'){navigationList.each(function(i,navLink){content.each(function(e,element){var node=$(element).find('td:eq(1)');var label=node.find('a').text();var url=node.find('a').attr('href');var desc=node.find('.menulinkdesctext').html();if(desc==null||typeof(desc)=='undefined'){desc='';}
if($(navLink).attr('url').indexOf(url)!=-1){var desc=$("<div class='descriptionText'>"+desc
+"</div>");desc.css({width:$(navLink).width()-30,cursor:'default'});$(navLink).after(desc);return true;}});});}else if(type=='xml'){navigationList.each(function(i,navLink){$(content).find('navigationEntryValueObject').each(function(e,element){var label=UnEscapeHTML($(element).attr('menu'));var options=UnEscapeHTML($(element).attr('options'));var url=UnEscapeHTML($(element).attr('path'));url=url.replace(/&amp;/gi,'&');if(typeof(options)!='undefined'&&options!=''){options=options.replace('&amp;','&');if(url.indexOf("?")!=-1){url=url+"&"+options;}else{url=url+"?"+options;}}
var desc=UnEscapeHTML($(element).attr('description'));if($(navLink).attr('url').indexOf(url)!=-1){var desc=$("<div class='descriptionText'>"
+desc+"</div>");desc.css({width:$(navLink).width()-30,cursor:'default'});$(navLink).after(desc);}});var helpURL=UnEscapeHTML($(content).find('extra').attr('url'));if(helpURL===undefined){helpURL='';}
if(helpURL.split(" ").length>0){if(typeof(helpURL)!='undefined'&&helpURL.indexOf('/')==0){helpURL=helpURL.substring(1);}
Context.helpURL=Application.getProtocol()+"//"+Application.getHost()+"/"+helpURL;Context.extHelpURL='FALSE';}else{Context.helpURL=helpURL;Context.extHelpURL='TRUE';}});document.title=ResourceManager.getString("default_document_title");}
Crumb.remove();}
function generateUnauthenticatedHome(content,container){if(typeof(container)=="undefined"){container=contentHolder();}
function callback(data){if(Context.standalone){Application.navigateToURL(Context.level4Page);return;}
if(data.url.indexOf('mailto')!=-1||data.url.indexOf('http')!=-1){Application.navigateToURL(data.url);return;}else if(data.url.indexOf('javascript')!=-1){if(window.execScript){window.execScript(data.url);}else{eval(data.url);}
return;}else{Application.navigateToURL(Application.getApplicationPath()+"/"+data.url);return;}}
container.append("<div id='row1'/>");container.append("<div id='row2'/>");var panelHeight=0;for(var i=0;i<document.styleSheets.length;i++){if(document.styleSheets[i].href.indexOf('cascade.css')!=-1){var rules=document.styleSheets[i].rules||document.styleSheets[i].cssRules;for(var x in rules){if(rules[x].selectorText=='#mainBannerImage'){var banner=$("<div id='mainBannerImage' />");break;}}}}
if(typeof(banner)=="undefined"){var homepageBanner=typeof(homepage_banner)=="undefined"||homepage_banner==""?'wtlgifs/main-banner-image.png':homepage_banner;var banner=$("<img id='mainBannerImage' src='"+homepageBanner+"'/>");}
container.prepend(banner);var maxItemHeight=0;content.each(function(e,element){var node=$(element).find('td:eq(1)');var label=node.find('a').text();var url=node.find('a').attr('href');if(url.indexOf('http')==-1){url=url.substring(url.lastIndexOf('/')+1,url.length);}
var desc=node.find('.menulinkdesctext').text();var item=new subMenuRightButton({id:'contentItem'+e,label:label,description:desc,url:url,styleName:'',callback:callback});var li=$("<div class='anonymousHomeLinks'></div>");li.append(item);if(e<4){container.find('#row1').append(li);}else{container.find('#row2').append(li);}});$("#row1").children().css("height",'71px');$("#row2").children().css("height",'71px');$(".anonymousHomeLinks").mouseenter(function(){$(this).addClass(" hover");});$(".anonymousHomeLinks").mouseleave(function(){$(this).removeClass(" hover");});var copyright='<br style="clear:both" /><div class="disclaimer">'+$("body").children("span.infotext").html()+'</div>';}
function convertHTMLButton(element,formNode){function callback(data){if(typeof $(element).attr('onClick')!='undefined'){if(window.execScript){window.execScript('('+$(element).attr('onClick')+')()');}else{eval($(element).attr('onClick'));var onClickStr=$(element.form).attr('onClick');var idx=onClickStr.indexOf('return');if(idx==-1){eval(onClickStr);}else{var func=onClickStr.substring(idx+7,onClickStr.length);var returnVal=eval(func);if(!returnVal)
return false;}}}
if(type=='submit'){doFormSubmit=true;if(typeof $(formNode).attr('onSubmit')!='undefined'){if(window.execScript){$(element).click();}else{var onSubmitStr=$(element.form).attr('onSubmit');var idx=onSubmitStr.indexOf('return');if(idx==-1){eval(onSubmitStr);}else{var func=onSubmitStr.substring(idx+7,onSubmitStr.length);var returnVal=eval(func);if(!returnVal)
return false;}}}
if(doFormSubmit)
formNode.submit();}
if(type=='reset'){formNode.resetForm();}
enableButtonsInForm(btn);return false;}
var type=$(element).attr('type');if(typeof(type)=='undefined'||type==''){type='text';}
var name=$(element).attr('name');if(typeof(name)=='undefined'){name='';}
var id=$(element).attr('id');if(typeof(id)=='undefined'){id=UIDGenerator.uniqueID();}
var value=$(element).attr('value');if(typeof(value)=='undefined'||value==''){value=$(element).text();}
var buttonStyle='defaultButtonSmall';var loginList=Context.loginProc;loginList=$.map(loginList,function(n){return(n.toLowerCase());});if($.inArray(Application.getProc().toLowerCase(),loginList)!=-1){buttonStyle='defaultButton';}
var btn=HTMLButton({id:id,name:name,value:value,url:'',type:buttonStyle,callback:callback,selected:false,inputType:type});$(element).replaceWith(btn);if(findIEVersion()>=8){$(function(){$("form input").keypress(function(e){if((e.which&&e.which==13)||(e.keyCode&&e.keyCode==13)){var pageDepth=typeof(level_depth)=="undefined"||level_depth==""?0:parseInt(level_depth);if(pageDepth==0){formNode.submit();}}});});}}
var HeaderLinks={initialize:function(){pageHeaderLinks=$("<div id='pageheaderlinks' />");list=$("<ul/>").appendTo(pageHeaderLinks);elem=$('body').find('.pageheaderlinks').children();var isHelp=false;var isLogout=false;elem.each(function(i,node){var label=$(node).text();var url=$(node).attr('href');if(url===undefined){url='';}
if(url.indexOf('twbksite.P_DispSiteMap')!=-1&&url.indexOf('twbkfrmt.P_DispHelp')==-1){var siteMapURL=url.substring(url.lastIndexOf('/')+1,url.length);FooterText.add($(node).text(),'sitemaplink',siteMapURL);}
if(url.indexOf('help')!=-1){if(url.indexOf('http')!=-1){Context.helpURL=url;Context.extHelpURL='TRUE';}else{Context.helpURL=Application.getProtocol()+"//"+Application.getHost()+url;Context.extHelpURL='FALSE';}
isHelp=true;}
if(url.indexOf('twbkfrmt.P_DispHelp')!=-1){Context.helpURL=Application.getProtocol()+"//"+Application.getHost()+url;Context.extHelpURL='FALSE';isHelp=true;}
if(url.indexOf('P_Logout')!=-1){var logoutURL=url.substring(url.lastIndexOf('/')+1,url.length);Context.logoutURL=Application.getApplicationPath()+"/"+logoutURL;isLogout=true;}
var PROXY_HASH=getCookie('PROXY_HASH');if(PROXY_HASH!=null&&isLogout==false){if(url.indexOf('javascript:window.close()')!=-1){Context.logoutURL='javascript:window.close();'
isLogout=true;Context.disableHome=true;$('#browseButton, #browseButtonBottom').unbind("click");}}
if($(node).attr('id')=='ssbbackurl'&&url.indexOf('twbksite.P_DispAccessibility')==-1){Crumb.backURL=url.substring(url.lastIndexOf('/')+1,url.length);Crumb.backURLTitle=$(node).html();}
var ADMSESSID=getCookie('ADMSESSID');if(url.indexOf('bwskalog.p_displogoutnon')!=-1&&typeof(ADMSESSID)!="undefined"){var logoutURL=url.substring(url.lastIndexOf('/')+1,url.length);Context.logoutURL=Application.getApplicationPath()+"/"+logoutURL;isLogout=true;}});if(!isLogout){$('body').find('.signOutText').css("display","none");$('body').find('.helpText').css("border-left","none");}
if(!isHelp){$('body').find('.helpText').css("display","none");}
if(!isLogout&&!isHelp){$('body').find('#globalNav div').css({"display":"none"});}
$('#content').prepend(pageHeaderLinks);$('body').find('.pageheaderlinks').remove();},add:function(label,url){if(Context.standalone){if(url.indexOf("SiteMap")!=-1){url=Context.siteMapPage;}else if(url.indexOf("WebTailor")!=-1){url=Context.WTAdminPage;}}
var li=$('<li/>');var link=$("<a href='"+url+"' />").appendTo(li);link.text(label);li.appendTo(pageHeaderLinks.find('ul'));}};function NavigationHistoryValueObject(identifier,responder,params){this.identifier=identifier;this.responder=responder;this.params=params;}
var HistoryManager={secondLevelIdentifier:null,thirdLevelIdentifier:null,initialize:function(){$('#content').hide();$.history.init(HistoryManager.callback);},callback:function(frag){HistoryManager.render(frag);},add:function(identifier,responder,params){CacheManager.add(new NavigationHistoryValueObject(identifier,responder,params));},set:function(params){var fragment=$.param(params);$.history.load(fragment);},get:function(){var frag=window.location.hash;if(frag){return frag.substr(1);}
return null;},render:function(identifier){UIDGenerator.token=0;if(identifier==null){HistoryManager.execute(CacheManager.get(""));return;}
var params=deparam(identifier,true);if(typeof(params)!='object'){HistoryManager.execute(CacheManager.get(""));return;}
if(params.pageDepth==1){var navigationHistoryValueObjects=CacheManager.get(params.pageName);if(typeof(navigationHistoryValueObjects)=="undefined"){var serviceURL=Bannerservice.url+Bannerservice.endpoints[2]
+UIDGenerator.getURLFromUID(params.pageName)+"/"
+sessionToken+"/"+params.options+"?dadName="+Application.getDadName()+"&locale="+Context.locale_settings;HistoryManager.loadHome(params.pageName,serviceURL);}else{HistoryManager.execute(navigationHistoryValueObjects)}
HistoryManager.secondLevelIdentifier=null;HistoryManager.thirdLevelIdentifier=null;}else if(params.pageDepth==2){var navigationHistoryValueObjects=CacheManager.get(params.pageName);if(typeof(navigationHistoryValueObjects)=="undefined"){var serviceURL=Bannerservice.url+Bannerservice.endpoints[2]
+UIDGenerator.getURLFromUID(params.pageName)+"/"
+sessionToken+"/"+params.options+"?dadName="+Application.getDadName()+"&locale="+Context.locale_settings;HistoryManager.loadSecondLevel(params.pageName,serviceURL,null);}else{HistoryManager.execute(navigationHistoryValueObjects)}
HistoryManager.secondLevelIdentifier=params.pageName;}else if(params.pageDepth==3){function getNextLevel(){var navigationHistoryValueObjects=CacheManager.get(params.pageName);if(typeof(navigationHistoryValueObjects)=="undefined"){var serviceURL=Bannerservice.url
+Bannerservice.endpoints[2]
+UIDGenerator.getURLFromUID(params.pageName)+"/"
+sessionToken+"/"+params.options+"?dadName="+Application.getDadName()+"&locale="+Context.locale_settings;HistoryManager.loadThirdLevel(params.pageName,serviceURL);}else{HistoryManager.execute(navigationHistoryValueObjects)}}
var navigationHistoryValueObjects=CacheManager.get(params.pageReferrerId);if(typeof(navigationHistoryValueObjects)=="undefined"){var serviceURL=Bannerservice.url+Bannerservice.endpoints[2]
+UIDGenerator.getURLFromUID(params.pageReferrerId)
+"/"+sessionToken+"/"+params.options+"?dadName="+Application.getDadName()+"&locale="+Context.locale_settings;HistoryManager.loadSecondLevel(params.pageReferrerId,serviceURL,getNextLevel);}else{if(HistoryManager.secondLevelIdentifier!=params.pageReferrerId){HistoryManager.execute(navigationHistoryValueObjects)}
var navigationHistoryValueObjects=CacheManager.get(params.pageName);if(typeof(navigationHistoryValueObjects)=="undefined"){var serviceURL=Bannerservice.url
+Bannerservice.endpoints[2]
+UIDGenerator.getURLFromUID(params.pageName)+"/"
+sessionToken+"/"+params.options+"?dadName="+Application.getDadName()+"&locale="+Context.locale_settings;HistoryManager.loadThirdLevel(params.pageName,serviceURL);}else{HistoryManager.execute(navigationHistoryValueObjects)}}
HistoryManager.secondLevelIdentifier=params.pageReferrerId;}else{HistoryManager.execute(CacheManager.get(""))}},loadHome:function(pageName,serviceURL){function resultHandler(result,textStatus){HistoryManager.add(pageName,PageRenderer.renderHome,{content:stringToDoc($.json2xml(result).replace(/\+/g,'%20')),type:'xml',pageReferrerId:pageName,container:contentHolder()});HistoryManager.execute(CacheManager.get(pageName));}
Blocker.block();var _options={url:serviceURL,type:'GET',dataType:'jsonp',callbackParameter:"callback",success:resultHandler,error:function(XMLHttpRequest,textStatus){Blocker.unblock();alert('Error occurred. Either services are down or your session is expired. Try re-logging in. If issue continues contact your administrator.');}};$.jsonp(_options);},loadSecondLevel:function(pageName,serviceURL,callback){function resultHandler(result,textStatus){var data1=$.json2xml(result).replace(/\+/g,'%20');var data2=stringToDoc(data1);var iText=$(data2).find('extra').attr('infoText');if($(data2).find('extra').attr('url')){$('.helpText').css('display','block');}else{$('.helpText').css('display','none');}
HistoryManager.add(pageName,PageRenderer.renderSecondLevel,{content:stringToDoc($.json2xml(result).replace(/\+/g,'%20')),type:'xml',pageReferrerId:pageName,container:contentHolder()});HistoryManager.execute(CacheManager.get(pageName));if(typeof(callback)=='function'){callback();}}
Blocker.block();var _options={url:serviceURL,type:'GET',dataType:'jsonp',callbackParameter:"callback",success:resultHandler,error:function(XMLHttpRequest,textStatus){Blocker.unblock();alert('Error occurred. Either services are down or your session is expired. Try re-logging in. If issue continues contact your administrator.');}};$.jsonp(_options);},loadThirdLevel:function(pageName,serviceURL){function resultHandler(data,textStatus){HistoryManager.thirdLevelIdentifier=pageName;HistoryManager.add(pageName,PageRenderer.renderThirdLevel,{content:stringToDoc($.json2xml(data).replace(/\+/g,'%20')),type:'xml',pageReferrerId:pageName,container:contentHolder()});HistoryManager.execute(CacheManager.get(pageName));}
Blocker.block();var _options={url:serviceURL,type:'GET',dataType:'jsonp',callbackParameter:"callback",success:resultHandler,error:function(XMLHttpRequest,textStatus){Blocker.unblock();alert('Error occurred. Either services are down or your session is expired. Try re-logging in. If issue continues contact your administrator.');}};$.jsonp(_options);},execute:function(navigationHistoryValueObjects){$('#content').show();if(typeof(navigationHistoryValueObjects)!='undefined'){var len=navigationHistoryValueObjects.length;for(var i=0;i<len;i++){var o=navigationHistoryValueObjects[i];if(o instanceof NavigationHistoryValueObject){o.responder(o.params);}}}
Blocker.unblock();}};var CacheManager={HOME:"__home",cacheDictionary:{},initialize:function(){},add:function(navigationHistoryValueObject){if(navigationHistoryValueObject instanceof NavigationHistoryValueObject){var identifier=navigationHistoryValueObject.identifier;if(typeof(identifier)=="undefined"||identifier==null||identifier==""){identifier=CacheManager.HOME;navigationHistoryValueObject.identifier=identifier;}
if(CacheManager.cacheDictionary[identifier]==null||typeof(CacheManager.cacheDictionary[identifier])=="undefined"){CacheManager.cacheDictionary[identifier]=[];}
CacheManager.cacheDictionary[identifier].push(navigationHistoryValueObject);}},get:function(identifier){if(identifier==null||typeof(identifier)=="undefined"||identifier==""){identifier=CacheManager.HOME;}
return CacheManager.cacheDictionary[identifier];},clear:function(identifier){CacheManager.cacheDictionary[identifier]=null;}};var PageRenderer={subMenuButtons:[],scrollTop:0,level2Rows:0,isResizing:false,duringTransition:false,initialize:function(){},renderHome:function(params){generateDescriptions(params.content,params.type,params.container);},renderSecondLevel:function(params){generateSecondLevel(params.content,params.type,params.pageReferrerId,params.container);},renderThirdLevel:function(params){if(PageRenderer.isLevel3ContainerOpen()){PageRenderer.closeAllLevel3Containers();}
generateThirdLevel(params.content,params.type,params.pageReferrerId,params.container)},renderFourthLevel:function(params){},calculateSecondLevelRows:function(){var rows=1;var itemsPerRow=0;var pos=PageRenderer.subMenuButtons[0].position().top;var len=PageRenderer.subMenuButtons.length;for(var i=0;i<len;i++){var btn=PageRenderer.subMenuButtons[i];if(i>0&&btn.position().top>pos){PageRenderer.subMenuButtons[i-1].after("<div id='level3Container' class='row"+rows+"'/>");contentHolder().find('.row'+rows).css({'display':'none'});itemsPerRow=0;rows++;}
itemsPerRow++;btn.data('rowId',rows);pos=btn.position().top;}
PageRenderer.subMenuButtons[len-1].after("<div id='level3Container' class='row"+rows+"'/>");contentHolder().find('.row'+rows).css({'display':'none'});PageRenderer.isResizing=false;PageRenderer.level2Rows=rows;},getButton:function(id){for(var i=0;i<PageRenderer.subMenuButtons.length;i++){var btn=PageRenderer.subMenuButtons[i];if(btn.attr('id')==id){return btn;}}
return null;},selectButton:function(id){for(var i=0;i<PageRenderer.subMenuButtons.length;i++){var btn=PageRenderer.subMenuButtons[i];if(btn.attr('id')==id){btn.select();return true;}}
return false;},getSelectedButton:function(){for(var i=0;i<PageRenderer.subMenuButtons.length;i++){var btn=PageRenderer.subMenuButtons[i];if(btn.hasClass('selected')){return btn;}}
return null;},isLevel3ContainerOpen:function(){var exists=false;contentHolder().find('#level3Container').each(function(e){if($(this).css('display').indexOf('block')>-1){exists=true;}});return exists;},closeAllLevel3Containers:function(){PageRenderer.duringTransition=true;var btn=PageRenderer.getSelectedButton();var rowId=btn?btn.data('rowId'):'';contentHolder().find('#level3Container').not('.row'+rowId).each(function(e){$(this).slideUp('normal',PageRenderer.transitionCallback);});},closeLevel3Container:function(container){PageRenderer.duringTransition=true;container.slideUp('normal',PageRenderer.transitionCallback);},transitionCallback:function(){$(this).css('height','0px');PageRenderer.duringTransition=false;}};var HTMLButtonFormatter={initialize:function(){var pageDepth=typeof(level_depth)=="undefined"||level_depth==""?0:parseInt(level_depth);if(pageDepth==4){return;}
$(':submit').each(function(i,elem){var form=$(elem).parents("form:first");HTMLButtonFormatter.fixP(form);});$(':submit').each(function(i,elem){var form=$(elem).parents("form:first");convertHTMLButton(elem,form);});$(':reset').each(function(i,elem){var form=$(elem.form);convertHTMLButton(elem,form);});},fixP:function(form){var frm=form.parent().html();if(frm==null)
return;if(frm.toLowerCase().indexOf('form')>-1&&frm.toLowerCase().indexOf('/form')==-1){var pre=frm.substring(0,frm.toLowerCase().indexOf('<form'));var frmTag=frm.substring(frm.toLowerCase().indexOf('<form'),frm.toLowerCase().indexOf('>',frm.toLowerCase().indexOf('<form'))+1);var rest=frm.substring(frm.toLowerCase().indexOf('>',frm.toLowerCase().indexOf('<form'))+1);try{form.parent().remove();form.before(frmTag);form.before(pre);form.prepend(rest);}catch(e){}}}};var Debug={win:null,trace:function(str){if(Debug.win==null){Debug.win=window.open('','debugWin');}
Debug.win.document.write(str);Debug.win.document.write("<hr/>")},clear:function(){if(Debug.win==null){Debug.win=window.open('','debugWin');Debug.win.document.open();}
Debug.win.document.close();Debug.win.document.open();},close:function(){Debug.win.document.close();}}
var Blocker={div:$("<div id='blocker' />"),block:function(){if($('#blocker').length==0){$('body').prepend(Blocker.div);}
if(jQuery.browser.msie){Blocker.div.addClass('on');}else{Blocker.div.animate({opacity:0.1,height:'100%',width:'100%'},100);}
document.body.style.cursor='wait';setTimeout(Blocker.unblock,15000)},unblock:function(){if($('#blocker').length>0){Blocker.div.animate({opacity:0,height:'100%',width:'100%'},100);Blocker.div.remove();document.body.style.cursor='default';}}};var Crumb={buttons:[],currentCrumb:'',parent:'',UI:$('<div id="crumb"><div class="breadCrumb"/></div>'),backurlUI:$('<div class="backurl"><a href="" title=""/></div>'),backURL:null,backURLTitle:null,initialize:function(pageDepth,container){var track=Crumb.UI.find(".breadCrumb");if(Crumb.backURL){Crumb.backurlUI.find('a').attr('href',Crumb.backURL);if(Crumb.backURLTitle){Crumb.backurlUI.find('a').attr('title',Crumb.backURLTitle);}
Crumb.UI.prepend(Crumb.backurlUI);if(!track.hasClass('hasBackURL'))
track.addClass('hasBackURL');}
if(pageDepth==0){Crumb.UI.addClass('anonymous');}else if(pageDepth==4){Crumb.UI.addClass('level4');}
var crum=$('body').find('.crumbs span:has(a)');var lastLabel=$.trim($('body').find('.crumbs .lastValue').text());var len=crum.length;if(len==0){Crumb.addUnauthenticatedHome();}
else
{crum.each(function(i,element){var label=$.trim($(element).text());var url=$(element).find('a').attr('href');var callback;if(url.indexOf('bmenu.P_MainMnu')!=-1){callback=Crumb.home;}else{callback=MenuNavigation.callback;}
var id;if(url.indexOf('name=')!=-1){id=UIDGenerator.getUIDFromURL(url.split('name=')[1]);}else{id=UIDGenerator.getUIDFromURL(url);}
var seperator="<div class='breadcrumbSeperator'>></div>";var link=new Link({id:id,label:label,url:url,styleName:'',callback:callback});track.append(link);if(i==len-1){Crumb.parent=label;if(lastLabel==''){return true;}}
track.append(seperator);});if(lastLabel!=""){var link=new Link({id:'crumButtonLast',label:lastLabel,url:'',styleName:'selected',callback:null,enabled:false});track.append(link);}
Crumb.currentCrumb=lastLabel;}
container.append(Crumb.UI);EventDispatcher.addEventListener(Localization.events.localeChange,function(){Crumb.UI.find(".breadCrumb a:first").text(ResourceManager.getString("crumb_label_home"));});},generateCrumb:function(content,pageReferrerId,level){Crumb.remove();var track=Crumb.UI.find(".breadCrumb");Crumb.backURL=$(content).find('backUrl').attr('url');Crumb.backURLTitle=$(content).find('backUrl').attr('urlText');if(Crumb.backURL){Crumb.backurlUI.find('a').attr('href',Crumb.backURL);if(Crumb.backURLTitle){Crumb.backurlUI.find('a').attr('title',Crumb.backURLTitle);}
if(Crumb.UI.find('backurl').length==0)
Crumb.UI.prepend(Crumb.backurlUI);if(!track.hasClass('hasBackURL'))
track.addClass('hasBackURL');}
if(level==1){return;}
var crum=$(content).find('crumbEntries crumbValueObject');var len=crum.length;if(len==0){Crumb.addUnauthenticatedHome();}
else{crum.each(function(i,element){if(i!=0){var label=Url.decode($(element).attr('caption'));if(label.indexOf("Home")!=-1){if(ResourceManager.getString("crumb_label_home")!=null){label=ResourceManager.getString("crumb_label_home");}}
var url=Url.decode($(element).attr('path'));url=url.replace(/&amp;/gi,'&');var options=Url.decode($(element).attr('options'));if(typeof(options)!='undefined'&&options!=''){options=options.replace('&amp;','&');if(url.indexOf("?")!=-1){url=url+"&"+options;}
else{url=url+"?"+options;}}
var callback;if(url.indexOf('bmenu.P_MainMnu')!=-1){callback=Crumb.home;}else{callback=MenuNavigation.callback;}
var id;if(url.indexOf('name=')!=-1){id=UIDGenerator.getUIDFromURL(url.split('name=')[1]);}else{id=UIDGenerator.getUIDFromURL(url);}
var seperator="<div class='breadcrumbSeperator'>></div>";var link=new Link({id:id,label:label,url:url,styleName:'',callback:callback});track.prepend(seperator);track.prepend(link);if(i==len-1){Crumb.parent=label;}}else{var label=$(element).attr('caption');if(label!=null){label=label.replace(/\+/g,'%20');label=Url.decode(label,false);label=extractText(label);}
var link=new Link({id:'crumButtonLast',label:label,url:'',styleName:'selected',callback:null,enabled:false});track.prepend(link);Crumb.currentCrumb=label;}});}},home:function(data){if($($('.breadCrumb a')[0]).hasClass("proxyAccess")){return;}
if(typeof(data)=='undefined'){return;}
if(Context.standalone){if(data.type=="blank"){Application.navigateToURL(Context.level1Page);}else{$.get(Context.level1URL,"",function(data){generateDescriptions(data,'xml',contentHolder());},'xml');}
return;}
var pageDepth=typeof(level_depth)=="undefined"||level_depth==""?0:parseInt(level_depth);if(pageDepth==0||pageDepth>=4){Application.navigateToURL(data.url);return;}
var pageName=data.id;var parameters="false";var pageReferrerId="";var params={pageName:pageName,pageReferrerId:pageReferrerId,pageDepth:1,options:parameters};HistoryManager.set(params);ConfirmationMessage.UI.animate({height:'0px',opacity:'0'},100);ConfirmationMessage.UI.find('.confirmationText').html('');ConfirmationMessage.container=null;},addUnauthenticatedHome:function(){if($.inArray(Application.getProc(),Context.unauthenticatedHomeProc)!=-1){return;}
function callback(data){Application.navigateToURL(data.url);}
var SESSID=getCookie('SESSID');var PROXY_HASH=getCookie('PROXY_HASH');if(PROXY_HASH!=null&&SESSID==null){}else if(Context.disableHome==true){}
else{var link=new Link({id:'anonymous_home',label:ResourceManager.getString("crumb_label_home"),url:Context.homeURL,styleName:'',callback:callback});Crumb.UI.find(".breadCrumb").append(link);}},remove:function(){Crumb.UI.find('.breadCrumb').html('&nbsp;');Crumb.UI.find(".breadCrumb").removeClass('hasBackURL')
Crumb.UI.find('.backurl').remove();}};var ExtraLinks={initialize:function(content,target){if(content.length==0)
return;DirectoryLinks.initialize(content,target);FooterLinks.initialize(content,target);content.each(function(e,element){var url=$(element).attr('href');if($.trim(url)==''){return true;}
$(element).attr('title',$(element).text());if(url.indexOf('bwpkedir.P_NameDirectory')>-1){DirectoryLinks.add($(element));}else{FooterLinks.add($(element));}});DirectoryLinks.apply();FooterLinks.apply();}};var FooterLinks={content:null,target:null,linkPointer:null,initialize:function(content,target){if(content.length==0)
return;FooterLinks.UI=$('<div id="footerLinks">'+'<ul>'+'</ul>'+'</div>'+'');FooterLinks.content=content;FooterLinks.target=target;FooterLinks.linkPointer=FooterLinks.UI.find('ul');FooterLinks.target.append(FooterLinks.UI);},add:function(label){var str=$('<div>').append(label).html();var anchorText=$(label).text();if(anchorText!=null&&anchorText!=undefined&&anchorText!=""){var anchor=$('<li>'+str+'</li>');FooterLinks.linkPointer.append(anchor);}},apply:function(){if(FooterLinks.linkPointer.children().length>0){FooterLinks.UI.find("li:last").css("background-image","none");}else{FooterLinks.UI.hide();}}};var DirectoryLinks={content:null,target:null,linkPointer:null,initialize:function(content,target){if(content.length==0)
return;DirectoryLinks.UI=$('<div id="footerLinks">'+'<ul>'+'</ul>'+'</div>'+'');DirectoryLinks.content=content;DirectoryLinks.target=target;DirectoryLinks.linkPointer=DirectoryLinks.UI.find('ul');DirectoryLinks.target.prepend(DirectoryLinks.UI);},add:function(label){var str=$('<div>').append(label).html();var anchor=$('<li>'+str+'</li>');DirectoryLinks.linkPointer.append(anchor);},apply:function(){if(DirectoryLinks.linkPointer.children().length>0){DirectoryLinks.UI.find("li:last").css("background-image","none");}else{DirectoryLinks.UI.hide();}}}
var InnerTabs={UI:$('<div id="innerTabsContainer">'
+'<ul id="innerTabs">'
+'</ul>'
+'</div>'),initialize:function(content,container){if(content.length==0)
return;var tabList=InnerTabs.UI.find('ul');content.each(function(e,element){var state=$(element).attr('class');var tabLabel=$(element).text();var tabURL=$(element).find('a').attr('href');var anchor=$('<li><a href="'+tabURL+'">'+tabLabel+'</a></li>');switch(state){case'tabon':anchor.addClass('selected');break;case'tabdisable':anchor.addClass('disabled');anchor.find('a').attr('href','#');break;default:break;}
tabList.append(anchor);});container.prepend(InnerTabs.UI);}};var LoginScreen={initialize:function(content,container){container.addClass('login');container.empty();var infoText="";var trList=$(content).find('.infotexttable tr');$.each(trList,function(i,row){infoText+="<p>";$.each($(row).find('.indefault'),function(i,column){infoText+=$(column).html();});infoText+="</p>";});infoText="<div class='loginmessage'>"+infoText+"</div>";var form=content.find('form');var userLabel=form.find("label[for='UserID']");userLabel.children().removeAttr('class');var pinLabel=form.find("label[for='PIN']");pinLabel.children().removeAttr('class');var extra=form.find("input[NAME='RET_CODE']");var userInput=form.find("input[NAME='sid']");var pinInput=form.find("input[NAME='PIN']");var loginButton=form.find(":submit[NAME!='ButtonSelected']");var forgotPinButton=form.find(":submit[NAME='ButtonSelected']");var loginWin=LoginWindow();loginWin.find('.loginHeading').html($('.pagetitlediv h2').text());loginWin.find('#loginmessage').html(infoText);loginWin.find("label[for='txtUID']").replaceWith(userLabel);loginWin.find("input[id='txtUID']").replaceWith(userInput)
loginWin.find("label[for='txtPIN']").replaceWith(pinLabel);loginWin.find("input[id='txtPIN']").replaceWith(pinInput);loginWin.find(".buttonRow .defaultButton2:eq(0)").replaceWith(loginButton);loginWin.find(".buttonRow .defaultButton2:eq(0)").replaceWith(forgotPinButton);loginWin.find('#middle').prepend(extra);loginWin.find('.loginmessage').contents().filter(function(){if(this.nodeType==3){$(this).replaceWith("<p>"+this.nodeValue+"</p>");}});if(form.find('a[href="/wtlhelp/twbhhelp.htm"]').html()!=null){var atag=form.find('a[href="/wtlhelp/twbhhelp.htm"]').html();loginWin.find('.buttonRow').append('<a href="/wtlhelp/twbhhelp.htm">'+atag+'</a>');}
form.empty();loginWin.find('#middle').wrap(form);form.remove();if(content.children().hasClass('.plaintable')){var alertMsg=content.find('.plaintable td:eq(1)').html();alertMsg=(alertMsg==null)?"":alertMsg;if(alertMsg.length>0)
loginWin.find('#loginmessage p:last').append('<br><br>'+alertMsg+'</br></br>')}
container.append(loginWin);}};var HelpWindow={STYLESHEETS:['/css/app-overrides.css','/css/cascade.common.css'],initialize:function(url,targetWin){function loadContent(responseText,textStatus,XMLHttpRequest){var data=$(this);var helpContent=$(""+"<div id='helpContent'>"+"<div id='helpWindowHeader'>"+"<div id='title'>"+ResourceManager.getString("help_title")+"</div>"+"<div id='close'><a href='javascript:window.close()'>#</a></div>"+"</div>"+"<div id='helpBodyContent'>"+"<div id='helpCrumbs'></div>"+"<span id='helpWindowIcon'></span>"+"<span id='helpWindowTitle'></span>"+"<span id='helpWindowCloseButton'></span>"+"<div id='helpWindowText'></div>"+"<div id='helpWindowFooter'>"+"<span id='release'></span>"+"<span id='copyright'></span>"+"</div>"+"</div>");var crumbs=data.find('.crumbs');crumbs.find('a').attr('href','javascript:void(0)');helpContent.find('#helpCrumbs').html(crumbs.html());helpContent.find('#release').html(data.find('.pagefooterdiv').text());data.find('.crumbs').remove()
data.find('form').remove();data.find('.bg3').remove();data.find('.bgtabon').remove();data.find('.pagefooterdiv').remove();data.find('.globalfooterdiv').remove();data.find('a[href="javascript:window.close()"]').remove();HelpWindow.loadStylesheets(data);data.find('a[href]').each(function(i){var href=$(this).attr('href');var click=$(this).attr('onclick');var isHTTP=false;if(href.indexOf('.htm')!=-1){var hrefString=href.substring(href.lastIndexOf('/')+1,href.length);href=helpBasePath+hrefString;$(this).attr('href',href);}
if(href.toLowerCase().indexOf('#')!=0){if(href.indexOf('http')==-1&&href.indexOf('mailto')==-1){href=helpBasePath+href;isHTTP=true;}
if(click==null){if(href.indexOf('http')!=-1||href.indexOf('mailto')!=-1){if(isHTTP==false){if(findIEVersion()>7){$(this).attr("onclick","location.replace('"+href+"');");}else{$(this).attr("onclick","window.open('"+href+"'); return false;");}}else{$(this).attr("onclick","window.opener.HelpWindow.initialize('"+href+"', window); return false;");}}else{$(this).attr("onclick","window.opener.HelpWindow.initialize('"+href+"', window); return false;");}}}else{href=href.substring(1);$(this).attr('href',"javascript:void(0);");$(this).attr("onclick","javascript:document.getElementById('helpBodyContent').scrollTop = document.anchors['"+href+"'].offsetTop; void(0);");}});data.find('img[src]').each(function(i){var src=$(this).attr('src');if(src.indexOf('http')==-1||(src.indexOf('http')==0)){if(!jQuery.browser.msie){if(src.indexOf('/')==0){var arry=helpBasePath.split("//");var temp=arry[0]+'//'+arry[1].substring(0,arry[1].indexOf('/'));src=temp+src;}else{src=helpBasePath.substring(0,url.lastIndexOf('/')+1)+src;}}else{if(src.indexOf('images/')>0){src=helpBasePath.substring(0,url.lastIndexOf('/')+1)+src.substring(src.lastIndexOf('images/'),src.length);}}
$(this).attr('src',src);}});helpContent.find('#helpWindowText').html(data.html());helpContent.find('#title').text(ResourceManager.getString("userdetails_help"));helpContent.find('#close a').text(ResourceManager.getString("userdetails_close"));targetWin.document.write(helpContent.html());targetWin.document.close();$(targetWin.document).ready(function(){if(CommonContext.locale.substr(0,2)=="ar"){setTimeout(function(){var body=targetWin.document.getElementsByTagName('body')[0];var isChrome=navigator.userAgent.toLowerCase().indexOf('chrome')>-1;var isSafari=navigator.userAgent.toLowerCase().indexOf('safari')>-1;var styletag=targetWin.document.createElement('style');styletag.setAttribute('type','text/css');body.appendChild(styletag);StylesheetFormatter.targetWin=targetWin;var dom=targetWin.document.styleSheets;var len=dom.length;for(var i=0;i<len;i++){StylesheetFormatter.toggle(i);}
StylesheetFormatter.targetWin=this;$(targetWin.document).find('body').css('display','block');},100);}else{$(targetWin.document).find('body').css('display','block');}});}
var helpBasePath=url.substring(0,url.lastIndexOf('/')+1);var fileContent=$('<div/>');fileContent.load(url,null,loadContent);},loadStylesheets:function(container){container.find('link[rel*="style"]').each(function(i){var index=$.inArray(this.getAttribute('href'),HelpWindow.STYLESHEETS);if(index!=-1){HelpWindow.STYLESHEETS=$.grep(HelpWindow.STYLESHEETS,function(n,i){return(i!=index);})}});var stylesheetsElem=$('<div/>');if(HelpWindow.STYLESHEETS.length>0){for(i=0;i<HelpWindow.STYLESHEETS.length;i++){var fileref=document.createElement("link");$(stylesheetsElem).append(fileref);$(fileref).attr('rel',"stylesheet");$(fileref).attr('type',"text/css");if(jQuery.browser.msie)
$(fileref).attr('href',Application.getProtocol()+"//"+Application.getHost()+HelpWindow.STYLESHEETS[i]);else
$(fileref).attr('href',HelpWindow.STYLESHEETS[i]);}}
var loc=container.find('link:last');if(loc.length>0){container.find('link:last').after(stylesheetsElem.html());}else{container.prepend(stylesheetsElem.html());}}};var FooterText={initialize:function(){$('#pagefooter').addClass('footertext');this.add($('body').find('.pagefooterdiv').text(),'reltext');var pageDepth=typeof(level_depth)=="undefined"||level_depth==""?0:parseInt(level_depth);if(pageDepth==4){}},add:function(val,style,url){if(url){val=$("<a href='"+url+"'>"+val+"</a>");}
val=$("<div>").append(val);if(typeof style=='string'){val.addClass(style);}else if(typeof style=='object'){val.css(style);}
$('#pagefooter').append(val);},reset:function(val){$('body').find('.reltext').remove();this.add('Release: '+val,'reltext');}};var ConfirmationMessage={UI:$('<div id="confirmationBase">'
+'<div class="confirmation">'
+'<div class="confirmationText"></div>'
+'<div class="confirmationCloseIcon" />'
+'</div>'
+'</div>'),container:null,infoType:'confirm',show:function(container){ConfirmationMessage.UI.find('.confirmationText').html('');ConfirmationMessage.UI.animate({height:'0',opacity:'0'},1);var txt='';var moveBy='40px';if($('.serviceInfotext').length>0){txt=$('.serviceInfotext').html();}else if($('.informationtext').length>0){txt=$('.informationtext').text();}else if($('.errortext').length>0){txt=$('.errortext').text();ConfirmationMessage.UI.addClass('errortext');ConfirmationMessage.infoType='error';}else if($('.warningtext').length>0){txt=$('.warningtext').text();ConfirmationMessage.UI.addClass('errortext');ConfirmationMessage.infoType='error';}else if($('.infoText').length>0){var imageTag=null;if($('body').find('.infotextdiv table tr').length>0&&$('body').find('.infotextdiv table tr')[0].cells.length>1){imageTag=$('body').find('.infotextdiv table td[class="indefault"]').html();}
txt=$('.infotext').html();txt=imageTag!=null?imageTag+txt:txt;}
if(txt!=''){txt=$('<div>'+txt+'</div>');ConfirmationMessage.UI.find('.confirmation').css({'background':StyleManager.getStyle('confirmation_background','background')});ConfirmationMessage.UI.find('.confirmationText').append(txt);ConfirmationMessage.UI.find('.confirmationCloseIcon').click(ConfirmationMessage.hide);if(!container.hasClass('confirmationText')){container.before(ConfirmationMessage.UI);}
ConfirmationMessage.container=container;ConfirmationMessage.UI.css({height:'0',opacity:'0'});moveBy=txt.height()+20;ConfirmationMessage.UI.animate({height:moveBy,opacity:'1'},1);ConfirmationMessage.UI.find('.confirmation').css({height:moveBy});}
container.find('.serviceInfotext').remove();},hide:function(){if(ConfirmationMessage.container){try{ConfirmationMessage.UI.animate({height:'0px',opacity:'0'},1000);ConfirmationMessage.UI.find('.confirmationText').html('');ConfirmationMessage.container=null;}catch(e){}}}};var LocalizeImages={cssString:'',IE7CSS:'',initialize:function(){if(CommonContext.locale.substr(0,2)=="ar"){LocalizeImages.addStylesheet("/css/rtl.css");if(window.ActiveXObject){LocalizeImages.addStylesheet("/css/ie7-rtl.css");}
LocalizeImages.updateStyles();}},updateStyles:function(){if(window.ActiveXObject)
{$('#browseButton, #browseButtonBottom').bind("click",function(){$('.columns').hide();setTimeout(function(){$('#browseMenu').addClass('over');$('#browseMenu').removeClass('over');$('.columns').show();},400)});setTimeout(function(){$('#contentHolder').addClass('over');$('#contentHolder').removeClass('over');},400);}},addStylesheet:function(css){var head=document.getElementsByTagName('head')[0];{var linktag=document.createElement('link');linktag.setAttribute('rel','stylesheet');linktag.setAttribute('type','text/css');linktag.setAttribute('href',css);head.appendChild(linktag);}}}
var IE6Patch={windowHeight:0,windowWidth:0,headerHeight:0,footerHeight:0,apply:function(){$(window).bind('resize',function(e){IE6Patch.windowHeight=document.body.offsetHeight;IE6Patch.windowWidth=document.body.offsetWidth;IE6Patch.fixContentScrollbars();IE6Patch.fixNavigationSmallWidth();});this.windowHeight=document.body.offsetHeight;this.windowWidth=document.body.offsetWidth;this.headerHeight=document.getElementById('header')?document.getElementById('header').offsetHeight:0;this.footerHeight=document.getElementById('outerFooter')?document.getElementById('outerFooter').offsetHeight:0;this.fixContentScrollbars();this.fixCrumbPosition();this.fixNavigationSmallWidth();},fixContentScrollbars:function(){$('#content').css('height',this.windowHeight-(this.headerHeight+this.footerHeight)+2);},fixCrumbPosition:function(){if(pageDepth==0){$('#crumb').css({top:'20px'});}},fixNavigationSmallWidth:function(){var w=$('#pageheaderlinks').width()+$('#search').width()+130;var navWid=Math.abs(this.windowWidth-w);$('#navigationcontrolSmall').css({width:navWid});if(pageDepth>=4){MenuNavigation.type="small";}
if(MenuNavigation.type=='small'){leftNavBtn=MenuNavigation.UI.find('.navArrowLeftSmall');rightNavBtn=MenuNavigation.UI.find('.navArrowRightSmall');}else{leftNavBtn=MenuNavigation.UI.find('.navArrowLeft');rightNavBtn=MenuNavigation.UI.find('.navArrowRight');}
var menuTrack=MenuNavigation.UI.find('.menutrack');for(var i=0;parseInt(menuTrack.css('left'),10)<0;i++){this.movePreviousMenu();menuTrack=MenuNavigation.UI.find('.menutrack');if(parseInt(menuTrack.css('left'),10)<0){break;}}
MenuNavigation.setNavigationButtonStates();leftNavBtn.click(MenuNavigation.previous);rightNavBtn.click(MenuNavigation.next);if(jQuery.browser.msie&&parseInt(jQuery.browser.version)<=6){$('#navigationcontrolSmall span.menucontainer').css({width:navWid});}},movePreviousMenu:function(){MenuNavigation.updatingNavigation=true;var menuTrack=MenuNavigation.UI.find('.menutrack');MenuNavigation.firstVisibleButtonIndex--;var tgt=menuTrack.find('.menuitem:eq('+MenuNavigation.firstVisibleButtonIndex+')');var wid=tgt.width();var marginLeft=tgt.css('margin-left')=='auto'?0:parseInt(tgt.css('margin-left'),10);var marginRight=tgt.css('margin-right')=='auto'?0:parseInt(tgt.css('margin-right'),10);var paddingLeft=tgt.css('padding-left')=='auto'?0:parseInt(tgt.css('padding-left'),10);var paddingRight=tgt.css('padding-right')=='auto'?0:parseInt(tgt.css('padding-right'),10);var totalWidth=wid+marginLeft+marginRight+paddingLeft+paddingRight;var seperator=menuTrack.find('.menuItemSeperator:eq('+MenuNavigation.firstVisibleButtonIndex+')');var sepWid=seperator.width();var sepMarginLeft=seperator.css('margin-left')=='auto'?0:parseInt(seperator.css('margin-left'),10);var sepMarginRight=seperator.css('margin-right')=='auto'?0:parseInt(seperator.css('margin-right'),10);var sepPaddingLeft=seperator.css('padding-left')=='auto'?0:parseInt(seperator.css('padding-left'),10);var sepPaddingRight=seperator.css('padding-right')=='auto'?0:parseInt(seperator.css('padding-right'),10);var totalWidth=wid+marginLeft+marginRight+paddingLeft+paddingRight+
sepWid+sepMarginLeft+sepMarginRight+sepPaddingLeft+sepPaddingRight;if(CommonContext.locale=="ar"){var right=menuTrack.css('right')=='auto'?0:parseInt(menuTrack.css('right'),10);menuTrack.animate({right:right+totalWidth},300,MenuNavigation.setNavigationButtonStates);if(jQuery.browser.msie){redrawInterval=setInterval("MenuNavigation.reDraw()",2);}}else{var left=menuTrack.css('left')=='auto'?0:parseInt(menuTrack.css('left'),10);menuTrack.animate({left:left+totalWidth},0,MenuNavigation.setNavigationButtonStates);}}};var DowngradeCascade={apply:function(){$('body').find('script').remove();$('body').children().show();$('.headerwrapperdiv').remove();$('#headerImage').remove();$('#content > #bodyContainer > #pagebody > #contentHolder').append($('.pagebodydiv'));$('.crumbs').remove();$('form[action*="twbksrch.P_ShowResults"]').remove();var staticHeadersContent=$('body').find('.staticheaders').html();if(staticHeadersContent)
$('#pageheader').append("<div class='staticheaders'>"+staticHeadersContent+"</div>");$('.pagetitlediv').remove();$('#header').after($('#content'))
$('.pagefooterdiv').remove();$('#outerFooter').css({left:0});$('.bgtabon').removeClass();$('.globalfooterdiv').remove();$('.disclaimer').remove();$('#contentHolder').find('th[class="ddlabel"][scope="row"]').css({'background':'none','color':'#000'});var pagefooterlinks=contentHolder().find('.pagefooterlinks');pagefooterlinks.each(function(e,element){var links=$(element).find('a[class!="skiplinks"]');if(links.length>0){ExtraLinks.initialize(links,$(element).parent());}
$(element).remove();});var links=$('body').find('.pagefooterlinks a[class!="skiplinks"]');if(links.length>0){ExtraLinks.initialize(links,$('#contentHolder'));links.parent().remove();}
$('body').find('.pagefooterlinks').remove();var tabContent=$('body').find('.pagebodydiv table table td[class^="tab"]');if(tabContent.length>0){InnerTabs.initialize(tabContent,$('#pagebody'));$('body').find('.pagebodydiv table table td[class^="tab"]').parent().remove();}
$('#content').addClass('level4');$('#pagebody').addClass('level4');$('body').find('.infotext').find('p').prepend('<br>');$('body').find('.bordertable').after('<br>');$(':submit').each(function(i,elem){__convertHTMLButton(elem);});$(':reset').each(function(i,elem){__convertHTMLButton(elem);});if($('.pagebodydiv').find('form').attr('action')=='bwpktetm.P_EnterTimeSheet'){$('.pagebodydiv').parent().addClass('contentHolderTab');}}};function __convertHTMLButton(element){function callback(data){if(!jQuery.browser.mozilla){if(jQuery.browser.msie){if(findIEVersion()<9){element.click();}else if(findIEVersion()>=9){if(element.name!=undefined&&element.name!=''){if(element.type=='submit'){element.click();}}}}else{element.click();}}
if(type=='reset'){element.form.reset();}
enableButtonsInForm(element);return false;}
var type=$(element).attr('type');if(typeof(type)=='undefined'||type==''){type='text';}
var name=$(element).attr('name');if(typeof(name)=='undefined'){name='';}
var id=$(element).attr('id');if(typeof(id)=='undefined'||id==''){id=UIDGenerator.uniqueID();}
var value=$(element).attr('value');if(typeof(value)=='undefined'||value==''){value=$(element).text();}
var onclick=$(element).attr('onclick');if(typeof(onclick)=='undefined'){onclick='';}
var buttonStyle='defaultButtonSmall';var loginList=Context.loginProc;loginList=$.map(loginList,function(n){return(n.toLowerCase());});if($.inArray(Application.getProc().toLowerCase(),loginList)!=-1){buttonStyle='defaultButton';}
var btn=HTMLButton({id:id,name:name,value:value,url:'',type:buttonStyle,callback:callback,selected:false,inputType:type});$(element).before(btn);$(element).hide();if(/firefox/.test(navigator.userAgent.toLowerCase())||($.browser.msie&&$.browser.version>8))
if(typeof(onclick)!='undefined'&&onclick!=null&&onclick!="")
$(btn).click(onclick);}
var GlobalFooterText={initialize:function(){$('#globalFooter').addClass('footertext');$('#globalFooter').html($('body').find('.globalfooterdiv > .infotext').html());$('body').find('.globalfooterdiv').html('');}};var Disclaimer={initialize:function(){if($("div.banner_copyright").text().length<=0)
return;var copyright='<br style="clear:both" /><br><div class="disclaimer">'+$("div.banner_copyright").html()+'</div>';$('body').find('#pagebody').append(copyright);$("div.banner_copyright").html('');}};