var url=DataObject.url;
if(!url){
	url=DataObject.text;
}
if(url){
	url=escape(url);
	App.NewTab("http://translate.google.co.jp/translate?hl=ja&sl=auto&tl=ja&u="+url);
}