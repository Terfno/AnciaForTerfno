var	url=DataObject.url;
if(url){
	if(url.match(/^javascript:/i)){
		CurrentTab.CmdExec("go",url);
	}else{
		if(!App.tabCount){
			App.CmdExec("go",url);
		}else{
			var	tab=CurrentTab.CmdExec("duplicate",-1,0x2,0);
			if(tab){
				tab.CmdExec("go",url);
			}
		}
	}
}