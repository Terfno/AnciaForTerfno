var	tabCount=App.tabCount();
var	txt=DataObject.text;
txt=txt.replace(/^(\s|\u00A0|\u3000)+|(\s|\u00A0|\u3000)+$/g,"");
for(i=0;i<tabCount;++i){
	var	tab = App.tab(i);
	tab.CmdExec("add.hilite",txt);
}