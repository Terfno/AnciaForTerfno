var theSnattei = new ActiveXObject("SnatteiServer.Launcher");
if( theSnattei ){
	theSnattei.yaru(DataObject.url, window.location.href);
}