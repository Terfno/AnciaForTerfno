var url=DataObject.url;
if(url){
	var	txt = App.clipboard.getData("TEXT");
	if(txt){
		txt += "\r\n";
	}
	txt+=url;
	App.clipboard.setData("TEXT",txt);
}