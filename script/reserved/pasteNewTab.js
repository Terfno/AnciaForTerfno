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
function addAsUrlList(urls,url,title,tabGroupId){
	var	urlInfo=App.createUrlInfo();
	urlInfo.url=url;
	urlInfo.title=url;
	urlInfo.tabGroupId=tabGroupId;
	urls.push(urlInfo);
}
function txtToUrlList(txt){
	var	re=/((((http|https|ftp|javascript|res|mailto|chrome):\/\/)|about:|file:\/\/\/)[A-z0-9$-_.+!*'(),\;\/?:@&=%~#\u00c0-\u024f]*)|((https?|ttps?|tps?|ps?|s?):\/\/(.+\/){0,1}[A-z0-9$-_.+!*'(),\;\/?:@&=%~#\u00c0-\u024f]*)|(\"[^\r\n]+\")/gi;
	var	urls=[];
	while(true){
		var ret=re.exec(txt);
		if(ret){
			var	url=recomp(ret[0]);

			// add url list
			addAsUrlList(urls,url,url,1);
		}
		else{
			break;
		}
	}
	if(! urls.length){
		addAsUrlList(urls,txt,txt,0);
	}
	return urls;
}

var	txt=App.clipboard.getData("TEXT");
if(txt&&txt.length){
	var flags=Context.tabFlags;
	var pos=Context.NewTabPosition;
	var	urls=txtToUrlList(txt);
	if(urls.length){
		if(1===urls.length){
			if ("javascript:"!=urls[0].url.substr(0,11).toLowerCase()){
				flags|=0x1;
			}
			App.CmdExec("go",urls[0].url,pos,flags);
		}else{
			App.openTabList(urls,pos,0x04000000);
		}
	}
}
