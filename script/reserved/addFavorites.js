var title,url;
url=DataObject.url;
if(!url){
	url=DataObject.text;
	title=url;
}else{
	title=DataObject.title;
}
App.cmdExec("add.favorites",title,url);