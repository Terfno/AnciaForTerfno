var	url=DataObject.url;
if(!url){
	url=DataObject.text;
}
if(url){
	App.NewTab("gcf:"+url);
}