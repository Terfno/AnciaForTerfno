var url=DataObject.url;
if(! url){
	url=DataObject.text;
}
if(url){
	CurrentTab.CmdExec("go",url);
}