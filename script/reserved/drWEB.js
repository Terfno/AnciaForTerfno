var	url=DataObject.url;
if(url){
	var	activate=((Context.tabFlags&0x4)===0);
	App.NewTab("http://online.drweb.com/result?url="+encodeURIComponent(url),activate,Context.NewTabPosition);
}