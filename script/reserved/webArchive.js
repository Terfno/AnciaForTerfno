var	url=DataObject.url;
if(!url){
	url=DataObject.text;
}
if(url){
	//url=escape(url);
	App.NewTab("http://web.archive.org/web/*/"+url);
}
