var	title=DataObject.title;
var	url=DataObject.url;
var	txt="";
if(title){
	if(title==url){
		txt=url;
	}else{
		txt=title+"\n"+DataObject.url;
	}
}else{
	txt=url;
}
App.MsgBox(txt,"sample");