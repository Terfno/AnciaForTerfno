function doLockToolbar(){
	g_ext.lockToolbar();
}
function _toolbarSettingChanged(){
	g_toolbarChanged=true;
	refreshToolbar();
}
function toolbarOption(id){
	if(g_ext.toolbarOption(id)){
		_toolbarSettingChanged();
	}
}
function addToolbar(clsid){
	if(g_ext.addToolbar(clsid)){
		_toolbarSettingChanged();
	}
}
function showToolbar(btn,id){
	var	isVisible=g_ext.showToolbar(id)
		,txtShow=" 隠す",imgShow="toolbarhide.png";
	if(! isVisible){
		txtShow=" 表示";
		imgShow="toolbar.png";
	}
	btn.firstChild.src=imgShow;
	btn.firstChild.nextSibling.nodeValue=txtShow;
}
function _getToolbarName(id){
	var	name="";
	var	list=g_ext.toolbarList,cnt=list.count
	for(var i=0;i<cnt;++i){
		if(id===list.id(i)){
			name=list.name(i);
			break;
		}
	}
	return name;
}
function delToolbar(id){
	var	name=_getToolbarName(id);
	if(confirm("ツールバー「"+name+"」を削除しますか？    \n注：削除は取り消せません")){
		if(g_ext.delToolbar(id)){
			_toolbarSettingChanged();
		}
	}
}
function _bookmarkToolbarOption(idToolbar){
	initBookmark();
	bookmarkToolbarOption(idToolbar);
}
function refreshToolbar(){
	var	list=g_ext.toolbarList,cnt=list.count,html="";
	if(cnt>0){
		html="<table vspace=0px hspace=0px border=0 cellpadding=0 cellspacing=0>";
		for(var i=0;i<cnt;++i){
			var	id=list.id(i),name=list.name(i)
				,style=list.style(i),disabled="",optionFunc=null;
			if(style&0x01000000){
				disabled=" disabled";
			}
			if(style&0x02000000){
				optionFunc='_bookmarkToolbarOption('+id+');';
			}else{
				optionFunc='toolbarOption('+id+');';
			}
			var	txtShow=" 隠す", imgShow="toolbarhide.png";
			if(style&0x8){
				txtShow=" 表示";
				imgShow="toolbar.png";
			}
			tmp='<tr><td width=145px><span class=cToolbar>'+name+'</span></td>';
			tmp+='<td>';
			tmp+='<button style="width=5em;" onclick=showToolbar(this,'+id+');><img src='+imgShow+'>'+txtShow+'</button>';
			tmp+='<button style="width=8em;" onclick='+optionFunc+'><img src=property.png>&nbsp;詳細設定...</button>';
			tmp+='<button style="width=6em;"'+disabled+' onclick=delToolbar('+id+');><img src=-.png>&nbsp;削除...</button>';
			tmp+="</td></tr>";
			html+=tmp;
		}
		html+="</table>";
	}else{
		html='なし';
	}
	document.getElementById("toolbarView").innerHTML=html;
}
(function(){refreshToolbar();})();