var	g_caption="Virustotal URL scan";
function saveSetting(fs,path,json){
	if(!json){
		return ;
	}
	try{
		var f=fs.OpenTextFile(path,2,true,-1);
		f.Write(json);
		f.Close();
	}catch(e){
		App.MsgBox("failed: save setting to "+path+"\r\n"+e.description);
	}
}
function loadSetting(fs,path){
	var	setting=null;
	try{
		setting=fs.OpenTextFile(path,1,false,-1).ReadAll();
		setting=eval("("+setting+")");
		// check value
		if(!setting.inputs||!setting.inputs[0]){
			setting=null;
		}
	}catch(e){
		setting=null;
	}
	return setting;
}
function inputbox(setting){
	var	apiKey="";
	if(setting&&setting.inputs){
		apiKey=setting.inputs[0];
	}
	return App.InputBox(
		{	caption:g_caption,
			statics:[{text:"VirustotalのApiKeyを入力してください。"},
					 {text:"空の場合はアプリケーションのApiKeyを使用します。"}],
			inputs:[{label:"ApiKey(&A):",value:apiKey}],
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
	try{
		if(!setting||!setting.inputs){
			throw new Error("failed: load setting");
		}

		var	apiKey=setting.inputs[0];
		//var	url="https://www.virustotal.com/api/get_url_report.json";
		//var param="resource="+encodeURIComponent(DataObject.url)+"&scan=0&key="+apiKey;
		//var url="https://www.virustotal.com/api/scan_url.json";
		//var param="url="+encodeURIComponent(DataObject.url)+"&key="+apiKey;
		var url="https://www.virustotal.com/vtapi/v2/url/scan";
		var param="url="+encodeURIComponent(DataObject.url)+"&apikey="+apiKey;
		//var url="http://www.virustotal.com/vtapi/v2/url/report";
		//var param="resource="+encodeURIComponent(DataObject.url)+"&scan=1&apikey="+apiKey;
		var	obj=new ActiveXObject("Microsoft.XMLHTTP");
		obj.open("POST",url,false);
		obj.send(param);
		if(200!=obj.status){
			throw new Error("failed: send error. "+obj.status+" "+obj.statusText);
		}
		//alert(obj.responseText);
		var	res=eval("("+obj.responseText+")");
		if(1!=res.response_code){
			throw new Error("failed: response result is "+res.result.toString());
		}
		var	url=res.permalink;
		// no report is found
		//if(res.scan_id){
			// open scaning page
			//url="http://www.virustotal.com/url-scan/report.html?id="+res.scan_id;
		//}else{
			// get url report ---
			//
			// clean site?
			//App.MsgBox(res.report[1]["Firefox"]);
			//App.MsgBox(res.result.toString());
			// open file report page
			//if(res["file-report"]){
			//	url="http://www.virustotal.com/file-scan/report.html?id="+res["file-report"];
			//}
		//}
		if(url){
			App.NewTab(url,(Context.tabFlags&0x4)===0,Context.NewTabPosition);
		}else{
			throw new Error("failed: open scan page");
		}
	}catch(e){
		errMsg=(e.description?e.description:"unknown error");
	}
	if(errMsg){
		App.MsgBox(errMsg, "Error");
	}else{
		saveSetting(fs,settingPath,input);
	}
})();