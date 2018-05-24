/////////////////////////////////////////////////////////////////////////////////////
// global
var
 g_cats
,g_ext=external
,g_setting=g_ext.setting
,g_app=g_ext.app
,g_initBookmark=false
,g_initHome=false
,g_initToolbar=false
,g_initAccel=false
,g_initSearch=false
,g_initUserAgent=false
,g_initMouseAction=false
,g_initScriptSetting=false
,g_initTridentEtcSetting=false
,g_initImagePanning=false
,g_loadUrlAction
,g_initSuperdd
,g_initTabSnapshot
,g_initUrlAction
,g_initStyleSheet
,g_urlAction
,g_initBHO
,g_bhoList
,g_initProxy=false
,g_defaultTabFont=true
,g_settings=[
	  // 0: category 1: setting name 2: init setting func
	  ["main,","startSetting",null]
	, ["main,tab,","appStyleSetting",null]
	, ["main,tab,","loadingStyleSetting",null]
	, ["main,tab","freezeCheckSetting",null]
	, ["main,style,","menuSetting",null]
	, ["main,style,","viewStyleSetting",null]
	, ["main,","instanceSetting",null]
	, ["main,","homeSetting",function(){initHomeSetting()}]
	, ["reg,","assocSetting",function(){initAssocSetting()}]
	, ["mouse,","dropActionSetting",null]
	, ["mouse,","superDragDropSetting",function(){initSuperdd()}]
	, ["mouse,","mouseGestureSetting",null]
	, ["mouse,","mousePlusSetting",null]
	, ["main,","pageSetting",null]
	, ["main","imagePanningSetting",function(){initImagePanningSetting()}]
	, ["main,","jumpListSetting",null]
	, ["main,","taskBarSetting",null]
	, ["main,","confirmSetting",null]
	, ["main,","exitSetting",null]
	, ["main,","memorySetting",null]
	, ["main,","crashSetting",null]
	, ["bookmark,sidebar,","bookmarkSetting",function(){initBookmark()}]
	, ["bookmark,sidebar,","addBookmarkSetting",null]
	, ["tool,sidebar,","toolSetting",function(){initBookmark()}]
	, ["tool,sidebar,","addToolSetting",null] 
	, ["trident,","renderingSetting",null]
	, ["trident,","securitySetting",null]
	, ["trident,","securityControlSetting",null]
	, ["trident,","connectionsSetting",null]
	, ["trident,","proxySetting",function(){initProxy()}]
	, ["trident,","userAgentSetting",function(){initUserAgent()}]
	, ["trident,","BHOSetting",function(){initBHO()}]
	, ["trident,","featureSetting",null]
	, ["trident,","internalFeatureSetting",null]
	, ["script,","scriptSetting",function(){initScriptSetting()}]
	, ["trident,script,","pageScriptSetting",null]
	, ["trident,","tridentEtcSetting",function(){initTridentEtcSetting()}]
	, ["tab,","newUrlSetting",null]
	, ["tab,search,","searchInBrowserSetting",null]
	, ["tab,","tabStyleSetting",null]
	, ["tab,","tabFontSetting",null]
	, ["tab,","tabPosSetting",null]
	, ["tab,","newTabPositionSetting",null]
	, ["tab,","newTabActivateSetting",null]
	, ["tab,","openPopupSetting",null]
	, ["tab,","closeActiveTabSetting",null]
	, ["tab,","selectTabSetting",null]
	, ["tab,","lastTabCmdSetting",null]
	, ["tab,","isolateSetting",null]
	, ["tab,","tabSnapshotSetting",function(){initTabSnapshot()}]
	, ["tab,","tabOptionSetting",null]
	, ["urlaction,","urlActionSetting",function(){initUrlAction()}]
	, ["styleSheet,","styleSheetSetting",function(){initStyleSheet()}]
	, ["mouse,","actionXButtonSetting",function(){initMouseAction()}]
	, ["mouse,","actionWithButtonSetting",function(){initMouseAction()}]
	, ["tab,mouse,","actionTabItemSetting",function(){initMouseAction()}]
	, ["tab,mouse,","actionTabBkgdSetting",function(){initMouseAction()}]
	, ["tab,mouse,","actionTabItemKeySetting",function(){initMouseAction()}]
	, ["tab,mouse,","actionTabBkgdKeySetting",function(){initMouseAction()}]
	, ["tab,","tabWidthSetting",null]
	, ["tab,","tabClosedSetting",null]
	, ["tab,","maxTabSetting",null]
	, ["tab,","travelLogSetting",null]
	, ["main,toolbar,","frameAdditionalButtonSetting",null]
	, ["toolbar,","toolbarSetting",function(){initToolbar()}]
	, ["toolbar,","addToolbarSetting",null]
	, ["toolbar,","hilitePosSetting",null]
	, ["toolbar,","isearchPosSetting",null]
	, ["accel,","accelSetting",function(){initAccel()}]
	, ["search,","searchEngineSetting",function(){initSearch()}]
	, ["search,","hiliteSetting",null]
	, ["search,","maxSearchHistorySetting",null]
	, ["sidebar,","sidebarEdgeSizeSetting",null]
	, ["main,","testFeatureSetting",null]
	, ["main,sidebar,","EBPlusSetting",null]
	, ["script,","activeScriptSetting",null]
	, ["script,","scriptVersionSetting",null]
	, ["cache,","faviconCacheSetting",null]
	, ["cache,","thumbnailCacheSetting",null]
]
,g_view=""
,g_txtScript=g_app.getCmdText("script")
,g_txtSearch=g_app.getCmdText("search")
,C_SELECTED="cSelected"
,C_UNHOVER=["cUnhover","cUnhover2"]
,g_dropActionChanged
,g_mouseGestureChanged
,g_bookmarkChanged
,g_toolChanged
,g_toolbarChanged
,g_initAssoc=false
,g_assocChanged
,g_recent
,g_jumplistChanged
;
/////////////////////////////////////////////////////////////////////////////////////
// proxy
function initProxy(){
	if(!g_initProxy){
		g_initProxy=true;
		loadScript("./option_proxy.js");
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// tab snapshot
function initTabSnapshot(){
	if(!g_initTabSnapshot){
		g_initTabSnapshot=true;
		loadScript("./option_snapshot.js");
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// url action
function loadUrlActionScript(){
	if(!g_loadUrlAction){
		g_loadUrlAction=true;
		loadScript("./option_urlAction.js");
	}
}
function initUrlAction(){
	loadUrlActionScript();
	if(!g_initUrlAction){
		g_initUrlAction=true;
		refreshUrlAction();
	}
}
function initStyleSheet(){
	loadUrlActionScript();
	if(!g_initStyleSheet){
		g_initStyleSheet=true;
		refreshStyleSheet();
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// toolbar
function initToolbar(){
	if(! g_initToolbar){
		g_initToolbar=true;
		loadScript("./option_toolbar.js");
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// drop action
function dropActionSetting(){
	if(g_ext.dropActionSetting()){
		g_dropActionChanged=true;
		if (g_initSuperdd){
			superdd.reloadAll();
		}
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// super drag drop
function initSuperdd(){
	if(! g_initSuperdd){
		g_initSuperdd=true;
		loadScript("option_superdd.js");
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// mouse gesture
function mouseGestureSetting(idx){
	if(g_ext.mouseGestureSetting(idx)){
		g_mouseGestureChanged=true;
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// bookmark
function initBookmark(){
	if(! g_initBookmark){
		g_initBookmark=true;
		loadScript("./option_bookmark.js");
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// accel
function initAccel(){
	if(! g_initAccel){
		g_initAccel=true;
		loadScript("jquery.poshytip.min.js");
		loadCss("tip-yellowsimple.css");
		loadScript("./option_accel.js");
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// search
function initSearch(){
	if(!g_initSearch){
		g_initSearch=true;
		loadScript("./option_search.js");
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// script
function initScriptSetting(){
	if(!g_initScriptSetting){
		g_initScriptSetting=true;
		loadScript("./option_script.js");
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// trident etc
function initTridentEtcSetting(){
  if(!g_initTridentEtcSetting){
    g_initTridentEtcSetting=true;
    document.wheelPaste.v.checked=wheelPaste();
    document.confirmCursorBrowse.v.checked=g_fsetting["confirmCursorBrowse"].isEnable();
  }
}
function _setCheckedFSetting(name) {
   var form = document[name];
   var fsetting = g_fsetting[name];
   var checked = form.v.checked;
   if (fsetting.isEnable() != checked){
      fsetting.setEnable(checked);
      _addRecent(form);
   }
}

function updateTridentEtcSetting(){
  if(g_initTridentEtcSetting){
    // wheel paste
    var b=document.wheelPaste.v.checked;
    if(b!=wheelPaste()){
      b?wheelPasteOn():wheelPasteOff();
      _addRecent(document.wheelPaste);
    }

    // confirm cursor browse
    _setCheckedFSetting("confirmCursorBrowse");
  }
}
function _setCheckedShowActiveScriptError()
{
  var b = document.showActiveScriptError.v.checked;
  if(b!=showActiveScriptError()) {
    showActiveScriptErrorOnOff(b);
    _addRecent(document.showActiveScriptError);
  }
}
/////////////////////////////////////////////////////////////////////////////////////
// user agent
function initUserAgent(){
	if(! g_initUserAgent) {
		g_initUserAgent=true;
		loadScript("option_userAgent.js");
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// BHO
function initBHO(){
	if(! g_initBHO){
		g_initBHO=true;
		loadScript("./option_bho.js");
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// home page
function setHomeUrl(target){
	var	urls=g_app.homeList;
	if(urls.count){
		target.value=urls.url(0);
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// mouse
function initMouseAction(){
	if(! g_initMouseAction){
		g_initMouseAction=true;
		loadScript("./option_mouse.js");
	}
}
$("form.cDummy .cSelectCmd:enabled").live("mousedown focus",function(ev){
	dispSelectCmd(ev.target);
	$(ev.target.form).removeClass("cDummy");
	return false;
});
/////////////////////////////////////////////////////////////////////////////////////
// tab font
function setTabFontDefault(){
	document.getElementById("currentTabFont").innerText="既定のフォント";
	g_defaultTabFont=true;
	g_ext.defaultTabFont();
}
function chooseTabFont(){
	var	currentTabFont=null;
	if(!g_defaultTabFont){
		currentTabFont=document.getElementById("currentTabFont").innerText;
	}
	var	tabFont=g_ext.chooseFont(currentTabFont);
	if(tabFont){
		g_defaultTabFont=false;
		document.getElementById("currentTabFont").innerText=tabFont;
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// home
function initHomeSetting(){
	if(!g_initHome){
		g_initHome=true;
		loadScript("./option_home.js");
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// regist app
function initAssocSetting(){
	if(!g_initAssoc){
		g_initAssoc=true;
		loadScript("./option_assoc.js");
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// image panning
function initImagePanningSetting(){
	if(!g_initImagePanning){
		g_initImagePanning=true;
		loadScript("./option_imagePanning.js");
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// jumplist
function jumpListSetting(){
	g_ext.jumpListSetting();
	g_jumplistChanged=true;
}
/////////////////////////////////////////////////////////////////////////////////////
// load option, recent
function getOptionSettingPath(){
	return getFSO().BuildPath(getSettingDirPath(),"Option.json");
}
function loadOptionSetting(){
	var	option=parseJsonFile(getOptionSettingPath());
	if(!option){
		option={};
	}
	return option;
}
function saveOptionSetting(){
	var	option={};
	option.width=g_ext.width;
	option.height=g_ext.height;
	if(g_recent){
		// save count: 10
		option.recent=g_recent.slice(0,9);
	}
	var	json=JSON.stringify(option,undefined,"");
	writeUnicodeTextFile(getOptionSettingPath(),json);
}
function showOption(option){
	var	width=option.width?option.width:750;
	var	height=option.height?option.height:500;
	g_ext.show(width,height);
}
function applyRecent(option){
	var	applied;
	if(option&&typeof option.recent==="object"){
		g_recent=option.recent;
		$.each(option.recent,function(){
			var	recentSetting=this.toString();
			$.each(g_settings,function(){
				if(this[1]==recentSetting){
					this[0]+="recent,";
					applied=true;
					return;
				}
			});
		});
	}
	return applied;
}
function clearRecent(){
	g_recent=undefined;
}
function _addRecentSp(){
	if(g_assocChanged)addRecent("assocSetting");
	if(g_dropActionChanged)addRecent("dropActionSetting");
	if(g_mouseGestureChanged)addRecent("mouseGestureSetting");
	if(g_bookmarkChanged)addRecent("bookmarkSetting");
	if(g_toolChanged)addRecent("toolSetting");
	if(g_toolbarChanged)addRecent("toolbarSetting");
}
function addRecent(settingName){
	if(!g_recent)g_recent=[];
	var	index=arrayIndexOf(g_recent,settingName);
	if(-1===index){
		g_recent.unshift(settingName);
	}
}
function _addRecent(form){
	var	parent=form.parentNode;
	if(parent&&parent.id){
		addRecent(parent.id);
	}
}
function _setCheckedIndex(name,docName){
	if(!docName)docName=name;
	var	v =getCheckedIdx(document[docName].v,g_setting[name]);
	if(v!=g_setting[name]){
		g_setting[name]=v;
		_addRecent(document[docName]);
	}
}
function _setCheckedValue(name,docName){
	if(!docName)docName=name;
	var	v =getCheckedIdx(document[docName].v,g_setting[name]);
	v=parseInt(document[docName][v].value);
	if(v!=g_setting[name]){
		g_setting[name]=parseInt(v);
		_addRecent(document[docName]);
	}
}
function _setChecked(name,docName){
	if(!docName)docName=name;
	var	v=document[docName].v.checked;
	if(v!=g_setting[name]){
		g_setting[name]=v;
		_addRecent(document[docName]);
	}
}
function _setInt(name,docName){
	if(!docName)docName=name;
	var	v=parseInt(document[docName].v.value);
	if(v!=g_setting[name]){
		g_setting[name]=v;
		_addRecent(document[docName]);
	}
}
function _setValue(name,docName){
	if(!docName)docName=name;
	var	v=document[docName].v.value;
	if(v!=g_setting[name]){
		g_setting[name]=v;
		_addRecent(document[docName]);
	}
}
function _setSelectedValue(name,docName){
	if(!docName)docName=name;
	var	v=getSelectedValue(document[docName].v.options);
	if(v!=g_setting[name]){
		g_setting[name]=v;
		_addRecent(document[docName]);
	}
}
function _setSelectedIntValue(name,docName){
	if(!docName)docName=name;
	var	v=parseInt(getSelectedValue(document[docName].v.options));
	if(v!=g_setting[name]){
		g_setting[name]=v;
		_addRecent(document[docName]);
	}
}
/////////////////////////////////////////////////////////////////////////////////////
// legacy menu
function getLegacyMenuPath(){
	return getFSO().BuildPath(getSettingDirPath(),"LegacyMenu");
}
function isLegacyMenu(){
	var path=getLegacyMenuPath();
	return getFSO().FileExists(path);
}
function setLegacyMenu(isSet){
	var path=getLegacyMenuPath();
	var fso=getFSO();
	var fileexist=fso.FileExists(path);
	var changed=isSet!=fileexist;
	if (changed){
		try{
			if (isSet){
				if(!fileexist){
					fso.CreateTextFile(path,false).Close();
				}
			}else{
				if(fileexist){
					fso.DeleteFile(path);
				}
			}
			changed=isSet!=fileexist;
		}catch(e){}
	}
	return changed;
}
/////////////////////////////////////////////////////////////////////////////////////
// init, apply, view
function goAddSearchPage(){
	g_app.ExecScript("reserved\\goAddSearchPage.js");
	optionClose();
}
function doFind(ev){
	if(13===ev.keyCode){
		view("find");
	}
}
function view(category){
	var	isFind=("find"===category);
	if(!isFind&&g_view===category){
		return;
	}
	g_ext.hilite("");
	var	elemNotFound=$("#notFound")
		,elemNeedKw=$("#needKw");
	document.getElementById("view").scrollTop=0;
	elemNotFound.hide();
	elemNeedKw.hide();	

	$.each(g_cats,function(){
		this.toggleClass(C_SELECTED,this.get(0).id===category);
		});

	var	g_settingsCnt=g_settings.length
		,kw=document.findKeyword.v.value;
	if(isFind&&kw.length){
		kw=kw.toUpperCase();
		var notFound=true;
		for(var j=0;j<g_settingsCnt;++j){
			var	setting=$("#"+g_settings[j][1]);
			if(setting){
				var	show=false;
				// call init
				if(null!==g_settings[j][2]){
					g_settings[j][2]();
					g_settings[j][2]=null;
				}
				var	txt=setting.text().toUpperCase();
				if(txt.indexOf(kw)!=-1){
					show=true;
					notFound=false;
				}
				show ? setting.show() : setting.hide();
			}
		}
		if(notFound){
			elemNotFound.slideDown(300);
		} else {
			g_ext.hilite(kw);
		}
	}else{
		for(var j=0;j<g_settingsCnt;++j){
			var	setting=$("#"+g_settings[j][1]);
			if(setting){
				if(isFind||(-1!=g_settings[j][0].indexOf(category))){
					// call init
					if(null!==g_settings[j][2]){
						g_settings[j][2]();
					}
					setting.show();
				}else{
					setting.hide();
				}
			}
		}
		if(isFind){
			elemNeedKw.slideDown(300);
		}
	}
	g_view=category;
}
function init(){
	// category
	g_cats=[
		  $(document.getElementById("recent"))
		, $(document.getElementById("main"))
		, $(document.getElementById("reg"))
		, $(document.getElementById("style"))
		, $(document.getElementById("bookmark"))
		, $(document.getElementById("tool"))
		, $(document.getElementById("trident"))
		, $(document.getElementById("tab"))
		, $(document.getElementById("urlaction"))
		, $(document.getElementById("stylesheet"))
		, $(document.getElementById("toolbar"))
		, $(document.getElementById("mouse"))
		, $(document.getElementById("accel"))
		, $(document.getElementById("search"))
		, $(document.getElementById("script"))
		, $(document.getElementById("cache"))
		, $(document.getElementById("sidebar"))
		, $(document.getElementById("find"))
	];

	var option=loadOptionSetting();
	showOption(option);
	var	firstSelect=1;
	if(applyRecent(option)){
		g_cats[0].show();
		firstSelect=0;
	}
	$.each(g_cats,function(){this.mouseout(
		function(ev){
			var	target=$(ev.target);
			if((ev.target.className.indexOf(C_SELECTED)===-1)&&ev.target.tagName==="A"){
				target.addClass(C_UNHOVER[0]);
				setTimeout(function(){
					if(!target.hasClass(C_SELECTED)){
						target.addClass(C_UNHOVER[1]);
					}
					target.removeClass(C_UNHOVER[0]);
					setTimeout(function(){
						target.removeClass(C_UNHOVER[1]);
					},50);
				},30);
			}
		})
	});

	//////////////////////////////////////////////////////
	// reg
	if(g_setting.sysVer<6000){
		document.getElementById("idSelectBrowserUI").style.display="none";
		document.getElementById("idAssocNew").style.display="none";
		document.getElementById("idAssocOld").style.display="block";
		document.getElementById("idNewSystem").style.display="none";
	}

	//////////////////////////////////////////////////////

	// start
	setCheckedByValue(document.start, g_setting.start);
	// app style
	setCheckedByValue(document.appStyle, g_setting.style);
	document.getElementById("idCurrentStyle").innerText=getAppStyleText(g_setting.currentStyle);
	// tab group
	document.tabGroup.v.checked=g_setting.tabGroup;
	// loading style
	document.loadingStyle[g_setting.loadingStyle].checked=true;
	document.getElementById("idCurrentLoadingStyle").innerText=getLoadingStyleText(g_setting.currentLoadingStyle);
	// tab width
	document.loadDelay.v.value=g_setting.loadDelay;
	// tab group color
	document.tabGroupColor.v.checked=g_setting.tabGroupColor;
	// menu style
	document.legacyMenu.v.checked=isLegacyMenu();
	// view style
	document.viewStyle[g_setting.viewStyle].checked=true;
	document.getElementById("currentViewStyle").innerText=getViewStyleText(g_setting.currentViewStyle);
	// single instance
	document.singleInstance.v.checked=g_setting.singleInstance;
	// single instance start enable
	document.singleInstanceStartEnable.v.checked=g_setting.singleInstanceStartEnable;
	// max closed
	document.maxClosed.v.value=g_setting.maxClosed;
	// max travellog
	document.maxTravelLog.v.value=g_setting.maxTravelLog;
	// max tab
	document.maxTab.v.value=g_setting.maxTab;
	// max tab load
	document.maxTabLoad.v.value=g_setting.maxTabLoad;
	// tab snapshot
	document.tabSnapshot.v.checked=g_setting.tabSnapshot;
	// tab snapshot interval
	document.tabSnapshotInterval.v.value=g_setting.tabSnapshotInterval;
	// tab width
	document.tabWidth.v.value=g_setting.tabWidth;
	// tab auto min width
	document.tabAutoMinWidth.v.value=g_setting.tabAutoMinWidth;
	// tab auto maxwidth
	document.tabAutoMaxWidth.v.value=g_setting.tabAutoMaxWidth;
	// tab font
	if(g_setting.tabFont){
		document.getElementById("currentTabFont").innerText=g_setting.tabFont;
		g_defaultTabFont=false;
	}
	// auto text link
	document.autoTextLink.v.checked=g_setting.autoTextLink;
	// auto text link dialog
	document.autoTextLinkDialog.v.checked=g_setting.autoTextLinkDialog;
	// auto image resize
	document.autoImageResize.v.checked=g_setting.autoImageResize;
	// security
	var	security = g_setting.security;
	document.securityImage.v.checked=(security&0x10);
	document.securityVideo.v.checked=(security&0x20);
	document.securitySound.v.checked=(security&0x40);
	document.securityScript.v.checked=(0===(security&0x80));
	document.securityJava.v.checked=(0===(security&0x100));
	document.securityRunActiveX.v.checked=(0===(security&0x200));
	document.securityDownloadActiveX.v.checked=(0===(security&0x400));
	document.metaRefresh.v.checked=g_setting.metaRefresh;
	// inherit security
	document.inheritSecurity.v.checked=g_setting.inheritSecurity;
	// feature
	selectOption(document.featureBrowserEmulation.v.options,g_setting.featureBrowserEmulation);
	document.featureGpuRendering.v.checked=g_setting.featureGpuRendering;
	document.featureObjectCaching.v.checked=g_setting.featureObjectCaching;
	document.featureZoneElevation.v.checked=g_setting.featureZoneElevation;
	document.featureMimeHandling.v.checked=g_setting.featureMimeHandling;
	document.featureMimeSniffing.v.checked=g_setting.featureMimeSniffing;
	document.featureWindowRestrictions.v.checked=g_setting.featureWindowRestrictions;
	document.featureWebocPopupmanagement.v.checked=g_setting.featureWebocPopupmanagement;
	document.featureBehaviors.v.checked=g_setting.featureBehaviors;
	document.featureDisableMkProtocol.v.checked=g_setting.featureDisableMkProtocol;
	document.featureLocalmachineLockdown.v.checked=g_setting.featureLocalmachineLockdown;
	document.featureSecurityband.v.checked=g_setting.featureSecurityband;
	document.featureRestrictActivexinstall.v.checked=g_setting.featureRestrictActivexinstall;
	document.featureValidateNavigateUrl.v.checked=g_setting.featureValidateNavigateUrl;
	document.featureRestrictFiledownload.v.checked=g_setting.featureRestrictFiledownload;
	document.featureProtocolLockdown.v.checked=g_setting.featureProtocolLockdown;
	document.featureHttpUsernamePasswordDisable.v.checked=g_setting.featureHttpUsernamePasswordDisable;
	document.featureSafeBindtoobject.v.checked=g_setting.featureSafeBindtoobject;
	document.featureUncSavedfilecheck.v.checked=g_setting.featureUncSavedfilecheck;
	document.featureGetUrlDomFilepathUnencoded.v.checked=g_setting.featureGetUrlDomFilepathUnencoded;
	document.featureTabbedBrowsing.v.checked=g_setting.featureTabbedBrowsing;
	document.featureSslux.v.checked=g_setting.featureSslux;
	document.featureDisableNavigationSounds.v.checked=g_setting.featureDisableNavigationSounds;
	document.featureDisableLegacyCompression.v.checked=g_setting.featureDisableLegacyCompression;
	document.featureXmlHttp.v.checked=g_setting.featureXmlHttp;
	document.featureDisableTelnetProtocol.v.checked=g_setting.featureDisableTelnetProtocol;
	document.featureFeeds.v.checked=g_setting.featureFeeds;
	document.featureBlockInputPrompts.v.checked=g_setting.featureBlockInputPrompts;
	document.featureEnableScriptPasteUrlActionIfPrompt.v.checked=!g_setting.featureEnableScriptPasteUrlActionIfPrompt;
	document.FEATURE_AJAX_CONNECTIONEVENTS.v.checked=g_setting.FEATURE_AJAX_CONNECTIONEVENTS;
	document.FEATURE_SHOW_APP_PROTOCOL_WARN_DIALOG.v.checked=g_setting.FEATURE_SHOW_APP_PROTOCOL_WARN_DIALOG;
	document.FEATURE_BLOCK_CROSS_PROTOCOL_FILE_NAVIGATION.v.checked=g_setting.FEATURE_BLOCK_CROSS_PROTOCOL_FILE_NAVIGATION;
	document.FEATURE_VIEWLINKEDWEBOC_IS_UNSAFE.v.checked=g_setting.FEATURE_VIEWLINKEDWEBOC_IS_UNSAFE;
	document.FEATURE_IFRAME_MAILTO_THRESHOLD.v.checked=g_setting.FEATURE_IFRAME_MAILTO_THRESHOLD;
	document.FEATURE_IVIEWOBJECTDRAW_DMLT9_WITH_GDI.v.checked=g_setting.FEATURE_IVIEWOBJECTDRAW_DMLT9_WITH_GDI;
	document.FEATURE_BLOCK_LMZ_IMG.v.checked=g_setting.FEATURE_BLOCK_LMZ_IMG;
	document.FEATURE_BLOCK_LMZ_OBJECT.v.checked=g_setting.FEATURE_BLOCK_LMZ_OBJECT;
	document.FEATURE_ADDITIONAL_IE8_MEMORY_CLEANUP.v.checked=g_setting.FEATURE_ADDITIONAL_IE8_MEMORY_CLEANUP;
	document.FEATURE_SCRIPTURL_MITIGATION.v.checked=g_setting.FEATURE_SCRIPTURL_MITIGATION;
	document.FEATURE_DOMSTORAGE.v.checked=g_setting.FEATURE_DOMSTORAGE;
	document.FEATURE_RESTRICT_RES_TO_LMZ.v.checked=g_setting.FEATURE_RESTRICT_RES_TO_LMZ;
	document.FEATURE_WARN_ON_SEC_CERT_REV_FAILED.v.checked=g_setting.FEATURE_WARN_ON_SEC_CERT_REV_FAILED;
	document.FEATURE_STATUS_BAR_THROTTLING.v.checked=g_setting.FEATURE_STATUS_BAR_THROTTLING;
	document.FEATURE_SHIM_MSHELP_COMBINE.v.checked=g_setting.FEATURE_SHIM_MSHELP_COMBINE;
	document.FEATURE_NINPUT_LEGACYMODE.v.checked=g_setting.FEATURE_NINPUT_LEGACYMODE;
	document.FEATURE_WEBOC_DOCUMENT_ZOOM.v.checked=g_setting.FEATURE_WEBOC_DOCUMENT_ZOOM;
	document.FEATURE_DISABLE_HSTS.v.checked=g_setting.FEATURE_DISABLE_HSTS;
	document.FEATURE_ACTIVEX_REPURPOSEDETECTION.v.checked=g_setting.FEATURE_ACTIVEX_REPURPOSEDETECTION;
	document.freezeCheck.v.checked=g_setting.freezeCheck;
	document.freezeCheckElapse.v.value=g_setting.freezeCheckElapse;
	document.featureMaxConnectionsPer1_0Server.v.value=g_setting.featureMaxConnectionsPer1_0Server;
	document.featureMaxConnectionsPerServer.v.value=g_setting.featureMaxConnectionsPerServer;
	document.featureAlignedTimers.v.checked=g_setting.featureAlignedTimers;
	document.featureAllowHighfreqTimers.v.checked=g_setting.featureAllowHighfreqTimers;

	// target name resolve
	document.targetNameResolve.v.checked=g_setting.targetNameResolve;
	// trident theme
	document.tridentTheme.v.checked=g_setting.tridentTheme;
	// auto complete
	document.autoComplete.v.checked=g_setting.autoComplete;
	// dpi aware
	document.dpiAware.v.checked=g_setting.dpiAware;
	// drop action
	document.dropAction.v.checked=g_setting.dropAction;
	// super drag drop
	document.superDragDrop.v.checked=g_setting.superDragDrop;
	// super drag drop form
	document.superDragDropForm.v.checked=g_setting.superDragDropForm;
	// mouse gesture
	document.mouseGesture.v[g_setting.mouseGesture].checked=true;
	// mouse gesture limit
	document.mouseGestureLimit.v.value=g_setting.mouseGestureLimit;
	// wheel redirect
	document.wheelRedirect.v.checked=g_setting.wheelRedirect;
	// hwheel redirect
	document.hwheelRedirect.v.checked=g_setting.hwheelRedirect;
	// new url
	document.newUrl.v.value=g_setting.newUrl;
	// search new tab
	document.searchNewTab.v.checked=g_setting.searchNewTab;
	// search tab group
	document.searchTabGroup.v.checked=g_setting.searchTabGroup;
	// tab style
	document.tabStyle.v[g_setting.tabStyle].checked=true;
	// tab icon
	document.tabIcon.v.checked=g_setting.tabIcon;
	// new tab position
	document.newTabPosition.v[g_setting.newTabPosition].checked=true;
	// new tab position tab list
	selectOption(document.newTabPositionTabList.v.options,g_setting.newTabPositionTabList);
	// new tab position window
	selectOption(document.newTabPositionWindow.v.options,g_setting.newTabPositionWindow);
	// new tab activate
	document.newTabActivate.v.checked=g_setting.newTabActivate;
	// new tab activate from page
	selectOption(document.newTabActivateFromPage.v.options,g_setting.newTabActivateFromPage);
	// open popup
	document.openPopup.v.checked=g_setting.openPopup;
	// new process activate
	selectOption(document.newProcessActivate.v.options,g_setting.newProcessActivate);
	// close active tab
	document.closeActiveTab.v[g_setting.closeActiveTab].checked=true;
	// last tab cmd
	document.lastTabCmd.v[g_setting.lastTabCmd].checked=true;
	// last union cmd
	document.lastUnionCmd.v[g_setting.lastUnionCmd].checked=true;
	// wheel tab
	document.wheelTab.v.checked=g_setting.wheelTab;
	// wheel tab loop
	document.wheelTabLoop.v.checked=g_setting.wheelTabLoop;
	// wheel tab scroll
	document.wheelTabScroll.v.checked=g_setting.wheelTabScroll;
	// select tab MDI
	document.selectTabMDI.v.checked=g_setting.selectTabMDI;
	// tab close button
	document.tabCloseButton.v.checked=g_setting.tabCloseButton;
	// tab control bar
	document.tabControlBar.v.checked=g_setting.tabControlBar;
	// nav close lock
	document.navCloseLock.v.checked=g_setting.navCloseLock;
	// show tab state
	document.showTabState.v.checked=g_setting.showTabState;
	// active no auto refresh
	document.activeNoAutoRefresh.v.checked=g_setting.activeNoAutoRefresh;
	// taskbar thumbnail
	document.taskbarThumbnail.v.checked=g_setting.taskbarThumbnail;
	// taskbar progress
	document.taskbarProgress.v.checked=g_setting.taskbarProgress;
	// confirm exit
	document.confirmExit.v.checked=g_setting.confirmExit;
	// confirm close any tab
	document.confirmCloseAnyTab.v.checked=g_setting.confirmCloseAnyTab;
	// sync ime state
	document.syncImeState.v.checked=g_setting.syncImeState;
	// check downloading
	document.checkDownloading.v.checked=g_setting.checkDownloading;
	// task tray
	document.tasktray.v.checked=g_setting.tasktray;
	// minimize task tray
	document.minimizeTasktray.v.checked=g_setting.minimizeTasktray;
	// delete history on close
	document.deleteHistoryOnClose.v.checked=g_setting.deleteHistoryOnClose;
	// delete cache on close
	document.deleteCacheOnClose.v.checked=g_setting.deleteCacheOnClose;
	// delete cookie on close
	document.deleteCookieOnClose.v.checked=g_setting.deleteCookieOnClose;
	// delete form data on close
	document.deleteFormDataOnClose.v.checked=g_setting.deleteFormDataOnClose;
	// delete passwords on close
	document.deletePasswordsOnClose.v.checked=g_setting.deletePasswordsOnClose;
	// delete search history on close
	document.deleteSearchHistoryOnClose.v.checked=g_setting.deleteSearchHistoryOnClose;
	// delete address history on close
	document.deleteAddressHistoryOnClose.v.checked=g_setting.deleteAddressHistoryOnClose;
	// delete lasttab on close
	document.deleteLastTabOnClose.v.checked=g_setting.deleteLastTabOnClose;
	// jump list
	document.jumpList.v.checked=g_setting.jumpList;
	toggleEnable(document.jumpList.v,'jumpListButton');
	// show active script error
	document.showActiveScriptError.v.checked=g_fsetting["showActiveScriptError"].isEnable();
	// show page script error
	document.showPageScriptError.v.checked=g_fsetting["showPageScriptError"].isEnable();
	// favicon
	document.favicon.v.checked=g_setting.favicon;
	// thumbnail
	document.thumbnail.v.checked=g_setting.thumbnail;
	// feed
	document.feed.v.checked=g_setting.feed;
	// auto hilite
	document.autoHilite.v.checked=g_setting.autoHilite;
	// inherit hilite
	document.inheritHilite.v.checked=g_setting.inheritHilite;
	// tab pos
	document.tabPos.v[g_setting.tabPos].checked=true;
	// hilite pos
	document.hilitePos.v[g_setting.hilitePos].checked=true;
	// frame additional button
	document.frameAdditionalButton.v.checked=g_setting.frameAdditionalButton;
	// script invoker version
	setCheckedByValue(document.scriptInvokerVersion, g_setting.scriptInvokerVersion);
	// isearch pos
	document.isearchPos.v[g_setting.isearchPos].checked=true;
	// max search histroy
	document.maxSearchHistory.v.value=g_setting.maxSearchHistory;
	// max inc history
	document.maxIncHistory.v.value=g_setting.maxIncHistory;
	// lock toolbar
	document.lockToolbar.v.checked=g_setting.lockToolbar;
	// favicon limit count
	document.faviconLimitCount.v.value=g_setting.faviconLimitCount;
	// favicon delete percent
	document.faviconDeletePercent.v.value=g_setting.faviconDeletePercent;
	// thumbnail limit count
	document.thumbnailLimitCount.v.value=g_setting.thumbnailLimitCount;
	// thumbnail delete percent
	document.thumbnailDeletePercent.v.value=g_setting.thumbnailDeletePercent;
	// DEP
	document.DEP.v.checked=g_setting.DEP;
	// empty working set
	document.emptyWorkingSet.v.checked=g_setting.emptyWorkingSet;
	// crash file
	document.crashFile.v.checked=g_setting.crashFile;
	// delete old crash file
	document.deleteOldCrashFile.v.checked=g_setting.deleteOldCrashFile;
	// save closed
	document.saveClosed.v.checked=g_setting.saveClosed;
	// save scroll pos
	document.saveScrollPos.v.checked=g_setting.saveScrollPos;
	// sidebar edge size
	document.sidebarEdgeSize.v.value=g_setting.sidebarEdgeSize;
	// test feature
	document.testFeature.v.checked=g_setting.testFeature;
	// EBPlus tab mode
	document.EBPlusTabMode.v.checked=g_setting.EBPlusTabMode;
	// url action
	document.urlAction.v.checked=g_setting.urlAction;
	// sub frame url action
	document.subFrameUrlAction.v.checked=g_setting.subFrameUrlAction;
	// fix active x
	document.fixActiveX.v.checked=g_setting.fixActiveX;
	// single key shortcut
	document.singlekeyShortcut.v.checked=g_setting.singlekeyShortcut;
	
	// select main
	g_cats[firstSelect].click();
	
	// focus
	document.findKeyword.v.focus();
}
// from html dialog
function onCloseHtmlDialog(){
	_addRecentSp();
	saveOptionSetting();
	if(g_toolbarChanged){
		g_ext.settingSave=true;
	}
}
function optionClose(){
	g_ext.optionClose();
}
function optionApply(){
	if(!apply_check()){
		return;
	}
	
	var	reloads=[];
	clearRecent();
	
	if(g_initUrlAction||g_initStyleSheet){
		if(saveUrlAction()){
			g_ext.reloadUrlAction();
			if(g_initUrlAction){
				addRecent("urlActionSetting");
			}
			if(g_initStyleSheet){
				addRecent("styleSheetSetting");
			}
		}
	}
	if(g_initProxy){
		saveProxy();
		var	indexProxy=getCheckedIdx(document.proxy.v,0);
		var	proxy="";
		if(1===indexProxy){
			proxy=":direct:";
		}else if(2===indexProxy){
			proxy=getSelectedValue(document.proxyList.v.options);
			if(proxy===":ng:"){
				alert("プロキシ情報が選択してください");
				document.proxyList.v.focus();
				return;
			}
			if(!getFSO().FileExists(getProxySettingPathFromName(proxy))){
				alert("プロキシ情報のファイルが読み取れません。");
				document.proxyList.v.focus();
				return;
			}
		}
		if(g_setting.proxy!=proxy){
			g_setting.proxy=proxy;
			addRecent("proxySetting");
		}
	}

	// start
	_setCheckedValue("start");
	// app style
	_setCheckedValue("style","appStyle");
	// tab group
	_setChecked("tabGroup");
	// loading style
	_setCheckedIndex("loadingStyle");
	// load delay
	_setInt("loadDelay");
	// tab group color
	_setChecked("tabGroupColor");
	// legacy menu
	if (setLegacyMenu(document.legacyMenu.v.checked)){
		addRecent("menuSetting");
	}
	// view style
	_setCheckedIndex("viewStyle");
	// single instance
	_setChecked("singleInstance");
	// single instance start enable
	_setChecked("singleInstanceStartEnable");
	// home
	if(g_initHome){
		_setSelectedValue("home");
	}
	// max closed
	_setInt("maxClosed");
	// max travellog
	_setInt("maxTravelLog");
	// max tab
	_setInt("maxTab");
	// max tab load
	_setInt("maxTabLoad");
	if(g_setting["maxTabLoad"]===0){
		g_setting["maxTabLoad"]=1;
	}
	// tab snapshot
	_setChecked("tabSnapshot");
	// tab snapshot interval
	_setInt("tabSnapshotInterval");
	if(! g_setting.tabSnapshotInterval){
		g_setting.tabSnapshotInterval=30;
	}
	if(g_initTabSnapshot){
		if(snapshot_save()){
			addRecent("tabSnapshotSetting");
		}
	}
	// tab width
	var	tabWidth=parseInt(document.tabWidth.v.value);
	if(tabWidth<48){
		document.tabWidth.v.value="48";
	}
	_setInt("tabWidth");
	// tab auto min width
	var	tabAutoMinWidth=parseInt(document.tabAutoMinWidth.v.value);
	if(tabAutoMinWidth<48){
		document.tabAutoMinWidth.v.value="48";
	}
	_setInt("tabAutoMinWidth");
	// tab auto max width
	var	tabAutoMaxWidth=parseInt(document.tabAutoMaxWidth.v.value);
	if(tabAutoMaxWidth<48){
		document.tabAutoMaxWidth.v.value="48";
	}
	_setInt("tabAutoMaxWidth");
	// tab font
	var	tabFont="";
	if(!g_defaultTabFont){
		tabFont=document.getElementById("currentTabFont").innerText;
	}
	if(g_setting.tabFont!=tabFont){
		g_setting.tabFont=tabFont;
		addRecent("tabFontSetting");
	}
	// auto text link
	_setChecked("autoTextLink");
	// auto text link dialog
	_setChecked("autoTextLinkDialog");
	// auto image resize
	_setChecked("autoImageResize");
	// image panning
	if(g_initImagePanning){
		if(imagePanning_save()){
			addRecent("imagePanningSetting");
		}
	}
	// security
	var	security = 0;
	security|=(document.securityImage.v.checked?0x10:0);
	security|=(document.securityVideo.v.checked?0x20:0);
	security|=(document.securitySound.v.checked?0x40:0);
	security|=(document.securityScript.v.checked?0:0x80);
	security|=(document.securityJava.v.checked?0:0x100);
	security|=(document.securityRunActiveX.v.checked?0:0x200);
	security|=(document.securityDownloadActiveX.v.checked?0:0x400);
	if(g_setting.security!=security){
		g_setting.security=security;
		addRecent("securitySetting");
	}
	_setChecked("metaRefresh");
	// inherit security
	_setChecked("inheritSecurity");
	// BHO
	if(g_initBHO){
		if(g_bhoList&&g_bhoList.length){
			var bhoList=[],bhoChanged;
			for(var i=0;i<g_bhoList.length;++i){
				var	bho=g_bhoList[i];
				if(bho.enable!=bho.enableOld){
					bhoChanged=true;
				}
				if(bho.enable){
					bhoList.push(bho.clsid);
				}
			}
			if(bhoChanged){
				addRecent("BHOSetting");
				g_ext.bhoList=bhoList;
			}
		}
	}
	// user agent
	if(g_initUserAgent) {
		var	idx=document.userAgentList.v.selectedIndex;
		var	userAgent="";
		if(0!=idx){
			userAgent=document.userAgent.v.value;
		}
		if(g_setting.userAgent!=userAgent){
			g_setting.userAgent=userAgent;
			addRecent("userAgentSetting");
		}
	}
	// feature
	_setSelectedValue("featureBrowserEmulation");
	_setChecked("featureGpuRendering");
	_setChecked("featureObjectCaching");
	_setChecked("featureZoneElevation");
	_setChecked("featureMimeHandling");
	_setChecked("featureMimeSniffing");
	_setChecked("featureWindowRestrictions");
	_setChecked("featureWebocPopupmanagement");
	_setChecked("featureBehaviors");
	_setChecked("featureDisableMkProtocol");
	_setChecked("featureLocalmachineLockdown");
	_setChecked("featureSecurityband");
	_setChecked("featureRestrictActivexinstall");
	_setChecked("featureValidateNavigateUrl");
	_setChecked("featureRestrictFiledownload");
	_setChecked("featureProtocolLockdown");
	_setChecked("featureHttpUsernamePasswordDisable");
	_setChecked("featureSafeBindtoobject");
	_setChecked("featureUncSavedfilecheck");
	_setChecked("featureGetUrlDomFilepathUnencoded");
	_setChecked("featureTabbedBrowsing");
	_setChecked("featureSslux");
	_setChecked("featureDisableNavigationSounds");
	_setChecked("featureDisableLegacyCompression");
	_setChecked("featureXmlHttp");
	_setChecked("featureDisableTelnetProtocol");
	_setChecked("featureFeeds");
	_setChecked("featureBlockInputPrompts");
	{
		var	tmp=featureEnableScriptPasteUrlActionIfPrompt;
		tmp.v.checked=!tmp.v.checked;
	}
	_setChecked("featureEnableScriptPasteUrlActionIfPrompt");
	_setChecked("featureAlignedTimers");
	_setChecked("featureAllowHighfreqTimers");
	_setChecked("FEATURE_AJAX_CONNECTIONEVENTS");
	_setChecked("FEATURE_SHOW_APP_PROTOCOL_WARN_DIALOG");
	_setChecked("FEATURE_BLOCK_CROSS_PROTOCOL_FILE_NAVIGATION");
	_setChecked("FEATURE_VIEWLINKEDWEBOC_IS_UNSAFE");
	_setChecked("FEATURE_IFRAME_MAILTO_THRESHOLD");
	_setChecked("FEATURE_IVIEWOBJECTDRAW_DMLT9_WITH_GDI");
	_setChecked("FEATURE_BLOCK_LMZ_IMG");
	_setChecked("FEATURE_BLOCK_LMZ_OBJECT");
	_setChecked("FEATURE_ADDITIONAL_IE8_MEMORY_CLEANUP");
	_setChecked("FEATURE_SCRIPTURL_MITIGATION");
	_setChecked("FEATURE_DOMSTORAGE");
	_setChecked("FEATURE_RESTRICT_RES_TO_LMZ");
	_setChecked("FEATURE_WARN_ON_SEC_CERT_REV_FAILED");
	_setChecked("FEATURE_STATUS_BAR_THROTTLING");
	_setChecked("FEATURE_SHIM_MSHELP_COMBINE");
	_setChecked("FEATURE_NINPUT_LEGACYMODE");
	_setChecked("FEATURE_WEBOC_DOCUMENT_ZOOM");
	_setChecked("FEATURE_DISABLE_HSTS");
	_setChecked("FEATURE_ACTIVEX_REPURPOSEDETECTION");
	_setChecked("freezeCheck");
	_setInt("freezeCheckElapse");
	if(g_setting["freezeCheckElapse"]===0){
		g_setting["freezeCheckElapse"]=10;
	}

	// max http10 connections
	{
		var	_frm=document.featureMaxConnectionsPer1_0Server;
		var	_v=common_fixRange(_frm.v.value,0,128);
		if(_v!=undefined){
			if(1===_v){
				_v=2;
			}
			_frm.v.value=_v;
			_setInt("featureMaxConnectionsPer1_0Server");
		}
	}

	// max http11 connections
	{
		var	_frm=document.featureMaxConnectionsPerServer;
		var	_v=common_fixRange(_frm.v.value,0,128);
		if(_v!=undefined){
			if(1===_v){
				_v=2;
			}
			_frm.v.value=_v;
			_setInt("featureMaxConnectionsPerServer");
		}
	}

	// target name resolve
	_setChecked("targetNameResolve");
	// trident theme
	_setChecked("tridentTheme");
	// auto complete
	_setChecked("autoComplete");
	// dpi aware
	_setChecked("dpiAware");
	// drop action
	_setChecked("dropAction");
	// super drag drop
	_setChecked("superDragDrop");
	// super drag drop form
	_setChecked("superDragDropForm");
	// super drag drop cmd
	if (g_initSuperdd){
		if(superdd.saveAll()){
			addRecent("superDragDropSetting");
		}
	}
	// mouse gesture
	_setCheckedIndex("mouseGesture");
	// mouse gesture limit
	var	mouseGestureLimit=parseInt(document.mouseGestureLimit.v.value);
	if(mouseGestureLimit < 1) {
		document.mouseGestureLimit.v.value="4";
	}
	_setInt("mouseGestureLimit");
	// wheel redirect
	_setChecked("wheelRedirect");
	// hwheel redirect
	_setChecked("hwheelRedirect");
	// new url
	_setValue("newUrl");
	// search new tab
	_setChecked("searchNewTab");
	// search tab group
	_setChecked("searchTabGroup");
	// tab style
	_setCheckedIndex("tabStyle");
	// tab icon
	_setChecked("tabIcon");
	// new tab position
	_setCheckedIndex("newTabPosition");
	// new tab position tab list
	_setSelectedIntValue("newTabPositionTabList");
	// new tab position window
	_setSelectedIntValue("newTabPositionWindow");
	// new tab activate
	_setChecked("newTabActivate");
	// new tab activate from page
	_setSelectedIntValue("newTabActivateFromPage");
	// open popup
	_setChecked("openPopup");
	// new process activate
	_setSelectedIntValue("newProcessActivate");
	// close active tab
	_setCheckedIndex("closeActiveTab");
	// last tab cmd
	_setCheckedIndex("lastTabCmd");
	// last tab cmd
	_setCheckedIndex("lastUnionCmd");
	// wheel tab
	_setChecked("wheelTab");
	// wheel tab loop
	_setChecked("wheelTabLoop");
	// wheel tab scroll
	_setChecked("wheelTabScroll");
	// select tab MDI
	_setChecked("selectTabMDI");
	// tab close button
	_setChecked("tabCloseButton");
	// tab control bar
	_setChecked("tabControlBar");
	// nav close lock
	_setChecked("navCloseLock");
	// show tab state
	_setChecked("showTabState");
	// active no auto refresh
	_setChecked("activeNoAutoRefresh");
	// show active script error
	_setCheckedFSetting("showActiveScriptError");
	// show page script error
	_setCheckedFSetting("showPageScriptError");
	// taskbar thumbnail
	_setChecked("taskbarThumbnail");
	// taskbar progress
	_setChecked("taskbarProgress");
	// confirm exit
	_setChecked("confirmExit");
	// confirm close any tab
	_setChecked("confirmCloseAnyTab");
	// sync ime state
	_setChecked("syncImeState");
	// check downloading
	_setChecked("checkDownloading");
	// task tray
	_setChecked("tasktray");
	// minimize task tray
	_setChecked("minimizeTasktray");
	// delete history on close
	_setChecked("deleteHistoryOnClose");
	// delete cache on close
	_setChecked("deleteCacheOnClose");
	// delete cookie on close
	_setChecked("deleteCookieOnClose");
	// delete form data on close
	_setChecked("deleteFormDataOnClose");
	// delete passwords on close
	_setChecked("deletePasswordsOnClose");
	// delete search history on close
	_setChecked("deleteSearchHistoryOnClose");
	// delete address history on close
	_setChecked("deleteAddressHistoryOnClose");
	// delete lasttab on close
	_setChecked("deleteLastTabOnClose");
	// jump list
	_setChecked("jumpList");
	// favicon
	_setChecked("favicon");
	// thumbnail
	_setChecked("thumbnail");
	// feed
	_setChecked("feed");
	// auto hilite
	_setChecked("autoHilite");
	// inherit hilite
	_setChecked("inheritHilite");
	// tab pos
	_setCheckedIndex("tabPos");
	// hilite pos
	_setCheckedIndex("hilitePos");
	// frame additional button
	_setChecked("frameAdditionalButton");
	// script invoker version
	_setCheckedValue("scriptInvokerVersion");
	// isearch pos
	_setCheckedIndex("isearchPos");
	// max search history
	_setInt("maxSearchHistory");
	// max inc history
	_setInt("maxIncHistory");
	// mouse
	if(g_initMouseAction){
		var	changed=mouse_saveAction();
		for(var idx in changed.settings){
			_addRecent(document.getElementById(changed.settings[idx]));
		}
		if(changed.reloads.length){
			reloads=reloads.concat(changed.reloads);
		}
	}
	// accel
	if(g_initAccel){
		// del add accel item
		var	accel=$(document.getElementById("idAppAccel")).data("accel");
		var	list=accel.list;
		list.del(list.count-1);
		// apply del
		var	count=list.count;
	
		while(count){
			--count;
			if(list.markDel(count)){
				list.del(count);
			}
		}
		// check default accel list
		list.sort();
		g_setting.defaultAccelList=false;
		if(compareAccelList(list,g_setting.defaultAccelList)){
			g_setting.defaultAccelList=true;
		}
		// check custom accel list
		else if(! compareAccelList(list,g_setting.accelList)){
			g_setting.accelList=list;
			addRecent("accelSetting");
		}
	}
	// favicon limit count
	_setInt("faviconLimitCount");
	// favicon delete percent
	{
		var	_frm=document.faviconDeletePercent;
		_frm.v.value=common_fixRange(_frm.v.value,0,100);
	}
	_setInt("faviconDeletePercent");
	// thumbnail limit count
	_setInt("thumbnailLimitCount");
	// thumbnail delete percent
	{
		var	_frm=document.thumbnailDeletePercent;
		_frm.v.value=common_fixRange(_frm.v.value,0,100);
	}
	_setInt("thumbnailDeletePercent");
	// DEP
	_setChecked("DEP");
	// empty working set
	_setChecked("emptyWorkingSet");
	// check file
	_setChecked("crashFile");
	// delete old crash file
	_setChecked("deleteOldCrashFile");
	// save closed
	_setChecked("saveClosed");
	// save scroll pos
	_setChecked("saveScrollPos");
	// sidebar edge size
	{
		var	_frm=document.sidebarEdgeSize;
		var	_v=common_fixRange(_frm.v.value,0,20);
		if(_v!=undefined){
			_frm.v.value=_v;
			_setInt("sidebarEdgeSize");
		}
	}
	// test feature
	_setChecked("testFeature");
	// EBPlus tab mode
	_setChecked("EBPlusTabMode");
	// url action
	_setChecked("urlAction");
	// sub frame url action
	_setChecked("subFrameUrlAction");
	// fix active x
	_setChecked("fixActiveX");
	// wheel paste
	updateTridentEtcSetting();
	// single key shortcut
	_setChecked("singlekeyShortcut");
	// jumplist
	if (g_jumplistChanged){
		addRecent("jumpListSetting");
	}
	
	// apply
	var	reloadSetting=reloads.join(',');
	if(1===reloads.length){
		reloadSetting+=',';
	}
	g_ext.optionApply(reloadSetting);
	g_ext.settingSave=true;
	optionClose();
}
function apply_check(){
	var	checks=
	[
			document.maxClosed
		,	document.maxTab
		,	document.maxTabLoad
		,	document.maxTravelLog
		,	document.tabWidth
		,	document.mouseGestureLimit
		,	document.maxSearchHistory
		,	document.maxIncHistory
		,	document.faviconLimitCount
		,	document.faviconDeletePercent
		,	document.thumbnailLimitCount
		,	document.thumbnailDeletePercent
		,	document.loadDelay
	];
	for(var i=0;i<checks.length;++i){
		if(0===checks[i].v.value.length){
			alert("不正な入力です。["+checks[i].name+"]");
			checks[i].v.focus();
			return false;
		}
	}
	return true;
}
