var	txt=DataObject.text;
if(txt){
	txt=txt.replace(/( |　)+|(\r|\n)+/g," ");
	txt=txt.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g,"");
	var	s=txt.split(" ");
	var	tabCount = App.tabCount();
	for(t=0;t<tabCount;++t){
		var	tab = App.tab(t);
		for(i=0;i<s.length;++i){
			tab.cmdExec("add.hilite",s[i]);
		}
	}
}
