var l_proxyList;
function getProxySettingNameFromPath(path){
	path=path.replace(/\\|\//g,"/");
	var	idx=path.lastIndexOf("/");
	var	name=path.substr(idx+7,path.length-idx-12);
	return name;
}
function getProxySettingPathFromName(name){
	var	fso=getFSO();
	return fso.BuildPath(getSettingDirPath(),"Proxy_"+name+".json");
}
function getProxyList(){
	if(!l_proxyList){
		// enum proxy setting file
		l_proxyList=[];
		var	fso=getFSO()
			,files=new Enumerator(fso.GetFolder(getSettingDirPath()).Files);
		for (;!files.atEnd();files.moveNext()){
			var f=files.item();
			if(f.Name.match(/^Proxy_.*.json$/i)){
				var	proxy=parseJsonFile(f.Path);
				if(proxy){
					l_proxyList.push({name:getProxySettingNameFromPath(f.Path),
						server:proxy.server,bypass:proxy.bypass});
				}
			}
		}
	}
	return l_proxyList;
}
function _refreshProxySelectList(list,isAdd,selVal){
	var	sel=document.proxyList.v;
	if(! list.length){
		return ;
	}
	var	options=sel.options;
	
	// check same item
	if(isAdd){
		for(var i=0;i<options.length;++i){
			if(options[i].value==list[0].name){
				return ;
			}
		}
	}
	for(var i=0;i<list.length;++i){
		var	proxy=list[i]
			,item=addOption(options,proxy.name,proxy.name);
		if(selVal==proxy.name){
			item.selected=true;
		}
	}
	
	// show UI select
	$(document.getElementById("idNoProxyCaption")).hide();
	$(sel).show();
}
function _refreshProxy(contentId,list,isAdd){
	var	content=document.getElementById(contentId);
	var	cnt=list?list.length:0,parent=$(content);
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
			,nameInputBase=$(c("<input type=text name=v maxlength=100 class='cProxyNameInput cInline'>"))
			,serverInputBase=$(c("<input type=text name=v class='cProxyServerInput cInline'>"))
			,bypassInputBase=$(c("<input type=text name=v class='cProxyBypassInput cInline'>"))
			,bypassSpanBase=$(c("<span class='cProxyBypass'>"))
			,btnDelBase=$(c("<button>"));
		bypassSpanBase.text("例外: ");
		btnDelBase.append($("<span>削除</span>")).addClass("cProxyDel");
		for(var i=0;i<cnt;++i){
			var	proxy=list[i]
				,div=$(c("<div>")).attr("id",contentId+i)
				,formInput=$(c("<form name="+contentId+"Input"+i+" class=cInline>"))
				,nameInput=nameInputBase.clone()
				,serverInput=serverInputBase.clone()
				,bypassInput=bypassInputBase.clone();
			div.data("proxy",proxy);
			
			var	btnDel=btnDelBase.clone();
			if(isAdd){
				div.addClass("cAdd cHide");
				nameInput.addClass("cMod");
				serverInput.addClass("cMod");
				bypassInput.addClass("cMod");
				proxy.isMod=true;
			}
			nameInput.val(proxy.name);
			serverInput.val(proxy.server);
			bypassInput.val(proxy.bypass);
			
			div .append(formInput.append(nameInput)
								 .append(serverInput)
								 .append(btnDel)
								 .append($("<br>"))
								 .append(bypassSpanBase.clone())
								 .append(bypassInput));
			if(isAdd&&parent.get(0).firstChild){
				$(parent.get(0).firstChild).before(div);
			}else{
				parent.append(div);
			}
			if(isAdd){
				div.slideDown("n");
				l_proxyList.push(proxy);
				break;
			}
		}
	}else{
		parent.text("なし");
	}
}
function refreshProxy(){
	var	list=getProxyList();
	_refreshProxy("idProxy",list,false);
	var	settingProxy,indexProxy=0;
	if(g_setting.proxy){
		if(g_setting.proxy!=":direct:"){
			indexProxy=2;
			settingProxy=g_setting.proxy;
		}else{
			indexProxy=1;
		}
	}
	_refreshProxySelectList(list,false,settingProxy);
	document.proxy.v[indexProxy].checked=true;
}
function addProxy(btn){
	var	parentNode=btn.parentNode
		,nameInput=document.forms.idProxyNameInput
		,serverInput=document.forms.idProxyServerInput
		,bypassInput=document.forms.idProxyBypassInput
		,proxy={name:nameInput.v.value
				,server:serverInput.v.value};
	var	bypassValue=!valueIsCueBanner(bypassInput.v);
	if(bypassValue){
		proxy.bypass=bypassInput.v.value;
	}
	if(proxy.name&&proxy.server){
		var	list=[proxy];
		_refreshProxy("idProxy",list,true);
		_refreshProxySelectList(list,true);
		nameInput.v.value="";
		serverInput.v.value="";
		var	ev={target:serverInput.v,type:"focusout"};
		toggleCueBanner(ev,g_cueBannerTxt[serverInput.name]);
		if(bypassValue){
			bypassInput.v.value="";
			ev.target=bypassInput.v;
			toggleCueBanner(ev,g_cueBannerTxt[bypassInput.name]);
		}
		nameInput.v.focus();
	}
	btn.disabled=true;
}
function saveProxy(){
	var	fso=getFSO();
	for(var i=0;i<l_proxyList.length;++i){
		var	proxy=l_proxyList[i];
		if(proxy.isDel){
			fso.DeleteFile(getProxySettingPathFromName(proxy.name));
			continue;
		}
		if(proxy.isMod){
			// del old file
			if(proxy.oldName){
				fso.DeleteFile(getProxySettingPathFromName(proxy.oldName));
			}
			// save 
			var	saveProxy={server:proxy.server};
			if(proxy.bypass){
				saveProxy.bypass=proxy.bypass;
			}
			var	json=JSON.stringify(saveProxy,undefined," ")
				,path=getProxySettingPathFromName(proxy.name);
			writeUnicodeTextFile(path,json);
		}
	}
}
function delProxy(btn,proxy,isDel){
	var	parentNode=btn.parentNode;
	$(":input:not(button.cProxyDel,button.cProxyDelCancel)",parentNode).attr("disabled",isDel);
	if(proxy.isDel){
		// to save
		proxy.isMod=true;
	}
	proxy.isDel=isDel;
	$(":first",btn).text(isDel?"取消":"削除");
	$(btn).toggleClass("cProxyDel cProxyDelCancel");
}
$("button.cProxyAdd:enabled").live("click", function(ev){
	addProxy(ev.target);
});
function checkProxyInputChanged(input,valName){
	var	proxy=$.data(input.parentNode.parentNode,"proxy");
	if(proxy){
		if(proxy[valName]!=input.value){
			if(valName==="name"){
				proxy.oldName=proxy.name;
			}
			proxy[valName]=input.value;
			proxy.isMod=true;
			$(input).addClass("cMod");
		}
	}
}
$("input.cProxyNameInput").live("focus blur",function(ev){
	var	focusin="focusin"===ev.type;
	g_ext.preventTransAccel(focusin);
	if(!focusin){
		checkProxyInputChanged(ev.target,"name");
	}
	return true;
});
$("input.cProxyServerInput").live("focus blur",function(ev){
	var	focusin="focusin"===ev.type;
	g_ext.preventTransAccel(focusin);
	if(!focusin){
		checkProxyInputChanged(ev.target,"server");
	}
	return true;
});
$("input.cProxyBypassInput").live("focus blur",function(ev){
	var	focusin="focusin"===ev.type;
	g_ext.preventTransAccel(focusin);
	if(!focusin){
		checkProxyInputChanged(ev.target,"bypass");
	}
	return true;
});
$("button.cProxyDel,button.cProxyDelCancel").live("click",function(ev){
	var	isDel="cProxyDel"===ev.target.className
		,proxy=$.data(ev.target.parentNode.parentNode,"proxy");
	delProxy(ev.target,proxy,isDel);
});
function UIUpdateProxyAdd(){
	document.getElementById("idProxyAdd").disabled=
		valueIsCueBanner(document.forms.idProxyNameInput.v)||
		valueIsCueBanner(document.forms.idProxyServerInput.v);
}
$("form[name=idProxyNameInput],form[name=idProxyServerInput]").live("keydown",function(ev){
	UIUpdateProxyAdd();
});
$("form[name=idProxyNameInput],form[name=idProxyServerInput]").live("focus blur",function(ev){
	toggleCueBanner(ev,g_cueBannerTxt[ev.target.form.name]);
	if("focusout"===ev.type){
		UIUpdateProxyAdd();
	}
});
$("form[name=idProxyBypassInput]").live("focus blur",function(ev){
	toggleCueBanner(ev,g_cueBannerTxt[ev.target.form.name]);
});
(function(){refreshProxy();})();