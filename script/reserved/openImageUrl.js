var imageUrl=DataObject.imageUrl;
var errMsg;
if(imageUrl){
	App.CmdExec("go",imageUrl,-1,0x1);
}else{
	errMsg="イメージのURL取得に失敗しました。";
}
if(undefined!==errMsg){
	App.MsgBox(errMsg,"openImageUrl",0x10);
}