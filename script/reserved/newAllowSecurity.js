var	url=DataObject.url;
var	tab = App.createTab();
tab.security = 0x70;
tab.CmdExec("go",url);