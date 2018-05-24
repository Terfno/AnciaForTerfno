function refreshSearch(){
	var	cnt = g_ext.searchEngineCount,content;
	if(cnt>0){
		var	div=$("<div>")
			,btn=$("<button>")
			,delTxt=$("<span>削除</span>")
			,name=$("<span>");
		btn.addClass("cSearchDel");
		name.addClass("cSearch");
		content=$("<div>");
		for(var i=0;i<cnt;++i){
			var	searchId=g_ext.searchEngineId(i)
				,delBtn=btn.clone().append(delTxt.clone());
			delBtn.data("id",searchId);
			content.append(
				div.clone().append(delBtn)
						   .append(name.clone().text(g_ext.searchEngine(i)))
			);
		}
	}
	if(!content){
		content=$("<div>なし</div>");
	}
	$("#searchView").empty().append(content);
}
$("button.cSearchDel").live("click",function(ev){
	var	id=$.data(ev.target,"id");
	g_ext.delSearchEngine(id, true);
	$(":first",ev.target).text("取消");
	ev.target.nextSibling.style.textDecoration="line-through";
	$(ev.target).toggleClass("cSearchDel cSearchDelCancel");
});
$("button.cSearchDelCancel").live("click",function(ev){
	var	id=$.data(ev.target,"id");
	g_ext.delSearchEngine(id, false);
	$(":first",ev.target).text("削除");
	ev.target.nextSibling.style.textDecoration="none";
	$(ev.target).toggleClass("cSearchDel cSearchDelCancel");
});
$("a.cSearchAdd").live("click",function(){
	goAddSearchPage();
});
(function(){refreshSearch();})();