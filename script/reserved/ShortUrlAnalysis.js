var	url=DataObject.url;
if(!url){
	url=DataObject.text;
}
if(url.match(/^http:\/\/(am6\.jp|bit\.ly|fc2\.in|goo\.gl|j\.mp|ux\.nu)\/([0-9a-zA-Z]+)$/)){
	var	msg=App.MsgBox("この URL は対応しています...\n\n"+url+"+"+
			"\n\n上記 URL で解析を行います。","ShortUrlAnalysis",0x001|0x040);
	if(msg==1){
		App.NewTab(url+"+");
	}
}else{
	var	msg=App.MsgBox("この URL は + に未対応...\n\n"+url+
			"\n\nTOPSY で解析を行います。","ShortUrlAnalysis",0x001|0x040);
	if(msg==1){
		App.NewTab("http://topsy.com/s?q="+encodeURIComponent(url));
	}
}
