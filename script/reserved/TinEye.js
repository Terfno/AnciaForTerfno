var	url=DataObject.url;
if(!url){
	url=DataObject.text;
}
if(url){
	url=escape(url);
	App.NewTab("http://www.tineye.com/search?url="+url);
}