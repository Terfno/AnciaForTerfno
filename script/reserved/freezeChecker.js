function pathRemoveFileSpec(path){
 return path.substr(0,path.lastIndexOf('\\'));
}
var fso=new ActiveXObject("Scripting.FileSystemObject");
var shl = new ActiveXObject("WScript.Shell");
var path=fso.BuildPath(pathRemoveFileSpec(App.path),"FreezeChecker.exe");
shl.Run('"'+path+'"', 1, false);