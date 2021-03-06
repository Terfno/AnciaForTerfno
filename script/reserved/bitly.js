var	g_caption="bit.ly URL短縮";
function saveSetting(fs,settingPath,json){
	if(!json){
		return ;
	}
	try{
		var f=fs.OpenTextFile(settingPath,2,true,-1);
		if(f){
			f.Write(json);
			f.Close();
		}
	}catch(e){
		App.MsgBox("failed: save setting "+settingPath);
	}
}
function loadSetting(fs,settingPath){
	var	setting=null;
	if(fs.FileExists(settingPath)){
		try{
			setting=fs.OpenTextFile(settingPath,1,false,-1).ReadAll();
			setting=eval("("+setting+")");
			// check value
			if(!setting.inputs||!setting.inputs[0]||!setting.inputs[1]){
				setting=null;
			}
		}catch(e){
			setting=null;
		}
	}
	return setting;
}
function inputbox(setting){
	var	user="";
	var	apiKey="";
	if(setting&&setting.inputs){
		user=setting.inputs[0];
		apiKey=setting.inputs[1];
	}
	return App.InputBox(
		{	caption:g_caption,
			statics:[{text:"bit.lyのログイン情報を入力してください。"},
					 {text:"空の場合はアプリケーションのApiKeyを使用します。"}],
			inputs:[{label:"ログインユーザ名(&U):",value:user},{label:"ApiKey(&A):",value:apiKey}],
			buttons:[{text:"OK"},{text:"キャンセル",type:"default"}]});
}
(function(){
	var	settingPath=Context.settingPath;
	var	fs=new ActiveXObject("Scripting.FileSystemObject");
	var	setting=loadSetting(fs,settingPath);
	var	input=null;
	var	errMsg=null;
	if(Context.isSetting){
		input=inputbox(setting);
		if(input){
			setting=eval("("+input+")");
		}else{
			return;
		}
	}
	// option: end script
	if(Context.isSetting){
		saveSetting(fs,settingPath,input);
		return ;
	}
	
	// no save setting, load default script setting
	if(!setting){
		setting=loadSetting(fs,Context.settingPath(true));
	}
	if(setting&&setting.inputs){
		var	user=setting.inputs[0];
		var	apiKey=setting.inputs[1];
		var	url="http://api.bit.ly/v3/shorten?login="+user+"&apiKey="+apiKey+"&domain=j.mp&longUrl="+encodeURIComponent(DataObject.url)+"&format=json";
		var	obj=new ActiveXObject("Microsoft.XMLHTTP");
		obj.open("GET",url,false);
		obj.send();
		if(200==obj.status){
			try{
				res=eval("("+obj.responseText+")");
				if(200==res.status_code){
					App.clipboard.setData("TEXT",res.data.url);
					App.MsgBox(DataObject.url+"\nの短縮URL "+res.data.url+" をクリップボードにコピーしました。",g_caption);
				}else{
					errMsg="failed: "+res.status_txt;
				}
			}catch(e){
				errMsg="failed: parse response as json";
			}
		}else{
			errMsg="failed: "+obj.statusText;
		}
	}else{
		errMsg="failed: load setting";
	}
	if(errMsg){
		App.MsgBox(errMsg, "Error");
	}else{
		saveSetting(fs,settingPath,input);
	}
})();