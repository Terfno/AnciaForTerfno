var	txt = App.clipboard.getData("TEXT");
txt += "\r\n";
txt += "<a href=\"";
txt += DataObject.url;
txt += "\">";
if(DataObject.title) {
	txt += DataObject.title;
} else {
	txt += DataObject.url;
}
txt += "</a>"
App.clipboard.setData("TEXT",txt);