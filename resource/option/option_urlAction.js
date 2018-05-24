// url action select items
var
 STR_STYLESHEET_DISABLE="スタイルシートを無効"
,STR_STYLESHEET_DEFAULT="デフォルトのスタイルシート"
,STR_STYLESHEET_ALTERNATE="代替: "
,STR_STYLESHEET_USER="ユーザ: "
,STR_URLACTION_DELETE="削除"
,STR_URLACTION_DELETE_CANCEL="取消"
,CMD_STYLESHEET_CSS="css:"
,CMD_STYLESHEET_DISABLE="disable"
,CMD_STYLESHEET_DEFAULT="default"
,CMD_STYLESHEET_ALTERNATE="alternate:"
,CMD_STYLESHEET_USER="user:"
,CMD_URLACTION_BEFORE="before"
,CMD_URLACTION_COMPLETE="complete"
,CMD_URLACTION_STYLESHEET="styleSheet"
,g_urlActionCmds=[
	 {event:CMD_URLACTION_BEFORE+","+CMD_URLACTION_COMPLETE,cmd:"none"}
	,{event:CMD_URLACTION_BEFORE,cmd:"cancel",txt:"ナビゲートキャンセル"}
	,{event:CMD_URLACTION_BEFORE+","+CMD_URLACTION_COMPLETE,cmd:"script:reserved\\close.js"}
	,{event:CMD_URLACTION_BEFORE+","+CMD_URLACTION_COMPLETE,cmd:"end",txt:"パターン検索を終了"}
	,{event:CMD_URLACTION_BEFORE,security:"-0x10",txt:"セキュリティ: 画像ダウンロードを無効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"+0x10",txt:"セキュリティ: 画像ダウンロードを有効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"-0x20",txt:"セキュリティ: ビデオダウンロードを無効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"+0x20",txt:"セキュリティ: ビデオダウンロードを有効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"-0x40",txt:"セキュリティ: バックサウンドダウンロードを無効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"+0x40",txt:"セキュリティ: バックサウンドダウンロードを有効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"-0x80",txt:"セキュリティ: スクリプト実行を有効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"+0x80",txt:"セキュリティ: スクリプト実行を無効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"-0x100",txt:"セキュリティ: Javaの実行を無効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"-0x100",txt:"セキュリティ: Javaの実行を有効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"-0x200",txt:"セキュリティ: ActiveXの実行を有効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"+0x200",txt:"セキュリティ: ActiveXの実行を無効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"-0x400",txt:"セキュリティ: ActiveXのダウンロードを有効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"+0x400",txt:"セキュリティ: ActiveXのダウンロードを無効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"-0x70",txt:"セキュリティ: 画像・ビデオ・サウンドを無効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"+0x70",txt:"セキュリティ: 画像・ビデオ・サウンドを有効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"-0x780",txt:"セキュリティ: スクリプト・Java・ActiveX関係を全て有効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"+0x780",txt:"セキュリティ: スクリプト・Java・ActiveX関係を全て無効にする"}
	,{event:CMD_URLACTION_BEFORE,security:"0x70",txt:"セキュリティ: セキュリティを全て許可"}
	,{event:CMD_URLACTION_BEFORE,security:"0x780",txt:"セキュリティ: セキュリティを全て非許可"}
	,{event:CMD_URLACTION_STYLESHEET,css:CMD_STYLESHEET_DEFAULT,txt:STR_STYLESHEET_DEFAULT}
	,{event:CMD_URLACTION_STYLESHEET,css:CMD_STYLESHEET_DISABLE,txt:STR_STYLESHEET_DISABLE}
],
g_userCssFiles;
/////////////////////////////////////////////////////////////////////////////////////
function getUserCssFiles(){
	if(!g_userCssFiles){
		g_userCssFiles=[];
		var	fso=getFSO()
			,files=new Enumerator(fso.GetFolder(getUserStyleSheetPath()).Files);
		for (;!files.atEnd();files.moveNext()){
			var f=files.item();
			if(f.Name.match(/.css$/i)){
				g_userCssFiles.push(f.Name);
			}
		}
	}
	return g_userCssFiles;
}
/////////////////////////////////////////////////////////////////////////////////////
function getUserStyleSheetPath(){
	var	appDir=pathRemoveFileSpec(g_app.path),fso=getFSO();
	return fso.BuildPath(appDir,"setting\\userStyleSheet");
}
function getUrlActionPath(){
	var	appDir=pathRemoveFileSpec(g_app.path),fso=getFSO();
	return fso.BuildPath(appDir,"setting\\customize\\url_action.json");
}
function getCurrentUrlAction(){
	return parseJsonFile(getUrlActionPath());
}
function getUrlActionDisplayName(cmd){
	// css
	if(-1!==cmd.indexOf(CMD_STYLESHEET_CSS)){
		var	v=cmd.substr(CMD_STYLESHEET_CSS.length);
		if(v===CMD_STYLESHEET_DISABLE){
			return STR_STYLESHEET_DISABLE;
		}
		if(v===CMD_STYLESHEET_DEFAULT){
			return STR_STYLESHEET_DEFAULT;
		}
		if(-1!==v.indexOf(CMD_STYLESHEET_ALTERNATE)){
			return STR_STYLESHEET_ALTERNATE+
				v.substr(CMD_STYLESHEET_ALTERNATE.length);
		}
		if(-1!==v.indexOf(CMD_STYLESHEET_USER)){
			return STR_STYLESHEET_USER+
				v.substr(CMD_STYLESHEET_USER.length);
		}
		return cmd;
	}

	// script
	if(-1!==cmd.indexOf("script:")){
		return _getScriptDisplayName(cmd);
	}

	// security
	var	cmdCnt=g_urlActionCmds.length,i;
	if(-1 !==cmd.indexOf("security:")){
		var	security=cmd.substr(9);
		for(var i=0;i<cmdCnt;++i){
			var	acmd=g_urlActionCmds[i];
			if(acmd.security===security){
				return acmd.txt;
			}
		}
	}

	// cmd
	for(var i=0;i<cmdCnt;++i){
		var	acmd=g_urlActionCmds[i];
		if(acmd.cmd===cmd && acmd.txt){
			return acmd.txt;
		}
	}
	return getCmdDisplayName(cmd);
}
function getUrlActionCmd(action){
	if(action.script){
		return "script:"+action.script;
	}
	if(action.security){
		return "security:"+action.security;
	}
	if(action.action){
		return action.action;
	}
	if(action.css){
		return CMD_STYLESHEET_CSS+action.css;
	}
	return "none";
}
function initUrlActionCmd(options,event){
	var	cmdCnt=g_urlActionCmds.length,i;
	options.length=0;
	for(var i=0;i<cmdCnt;++i){
		var	cmd=g_urlActionCmds[i];
		if(cmd.event.indexOf(event)!==-1){
			var	val;
			if(cmd.cmd)val=cmd.cmd;
			if(cmd.security)val="security:"+cmd.security;
			if(cmd.css)val=CMD_STYLESHEET_CSS+cmd.css;
			if(val){
				var txt=cmd.txt;
				if(!txt){
					txt=getUrlActionDisplayName(val);
				}
				addOption(options,val,txt);
			}
		}
	}
	
	// script
	if(event!==CMD_URLACTION_STYLESHEET){
		var	scriptList=getScriptList(),scriptCnt=scriptList.count;
		for(var i=0;i<scriptCnt;++i){
			var	filename=scriptList.filename(i);
			if(queryScriptAction(filename,SCRIPTACTION_URLACTION)){
				addOption(options,"script:"+filename,_getScriptDisplayName(filename));
			}
		}
	}

	// user style sheet
	if(event===CMD_URLACTION_STYLESHEET){
		var	files=getUserCssFiles(),cnt=files.length;
		for(var i=0;i<cnt;++i){
			var	cmd=CMD_STYLESHEET_CSS+CMD_STYLESHEET_USER+files[i];
			addOption(options,cmd,getUrlActionDisplayName(cmd));
		}
	}
}
function _isEqualEventsLight(l,r,ev){
	l=l[ev],r=r[ev];
	var	lOk=undefined!==l,rOk=undefined!==r;
	if(lOk!==rOk){
		return false;
	}
	if(lOk){
		if(l.length!==r.length){
			return false;
		}
	}
	return true;
}
function _isEqualEvents(l,r,ev){
	l=l[ev];
	if(l){
		r=r[ev];
		var	len=l.length;
		for(var i=0;i<len;++i){
			var	lJson=JSON.stringify(l[i])
			   ,rJson=JSON.stringify(r[i]);
			if(lJson!==rJson){
				return false;
			}
		}
	}
	return true;
}
function isEqualUrlAction(l,r){
	// check:    before complete styleSheet
	if( !_isEqualEventsLight(l,r,CMD_URLACTION_BEFORE)||
		!_isEqualEventsLight(l,r,CMD_URLACTION_COMPLETE)||
		!_isEqualEventsLight(l,r,CMD_URLACTION_STYLESHEET)||
		!_isEqualEvents(l,r,CMD_URLACTION_BEFORE)||
		!_isEqualEvents(l,r,CMD_URLACTION_COMPLETE)||
		!_isEqualEvents(l,r,CMD_URLACTION_STYLESHEET)
	){
		return false;
	}
	return true;
}
function _refreshUrlAction(contentId,actions,isAdd){
	var	content=document.getElementById(contentId);
	var	cnt=actions?actions.length:0,parent=$(content);
	if(!isAdd){
		parent.empty();
	}else{
		// remove "empty" content
		if(3==content.firstChild.nodeType){
			parent.empty();
		}
	}
	if(cnt){
		var	c=document.createElement
			,textInputBase=$(c("<input type=text name=v class='cUrlActionInput cInline'>"))
			,selectCmdBase=$(c("<select name=v class='cUrlActionCmd cInline'>"))
			,btnDelBase=$(c("<button>"))
			,btnUpBase=btnDelBase.clone()
			,btnDownBase=btnDelBase.clone();
		btnDelBase.append($("<span>"+STR_URLACTION_DELETE+"</span>")).addClass("cUrlActionDel");
		btnUpBase.append($("<span></span>")).addClass("cUrlActionUp");
		btnDownBase.append($("<span></span>")).addClass("cUrlActionDown");
		for(var i=0;i<cnt;++i){
			
			var	action=actions[i];
			var	data={contentId:contentId,action:action}
				,div=$(c("<div>")).text(": ").attr("id",contentId+i)
				,formInput=$(c("<form name="+contentId+"Input"+i+" class=cInline>"))
				,textInput=textInputBase.clone();
			div.data("action",data);
			
			var	formCmd=$(c("<form class='cDummy cInline'>"))
				,selectCmd=selectCmdBase.clone()
				,btnDel=btnDelBase.clone()
				,btnUp=btnUpBase.clone()
				,btnDown=btnDownBase.clone();
			selectCmd.change(function(ev){changeUrlActionCmd(ev.target)});
			if(isAdd){
				div.addClass("cAdd cHide");
				textInput.addClass("cMod");
				selectCmd.addClass("cMod");
			}
			textInput.val(action.url);
			
			var	optCmd=selectCmd.get(0).options
				,cmd=getUrlActionCmd(action);
			optCmd.length=1;
			optCmd[0].value=cmd;
			optCmd[0].text=getUrlActionDisplayName(cmd);
			div .append(formInput.append(textInput))
				.append(formCmd.append(selectCmd))
				.append(btnDel)
				.append(btnUp)
				.append(btnDown);
			
			if(isAdd&&parent.get(0).firstChild){
				$(parent.get(0).firstChild).before(div);
			}else{
				parent.append(div);
			}
			if(isAdd){
				div.slideDown("n");
				break;
			}
		}
	}else{
		parent.text("なし");
	}
}
function addUrlAction(btn){
	var	parentNode=btn.parentNode
		,contentId=btn.contentId
		,formInput=document.forms[contentId+"Input"]
		,url=formInput.v.value;
	if(url.length){
		var	formCmd=document.forms[contentId+"Cmd"]
			,selCmd=formCmd.v.value
			,action={"url":url}
			,iScript=selCmd.indexOf("script:")
			,iSecurity=selCmd.indexOf("security:")
			,iCss=selCmd.indexOf(CMD_STYLESHEET_CSS);
		if(-1!==iScript){
			action.script=selCmd.substr(7);
		}else if(-1!==iSecurity){
			action.security=selCmd.substr(9);
		}else if(-1!==iCss){
			action.css=selCmd.substr(CMD_STYLESHEET_CSS.length);
		}else{
			action.action=selCmd;
		}
		_refreshUrlAction(contentId,[action],true);
		formInput.v.value="";
		formInput.v.focus();
		selectOption(formCmd.v.options,"none");
	}
	btn.disabled=true;
}
function delUrlAction(btn,action,isDel){
	var	parentNode=btn.parentNode;
	$(":input:not(button.cUrlActionDel,button.cUrlActionDelCancel)",parentNode).attr("disabled",isDel);
	action.action.isDel=isDel;
	$(":first",btn).text(isDel?STR_URLACTION_DELETE_CANCEL:STR_URLACTION_DELETE);
	$(btn).toggleClass("cUrlActionDel cUrlActionDelCancel");
}
function _contentToUrlAction(content,actions){
	while(content){
		var	action=$(content).data("action").action;
		if(action&&!action.isDel&&action.url){
			var	add={"url":action.url};
			if(action.script){
				add.script=action.script;
			}else if(action.security){
				add.security=action.security;
			}else if(action.css){
				add.css=action.css;
			}else{
				add.action=action.action;
			}
			actions.push(add);
		}
		content=content.nextSibling;
	}
}
function _hasUrlAction(content){
	return content.firstChild&&1==content.firstChild.nodeType;
}
function saveUrlAction(){
	var	urlAction={};

	// before
	if(g_initUrlAction){
		var	before=document.getElementById("idUrlActionBefore");
		if(_hasUrlAction(before)){
			urlAction[CMD_URLACTION_BEFORE]=[];
			_contentToUrlAction(before.firstChild,urlAction[CMD_URLACTION_BEFORE]);
		}
	
		// complete
		var	complete=document.getElementById("idUrlActionComplete");
		if(_hasUrlAction(complete)){
			urlAction[CMD_URLACTION_COMPLETE]=[];
			_contentToUrlAction(complete.firstChild,urlAction[CMD_URLACTION_COMPLETE]);
		}
	}else{
		if(g_urlAction){
			if(g_urlAction[CMD_URLACTION_BEFORE]){
				urlAction[CMD_URLACTION_BEFORE]=g_urlAction[CMD_URLACTION_BEFORE];
			}
			if(g_urlAction[CMD_URLACTION_COMPLETE]){
				urlAction[CMD_URLACTION_COMPLETE]=g_urlAction[CMD_URLACTION_COMPLETE];
			}
		}
	}

	// style sheet
	if(g_initStyleSheet){
		var	styleSheet=document.getElementById("idStyleSheet");
		if(_hasUrlAction(styleSheet)){
			urlAction[CMD_URLACTION_STYLESHEET]=[];
			_contentToUrlAction(styleSheet.firstChild,urlAction[CMD_URLACTION_STYLESHEET]);
		}
	}else{
		if(g_urlAction){
			if(g_urlAction[CMD_URLACTION_STYLESHEET]){
				urlAction[CMD_URLACTION_STYLESHEET]=g_urlAction[CMD_URLACTION_STYLESHEET];
			}
		}
	}
	
	// compare current setting
	var	current=getCurrentUrlAction();
	if(current&&isEqualUrlAction(current,urlAction)){
		return false;
	}
	
	// browser emulation
	if(g_urlAction&&g_urlAction.emulation){
		urlAction.emulation=g_urlAction.emulation;
	}

	// popup
	if(g_urlAction&&g_urlAction.popup){
		urlAction.popup=g_urlAction.popup;
	}

	if(! urlAction.before &&
	   ! urlAction.complete &&
	   ! urlAction.popup &&
	   ! urlAction.styleSheet &&
	   ! urlAction.emulation){
		return false;
	}
	var	json=JSON.stringify(urlAction,undefined," ");
	writeUnicodeTextFile(getUrlActionPath(), json);
	return true;
}
function changeUrlActionCmd(elem){
	$(elem).addClass("cMod");
	var	action=$.data(elem.parentNode.parentNode,"action");
	if(action){
		var	value=elem.value;
		action=action.action;
		if(value.indexOf("script:")!==-1){
			action.action=undefined;
			action.script=value.substr(7);
			action.security=undefined;
		}else if(value.indexOf("security:")!==-1){
			action.action=undefined;
			action.script=undefined;
			action.security=value.substr(9);
		}else if(value.indexOf(CMD_STYLESHEET_CSS)!==-1){
			action.css=value.substr(CMD_STYLESHEET_CSS.length);
		}else{
			action.action=value;
			action.script=undefined;
			action.security=undefined;
		}
	}
}
$("button.cUrlActionAdd:enabled").live("click", function(ev){
	addUrlAction(ev.target);
});
$("button.cUrlActionUp,button.cUrlActionDown").live("click",function(ev){
	var	parent=ev.target.parentNode
		,swp="cUrlActionDown"===ev.target.className?
		parent.nextSibling:parent.previousSibling;
	if(swp){
		swp.swapNode(parent);
	}
});
$("button.cUrlActionDel,button.cUrlActionDelCancel").live("click",function(ev){
	var	isDel="cUrlActionDel"===ev.target.className
		,action=$.data(ev.target.parentNode,"action");
	delUrlAction(ev.target,action,isDel);
});
$("input.cUrlActionInput").live("focus blur",function(ev){
	var	focusin="focusin"===ev.type;
	g_ext.preventTransAccel(focusin);
	if(!focusin){
		var action=$.data(ev.target.parentNode.parentNode,"action");
		if(action){
			action=action.action;
			if(action.url!=ev.target.value){
				action.url=ev.target.value;
				$(ev.target).addClass("cMod");
			}
		}
	}
	return true;
});
$("form.cDummy .cUrlActionCmd:enabled").live("mousedown focus",function(ev){
	var	select=ev.target,value=select.value
		,action=$.data(select.parentNode.parentNode,"action"),contentId;
	if(action){
		contentId=action.contentId;
	}else{
		contentId=select.parentNode.name;
	}
	var	event;
	if(-1!==contentId.indexOf("StyleSheet")){
		event=CMD_URLACTION_STYLESHEET;
	}else{
		event=(contentId.indexOf("Complete")===-1?
			CMD_URLACTION_BEFORE:CMD_URLACTION_COMPLETE);
	}
	initUrlActionCmd(select.options,event);
	if(!selectOption(select.options,value)){
		var	item=addOption(select.options,value,getUrlActionDisplayName(value));
		item.selected=true;
	}
	$(select.form).removeClass("cDummy");
	return false;
});
function _handleInputKeydown(ev,btnid){
  // return key
  if (13===ev.keyCode){
    document.getElementById(btnid).click();
  }else{ 
    var target=ev.target;
    window.setTimeout(function(){
      document.getElementById(btnid).disabled=!target.value.length;
    },0);
  }
}
function _handleActionSelectKeydown(ev,btnid){ 
  // return key
  if (13===ev.keyCode){
    document.getElementById(btnid).click();
  }
}
// url pattern input form key handler
$("form[name=idUrlActionBeforeInput]").live("keydown",function(ev){
  _handleInputKeydown(ev,"idAppUrlActionBeforeAdd");
});
$("form[name=idUrlActionCompleteInput]").live("keydown",function(ev){
  _handleInputKeydown(ev,"idAppUrlActionCompleteAdd");
});
$("form[name=idStyleSheetInput]").live("keydown",function(ev){
  _handleInputKeydown(ev,"idAppStyleSheetAdd");
});
$("form[name=idUrlActionBeforeInput],form[name=idUrlActionCompleteInput],form[name=idStyleSheetInput]").live("focus blur",function(ev){
	var	name=ev.target.form.name;
	if(toggleCueBanner(ev,g_cueBannerTxt[name])){
		var	idBtn;
		if("idStyleSheetInput"===name){
			idBtn="idAppStyleSheetAdd";
		}else{
			if("idUrlActionBeforeInput"===name){
				idBtn="idAppUrlActionBeforeAdd";
			}else{
				idBtn="idAppUrlActionCompleteAdd";
			}
		}
		document.getElementById(idBtn).disabled=true;
	}
});
// action select form key handler
$("form[name=idUrlActionBeforeCmd]").live("keydown",function(ev){
  _handleActionSelectKeydown(ev,"idAppUrlActionBeforeAdd");
});
$("form[name=idUrlActionCompleteCmd]").live("keydown",function(ev){
  _handleActionSelectKeydown(ev,"idAppUrlActionCompleteAdd");
});
$("form[name=idStyleSheetCmd]").live("keydown",function(ev){
  _handleActionSelectKeydown(ev,"idAppStyleSheetAdd");
});

/////////////////////////////////////////////////////////////////////////////////////
function refreshUrlAction(){
	if(g_urlAction){
		_refreshUrlAction("idUrlActionBefore", g_urlAction[CMD_URLACTION_BEFORE],false);
		_refreshUrlAction("idUrlActionComplete", g_urlAction[CMD_URLACTION_COMPLETE],false);
	}
}
function refreshStyleSheet(){
	if(g_urlAction){
		_refreshUrlAction("idStyleSheet", g_urlAction[CMD_URLACTION_STYLESHEET],false);
	}
}
/////////////////////////////////////////////////////////////////////////////////////
(function(){
	g_urlAction=getCurrentUrlAction();
})();