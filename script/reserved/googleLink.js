var	url=DataObject.url;
if(!url){
	url=DataObject.text;
}
if(url){
	url=escape(url);
	App.NewTab("http://www.google.co.jp/search?num=100&q=link:"+url);
}