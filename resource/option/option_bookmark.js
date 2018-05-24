var s_defBookmarkGuid="",s_bookmarks;
// todo: load tool clsid from setting
// reserved tool clsid: resource/toolclsid.json
// user clsid setting toolclsid.json
var ToolClsids=[
	 "{68D93D97-31CA-4220-A7E5-4B549455B3E7}"	// extract link tool
	,"{D8730075-FE38-4C61-8EEE-7037A5F0E42A}"	// ie history
]
function isToolClsid(clsid){
	clsid=clsid.toUpperCase();
	for (var i=0;i<ToolClsids.length;++i){
		if (ToolClsids[i]===clsid){
			return true;
		}
	}
	return false;
}
function invalidateBookmark(refresh){
	if(g_initBookmark){
		refreshBookmark(refresh);
	}
	if(g_initToolbar){
		refreshToolbar();
	}
}
function bookmarkOption(guid){
	try{
		if(g_ext.bookmarkOption(guid)){
			g_bookmarkChanged=true;
			invalidateBookmark({bookmark:true});
		}
	}catch(e){
		errDlg(ERRCODE_BOOKMARK_SETTING);
	}
}
function _bookmarkOption(){
	var	bm=window.event.srcElement.bm;
	bookmarkOption(bm.guid);
}
function bookmarkToolbarOption(idToolbar){
	try{
		guid=g_ext.bandIdToGuid(idToolbar);
		if(g_ext.bookmarkOption(guid,'toolbar')){
			g_toolbarChanged=true;
			g_bookmarkChanged=true;
			invalidateBookmark({bookmark:true,tool:true});
		}
	}catch(e){
		errDlg(ERRCODE_BOOKMARK_SETTING);
	}
}
function addBookmark(clsid){
	try{
		if(g_ext.addBookmark(clsid)){
			invalidateBookmark({bookmark:true});
			g_bookmarkChanged=true;
		}
	}catch(e){
		errDlg(ERRCODE_BOOKMARK_SETTING);
	}
}
function addTool(clsid){
	try{
		if(g_ext.addBookmark(clsid)){
			invalidateBookmark({tool:true});
			g_toolChanged=true;
		}
	}catch(e){
		errDlg(ERRCODE_BOOKMARK_SETTING);
	}
}
function delBookmark(guid){
	var name=_getBookmarkNameByGuid(guid);
	if(confirm("ブックマーク「"+name+"」を削除しますか？\n削除するとツールバーも削除されます。\n\n注：削除は取り消せません")){
		try{
			if(g_ext.delBookmark(guid)){
				invalidateBookmark({bookmark:true});
				g_bookmarkChanged=true;
			}
		}catch(e){
			errDlg(ERRCODE_BOOKMARK_SETTING);
		}
	}
}
function _delBookmark(){
	var	bm=window.event.srcElement.bm;
	if(isToolClsid(bm.clsid))delTool(bm.guid);
	else delBookmark(bm.guid);
}
function delTool(guid){
	var name=_getBookmarkNameByGuid(guid);
	if(confirm("「"+name+"」 を削除しますか？\n\n注：削除は取り消せません")){
		try{
			if(g_ext.delBookmark(guid)){
				invalidateBookmark({tool:true});
				g_toolChanged=true;
			}
		}catch(e){
			//errDlg(ERRCODE_BOOKMARK_SETTING);
		}
	}
}
function _getBookmarkName(bm){
	return (bm.txt?bm.txt:"&lt;名前がありません&gt;");
}
function _getBookmarkNameByGuid(guid){
	var	name="";
	if(s_bookmarks){
		for(var i=0;i<s_bookmarks.length;++i){
			if(guid===s_bookmarks[i].guid){
				name=_getBookmarkName(s_bookmarks[i]);
				break;
			}
		}
	}
	return name;
}

