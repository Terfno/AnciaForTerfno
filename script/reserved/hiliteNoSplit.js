var	txt=DataObject.text;
txt=txt.replace(/^(\s|\u00A0|\u3000)+|(\s|\u00A0|\u3000)+$/g,"");
CurrentTab.cmdExec("add.hilite",txt);