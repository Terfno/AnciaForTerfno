function refreshScript(){
	var	list=g_ext.scriptSettingList,content,cnt=list.length;
	if(cnt>0){
		var	c=document.createElement;
		content=c("div");
		for(var i=0;i<cnt;++i){
			var	script=list[i],li=c("li"),span=c("span")
				,btn=c("button"),img=c("img");
		    span.innerText=g_ext.scriptDisplayName(script)+"("+script+")";
			span.title=script;
			img.src="property.png"
			btn.appendChild(img);
			btn.appendChild(document.createTextNode("設定..."));
			btn.script={script:script};
			btn.onclick=function(){g_ext.scriptSetting(this.script.script);}
			li.appendChild(span);
            li.appendChild(btn);
			content.appendChild(li);
		}
	}
	if(!content){
		content=c("div");
		content.innerText="なし";
	}
	var	v=document.getElementById("idScriptSetting");
	removeChildren(v);
	v.appendChild(content);
}
(function(){refreshScript();})();