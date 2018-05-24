function refreshBHO(){
	var	bhoSetting=g_ext.bhoSetting()
		,content,c=document.createElement;
	if(bhoSetting){
		g_bhoList=parseJson(bhoSetting);
		if(g_bhoList&&g_bhoList.length){
			content=c("div");
			for(var i=0;i<g_bhoList.length;++i){
				// fix IE6 checkbox
				// chk.chekced=true is no effect.
				var	bho=g_bhoList[i],li=c("li"),span=c("span"),label=c("label")
					,chk=c("<input type=checkbox value='"+bho.clsid+"'"+(bho.enable?" checked":"")+">");
			    span.innerText=bho.txt;
				span.title=bho.clsid;
				li.appendChild(span);
				label=li.appendChild(label);
				chk=label.appendChild(chk);
				chk.bho=bho;
				if(bho.enable){
					bho.enableOld=true;
				}
				chk.onclick=function(){this.bho.enable=this.checked;}
				label.appendChild(document.createTextNode(" 有効にする "));
				
				if(bho.error){
					var	img=c("img");
					img.src="error.png";
					li.appendChild(img);
					li.appendChild(document.createTextNode(" BHOが未登録"));
				}
				content.appendChild(li);
			}
		}
	}
	if(!content){
		content=c("div");
		content.innerText="なし";
	}
	var v=document.getElementById("idBHO");
	removeChildren(v);
	v.appendChild(content);
}
(function(){refreshBHO();})();