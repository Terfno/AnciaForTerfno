var	url=DataObject.url;
if(url){
	var	sch = App.openSearch("aguse.jp.xml");
	if(sch){
		url=sch.buildUrl(url);
		if(url){
			App.NewTab(url);
		}
	}
}
