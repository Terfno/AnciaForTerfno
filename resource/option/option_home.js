function getTabListDisplayName(filename){
	return filename.substring(8,filename.length-5);
}
var	s_homeTabListRefreshed;
function _refreshHomeTabList(){
	if(s_homeTabListRefreshed){
		return;
	}
	s_homeTabListRefreshed=true;
	var options=document.home.v.options
		,fs=getFSO()
		,tabLists=[]
		,files=new Enumerator(fs.GetFolder(getSettingDirPath()).Files)
		,reTabList=/^TabList_.*\.json$/i
		,homeTabList=g_setting.home
	;
	for (;!files.atEnd();files.moveNext()){
		var f=files.item(),name=f.Name;
		if(name.match(reTabList)){
			if(homeTabList!==name){
				addOption(options,name,getTabListDisplayName(name));
			}
		}
	}
}
function _attachHomeTabListRefresh(){
	var options=document.home.v.options;
	options.onfocus=_refreshHomeTabList;
	options.onclick=_refreshHomeTabList;

	// add current val
	var homeTabList=g_setting.home;
	if(homeTabList&&homeTabList.length){
		addOption(options,homeTabList,getTabListDisplayName(homeTabList)).selected=true;
	}
}
(function(){_attachHomeTabListRefresh();})();