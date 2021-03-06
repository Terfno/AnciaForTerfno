function buildTmpFilePath(fso,ext){
	return fso.buildPath(fso.GetSpecialFolder(2),fso.GetTempName()+ext);
}
function regReadString(shl,key){
	try{
		var path=shl.RegRead(key);
		if(path&&(typeof path==="string"))return path;
	}catch(e){}
	return false;
}
// add tertiary fourth retrieve editor path. thunks fromE.
function getEditExe(shl){
	var	path;
	// ie html editor
	path=regReadString(shl,"HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\View Source Editor\\Editor Name\\");
	if(path)return path;
	path=regReadString(shl,"HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\Default HTML Editor\\shell\\edit\\command\\");
	if(path)return path;
	path=regReadString(shl,"HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Internet Explorer\\View Source Editor\\Editor Name\\");
	if(path)return path;
	path=regReadString(shl,"HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Internet Explorer\\Default HTML Editor\\shell\\edit\\command\\");
	if(path)return path;
	// notepad
	return "%windir%\\notepad.exe";
}
var	txt=DataObject.selectionHtml;
if(!txt)txt=DataObject.text;
if(txt){
	var	fso=new ActiveXObject("Scripting.FileSystemObject")
		,path=buildTmpFilePath(fso,".html")
		,file=fso.CreateTextFile(path,true,true);
	file.Write(txt);
	file.Close();

	// get open app path
	var	shl=new ActiveXObject("WScript.Shell")
		,exec=getEditExe(shl);
	exec=exec.replace("%1","");
	exec='"'+exec+'" ';
	exec+='"'+path+'"';
	shl.Run(exec,1,false);
}
