var imageUrl=DataObject.imageUrl;
var errMsg;
if(imageUrl){
  var WshShell = new ActiveXObject("WScript.Shell");
  WshShell.Run('"'+App.path+'" "'+imageUrl+'"', 1, false);
}else{
	errMsg="イメージのURL取得に失敗しました。";
}
if(undefined!==errMsg){
	App.MsgBox(errMsg,"openImageUrl",0x10);
}