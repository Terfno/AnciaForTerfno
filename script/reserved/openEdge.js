var	url=DataObject.url;
if(!url){url=DataObject.text;}
if(url){
 var sh=new ActiveXObject("WScript.Shell");
 sh.Run("microsoft-edge:"+url, 1, false);
}