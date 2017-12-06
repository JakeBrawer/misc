
function ContextValueObject(){this.appid="";this.host="";this.locale="";this.pageName="";};var ContentManager={container:"content",commonUIPlatformMarker:"CUIP",initialize:function(){$('body').append("<div id='"+ContentManager.container+"'></div>");ContentManager.calculateContentHeight();},open:function(nav,context){this.addContent(nav,context);},close:function(name){this.removeContent(name);},closeAll:function(){$('#'+this.container+' > iframe').each(function(i){ContentManager.removeContent($(this).attr('id'));});},removeCUIP:function(name){if(name.indexOf("_"+this.commonUIPlatformMarker)!==-1){name=name.substring(0,name.indexOf("_"+this.commonUIPlatformMarker));}
return name;},addContent:function(nav,context){Application.navigateToURL(nav.url);return;},removeContent:function(name){OpenItems.remove(name);$('#'+name).remove();if(ChannelManager.channels[name]){delete ChannelManager.channels[name];}},bringToFront:function(name){$('#'+this.container+' > iframe').css("visibility","visible");$('#'+name).css("visibility","visible");this.setActiveTab(name+OpenItems.openItemMarker);var item=OpenItems.getOpenItemByName(name);if(item&&item.navigationEntry instanceof NavigationEntryValueObject){if(FragmentManager){FragmentManager.set(item.navigationEntry.menu+"/"+item.navigationEntry.caption+"/"+this.getCUIP(name));}
this.setTitle(item.navigationEntry.caption);}},setActiveTab:function(name){$('#'+OpenItems.container+' > li').removeClass("activeOpenItem");$('#'+OpenItems.container+' > #'+name).addClass("activeOpenItem");},setTitle:function(title){if(title){$(document).attr("title",title+" - Magellan");}},calculateContentHeight:function(){var headerHeight=$('#header:visible').height();var footerHeight=$('#outerFooter').height();if(!headerHeight){headerHeight=0;}},generateUniqueId:function(){var dateObject=new Date();var uniqueId=this.commonUIPlatformMarker
+Math.floor(Math.random()*10001);return uniqueId;},getCUIP:function(name){name=name.substring((name.indexOf(this.commonUIPlatformMarker)));if(name.indexOf("_")!==-1){name=name.substring(0,name.indexOf("_"));}
return name;}};function NavigationEntryValueObject(){this.id="";this.name="";this.menu="";this.caption="";this.host="";this.page="";this.parent="";this.protocol="";this.port="";this.path="";this.options="";};NavigationEntryValueObject.prototype.toXML=function(){var xml="<NavigationEntryValueObject ";for(var x in this){if(typeof(this[x])!=='function'&&this[x]!=null&&x!="url"){xml+=x+"=\""+this[x]+"\" ";}}
xml+="/>";return xml;};var Navigation={initialized:false,endpoints:[],standaloneEndpoints:["/magellan-ws/resources/navigationentries/ssb"],endpointIndex:-1,menuList:[],parentMenu:null,initialize:function(){Navigation.endpointIndex+=1;if(Navigation.endpointIndex>=Navigation.endpoints.length){ErrorManager.show("Unable to load navigation entries.");return false;}
var ep=Navigation.endpoints[Navigation.endpointIndex];ep=ep.replace(":owner",CommonContext.pidm);ep=ep.replace(":roles",CommonContext.roles);var endpoint=window.location.protocol
+"//"
+window.location.host
+ep;ServiceManager.get(endpoint,Navigation.handleServiceResults);},handleServiceResults:function(xmldoc){if(!xmldoc){Navigation.initialized=false;return;}
if(xmldoc.status){if(xmldoc.status==404||xmldoc.status==500){Navigation.initialize();return;}}
var vo=Navigation.loadXML(xmldoc);if(CommonContext.standalone==true){var nav=vo[0];if(nav!=null){var location=nav.menu.split("/");Navigation.removeParent(location);for(var x in vo){if(vo[x]instanceof NavigationEntryValueObject){Navigation.addMenuEntryStandAlone(vo[x]);nav=vo[x];}}
ScrollableList.reinitialize(location);Navigation.initialized=true;}}else{for(var x in vo){if(vo[x]instanceof NavigationEntryValueObject){Navigation.addMenuEntry(vo[x]);}}
ScrollableList.initialize();Navigation.initialized=true;}},handleServiceResults1:function(xmldoc){if(!xmldoc){Navigation.initialized=false;return;}
if(xmldoc.status){if(xmldoc.status==404||xmldoc.status==500){Navigation.initialize();return;}}
var vo=Navigation.loadXML(xmldoc);for(var x in vo){if(vo[x]instanceof NavigationEntryValueObject){Navigation.addMenuEntry(vo[x]);}}
ScrollableList.initialize();Navigation.initialized=true;},loadXML:function(xmldoc){if(!xmldoc){return;}
var entries=xmldoc.getElementsByTagName("navigationEntryValueObject");var vo=[];for(var x=0;x<entries.length;x++){if(!entries[x].attributes){continue;}
var nav=new NavigationEntryValueObject();for(var y=0;y<entries[x].attributes.length;y++){nav[entries[x].attributes[y].nodeName]=entries[x].attributes[y].nodeValue;}
if(!nav.menu){nav.menu="none";}
if(Navigation.parentMenu!=null&&CommonContext.standalone==true){if(Navigation.parentMenu.menu==""||Navigation.parentMenu.menu==null)
{nav.menu=Navigation.parentMenu.caption;var arr=Navigation.parentMenu.path.split("/");nav.path="/"+arr[1]+"/"+nav.path;}else{nav.menu=Navigation.parentMenu.menu+"/"+Navigation.parentMenu.caption;var arr=Navigation.parentMenu.path.split("/");nav.path="/"+arr[1]+"/"+nav.path;}
nav.port=Navigation.parentMenu.port;nav.protocol=Navigation.parentMenu.protocol;nav.host=Navigation.parentMenu.host;}
nav.url=(nav.protocol?nav.protocol+"://":"")
+(nav.host?nav.host:"")
+(nav.port?":"+nav.port:"")
+(nav.path?nav.path:"")
+(nav.options?nav.options:"");vo.push(nav);}
return vo;},isInitialized:function(){return initialized;},addMenuEntryStandAlone:function(nav){if(nav.menu==null||!(nav instanceof NavigationEntryValueObject)){return;}
var location=nav.menu.split("/");Navigation.recurseMenuStructureStandAlone(location,nav);},recurseMenuStructureStandAlone:function(hierarchy,nav){var tmpArray=Navigation.menuList;var singleArr=[nav];var indx=0;$.each(hierarchy,function(i,value){if(!tmpArray[i]&&!tmpArray[value]){tmpArray[value]=[];}
indx=indx+1;tmpArray=tmpArray[value];});tmpArray[nav.caption]=nav;return tmpArray;},addMenuEntry:function(nav){if(nav.menu==null||!(nav instanceof NavigationEntryValueObject)){return;}
var location=nav.menu.split("/");Navigation.recurseMenuStructure(location).push(nav);},recurseMenuStructure:function(hierarchy){var tmpArray=Navigation.menuList;for(var x in hierarchy){if(!tmpArray[hierarchy[x]]){tmpArray[hierarchy[x]]=[];}
tmpArray=tmpArray[hierarchy[x]];}
return tmpArray;},removeParent:function(hierarchy){var tmpArray=Navigation.menuList;var indx=0;$.each(hierarchy,function(i,value){indx=indx+1;if(tmpArray[value]instanceof NavigationEntryValueObject&&indx==hierarchy.length){tmpArray[value]=[];}else{tmpArray=tmpArray[value];}});return tmpArray;},generateHTMLMenu:function(){return Navigation.recurseGenerateMenu(Navigation.menuList);},recurseGenerateMenu:function(menu){var out="";for(var x in menu){if(menu[x]instanceof Array){out+="<li class='ui-finder-folder'><a>"+x+"</a>";out+="<ul>"+Navigation.recurseGenerateMenu(menu[x])+"</ul>";out+="</li>";}else if(menu[x]instanceof NavigationEntryValueObject){out+="<li onclick=\"toggleBrowseMenu();Navigation.navigate('"+menu[x].name+"','"+menu[x].path+"');\"><a>"+menu[x].caption+"</a></li>";}}
return out;},findNavigationEntry:function(name){if(!name){return false;}
if(name.indexOf("/")!=-1){return Navigation.pathFindNavigationEntry(name);}else
return Navigation.recurseFindNavigationEntry(Navigation.menuList,name,null);},findNavigationEntryByPath:function(name,pathLoc){if(!name){return false;}
if(name.indexOf("/")!=-1){return Navigation.pathFindNavigationEntry(name);}else{return Navigation.recurseFindNavigationEntry(Navigation.menuList,name,pathLoc);}},pathFindNavigationEntry:function(name){var leaf=name.substring(name.lastIndexOf("/")+1);var branch=name.substring(0,name.lastIndexOf("/"));var hierarchy=branch.split("/");var tmpArray=Navigation.menuList;for(var x in hierarchy){if(tmpArray[hierarchy[x]]&&tmpArray[hierarchy[x]]instanceof Array){tmpArray=tmpArray[hierarchy[x]];}}
if(tmpArray){for(var x in tmpArray){if(tmpArray[x]instanceof NavigationEntryValueObject){if(tmpArray[x].name==leaf||tmpArray[x].caption==leaf){return tmpArray[x];}}}}
return null;},recurseFindNavigationEntry:function(menu,name,pathLoc){var out=null;for(var x in menu){if(menu[x]instanceof Array){out=Navigation.recurseFindNavigationEntry(menu[x],name,pathLoc);}else if(menu[x]instanceof NavigationEntryValueObject){if(menu[x].name==name&&pathLoc==null)
out=menu[x];else if(menu[x].name==name&&(pathLoc!=null&&menu[x].path==pathLoc))
out=menu[x];}
if(out!=null){break;}}
return out;},findNavigationEntryCaption:function(name){var navEntry=Navigation.findNavigationEntry(name);if(navEntry){return navEntry.caption;}
return null;},findNavigationEntrySource:function(name){var navEntry=Navigation.findNavigationEntry(name);if(navEntry){return navEntry.url;}
return null;},navigate:function(nav,pathLoc){var navEntry;if(nav instanceof NavigationEntryValueObject){navEntry=nav;}else{navEntry=Navigation.findNavigationEntryByPath(nav,pathLoc);}
if(!navEntry){return;}
if(navEntry.page&&navEntry.parent){var app=OpenItems.findAnyOpenItemByName(navEntry.parent);if(app instanceof OpenItemValueObject&&app.navigationEntry instanceof NavigationEntryValueObject){ContentManager.bringToFront(app.navigationEntry.name+"_"+app.cuipid);}else{var context=new ContextValueObject()
context.pageName=navEntry.page;ContentManager.open(Navigation.findNavigationEntry(navEntry.parent),context);}
if($("li.activeOpenItem")){var activeFrameName=$("li.activeOpenItem").attr("id").replace(OpenItems.openItemMarker,"");ChannelManager.send(createApplicationPageNavigationMessage(navEntry.page),activeFrameName);}}else{var app=OpenItems.findAnyOpenItemByName(navEntry.name);if(app){ContentManager.bringToFront(app.navigationEntry.name+"_"+app.cuipid);}else{var context=new ContextValueObject()
if(navEntry.page!==""){context.pageName=navEntry.page;}
ContentManager.open(navEntry,context);}}
if(CommonContext.standalone==true){Navigation.nextNavItem(nav);}
if(WorkspaceManager){$('#areasMenu > li.workspace').removeClass("activeWorkspace");var ws=WorkspaceManager.findWorkspaceByNavigationEntryName(navEntry.name);if(ws){$('#areasMenu > #'+WorkspaceManager.marker+ws.id).addClass('activeWorkspace');}}},nextNavItem:function(nav){var navEntry;if(CommonContext.udcid==null){return;}
if(nav instanceof NavigationEntryValueObject){navEntry=nav;}else{navEntry=Navigation.findNavigationEntry(nav);}
if(Navigation.parentMenu==null)
{var ep=Navigation.standaloneEndpoints[0]+"/standalone_role_nav_bar/"+CommonContext.udcid;var endpoint=AuroraService.protocol+"://"+AuroraService.host+ep;Navigation.parentMenu=navEntry;$.ajax({type:"GET",url:endpoint,data:"callback=?",dataType:"json",success:function(data){var options={formatOutput:true};var xmlData=$.json2xml(data,options);Navigation.handleServiceResults1(parseXML(xmlData));},error:function(data){alert("UDCXML failure");}});}
else{if(navEntry.options==""||navEntry.options==null){var tempArr=navEntry.path.split("/");var ep=Navigation.standaloneEndpoints[0]+"/"+tempArr[tempArr.length-1]+"/"+CommonContext.udcid;var endpoint=AuroraService.protocol+"://"+AuroraService.host+ep;Navigation.parentMenu=navEntry;$.ajax({type:"GET",url:endpoint,data:"callback=?",dataType:"json",success:function(data){var options={formatOutput:true};var xmlData=$.json2xml(data,options);Navigation.handleServiceResults1(parseXML(xmlData));},error:function(data){alert("Navigation failure");}});}
else{var temp=navEntry.options.substring(navEntry.options.lastIndexOf("=")+1)
var ep=Navigation.standaloneEndpoints[0]+"/"+temp+"/"+CommonContext.udcid;var endpoint=AuroraService.protocol+"://"+AuroraService.host+ep;Navigation.parentMenu=navEntry;$.ajax({type:"GET",url:endpoint,data:"callback=?",dataType:"json",success:function(data){var options={formatOutput:true};var xmlData=$.json2xml(data,options);Navigation.handleServiceResults1(parseXML(xmlData));},error:function(data){alert("Navigation failure");}});}}}};function WorkspaceValueObject(){this.home=false;this.id=-1;this.name="";this.navigationEntries=[];this.owner=-1;this.version=-1;};var WorkspaceManager={spaces:[],endpoints:{query:[],create:"/magellan-ws/resources/workspaces/create",remove:"/magellan-ws/resources/workspaces/remove/:id"},endpointIndex:-1,temporarySpace:null,marker:"workspace_",initialized:false,events:{initialized:"workspaceManagerInitialized"},initialize:function(){WorkspaceManager.initialized=false;EventDispatcher.addEventListener(WorkspaceManager.events.initialized,function(val){var nav=null;var frag=FragmentManager.get();if(frag){nav=Navigation.findNavigationEntry(frag)}else{if(val&&(val instanceof NavigationEntryValueObject||typeof(val)=="string")){nav=val;}else{nav="banstu-entergrades";}}
Navigation.navigate(nav,null);});$('#areas').append(""
+"<ul id='areasMenu'>"
+"<li class='areasListItem'>"
+"<span class='workspaceDivider'></span>"
+"</li>"
+"</ul>");$('#areas').find('#areasMenu').after(Button("addWorkspaceButton","areas_label_addtabWithPlusSymbol",WorkspaceManager.create));$('#workspaceSaveButton').click(function(){WorkspaceManager.save();});$('#cancelTabCreationButton, #addTabModal > .modalCloseIcon').click(function(){WorkspaceManager.cancelAndRemove();})
WorkspaceManager.load();},load:function(){WorkspaceManager.endpointIndex+=1;if(WorkspaceManager.endpointIndex>=WorkspaceManager.endpoints.query.length){ErrorManager.show("Unable to load workspaces.");return false;}
var endpoint=window.location.protocol
+"//"
+window.location.host
+WorkspaceManager.endpoints.query[WorkspaceManager.endpointIndex].replace(":owner",CommonContext.pidm);},loadXML:function(xmldoc){if(!xmldoc){WorkspaceManager.initialized=false;return;}
if(xmldoc.status){if(xmldoc.status==404||xmldoc.status==500){WorkspaceManager.load();return;}}
var entries=xmldoc.getElementsByTagName("WorkspaceValueObject");var home=null;for(var x=0;x<entries.length;x++){if(!entries[x].attributes){continue;}
var ws=new WorkspaceValueObject();for(var y=0;y<entries[x].attributes.length;y++){ws[entries[x].attributes[y].nodeName]=entries[x].attributes[y].nodeValue;}
var navEntries=Navigation.loadXML(entries[x].getElementsByTagName("NavigationEntries")[0]);if(navEntries){ws.navigationEntries=navEntries;}
WorkspaceManager.add(ws);if(ws.home=="true"){home=ws.navigationEntries[0];}}
WorkspaceManager.initialized=true;EventDispatcher.dispatchEvent(WorkspaceManager.events.initialized,home);},add:function(workspace){if(workspace instanceof WorkspaceValueObject){var w=$("<li id='"+WorkspaceManager.marker+workspace.id+"' class='workspace'>"
+"<span id='workspaceText'>"
+workspace.name
+"</span>"
+"<span class='workspaceDivider'></span>"
+"</li>");var intervalID=null;w.click(function(){}).mouseover(function(){intervalID=setTimeout(addEditClass,750);function addEditClass(){w.addClass("edit");w.bind("click",WorkspaceManager.edit);}}).mouseleave(function(){clearTimeout(intervalID);w.removeClass("edit");w.unbind("click",WorkspaceManager.edit);}).mouseout(function(){clearTimeout(intervalID);w.removeClass("edit");w.unbind("click",WorkspaceManager.edit);});$('#areasMenu').append(w);this.spaces.push(workspace);}},findWorkspaceById:function(id){for(var x in this.spaces){if(this.spaces[x].id==id){return this.spaces[x];}}
return null;},findWorkspaceByName:function(name){for(var x in this.spaces){if(this.spaces[x].name==name){return this.spaces[x];}}
return null;},findWorkspaceByNavigationEntryName:function(name){for(var x=0;x<WorkspaceManager.spaces.length;x++){if(WorkspaceManager.spaces[x].navigationEntries){var entries=WorkspaceManager.spaces[x].navigationEntries;for(var y=0;y<entries.length;y++){if(entries[y].name==name){return WorkspaceManager.spaces[x];}}}}
return null;},edit:function(id){if(typeof(id)=='object'){if($(this).attr('id')){id=$(this).attr('id').replace(WorkspaceManager.marker,"");}}
var workspace=WorkspaceManager.findWorkspaceById(id);if(!(workspace instanceof WorkspaceValueObject)){ErrorManager.show("Unable to find the workspace to edit.");}
WorkspaceManager.temporarySpace=workspace;$('#areasMenu > li').removeClass('activeWorkspace');$('#areasMenu > #'+WorkspaceManager.marker+workspace.id).addClass('activeWorkspace');var content="<div class='tabContentDiv'>"
+"<span class='tabInfoTitle tabName'>"+
ResourceManager.getString("tab_label_name")+':'+"</span>"
+"<input id='workspaceNameText' type='text'>"
+"</div>"
+"<span class='spacer'></span>"
+"<div class='tabContentDiv'>"
+"<span class='tabInfoTitle'>"+ResourceManager.getString("tab_label_setAsHome")+':'+"</span>"
+"<input id='homeWorkspaceCheckbox' class='tabRadio' type='checkbox'/>"
+"</div>";var buttons=[];buttons.push(Button("saveTabCreationButton","common_save",WorkspaceManager.save));buttons.push(Button("cancelTabCreationButton","common_cancel",WorkspaceManager.cancel));buttons.push(Button("removeTabCreationButton","common_remove",WorkspaceManager.remove));ModalWindowFactory.show("editTabModal","areas_label_edittab","",content,"tabContentHeight",buttons,WorkspaceManager.cancel);$('#workspaceNameText').val(workspace.name);$('#workspaceNameText').bind("keyup",WorkspaceManager.trackWorkspaceName);$('#homeWorkspaceCheckbox').attr('checked',(workspace.home=="true"?true:false));},create:function(){var oi=OpenItems.getActiveOpenItem();if(!oi||!(oi instanceof OpenItemValueObject)||!oi.navigationEntry||!(oi.navigationEntry instanceof NavigationEntryValueObject)){ErrorManager.show("There is no active page.");return;}
var space=new WorkspaceValueObject();space.id=-1;space.name=oi.navigationEntry.caption;space.owner=37853;WorkspaceManager.temporarySpace=space;WorkspaceManager.add(WorkspaceManager.temporarySpace);$('#areasMenu > li').removeClass('activeWorkspace');$('#areasMenu > #'+WorkspaceManager.marker+WorkspaceManager.temporarySpace.id).addClass('activeWorkspace');var content="<div class='tabContentDiv'>"
+"<span class='tabInfoTitle tabName'>"+ResourceManager.getString("tab_label_name")+':'+"</span>"
+"<input id='workspaceNameText' type='text'>"
+"</div>"
+"<div class='tabContentDiv'>"
+"<span class='tabInfoTitle addContent'>"+ResourceManager.getString("tab_label_addContent")+':'+"</span>"
+"<div class='tabRadioGroup'>"
+"<input type='radio' name='tabContentRadio' class='tabRadio' value='this' checked />"
+"<span class='tabInfoText thisPage'>"+ResourceManager.getString("tab_label_bookmarkThisPage")+"</span>"
+"<input type='radio' name='tabContentRadio' class='tabRadio clearBoth' value='other' />"
+"<span class='tabInfoText otherPage'>"+ResourceManager.getString("tab_label_findOtherPage")+"</span>"
+"</div>"
+"</div>"
+"<span class='spacer'></span>"
+"<div class='tabContentDiv'>"
+"<span class='tabInfoTitle'>"+ResourceManager.getString("tab_label_setAsHome")+':'+"</span>"
+"<input id='homeWorkspaceCheckbox' class='tabRadio' type='checkbox'/>"
+"</div>";var buttons=[];buttons.push(Button("saveTabCreationButton","common_save",WorkspaceManager.save));buttons.push(Button("cancelTabCreationButton","common_cancel",WorkspaceManager.cancelAndRemove));ModalWindowFactory.show("addTabModal","areas_label_addtab","",content,"tabContentHeight",buttons,WorkspaceManager.cancelAndRemove);var oi=OpenItems.getActiveOpenItem();$('#workspaceNameText').val(oi.navigationEntry.caption);$('#workspaceNameText').bind("keyup",WorkspaceManager.trackWorkspaceName);},trackWorkspaceName:function(){if(WorkspaceManager.temporarySpace){$('#'+WorkspaceManager.marker+WorkspaceManager.temporarySpace.id).find('#workspaceText').text($('#workspaceNameText').val());}},cancel:function(){ModalWindowFactory.close();if($('#areasMenu > #'+WorkspaceManager.marker+WorkspaceManager.temporarySpace.id).length>0){$('#areasMenu > #'+WorkspaceManager.marker+WorkspaceManager.temporarySpace.id+' > #workspaceText').text(WorkspaceManager.temporarySpace.name);}
this.temporarySpace=null;$('#workspaceNameText').unbind("keyup");$('#workspaceCancelButton').unbind("click");},cancelAndRemove:function(){if(WorkspaceManager.temporarySpace){var tmp=WorkspaceManager.temporarySpace;$('#areasMenu').find('li').each(function(i){if($(this).attr("id")===(WorkspaceManager.marker+tmp.id)){$(this).empty();$(this).remove();}});}
WorkspaceManager.cancel();},save:function(){if(!WorkspaceManager.temporarySpace){return;}
var name=$('#workspaceNameText').val();var what=$("input[name='tabContentRadio']:checked").val();var home=$('#homeWorkspaceCheckbox').is(':checked');var entries=[];if(what=="this"){var oi=OpenItems.getActiveOpenItem();if(oi&&oi instanceof OpenItemValueObject&&oi.navigationEntry&&oi.navigationEntry instanceof NavigationEntryValueObject){WorkspaceManager.temporarySpace.navigationEntries.push(oi.navigationEntry);}}
entries=WorkspaceManager.temporarySpace.navigationEntries;var xml="<?xml version=\"1.0\" encoding=\"utf-8\"?>"
+"<Workspaces>"
+"<WorkspaceValueObject version=\""+WorkspaceManager.temporarySpace.version+"\" home=\""+home+"\" id=\""+WorkspaceManager.temporarySpace.id+"\" name=\""+name+"\" owner=\""+WorkspaceManager.temporarySpace.owner+"\">"
if(entries.length>0){xml+="<NavigationEntries>";for(var x in entries){xml+=entries[x].toXML();}
xml+="</NavigationEntries>";}
xml+="</WorkspaceValueObject></Workspaces>";ServiceManager.post(WorkspaceManager.endpoints.create,xml,handleResult);function handleResult(xmlhttp){if(xmlhttp){if(xmlhttp.status!==201){ErrorManager.show("Problem saving the workspace: "+xmlhttp.status+", "+xmlhttp.statusText);}else{var entries=xmlhttp.responseXML.getElementsByTagName("WorkspaceValueObject");if(entries.length>0){if(!entries[0].attributes){ErrorManager.show("Problem saving the workspace: invalid data returned");return;}
var ws=new WorkspaceValueObject();for(var y=0;y<entries[0].attributes.length;y++){ws[entries[0].attributes[y].nodeName]=entries[0].attributes[y].nodeValue;}
var navEntries=Navigation.loadXML(entries[0].getElementsByTagName("NavigationEntries")[0]);if(navEntries){ws.navigationEntries=navEntries;}
if(!ws.id){ErrorManager.show("Problem saving the workspace: no id returned.");return;}
for(var x=0;x<WorkspaceManager.spaces.length;x++){if(WorkspaceManager.spaces[x].id==-1||WorkspaceManager.spaces[x].id==ws.id){WorkspaceManager.spaces[x]=ws;}}
$('#'+WorkspaceManager.marker+"-1").attr("id",WorkspaceManager.marker+ws.id);}}}}
$('#workspaceNameText').unbind("keyup",WorkspaceManager.trackWorkspaceName);ModalWindowFactory.close();},remove:function(id){if(!id){id=WorkspaceManager.temporarySpace.id;}else{if(typeof(id)=='object'){id=WorkspaceManager.temporarySpace.id;}
id=id.replace(WorkspaceManager.marker,"");}
var vo=WorkspaceManager.findWorkspaceById(id);ServiceManager.remove(WorkspaceManager.endpoints.remove.replace(":id",vo.id),null,handleResult);function handleResult(xmlhttp){if(xmlhttp){if(xmlhttp.status!==204){ErrorManager.show("Problem saving the workspace: "+xmlhttp.status+", "+xmlhttp.statusText);}else{for(var x=0;x<WorkspaceManager.spaces.length;x++){if(WorkspaceManager.spaces[x].id==id){WorkspaceManager.spaces.splice(x,1);break;}}
$('#'+WorkspaceManager.marker+id).empty();$('#'+WorkspaceManager.marker+id).remove();ModalWindowFactory.close();}}}}};function OpenItemValueObject(navigationEntry,context){this.name=navigationEntry.name;this.cuipid=ContentManager.generateUniqueId();this.navigationEntry=navigationEntry;this.context=context;}
var OpenItems={items:[],openItemMarker:"-openitem",container:"openItems",initialize:function(){var oi=$("<div id='openItemsContainer'>"
+"<div id='openItemsHeader'>"
+"<div>"
+"<h3><span class='openItemsCount'>Open Items (0)</span></h3>"
+"<span id='headerCloseButton' alt='Close' title='Close'></span>"
+"</div>"
+"</div>"
+"<div id='openItemsBody'>"
+"<ul id='categoryList' style='height:150px; overflow:auto'></ul>"
+"</div>"
+"<div id='openItemsFooter'>"
+"<div class='buttonBar'>"
+"</div>"
+"</div>"
+"</div>");oi.find('.buttonBar').append(Button("closeAllOpenItemsButton","openitems_label_closeAll",function(){ContentManager.closeAll();toggleFooterOpenItems();}));oi.find('.buttonBar').append(Button("closeOpenItemsButton","openitems_label_closeSelected",function(){ContentManager.close($("li.activeOpenItem").attr("id").replace(OpenItems.openItemMarker,""));}));$("#headerCloseButton, #footerOpenItemsApplication").bind("click",toggleFooterOpenItems);$("#openItemsIcon").click(function(){$("#openItemsContainer").show();});$("#categoryList > li > h4").live("click",function(){if($(this).next().is(':visible')){$(this).find('div').removeClass('downArrow');$(this).find('div').addClass('rightArrow');}else{$(this).find('div').removeClass('rightArrow');$(this).find('div').addClass('downArrow');}
$(this).next().toggle("fast");});$(".itemList li").click(function(){ContentManager.setActiveTab($(this).attr("id"));});},add:function(openItem){var found=false;var category=openItem.navigationEntry.menu.substring(openItem.navigationEntry.menu.lastIndexOf("/")+1);var name=openItem.navigationEntry.name+"_"+openItem.cuipid;var tab=name+this.openItemMarker;$('#categoryList > li').each(function(i){if($(this).find('h4').text()===category){$(this).find('ul').append("<li id='"+tab+"' class='activeOpenItem' onclick=\"ContentManager.bringToFront('"+name+"');\"><a>"+openItem.navigationEntry.caption+"</a></li>");found=true;}});if(!found){var newCategory="<li>"
+"<h4><div class='downArrow'></div>"+category+"</h4>"
+"<ul class='itemList' id='openItems'>"
+"<li id='"+tab+"' class='activeOpenItem' onclick=\"ContentManager.bringToFront('"+name+"');\"><a>"+openItem.navigationEntry.caption+"</a></li>"
+"</ul>"
+"</li>";$('#categoryList').append(newCategory);}
this.items[name]=openItem;this.updateCountDisplay();},addApplicationPage:function(appid,page){var element=$('#categoryList > li > ul > #'+appid+OpenItems.openItemMarker);var name=appid+"-"+page+OpenItems.openItemMarker;if(element.length==1){$('#categoryList > li > ul > li').removeClass("activeOpenItem");element.after("<li id='"+name+"' class='activeOpenItem' onclick=\"ContentManager.bringToFront('"+name+"');\"><a>"+page+"</a></li>");}
this.updateCountDisplay();},findAnyOpenItemByName:function(name){name=ContentManager.removeCUIP(name);for(var x in this.items){if(name===ContentManager.removeCUIP(this.items[x].name)){return this.items[x];}}
return null;},getOpenItems:function(){return this.items;},getOpenItemById:function(id){for(var x in this.items){if(this.items[x].navigationEntry&&this.items[x].navigationEntry.id===id){return this.items[x];}}
return null;},getOpenItemByName:function(name){if(this.items[name]){return this.items[name];}
return null;},gotoPreviousTab:function(){if($("li.activeOpenItem").prev().length>0){$("li.activeOpenItem").prev().trigger("click");}else{$("li.activeOpenItem").next().trigger("click");}},isOpen:function(name){if(this.items[name]){return true;}
return false;},size:function(){var count=0;for(var x in this.items){count+=1;}
return count;},remove:function(name){delete this.items[name];var name=name+this.openItemMarker
if($('#'+name).attr("className")=="activeOpenItem"){this.gotoPreviousTab();}
var parentCategory=$('#'+name).parent().parent();if(parentCategory.find('li').length===1){parentCategory.empty();parentCategory.remove();}else{$('#'+name).remove();}
this.updateCountDisplay();},removeApplicationPage:function(appid,page){var name=appid+"-"+page+OpenItems.openItemMarker;var element=$('#'+name);if(element.length==1){element.remove();}
this.updateCountDisplay();},updateCountDisplay:function(){$('.openItemsCount').text("Open Items ("+this.size()+")");},getActiveOpenItem:function(){if($('.activeOpenItem').length<=0){return null;}
var name=$('.activeOpenItem').attr('id').replace(OpenItems.openItemMarker,"");if(name){return this.getOpenItemByName(name);}
return null;}};function toggleFooterOpenItems(){if($('#openItemsContainer').is(":hidden")){$('#footerOpenItemsApplication').addClass("footerOpenItemsIconHover");$('#openItemsContainer').css("left",$("#footerOpenItemsApplication").offset().left);$('#openItemsContainer').fadeIn();}else{$('#footerOpenItemsApplication').removeClass("footerOpenItemsIconHover");$('#openItemsContainer').fadeOut();}}