var	txt = App.clipboard.getData("TEXT");
if(txt){
	txt += "\r\n";
}
txt += DataObject.text;
App.clipboard.setData("TEXT",txt);