function _changeDefaultBookmark(){
	var	options=document.defaultBookmark.v.options
		,selGuid=getSelectedValue(options)
		,change=confirm("ブックマーク 「"+_getBookmarkNameByGuid(selGuid)+"」 を既定に設定しますか？");
	if(change){
		g_bookmarkChanged=true;
		try{
			if(g_ext.setDefaultBookmark(selGuid)){
				// update bookmark content
				for(var i=0;i<options.length;++i){
					var	guid=options[i].value
						,delBtn=document.getElementById(guid+"del"),def=(guid===selGuid);
					if(delBtn){
						delBtn.disabled=def;
					}
					var	defTxt=document.getElementById(guid+'def');
					if(defTxt){
						defTxt.style.display=(def?"inline":"none");
					}
				}
				s_defBookmarkGuid=selGuid;
			}
		}catch(e){
			errDlg(ERRCODE_BOOKMARK_SETTING);
		}
	}else{
		// prevent change
		selectOption(options,s_defBookmarkGuid);
	}
}
function _createTable0(){
	var	t=$c("table");
	t.border=t.cellPadding=t.cellSpacing=0;
	return t;
}
function _buildBookmarkContent(refresh){
	var	bookmarks=s_bookmarks,content={bookmark:undefined,tool:undefined};
	if(bookmarks&&(bookmarks.length>0)){
		
		// build select default bookmark html
		var	tableBm,tableTool;
		if(refresh.bookmark){
			content.bookmark=[undefined,undefined];
			var	 frmDefaultBm=$c("<form name=defaultBookmark>")
				,label=$c("label"),select=$c("<select name=v>");
			label.style.paddingLeft=2;//"2px";
			label.appendChild($t("既定のブックマーク： "));
			frmDefaultBm.appendChild(label);
			select.style.width=195;
			select.onchange=_changeDefaultBookmark;
			select=frmDefaultBm.appendChild(select);
			for(var i=0;i<bookmarks.length;++i){
				var	bm=bookmarks[i];
				
				// tool
				if(isToolClsid(bm.clsid)){
					continue;
				}
				var	opt=addOption(select.options,bm.guid,_getBookmarkName(bm));
				if(bm.isDefault){
					opt.defaultSelected=true;
					s_defBookmarkGuid=bm.guid;
				}
			}
			content.bookmark[0]=frmDefaultBm;
			tableBm=_createTable0();
			//html.bookmark+=" vspace=0px hspace=0px border=0 cellpadding=0 cellspacing=0>";
		}
		
		if(refresh.tool){
			tableTool=_createTable0();
			content.tool=tableTool;
		}

		// build bookmark list, tool list
		var	resDir=getResourceDirPath(),fs=getFSO()
			,spanDefBase,btnOptionBase=$c("button"),spanOption=$c("span")
			,btnDelBase=$c("button"),spanDel=$c("span");
		if(refresh.bookmark){
			spanDefBase=$c("span");
			spanDefBase.style.fontWeight="bold";
			spanDefBase.style.display="none";
			spanDefBase.innerText=" <既定>";
		}
		// option button
		btnOptionBase.className="cComOption";
		spanOption.innerText=" 詳細設定...";
		btnOptionBase.appendChild(spanOption);
		// del button
		btnDelBase.className="cComDel";
		spanDel.innerText=" 削除...";
		btnDelBase.appendChild(spanDel);
		for(var i=0;i<bookmarks.length;++i){
			var	bm=bookmarks[i],isTool=isToolClsid(bm.clsid);
			if(refresh.bookmark&&!refresh.tool&&isTool){
				continue;
			}
			if(!refresh.bookmark&&refresh.tool&&!isTool){
				continue;
			}
			var	table=isTool?tableTool:tableBm;
			var	tr=table.insertRow(),td=tr.insertCell(),spanName=$c("span");
			td.style.width=222;
			spanName.className=isTool?"cComponent32 cTool32":"cComponent32 cBookmark32";
			var	icon32path=fs.BuildPath(resDir,bm.clsid+"/icon32.png");
			if(fs.FileExists(icon32path)){
				spanName.style.backgroundImage="url("+icon32path+")";
			}
			spanName.appendChild($t(_getBookmarkName(bm)));
			if(!isTool){
				var	spanDef=spanDefBase.cloneNode(true);
				spanDef.id=bm.guid+"def";
				if(bm.isDefault){
					spanDef.style.display="inline";
				}
				spanName.appendChild(spanDef);
			}
			td.appendChild(spanName);
			// option
			td=tr.insertCell(),btnOption=btnOptionBase.cloneNode(true);
			btnOption.bm=bm;
			btnOption.onclick=_bookmarkOption;
			td.appendChild(btnOption);
			// del
			td=tr.insertCell();
			var	btnDel=btnDelBase.cloneNode(true);
			btnDel.id=bm.guid+"del";
			if(bm.isDefault){
				btnDel.disabled=true;
			}
			btnDel.bm=bm;
			btnDel.onclick=_delBookmark;
			td.appendChild(btnDel);
		}
		if(refresh.bookmark){
			content.bookmark[1]=tableBm;
		}
		if(refresh.tool){
			if(!content.tool.rows.length){
				content.tool=$t("使用ツールがありません。");
			}
		}
	}
	return content;
}
function _loadBookmarks(){
	var	fs=getFSO(),path;
	path=fs.BuildPath(getSettingDirPath(),"Bookmarks.json");
	if (!fs.FileExists(path)){
		path=fs.BuildPath(getResourceDirPath(),"Bookmarks.json");
	}
	return parseJsonFile(path);
}
function refreshBookmark(refresh){
	var	content={};
	s_bookmarks=undefined;
	try{
		var	info=_loadBookmarks();
		if (info){
			s_bookmarks=info.bookmark;
			content=_buildBookmarkContent(refresh);
		}
	}catch(e){
		throw e;
		alert(e.message);}
	if(refresh.bookmark){
		if(!content.bookmark){
			content.bookmark=[undefined];
			content.bookmark[0]=$t("何らかのエラーが発生しました");
		}
		replaceChildren(document.getElementById("bookmarkView"),content.bookmark);
		var	frm=document.defaultBookmark;
		if(frm){
			selectOption(frm.v.options,s_defBookmarkGuid);
		}
	}
	if(refresh.tool){
		if(!content.tool)content.tool=$t("何らかのエラーが発生しました");
		replaceChild(document.getElementById("toolView"),content.tool);
	}
}
(function(){refreshBookmark({bookmark:true,tool:true});})();