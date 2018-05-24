var s_assoc;
function isAssoced(ext){
	var	exe=g_ext.AssocQuery(ext,null),ret=false;
	if(exe&&typeof exe==="string"){
		var	appPath=g_app.path;
		appPath=appPath.toUpperCase();
		exe=exe.toUpperCase();
		ret=appPath===exe;
	}
	return ret;
}
function selectBrowserUI(){
	// Vista,7 only
	var	shl=g_app.createObject("WScript.Shell"),fso=getFSO()
		,ctl=fso.BuildPath(fso.GetSpecialFolder(1),"control.exe");
	shl.Run('"'+ctl+'" /name Microsoft.DefaultPrograms /page pageDefaultProgram',1, false);
}
function refreshAssoc(){
	var	isAssoc=isAssoced("http");
	if(undefined===s_assoc||isAssoc!==s_assoc){
		s_assoc=isAssoc;
		var	assocs=$("#idIsNoAssoc,#idIsAssoc,#btnUnregApp,#btnRegApp,#idDisableUnregApp")
			,ctx=assocs.context;
		$("#idIsNoAssoc,#idIsAssoc",ctx).hide();
		$("#btnRegApp",ctx).attr("disabled",false);
		if(g_setting.sysVer>=6000){
			// Vista,7
			var	elem=$("#idDisableUnregApp",ctx);
			if(!isAssoc)elem.hide();
			else elem.slideDown("slow");
			$("#btnUnregApp",ctx).attr("disabled",isAssoc);
		}else{
			// Xp
			$("#btnUnregApp",ctx).attr("disabled",!isAssoc);
		}
		if(isAssoc){
			$("#idIsAssoc",ctx).slideDown("slow");
		}else{
			$("#idIsNoAssoc",ctx).slideDown("slow");
		}
	}
	return s_assoc;
}
var	STR_BROWSERCHANGED="Software\\Clients\\StartMenuInternet";
// call from html dialog
function settingChange(strChanged){
	if(g_initAssoc&&(STR_BROWSERCHANGED.toUpperCase()===strChanged.toUpperCase())){
		var	assoc=$("#assocSetting:visible");
		if(assoc.length){
			var assoc=s_assoc;
			if(assoc==refreshAssoc()){
				// fix Xp
				if(g_setting.ieVer<9000){
					setTimeout(function(){
						refreshAssoc();
					},3000);
				}
			}
		}
	}
}
function regApp(regist){
	var	msg=regist?"レジストリに登録しますか?":"レジストリから削除しますか?";
	if(confirm(msg)){
		g_assocChanged=true;
		var	appPath=g_app.path
			,ar=[];
		ar.push("'regist':"+regist);
		ar.push("'sysVer':"+g_setting.sysVer);
		ar.push("'ieVer':"+g_setting.ieVer);
		ar.push("'appPath':'"+appPath.replace(/\\/g, "\\\\")+"'");
		if(regist){
			ar.push("'appDetail':'Ancia(アンシア)は、軽い動作を目指したマルチスレッド対応タブブラウザです。'");
		}
		var	shl=g_app.createObject("WScript.Shell")
			,fso=getFSO()
			,appDir=pathRemoveFileSpec(appPath)
			//,regApp=fso.BuildPath(appDir,"Regist.exe")
			,regScript=fso.BuildPath(appDir,"script\\reserved\\regApp.js")
			,cscriptPath=fso.BuildPath(fso.GetSpecialFolder(1),"cscript.exe");
		try{
			//shl.Run('"'+regApp+'" "'+cscriptPath+'" "'+regScript+'" "{'+ar.join(",")+'}"', 0, true);
			g_ext.runas(appPath, ' /reg "'+cscriptPath+'" "'+regScript+'" "{'+ar.join(",")+'}"');
			if(g_setting.sysVer<6000){
				g_ext.assocChanged();
				g_ext.broadcastSettingChanged(STR_BROWSERCHANGED);
			}
		}catch(e){}
	}
}
(function(){refreshAssoc();})();