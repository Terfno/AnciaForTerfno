var	g_caption="ux.nu URL短縮";
(function(){
	if(Context.isSetting){
		return ;
	}
	var	errMsg=null;
	var	url="http://ux.nu/api/short?url="+encodeURIComponent(DataObject.url);
	var	obj=new ActiveXObject("Microsoft.XMLHTTP");
	obj.open("GET",url,false);
	obj.send();
	if(200==obj.status){
		try{
			var	res=eval("("+obj.responseText+")");
			// check status
			if("200"!=res.status_code){
				throw new Error("status code not 200: "+res.status_code);
			}
			
			// 
			App.clipboard.setData("TEXT",res.data.url);
			App.MsgBox(DataObject.url+"\nの短縮URL "+res.data.url+" をクリップボードにコピーしました。\n"+
				"\n詳細短縮情報\n"+
				" BlackList: "+res.data.blacklist+"\n"+
				" Malware: "+res.data.malware+"\n"+
				" Safe: "+res.data.safe,g_caption);
		}catch(e){
			errMsg=(e.description?e.description:"unknown err");
		}
	}else{
		errMsg="failed: "+obj.statusText;
	}
	if(errMsg){
		App.MsgBox(errMsg, "Error");
	}
})();