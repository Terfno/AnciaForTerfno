var	title=DataObject.title;
var	url=DataObject.url;
var	txt="";
if(title){
	if(title===url){
		txt=url;
	}else{
		txt=title+"\r\n"+DataObject.url+"\r\n";
	}
}else{
	txt=url;
}
App.clipboard.setData("TEXT",txt);