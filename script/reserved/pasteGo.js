function recomp(txt){
	var chr=txt.charAt(0);
	if("\""===chr){
		txt=txt.substr(1,txt.length-2);
	}else{
		chr=chr.toLowerCase();
		if(chr!="f"&&chr!="h"&&chr!="c"){
			var	reComp=/(https?|ttps?|tps?|ps?|s?):\/\//i;
			if(reComp.test(txt)){
				var scheme=txt.substr(0,4);
				var colon=txt.indexOf(":");
				if(-1!=scheme.indexOf("s")){
					txt="https"+txt.substr(colon);
				}else{
					txt="http"+txt.substr(colon);
				}
			}
		}
	}
	return txt;
}
function open(txt,flags,pos){
	App.CmdExec("go",txt,pos,flags);
}
(function(){
	var txt=App.clipboard.getData("TEXT");
	if(txt&&txt.length){
		var	re=/((((http|https|ftp|javascript|res|mailto|chrome):\/\/)|about:|file:\/\/\/)[A-z0-9$-_.+!*'(),\;\/?:@&=%~#\u00c0-\u024f]*)|((https?|ttps?|tps?|ps?|s?):\/\/(.+\/){0,1}[A-z0-9$-_.+!*'(),\;\/?:@&=%~#\u00c0-\u024f]*)|(\"[^\r\n]+\")/gi;
		var ret=re.exec(txt);
		var	url=(ret?recomp(ret[0]):txt);
		open(url,Context.tabFlags,Context.NewTabPosition);
	}
})();