var txt=App.clipboard.getData("TEXT");
if(!txt){
	txt="";
}
var	activate=((Context.tabFlags&0x4)===0);
var tab=App.createTab(Context.NewTabPosition,activate);
if(tab){
	tab.cmdExec("search","goo 辞書.xml",txt);
}