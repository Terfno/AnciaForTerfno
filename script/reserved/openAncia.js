var WshShell = new ActiveXObject("WScript.Shell");
WshShell.Run('"'+App.path+'" "'+DataObject.url+'"', 1, false);