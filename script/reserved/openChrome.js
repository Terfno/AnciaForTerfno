/*
function getExe(shl){
	var fld=shl.RegRead("HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Google Chrome\\InstallLocation");
	if(fld&&(typeof fld==="string")){
		var	fso=new ActiveXObject("Scripting.FileSystemObject");
		return fso.BuildPath(fld,"chrome.exe");
	}
	return false;
}
var	exe=getExe(sh);
if(exe){
	sh.Run('"'+exe+'" "'+DataObject.url+'"', 1, false);
}
*/
var	url=DataObject.url;
if(!url){url=DataObject.text;}
if(url){
	var	sh=new ActiveXObject("WScript.Shell");
	sh.Run("Chrome.exe \""+url+"\"", 1, false);
}