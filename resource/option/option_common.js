/////////////////////////////////////////////////////////////////////////////////////
// local
var 
 $$=document.getElementById
,$c=document.createElement
,$t=document.createTextNode
;
var
 s_app=external.app
,s_fso
,s_scriptDetails
,s_scriptList
,s_searchList
;
/////////////////////////////////////////////////////////////////////////////////////
// common
function common_fixRange(v,minValue,maxValue){
	var	num;
	switch(typeof v){
	case "string":
		num=parseInt(v);
		break;
	case "number":
		num=v;
		break;
	default:
		return num;
	}
	if(minValue&&(num<minValue)){
		num=minValue;
	}
	if(maxValue&&(num>maxValue)){
		num=maxValue;
	}
	return num;
}
function common_deepCopy(obj){
	var ret,tof=typeof obj;
	if(tof==="object") {
		ret={};
	}else if(tof==="array"){
		ret=[];
	}else {
		return obj;
	}
	for(var name in obj) {
		ret[name]=common_deepCopy(obj[name]);
	}
	return ret;
}
function common_getPropCount(obj){
	var	n=0;
	for(var v in obj){
		++n;
	}
	return n;
}
function common_isEqualDeep(l,r){
	var	ltype=typeof l, rtype=typeof r;
	if(ltype!==rtype){
		return false;
	}
	if("object"===ltype||"array"===rtype){
		if(common_getPropCount(l)!==common_getPropCount(r)){
			return false;
		}
		
		for(var idx in l){
			if(!common_isEqualDeep(l[idx],r[idx])){
				return false;
			}
		}
	}else{
		if(l!==r){
			return false;
		}
	}
	return true;
}
function removeChildren(elem){
	while(elem.firstChild)elem.removeChild(elem.firstChild);
}
function replaceChild(elem,child){
	removeChildren(elem);
	elem.appendChild(child);
}
function replaceChildren(elem,children){
	removeChildren(elem);
	for(var i=0;i<children.length;++i)elem.appendChild(children[i]);
}
function loadScript(src,doc){
	if(!doc)doc=document;
	var script=doc.createElement("script");
	script.type="text/javascript";
	script.src=src;
	var head=doc.getElementsByTagName("head")[0];
	head.insertBefore(script,head.firstChild);
}
function loadCss(src,doc){
	if(!doc)doc=document;
	var lnk=doc.createElement("link");
	lnk.rel="stylesheet";
	lnk.type="text/css";
	lnk.href=src;
	var head=doc.getElementsByTagName("head")[0];
	head.insertBefore(lnk,head.firstChild);
}
function arrayIndexOf(ar,v){
	for(var i=0;i<ar.length;++i){
		if(ar[i]===v){
			return i;
		}
	}
	return -1;
}
function getFSO(){
	if(!s_fso){
		s_fso=s_app.createObject("Scripting.FileSystemObject");
	}
	return s_fso;
}
function readUnicodeTextFile(path){
	var	txt,f;
	try{
		f=getFSO().OpenTextFile(path,1,false,-1);
		txt=f.ReadAll();
	}catch(e){}
	if(f){
		f.Close();
	}
	return txt;
}
function writeUnicodeTextFile(path,txt){
	var	f,ok=true;
	try{
		f=getFSO().OpenTextFile(path,2,true,-1);
		f.Write(txt);
	}catch(e){
		ok=false;
	}
	if(f){
		f.Close();
	}
	return ok;
}
function common_deleteFileKillError(path){
	var	ok=true;
	try{
		getFSO().DeleteFile(path);
	}catch(e){
		ok=false;
	}
	return ok;
}
function loadScriptDetails(){
	if(!s_scriptDetails){
		s_scriptDetails=[undefined,undefined];
		var	scriptDir=getScriptDirPath(),fso=getFSO();
		var	scriptsPath=fso.BuildPath(scriptDir,"scripts.json");
		if(fso.FileExists(scriptsPath)){
			s_scriptDetails[0]=parseJsonFile(scriptsPath);
		}
		scriptsPath=fso.BuildPath(scriptDir,"reserved\\scripts.json");
		if(fso.FileExists(scriptsPath)){
			s_scriptDetails[1]=parseJsonFile(scriptsPath);
		}
	}
	return s_scriptDetails;
}
function getScriptDetail(script){
	var	isReserved=script.indexOf("reserved\\")===0
		,details=loadScriptDetails()[isReserved?1:0]
		,detail;
	if(details){
		var	key=isReserved?script.substr(9):script;
		detail=details[key];
	}
	return detail;
}
function queryScriptAction(script,action){
	var	detail=getScriptDetail(script);
	if(!detail||!detail.action){
		// no scripts detail(etc. sample.js)
		return true;
	}
	return detail.action.indexOf(action)!==-1;
}
function getCmdValue(cmdObj)
{
	var	val=cmdObj?cmdObj.cmd:undefined;
	if(!val){
		if(cmdObj){
			if(cmdObj.script){
				val="script:"+cmdObj.script;
			}else if(cmdObj.search){
				val="search:"+cmdObj.search;
			}
		}
	}
	if(!val){
		val="none";
	}
	return val;
}
function cmdValueToCmdObj(cmdValue,excludeCmds){
	if(!excludeCmds){
		excludeCmds="none,";
	}
	var	obj;
	if(cmdValue){
		obj={};
		if(-1!==cmdValue.indexOf("script:")){
			obj["script"]=cmdValue.substr(7);
		}else if(-1!==cmdValue.indexOf("search:")){
			obj["search"]=cmdValue.substr(7);
		}else{
			if(-1===excludeCmds.indexOf(cmdValue+",")){
				obj["cmd"]=cmdValue;
			}else{
				obj=undefined;
			}
		}
	}
	return obj;
}
function _getScriptDisplayName(script){
	// remove cmd prefix(script:)
	if(script.indexOf(":")!==-1){
		script=script.substr(7);
	}
	var	detail=getScriptDetail(script);
	if(detail&&detail.txt){
		script=detail.txt+" ("+script+")";
	}
	return g_txtScript+":"+script;
}
function _getSearchDisplayName(search){
	// remove cmd prefix(search:)
	if(search.indexOf(":")!==-1){
		search=search.substr(7);
	}
	return g_txtSearch+":"+pathRemoveExtention(search);
}
function getCmdTxt(cmd){
	var	txt;
	if(-1===cmd.indexOf(":")){
		txt=s_app.getCmdText(cmd);
	}else{
		if(-1!==cmd.indexOf("script:")){
			// remove cmd prefix(script:)
			if(cmd.indexOf(":")!==-1){
				cmd=cmd.substr(7);
			}
			var	detail=getScriptDetail(cmd);
			if(detail&&detail.txt){
				txt=detail.txt;
			}
			if(!txt){
				txt=pathFindFilename(cmd);
				txt=pathRemoveExtention(txt);
			}
		}else if(-1!==cmd.indexOf("search:")){
			// remove cmd prefix(search:)
			if(cmd.indexOf(":")!==-1){
				cmd=cmd.substr(7);
			}
			txt=pathRemoveExtention(cmd);
		}
	}
	return txt;
}
function getCmdDisplayName(cmd){
	var	cmdText;
	if(-1===cmd.indexOf(":")){
		cmdText=s_app.getCmdText(cmd);
	}else{
		if(-1!==cmd.indexOf("script:")){
			cmdText=_getScriptDisplayName(cmd);
		}else if(-1!==cmd.indexOf("search:")){
			cmdText=_getSearchDisplayName(cmd);
		}
	}
	if(!cmdText)cmdText=cmd;
	return cmdText;
}
function getScriptList(){
	if(!s_scriptList){
		s_scriptList=s_app.scriptList;
	}
	return s_scriptList;
}
function getSearchList(){
	if(!s_searchList){
		s_searchList=s_app.searchList;
	}
	return s_searchList;
}
function parseJson(txt){
	var	obj;
	try{
		obj=eval("("+txt+")");
	}catch(e){}
	return obj;
}
function parseJsonFile(path){
	var	obj;
	try{
		var	txt=readUnicodeTextFile(path);
		obj=parseJson(txt);
	}catch(e){}
	return obj;
}
function pathRemoveFileSpec(path){
	return path.substr(0,path.lastIndexOf('\\'));
}
function pathRemoveExtention(path){
	var	iExt=path.lastIndexOf(".");
	if(-1===iExt){
		iExt=path.length;
	}
	return path.substring(0,iExt);
}
function pathFindFilename(path){
	var	sep=path.lastIndexOf('\\');
	if(sep!==-1){
		path.substr(sep+1);
	}
	return path;
}
function getSettingDirPath(){
	return getFSO().BuildPath(pathRemoveFileSpec(s_app.path),"setting");
}
function getScriptDirPath(){
	return getFSO().BuildPath(pathRemoveFileSpec(s_app.path),"script");
}
function getResourceDirPath(){
	return getFSO().BuildPath(pathRemoveFileSpec(s_app.path),"resource");
}
function addOption(options,val,txt){
	var	op=new Option(txt,val);
	options.add(op);
	return op;
}
function getSelectedValue(options){
	return options[options.selectedIndex].value;
}
function toggleEnable(chk,id){
	var elem=document.getElementById(id);
	if(elem){
		elem.disabled=!chk.checked;
	}
}
function valueIsCueBanner(elem){
	return -1!==elem.className.indexOf("cCueBanner");
}
function toggleCueBanner(ev,bannerTxt){
	var	isCueBanner;
	if("focusin"===ev.type){
		if(valueIsCueBanner(ev.target)){
			ev.target.value="";
			$(ev.target).toggleClass("cCueBanner");
		}
	}else{
		if(0===ev.target.value.length){
			$(ev.target).toggleClass("cCueBanner");
			ev.target.value=bannerTxt;
			isCueBanner=true;
		}
	}
	return isCueBanner;
}
function getCmdFlags(settingName){
	var	flags=0x1;
	if(typeof g_cmdFlags[settingName]==="number"){
		flags=g_cmdFlags[settingName];
	}
	return flags;
}
function getCheckedIdx(v,defVal){
	var	ret_idx=defVal,checkedCnt=v.length;
	for(var checked_i=0;checked_i<checkedCnt;++checked_i){
		if(v[checked_i].checked){
			ret_idx=checked_i;
			break;
		}
	}
	return ret_idx;
}
function setCheckedByValue(v,value){
	var	cnt=v.length;
	for(var checked_i=0;checked_i<cnt;++checked_i){
		if(v[checked_i].value==value){
			v[checked_i].checked=true;
			break;
		}
	}
}
function getAppStyleText(style){
	var	txt;
	switch(style){
	case 1:txt="シングルスレッド";break;
	case 2:txt="マルチスレッド";break;
	case 3:txt="マルチプロセス";break;
	case 4:txt="マルチスレッド(ブラウザプロセス生成)";break;
	}
	if(!txt)txt="unknown";
	return txt;
}
function getViewStyleText(style){
	var	txt;
	switch(style){
	case 0:txt="旧スタイル";break;
	case 1:txt="Internet Explorerスタイル";break;
	}
	if(!txt)txt="unknown";
	return txt;
}
function getLoadingStyleText(style){
	var	txt;
	switch(style){
	case 0:txt="負荷が少ない遅延読み込み";break;
	case 1:txt="アクティブ時読み込み";break;
	case 2:txt="遅延読み込みなし";break;
	}
	if(!txt)txt="unknown";
	return txt;
}
/////////////////////////////////////////////////////////////////////////////////////
// input filter
function inputNum(k){
	// num
	if((48<=k&&k<=57)||(96<=k&&k<=105)) return true;
	// del, backspace, ins, <-, ->, home, end, tab
	if(8===k||46===k||45===k||37===k||39===k||35===k||36===k||9===k) {
		return true;
	}
	// return
	if(13===k) {
		optionApply();
		return false;
	}
	return false;
}
function inputAlpNum(k){
	// alp, num
	if(32<=k&&k<=125) return true;
	// del, backspace, ins, <-, ->, home, end, tab
	if(8===k||46===k||45===k||37===k||39===k||35===k||36===k||9===k) {
		return true;
	}
	// return
	if(13===k) {
		optionApply();
		return false;
	}
	return false;
}
// true:OK false:NG
function inputUrl(k){
	if(inputAlpNum(k)){
		return true;
	}

	// _ etc..
	if( 189===k||220===k||222===k||192===k||219===k||
		221===k||186===k||191===k||188===k||190===k||
		187===k||226===k){
		return true;
	}
	return false;
}
/////////////////////////////////////////////////////////////////////////////////////
// select command
// fAddFlags
//    0x1:prevent add menu
function initSelectCmd(options, fAddFlags){
	var	cmdCnt=g_supportCmds.length;
	options.length=0;
	if(!(fAddFlags&0x2)){
		for(var i=0;i<cmdCnt;++i){
			var	cmd=g_supportCmds[i];
			if(cmd==="menu"){
				if(fAddFlags&0x1){
					continue;
				}
			}
			addOption(options,cmd,s_app.getCmdText(cmd));
		}
	}else{
		// add none
		addOption(options,"none",s_app.getCmdText("none"));
	}
	
	// script
	var	scriptList=getScriptList(),scriptCnt=scriptList.count;
	for(var i=0;i<scriptCnt;++i){
		var	filename=scriptList.filename(i);
		var	dropAdd;
		if (fAddFlags&0x10){
			
		}
		if(queryScriptAction(filename,SCRIPTACTION_COMMAND)||
		   ((fAddFlags&0x10)&&queryScriptAction(filename,SCRIPTACTION_DROP))){
			addOption(options,"script:"+filename,_getScriptDisplayName(filename));
		}
	}
	
	// search
	var	searchList=getSearchList(),searchCnt=searchList.count;
	for(var i=0;i<searchCnt;++i){
		addOption(options,"search:"+searchList.filename(i),
			_getSearchDisplayName(searchList.filename(i)));
	}
}
function initOptionCmd(options,cmd){
	options.length=1;
	options[0].value=cmd;
	options[0].text=getCmdDisplayName(cmd);
}
function selectOption(options,value){
	var	cnt=options.length;
	for(var i=0;i<cnt;++i){
		if(options[i].value==value){
			options[i].selected=true;
			return true;
		}
	}
	// 初期アイテムを選択
	options.selectedIndex=0;
	return false;
}
function selectOptionCmd(options,cmd){
	var	cnt=options.length;
	for(var i=0;i<cnt;++i){
		if(options[i].value===cmd){
			options[i].selected=true;
			return true;
		}
	}
	initOptionCmd(options,cmd);
	return false;
}
function sepCmd(cmd){
	var	ret=new Array(2),iFind=cmd.lastIndexOf(":");
	if(-1!==iFind){
		ret[0]=cmd.substring(0,iFind);
		ret[1]=cmd=value.substring(iFind+1);
	}else{
		ret[0]=cmd;
		ret[1]=null;
	}
	return ret;
}
function dispSelectCmd(select){
	var	value=select.value
		,addFlags=getCmdFlags(select.form.name);
	initSelectCmd(select.options,addFlags);
	selectOptionCmd(select.options,value);
}
/////////////////////////////////////////////////////////////////////////////////////
// err dialog
var ERRCODE_BOOKMARK_SETTING=1;
function errDlg(errCode){
	var	msg="unknown error";
	if(ERRCODE_BOOKMARK_SETTING===errCode){
		msg="ブックマークの設定に失敗しました。";
	}
	alert(msg);
}
/////////////////////////////////////////////////////////////////////////////////////
// wheel paste file
function buildWheelPastePath(){
 return getFSO().BuildPath(getSettingDirPath(),"wheelpaste");
}
function wheelPaste(){
 return !!getFSO().FileExists(buildWheelPastePath());
}
function wheelPasteOn(){
  if(!wheelPaste()){
    writeUnicodeTextFile(buildWheelPastePath(),"");
  }
}
function wheelPasteOff(){
  if (wheelPaste()){
    common_deleteFileKillError(buildWheelPastePath());
  }
}

/////////////////////////////////////////////////////////////////////////////////////
// file setting
(function(){
  var f = function(filename, existOn){
    this.filename_ = filename;
    this.existOn_ = existOn;
  };
  f.prototype = {
    getPath : function() {
      return getFSO().BuildPath(getSettingDirPath(), this.filename_);
    },
    exist_ : function() {
      return getFSO().FileExists(this.getPath());
    },
    delete_ : function() {
      return common_deleteFileKillError(this.getPath());
    },
    create_ : function() {
      return writeUnicodeTextFile(this.getPath());
    },
    isEnable : function() {
      var b = this.exist_();
      return this.existOn_ ? b : !b;
    },
    setEnable : function(on) {
      if (on){
        return this.existOn_ ? this.create_() : this.delete_();
      }
      return this.existOn_ ? this.delete_() : this.create_();
    }
  };
  window.FileSetting = f;
}
)();
var g_fsetting={
 confirmCursorBrowse : new FileSetting("noconfirm_cursor_browse", 0),
 showActiveScriptError : new FileSetting("noshow_active_script_error", 0),
 showPageScriptError : new FileSetting("show_page_script_error", 1)
};
