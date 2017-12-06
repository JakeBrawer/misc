
function Button(id,label,callback,type){if(typeof(type)=="undefined"){type="";}
var b=$("<span class='primaryButton2 "+type+"' id='"+id+"'>"
+"<span class='primaryButtonComponent primaryButtonLeft"+type+"'></span>"
+"<span class='primaryButtonComponent primaryButtonMiddle"+type+"' id='"+id+"Text'>"+ResourceManager.getString(label)+"</span>"
+"<span class='primaryButtonComponent primaryButtonRight"+type+"'></span>"
+"</span>");if(typeof(callback)=="function"){b.click(callback);}
b.hover(function(){$(this).find('.primaryButtonLeft').addClass("primaryButtonLeftHover");$(this).find('.primaryButtonMiddle').addClass("primaryButtonMiddleHover");$(this).find('.primaryButtonRight').addClass("primaryButtonRightHover");}).mouseleave(function(){$(this).find('.primaryButtonLeft').removeClass("primaryButtonLeftHover");$(this).find('.primaryButtonMiddle').removeClass("primaryButtonMiddleHover");$(this).find('.primaryButtonRight').removeClass("primaryButtonRightHover");});EventDispatcher.addEventListener(Localization.events.localeChange,function(){b.find('.primaryButtonMiddle').text(ResourceManager.getString(label));});return b;};function ModalWindow(id,label,type,closeCallback){var modal=$("<div class='modalContainer'>"
+"<div class='modalWindowModal'></div>"
+"<div class='modalWindow' id='"+id+"'>"
+"<div class='modalWindowTop"+type+"'>"
+"<span class='modalWindowIcon "+type+"'></span>"
+"<span class='modalWindowTitle "+type+"'>"+ResourceManager.getString(label)+"</span>"
+"<span class='modalCloseIcon"+type+"'></span>"
+"</div>"
+"<div class='modalWindowMiddle"+type+"'>"
+"<div class='modalWindowContent "+type+"'></div>"
+"</div>"
+"<div class='modalWindowBottom"+type+"'>"
+"<div class='buttonBar modalButtonBar"+type+"'></div>"
+"</div>"
+"</div></div>");if(typeof(closeCallback)=="function"){modal.find('.modalCloseIcon').bind("click",closeCallback);}
EventDispatcher.addEventListener(Localization.events.localeChange,function(){modal.find('.modalWindowTitle').text(ResourceManager.getString(label));});return modal;};var ModalWindowFactory={currentModal:null,show:function(id,label,type,content,contentClass,buttons,closeCallback){var modal=ModalWindow(id,label,type,closeCallback);modal.find('.modalWindowContent').append(content);for(var x=0;x<buttons.length;x++){modal.find('.buttonBar').append(buttons[x]);}
$('body').append(modal);modal.find('.modalWindowModal').animate({opacity:0.25,height:'100%',width:'100%'},1000);modal.find('.modalWindow').fadeIn();var winHeight=window.innerHeight/2;var winWidth=window.innerWidth/2;var modHeight=modal.find('.modalWindow').height()/2;var modWidth=modal.find('.modalWindow').width()/2;if(modHeight!=0&&winHeight-modHeight>=0){modal.find('.modalWindow').css("top",winHeight-modHeight);}
if(modWidth!=0&&winWidth-modWidth>=0){modal.find('.modalWindow').css("left",winWidth-modWidth);}
ModalWindowFactory.currentModal=modal;},close:function(){if(!ModalWindowFactory.currentModal){return;}
ModalWindowFactory.currentModal.find('.modalWindow').fadeOut();ModalWindowFactory.currentModal.find('.modalWindowModal').animate({opacity:0,height:'100%',width:'100%'},1000,function(){if(ModalWindowFactory.currentModal){ModalWindowFactory.currentModal.remove();ModalWindowFactory.currentModal=null;}});}}
function Header(){return $("<div id='header'>"
+"<div id='areas'></div>"
+"<div id='browseMenuContainer'>"
+"<span class='bottomDropShadow'></span>"
+"</div>"
+"</div>");}
function InstitutionalBranding(){return $("<span class='institutionalBranding'></span>");}
function SearchBox(){var out=$("<div id='searchBox'>"
+"<span class='searchInputContainer'><input id='searchInput' type='text'/></span>"
+"<span id='searchButton'></span>"
+"</div>");out.find('#searchInput').focus(function(){if($(this).val()==ResourceManager.getString("search_title")){$(this).val("");}}).blur(function(){if($(this).val()==""){$(this).val(ResourceManager.getString("search_title"));}});EventDispatcher.addEventListener(Localization.events.localeChange,function(){out.find('#searchInput').val(ResourceManager.getString("search_title"));});return out;}
function addNavigationControls(){$('#areas').append("<div id='browseButton' class='browseButton'>"
+"<div>"
+"<div>"
+"<a id='browseArrow' class='browseButtonDownArrow' href='javascript:void(0)'></a>"
+"</div>"
+"</div>"
+"</div>");$('#browseMenuContainer').prepend("<div id='browseMenu'>"
+"<div id='scrollableListContainer'></div>"
+"</div>"
+"<span id='browseButtonBottom' class='browseButton'></span>");$('#browseButton, #browseButtonBottom').bind("click",toggleBrowseMenu);$('.browseButton').hover(function(){if($("#browseButton").hasClass('browseTab')){return;}
$("#browseButton").css("background-position","0px -205px");$("#browseButton div").css("background-position","0 -123px");$("#browseButton div div").css("background-position","right -164px");}).mouseleave(function(){if($("#browseButton").hasClass('browseTab')){return;}
$("#browseButton").css("background-position","0px -82px");$("#browseButton div").css("background-position","0 0px");$("#browseButton div div").css("background-position","right -41px");});EventDispatcher.addEventListener(Localization.events.localeChange,function(){$('#browseButton div div a').text(ResourceManager.getString("areas_label_browse"));});}
function toggleBrowseMenu(){if($('#browseMenu').is(':hidden')){$('#browseButton').removeClass("browseButton");$('#browseButton').addClass("browseTab");$("#browseButton").css("background-position","top left");$("#browseButton div").css("background-position","top right");$("#browseButton div div").css("background-position","top left");$('#browseArrow').removeClass('browseButtonDownArrow');$('#browseArrow').addClass('upArrow');$('#browseMenu').slideDown('normal',function(){$('body').click(function(){if(!$('#browseMenu').hasClass('over')){$('body').unbind('click');toggleBrowseMenu()}});});ScrollableList.slideDownScrollButtons();$('#browseMenu').bind('mouseenter',function(){$(this).addClass("over");});$('#browseMenu').bind('mouseleave',function(){$(this).removeClass("over");});}else{$('#browseButton').removeClass("browseTab");$('#browseButton').addClass("browseButton");$("#browseButton").css("background-position","0px -82px");$("#browseButton div").css("background-position","0 0px");$("#browseButton div div").css("background-position","right -41px");$('#browseArrow').removeClass('upArrow');$('#browseArrow').addClass('browseButtonDownArrow');$('#browseMenu').slideUp();ScrollableList.slideUpScrollButtons();$('body').unbind('click');}
return false;}
function BrowseMenu(){var out=$("<div id='browseMenuContainer'>"
+"<div id='browseMenu'>"
+"<div id='scrollableListContainer'></div>"
+"</div>"
+"<span id='browseButtonBottom' class='browseButton'></span>"
+"<span class='bottomDropShadow'></span>"
+"</div>");return out;}
function UserControls(){var out=$("<div id='globalNav'>"
+"<div>"
+"<ul>"
+"<li><a class='signOutText pointer'>"+ResourceManager.getString("userdetails_signout")+"</a></li>"
+"<li><a class='helpText pointer'>"+ResourceManager.getString("userdetails_help")+"</a></li>"
+"</ul>"
+"</div>"
+"</div>");out.find('.signOutText').click(function(){if($($('.signOutText')[0]).hasClass("proxyAccess")){return;}
CommonContext.user=null;CookieManager.remove("username");if(CommonContext.standalone){if(typeof(Messenger.messageHandler)=='function'){if($(this).hasClass('signIn')){Messenger.messageHandler(createRequestMessage("signin"));}else{Messenger.messageHandler(createRequestMessage("signout"));}}}else{window.location="login.html";}});out.find('.preferenceText').bind("click",Preferences.show);EventDispatcher.addEventListener(Localization.events.localeChange,function(){if(CommonContext.user){out.find('.signOutText').text(ResourceManager.getString("userdetails_signout"));out.find('.signOutText').addClass('signOut');}else{out.find('.signOutText').text(ResourceManager.getString("userdetails_signin"));out.find('.signOutText').addClass('signIn');}
out.find('.preferenceText').text(ResourceManager.getString("preferences_label"));out.find('.helpText').text(ResourceManager.getString("userdetails_help"));});return out;}
function FooterApplicationValueObject(appid,className,displayUI){this.appid=appid;this.className=className;this.displayUI=displayUI;}
function footerAppDiv(index,appId,html){this.index=index;this.appId=appId;this.html=html;}
var Footer={apps:[],uiMarker:"-ui",appContainers:[],displayUI:"<div id='outerFooter'>"
+"<div id='footer'>"
+"<div id='footerApplicationBar'>"
+"<ul id='footerIconContainer'></ul>"
+"<span class='footerBrandingLogo'></span>"
+"<div id='footerAppContainer'"
+"</div>"
+"</div>"
+"</div>"
+"</div>",initialize:function(){$('body').append(Footer.displayUI);$('.footerBrandingLogo').click(function(){var nav=Navigation.findNavigationEntry("institutionHomePage");if(nav&&nav instanceof NavigationEntryValueObject){Navigation.navigate(nav,null);}});},add:function(footerApplication){if(footerApplication instanceof FooterApplicationValueObject){var icon="<li><span id='"+footerApplication.appid+"' class='"+footerApplication.className+"'></span></li>";var ui=$("<div id='"+footerApplication.appid+this.uiMarker+"'></div>");ui.append(footerApplication.displayUI);$('#footerIconContainer').append(icon);$('#footerContainer').append(ui);this.apps.push(footerApplication);}},remove:function(appid){for(var x=0;x<this.apps.length;x++){if(this.apps[x].appid==appid){$('#'+this.apps[x].appid).parent().remove();$('#'+this.apps[x].appid+this.uiMarker).remove();}}},createContainer:function(footerDiv){if(footerDiv instanceof footerAppDiv){for(i=0;i<Footer.appContainers.length;i++){if(Footer.appContainers[i].appId==footerDiv.appId){$('#footerAppContainer').find('#'+footerDiv.appId).remove();}}
var ui=$("<div id='"+footerDiv.appId+"'></div>");var arrIndex=$("#footerAppContainer").children().length;if(footerDiv.index!=-1&&footerDiv.index!=null&&footerDiv.index<=$("#footerAppContainer").children().length){if($("#footerAppContainer").children().length>0){if(footerDiv.index!=0){$("#footerAppContainer").find('div:eq('+(footerDiv.index-1)+')').after(ui);}
else
if(footerDiv.index==0){$("#footerAppContainer").find('div:eq('+footerDiv.index+')').before(ui);}}
else{if(footerDiv.index==0){$("#footerAppContainer").append(ui);}}}
else{$("#footerAppContainer").append(ui);}
$('#footer').find('#'+footerDiv.appId).html(footerDiv.html);this.appContainers.push(footerDiv);}
return footerDiv;},getAppContainer:function(appId){var children=$("#footerAppContainer").children().size();var appNewDiv;var exists='false';for(i=0;i<Footer.appContainers.length;i++){if(Footer.appContainers[i].appId==appId){exists='true';appNewDiv=Footer.appContainers[i];break;}}
if(exists=="true"){return appNewDiv;}
else{return Footer.createContainer(new footerAppDiv(children,appId,""));}}};var ScrollableList={initialized:false,speed:5,height:110,interval:null,selectedList:null,marker:"___",totalColumns:2,numColumns:0,initialize:function(){this.add(ScrollableList.totalColumns);$('.navList > .scrollableListFolder').live('click',function(){ScrollableList.load($(this));});var menu=Navigation.menuList;for(var x in menu){if(x!="none"){if(menu[x]instanceof Array){$('.navList:first').append("<li id='"+ScrollableList.marker+x+"'  class='parent scrollableListFolder'><span>"+x+"</span></li>");}else{$('.navList:first').append("<li class='scrollableListItem'><span>"+menu[x]+"</span></li>");}}}
ScrollableList.refresh();$('.downButton').live("mouseover",function(){ScrollableList.selectedList=$(this).parent();ScrollableList.interval=setInterval(ScrollableList.scrolldown,50);});$('.downButton').live("mouseout",function(){clearInterval(ScrollableList.interval);});$('.upButton').live("mouseover",function(){ScrollableList.selectedList=$(this).parent();ScrollableList.interval=setInterval(ScrollableList.scrollup,50);});$('.upButton').live("mouseout",function(){clearInterval(ScrollableList.interval);});$(window).resize(function(){});ScrollableList.attachScrollButtonHandlers();},reinitialize:function(len){$('.navList > .scrollableListFolder').live('click',function(){ScrollableList.load($(this));});var menu=Navigation.menuList;for(var x in menu){if(x!="none"){if(len==1){$('.navList:first').append("<li id='"+ScrollableList.marker+x+"'  class='parent scrollableListFolder'><span>"+x+"</span></li>");}else{var temp="list_"+x;$('#'+temp).remove();$('.selectedListItem').removeClass("selectedListItem");$('.navList:first').append("<li id='"+ScrollableList.marker+x+"'  class='parent scrollableListFolder'><span>"+x+"</span></li>");}}}
ScrollableList.refresh();$('.downButton').live("mouseover",function(){ScrollableList.selectedList=$(this).parent();ScrollableList.interval=setInterval(ScrollableList.scrolldown,50);});$('.downButton').live("mouseout",function(){clearInterval(ScrollableList.interval);});$('.upButton').live("mouseover",function(){ScrollableList.selectedList=$(this).parent();ScrollableList.interval=setInterval(ScrollableList.scrollup,50);});$('.upButton').live("mouseout",function(){clearInterval(ScrollableList.interval);});$(window).resize(function(){});ScrollableList.attachScrollButtonHandlers();},add:function(count){if(!count||count<=0){count=1;}
var trackWidth=0;for(var x=0;x<count;x++){if(x==0){$('#scrollableListContainer').append(""
+"<div class='columns header'>"
+"<div class='scrollContainer'>"
+"<ul class='navList navListStart'></ul>"
+"</div>"
+"</div>");$('#scrollableListContainer').append(""
+"<div id='btn-l' class='btn-l'/>");$('#scrollableListContainer').append(""
+"<div id='columnsContainer'><div id='columnsContainerTrack'/></div>");$('#scrollableListContainer').append(""
+"<div id='btn-r' class='btn-r'/>");}else{ScrollableList.addColumn();}}},addColumn:function(){$('#columnsContainerTrack').append(""
+"<div class='columns'>"
+"<span class='scrollUpButton'></span>"
+"<div class='scrollContainer'>"
+"<ul class='navList'></ul>"
+"</div>"
+"<span class='scrollDownButton'></span>"
+"</div>");ScrollableList.numColumns++;var columnWidth=$('#columnsContainerTrack').find('.columns:first').width();$('#columnsContainerTrack').css('width',((ScrollableList.numColumns*columnWidth)+ScrollableList.numColumns)+'px');ScrollableList.setScrollButtonStates();},removeColumn:function(col){$('#columnsContainerTrack').find('.columns:last').remove();ScrollableList.numColumns--;var trackWidth=$('#columnsContainerTrack').find('.columns:first').width();$('#columnsContainerTrack').css('width',((ScrollableList.numColumns*trackWidth)+ScrollableList.numColumns)+'px');},load:function(item){var loc=item.attr('id').replace(ScrollableList.marker,"").split("___");item.parent().parent().parent().nextAll().find('.navList').each(function(i){ScrollableList.removeColumn();})
ScrollableList.addColumn();var next=null;if(item.parent().hasClass('navListStart')){next=item.parent().parent().parent().next().next().find('.navList:first');}else{next=item.parent().parent().parent().next().find('.navList');}
next.css("top","0");item.parent().find("li").removeClass("selectedListItem");item.addClass("selectedListItem");var list=Navigation.menuList;for(var x=0;x<loc.length;x++){if(list[loc[x]]){if(list[loc[x]]instanceof Array){list=list[loc[x]];}}}
for(var x in list){var id=Url.decode(item.attr('id')+"___"+x);if(list[x]instanceof Array){next.append("<li id='"+id+"' class='parent scrollableListFolder'><span>"+x+"</span></li>");}else if(list[x]instanceof NavigationEntryValueObject){var linkName=list[x].name.replace("&lsquo;","").replace(/-/gi," ccccc ").replace("&quot;","").replace(/[^(a-z_)/\u00D1\u00F10-9]/ig,'').replace(/ ccccc /gi,"-");next.append("<li class='scrollableListItem' onclick=\"toggleBrowseMenu();Navigation.navigate('"+linkName+"','"+list[x].path+"');\"><span>"+list[x].caption+"</span></li>");}else{ErrorManager.show("Unknown entry encountered.");}}
ScrollableList.refresh();},refresh:function(){$('.navList').each(function(i){if($(this).height()>ScrollableList.height){var up=$(this).parent().parent().find('.scrollUpButton');if(!up.hasClass("upButton")){up.removeClass("upButtonDisabled");up.addClass("upButton");up.append("<span class='navUpArrow'></span>");}
var down=$(this).parent().parent().find('.scrollDownButton');if(!down.hasClass("downButton")){down.removeClass("downButtonDisabled");down.addClass("downButton");down.append("<span class='navDownArrow'></span>");}}else{var up=$(this).parent().parent().find('.scrollUpButton');up.removeClass("upButton");up.addClass("upButtonDisabled");up.empty();var down=$(this).parent().parent().find('.scrollDownButton');down.removeClass("downButton");down.addClass("downButtonDisabled");down.empty();}});},scrollup:function(){if(ScrollableList.selectedList){var top=ScrollableList.selectedList.find('.navList').attr('offsetTop');var newTop=(top<0)?top+ScrollableList.speed:top;ScrollableList.selectedList.find('.navList').css("top",newTop+"px");}},scrolldown:function(){if(ScrollableList.selectedList){var height=ScrollableList.selectedList.find('.navList').attr('offsetHeight');var top=ScrollableList.selectedList.find('.navList').attr('offsetTop');var newTop=((height+top)>ScrollableList.height)?top-ScrollableList.speed:top;ScrollableList.selectedList.find('.navList').css("top",newTop+"px");}},attachScrollButtonHandlers:function(){var colWidth=$('#columnsContainerTrack').find('.columns:first').css('width');var isScrolling=false;function resetIsScrolling(){isScrolling=false;}
$("#btn-l").css("display","none");$("#btn-r").css("display","none");$("#btn-r").live("mouseover",function(){$(this).css({"border-color":"#369","background-position":"-52px center"});});$("#btn-r").live("mouseout",function(){$(this).css({"border-color":"#666","background-position":"-18px center"});});$("#btn-r").live("click",function(){if(!isScrolling){isScrolling=true;$("#columnsContainerTrack").animate({marginLeft:"-="+colWidth},500,function(){ScrollableList.setScrollButtonStates();setTimeout(resetIsScrolling,250);});}});$("#btn-l").live("mouseover",function(){$(this).css({"border-color":"#369","background-position":"-36px center"});});$("#btn-l").live("mouseout",function(){$(this).css({"border-color":"#666","background-position":"-1px center"});});$("#btn-l").live("click",function(){if(!isScrolling){isScrolling=true;$("#columnsContainerTrack").animate({marginLeft:"+="+colWidth},500,function(){ScrollableList.setScrollButtonStates();setTimeout(resetIsScrolling,250);});}});$("#btn-r, #btn-l").live("mousedown",function(){$(this).css({"border-color":"#036"});});$("#btn-r, #btn-l").live("mouseup",function(){$(this).css({"border-color":"#369"});});},setColumnContainerWidth:function(){},slideDownScrollButtons:function(){if($("#btn-l").hasClass('visible')){$("#btn-l").slideDown();}
if($("#btn-r").hasClass('visible')){$("#btn-r").slideDown();}},slideUpScrollButtons:function(){if($("#btn-l").hasClass('visible')){$("#btn-l").slideUp();}
if($("#btn-r").hasClass('visible')){$("#btn-r").slideUp();}},setScrollButtonStates:function(){var columnWidth=$('#columnsContainerTrack').find('.columns:first').width();var trackMarginLeft=$('#columnsContainerTrack').css('margin-left');trackMarginLeft=trackMarginLeft=='auto'?0:parseInt(trackMarginLeft);if(trackMarginLeft==0){$("#btn-l").fadeOut(250);$("#btn-l").removeClass('visible');}else{$("#btn-l").fadeIn(250);$("#btn-l").addClass('visible');}
if(((ScrollableList.numColumns*columnWidth)+trackMarginLeft)<=$('#columnsContainer').width()){$("#btn-r").fadeOut(250);$("#btn-r").removeClass('visible');}else{$("#btn-r").fadeIn(250);$("#btn-r").addClass('visible');}}};var StopWatch={startTime:null,start:function(){startTime=(new Date).getTime();},stop:function(){ErrorManager.show("elapsed: "+((new Date).getTime()-startTime)+" ms");}};function ColorPickerComponent(id,type,label,color,updateFunction,resetFunction){var out=$("<div class='colorPickerComponent'>"
+"<span class='colorpickerlabel "+type+"'>"+label+"</span>"
+"<div id='"+id+"' class='colorPickerControl'>"
+"<div style='background-color: "+color+"'>"
+"</div>"
+"</div>"
+"<span class='colorPickerReset'>"+ResourceManager.getString("common_reset")+"</span>"
+"</div>");out.find('.colorPickerReset').click(resetFunction);out.find('#'+id).ColorPicker({color:color,onShow:function(colpkr){$(colpkr).fadeIn(500);return false;},onHide:function(colpkr){$(colpkr).fadeOut(500);return false;},onChange:function(hsb,hex,rgb){updateFunction(hex);Theme.currentThemeName="custom";$('#changeTheme').val("custom");MessageProcessor.broadcast(wrapMessage(createStyleMessage()));}});return out;}
var Preferences={show:function(){var content=$("<div id='prefWindowContent'>"
+"<span class='prefLang'>"+ResourceManager.getString("preferences_language")+":"+"</span> "
+"<select id='changeLocale'>"
+"<option value='en'>English</option>"
+"<option value='es'>Espa&ntilde;ol</option>"
+"<option value='fr'>Fran&ccedil;ais</option>"
+"<option value='ar'>Arabic</option>"
+"<option value='xx'>Default</option>"
+"</select>"
+"<br><br><span class='prefTheme'>"+ResourceManager.getString("preferences_theme")+":"+"</span> <select id='changeTheme'></select>"
+"<br><br>"
+"<div class='colorPickerContainer'></div>"
+"</div>");var container=content.find('.colorPickerContainer');container.append(ColorPickerComponent("primaryColorSelector","primary",ResourceManager.getString("preferences_color_primary"),Theme.custom.colors.primary,Theme.setPrimaryColor,Theme.resetPrimaryColor));container.append(ColorPickerComponent("secondaryColorSelector","secondary",ResourceManager.getString("preferences_color_secondary"),Theme.custom.colors.secondary,Theme.setSecondaryColor,Theme.resetSecondaryColor));container.append(ColorPickerComponent("interactionColorSelector","interaction",ResourceManager.getString("preferences_color_interaction"),Theme.custom.colors.interaction,Theme.setInteractionColor,Theme.resetInteractionColor));container.append(ColorPickerComponent("selectionColorSelector","selection",ResourceManager.getString("preferences_color_selection"),Theme.custom.colors.selection,Theme.setSelectionColor,Theme.resetSelectionColor));container.append(ColorPickerComponent("primaryTextColorSelector","text",ResourceManager.getString("preferences_text"),Theme.custom.text.primary.color,Theme.setTextPrimaryColor,Theme.resetTextPrimaryColor));container.append(ColorPickerComponent("secondaryTextColorSelector","text",ResourceManager.getString("preferences_text"),Theme.custom.text.secondary.color,Theme.setTextSecondaryColor,Theme.resetTextSecondaryColor));EventDispatcher.addEventListener(Localization.events.localeChange,function(){content.find('.prefLang').text(ResourceManager.getString("preferences_language")+":");content.find('.prefTheme').text(ResourceManager.getString("preferences_theme")+":");content.find('.colorpickerlabel.primary').text(ResourceManager.getString("preferences_color_primary"));content.find('.colorpickerlabel.secondary').text(ResourceManager.getString("preferences_color_secondary"));content.find('.colorpickerlabel.interaction').text(ResourceManager.getString("preferences_color_interaction"));content.find('.colorpickerlabel.selection').text(ResourceManager.getString("preferences_color_selection"));content.find('.colorPickerReset').text(ResourceManager.getString("common_reset"));});var val=CookieManager.get("theme");if(!val){val=Theme.defaultTheme;}
content.find('#changeTheme').append("<option value='custom'>custom</option>");for(var x in Theme.themes){content.find('#changeTheme').append("<option value='"+x+"' "+(val==x?"selected":"")+">"+x+"</option>");}
if(CommonContext.locale){content.find('#changeLocale').val(CommonContext.locale);}
content.find('#changeTheme').change(function(){if($(this).val()=="none"){return;}
Theme.setTheme($(this).val());});content.find('#changeLocale').change(function(){ResourceManager.setLocale($(this).val());});$('#prefWindowCloseButton').click(function(){Theme.save();ModalWindowFactory.close();});var buttons=[Button("saveTabCreationButton","common_save",Preferences.save)];ModalWindowFactory.show("prefWindowModal","preferences_label_title","",content,"",buttons,ModalWindowFactory.close);},save:function(){Theme.save();CookieManager.set("locale",$('#changeLocale').val());ModalWindowFactory.close();}}