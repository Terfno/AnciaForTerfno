function buildSavePath(fso,fromFile){
	var	filename=App.pathUndecorate(fso.GetFileName(fromFile));
	return App.SaveFileNameDlg(filename,undefined,"allfilter");
}
function save(from){
	var	fso=new ActiveXObject("Scripting.FileSystemObject");
	var	to=buildSavePath(fso,from);
	if(to){
		fso.CopyFile(from,to,true);
	}
}
var imageUrl=DataObject.imageUrl;
var errMsg;
if(imageUrl){
	var cacheFile=App.cacheFile(imageUrl);
	if(!cacheFile){
		cacheFile=App.downloadToCacheFile(imageUrl);
	}
	if(cacheFile){
		try{
			save(cacheFile);
		}catch(e){
			errMsg="イメージの保存に失敗しました。";
			if(e.description){
				errMsg+="\n\n";
				errMsg+=e.description;
			}
		}
	}else{
		errMsg="イメージのキャッシュファイル取得に失敗しました。";
		errMsg+="\n";
		errMsg+="imageUrl:\n";
		errMsg+=imageUrl;
	}
}else{
	errMsg="イメージのURL取得に失敗しました。";
}
if(undefined!==errMsg){
	App.MsgBox(errMsg,"saveImage",0x10);
}