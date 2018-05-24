var	SNAPSHOT_JSON="snapshot.json";
function snapshot_getSettingPath(customize){
	var	 fs=getFSO()
		,path=snapshot_getCustomPath()
	;
	if(customize){
		return path;
	}
	if(!getFSO().FileExists(path)){
		path=snapshot_getResourcePath();
	}
	return path;
}
function snapshot_getResourcePath(){
	return getFSO().BuildPath(getResourceDirPath(),SNAPSHOT_JSON);
}
function snapshot_getCustomPath(){
	return getFSO().BuildPath(getSettingDirPath(),"customize/"+SNAPSHOT_JSON);
}
function snapshot_load(){
	var	default_v=parseJsonFile(snapshot_getResourcePath());
	var	setting=parseJsonFile(snapshot_getSettingPath());
	for(var v in default_v){
		if(undefined===setting[v]){
			setting[v]=default_v[v];
		}
	}
	return setting;
}
function _snapshot_save(setting){
	var	txt='{',comma='';
	if(setting.maxCount){
		txt+='"maxCount":'+setting.maxCount;
		comma=',';
	}
	txt+='}';
	writeUnicodeTextFile(snapshot_getSettingPath(true),txt);
}
function snapshot_save(){
	var	setting={};
	setting.maxCount=parseInt(document.tabSnapshotMaxCount.v.value);

	// check changed
	var	doSave=false,curSetting=snapshot_load();
	for(var v in curSetting){
		if(curSetting[v]!==setting[v]){
			doSave=true;
			break;
		}
	}
	if(doSave){
		_snapshot_save(setting);
	}
	return doSave;
}
function snapshot_init(){
	var setting=snapshot_load();
	document.tabSnapshotMaxCount.v.value=setting.maxCount;
}
(function(){snapshot_init();})();