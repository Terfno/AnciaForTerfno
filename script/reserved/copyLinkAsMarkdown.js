var	txt = "[";
if(DataObject.title) {
 txt += DataObject.title;
} else {
 txt += DataObject.url;
}
txt += "](";
var url = DataObject.url;
url = url.replace(/\(/g, "\\(");
url = url.replace(/\)/g, "\\)");
txt += url;
txt += ")";
App.clipboard.setData("TEXT",txt);