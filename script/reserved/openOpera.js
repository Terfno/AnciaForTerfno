var	url=DataObject.url;
if(!url){url=DataObject.text;}
if(url){
	var sh=new ActiveXObject("WScript.Shell");
	sh.Run("opera.exe \""+url+"\"", 1, false);
}