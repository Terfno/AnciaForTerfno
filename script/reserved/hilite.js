var	txt=DataObject.text;
if(txt){
	txt=txt.replace(/( |　)+|(\r|\n)+/g," ");
	txt=txt.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g,"");
	var	s=txt.split(" ");
	for(i=0;i<s.length;++i){
		CurrentTab.cmdExec("add.hilite",s[i]);
	}
}