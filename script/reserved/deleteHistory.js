function _doDelete(){
	App.deleteHistory(0x4);
}

var	g_fs=new ActiveXObject("Scripting.FileSystemObject");
var	g_strings,g_setting={},g_caption;
g_setting.inputs=[
	false			// start message
	,false			// end message
];
function pathRenameExtention(path,ext){
	var	idx=path.lastIndexOf('.');
	if(-1===idx){
		return path+ext;
	}
	return path.substr(0,idx)+ext;
}
function pathRemoveFileSpec(path){
	return path.substr(0,path.lastIndexOf('\\'));
}
function _RelativeToAbsPath(relPath){
	var	path=pathRemoveFileSpec(App.path);
	return g_fs.BuildPath(path,relPath);
}
function _getCaption(){
	if(!g_caption){
		var path=_RelativeToAbsPath("script/reserved/scripts.json");
		var scripts=_readAndParseJson(path);
		if(scripts){
			var	filename=g_fs.GetFileName(Context.Path);
			var	info=scripts[filename];
			if(info&&info.txt){
				g_caption=info.txt;
			}
		}
		if(!g_caption){
			g_caption="";
		}
	}
	return g_caption;
}
function _readAndParseJson(path){
	var	obj=null,txt;
	try{
		txt=g_fs.OpenTextFile(path,1,false,-1).ReadAll();
		obj=eval("("+txt+")");
	}catch(e){}
	return obj;
}
function _getString(name){
	if(!g_strings){
		var	stringsPath=_RelativeToAbsPath("script/reserved/deleteHistory.strings");
		g_strings=_readAndParseJson(stringsPath);
	}
	var	str;
	if(g_strings){
		str=g_strings[name];
	}
	if(!str){
		str="";
	}
	return str;
}
function loadSetting(path){
	return _readAndParseJson(path);
}
function saveSetting(path,json){
	if(!json){
		return ;
	}
	var	f;
	try{
		f=g_fs.OpenTextFile(path,2,true,-1);
		f.Write(json);
	}catch(e){
		App.MsgBox("failed: save setting to "+path+"\r\n"+e.description);
	}
	if(f){
		f.Close();
	}
}
function inputbox(setting){
	var	inputs=setting.inputs;
	return App.InputBox(
		{	 caption:_getCaption()
			,inputs:[ {label:_getString("inputLabel1"),value:inputs[0],type:"checkbox",text:_getString("inputText1")}
					,{label:_getString("inputLabel2"),value:inputs[1],type:"checkbox",text:_getString("inputText2")}]
			,buttons:[{text:_getString("ok")},{text:_getString("cancel"),type:"default"}]});
}
(function(){
	var	settingPath=Context.settingPath;
	var	setting=loadSetting(settingPath);
	if(setting&&setting.inputs){
		g_setting=setting;
	}

	// option: end script
	if(Context.isSetting){
		input=inputbox(g_setting);
		if(input){
			saveSetting(settingPath,input);
		}
		return;
	}

	// start message
	if(g_setting.inputs[0]){
		if(1!=App.MsgBox(_getString("startMessage"),_getCaption(),0x1)){
			return;
		}
	}

	_doDelete();

	// end message
	if(g_setting.inputs[1]){
		App.MsgBox(_getString("endMessage"),_getCaption());
	}
})();
