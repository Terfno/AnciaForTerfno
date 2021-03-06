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
var	txt=DataObject.text;
if(txt&&txt.length){
	var flags=Context.tabFlags;
	var pos=Context.NewTabPosition;
	var	re=/((((http|https|ftp|javascript|res|mailto|chrome):\/\/)|about:|file:\/\/\/)[A-z0-9$-_.+!*'(),\;\/?:@&=%~#\u00c0-\u024f]*)|((https?|ttps?|tps?|ps?|s?):\/\/(.+\/){0,1}[A-z0-9$-_.+!*'(),\;\/?:@&=%~#\u00c0-\u024f]*)|(\"[^\r\n]+\")/gi;
	var	urls=[];
	while(true){
		var ret=re.exec(txt);
		if(ret){
			var	url=recomp(ret[0]);

			// add url list
			var	urlInfo=App.createUrlInfo();
			urlInfo.url=url;
			urlInfo.title=url;
			urlInfo.tabGroupId=1;
			urls.push(urlInfo);
		}
		else{
			break;
		}
	}
	if(urls.length){
		if(1===urls.length){
			App.CmdExec("go",urls[0].url,pos,flags|0x1);
		}else{
			App.openTabList(urls,pos,0x04000000);
		}
	}
}