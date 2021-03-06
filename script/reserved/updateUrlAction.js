///////////////////////////////////////////////////////////////////////////////////////////////////////
var JSON;if(!JSON){JSON={};}
(function(){"use strict";function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());
///////////////////////////////////////////////////////////////////////////////////////////////////////
var s_fso,g_app=App;
function getFSO(){
	if(!s_fso){
		s_fso=new ActiveXObject("Scripting.FileSystemObject");
	}
	return s_fso;
}
function readUnicodeTextFile(path){
	var	txt,f;
	try{
		f=getFSO().OpenTextFile(path,1,false,-1);
		txt=f.ReadAll();
	}catch(e){}
	if(f){
		f.Close();
	}
	return txt;
}
function writeUnicodeTextFile(path,txt){
	var	f,ok=true;
	try{
		f=getFSO().OpenTextFile(path,2,true,-1);
		f.Write(txt);
	}catch(e){
		ok=false;
	}
	if(f){
		f.Close();
	}
	return ok;
}
function parseJson(txt){
	var	obj;
	try{
		obj=eval("("+txt+")");
	}catch(e){}
	return obj;
}
function parseJsonFile(path){
	var	obj;
	try{
		var	txt=readUnicodeTextFile(path);
		obj=parseJson(txt);
	}catch(e){}
	return obj;
}
function pathRemoveFileSpec(path){
	return path.substr(0,path.lastIndexOf('\\'));
}
function getUrlActionPath(){
	var	appDir=pathRemoveFileSpec(g_app.path),fso=getFSO();
	return fso.BuildPath(appDir,"setting\\customize\\url_action.json");
}
///////////////////////////////////////////////////////////////////////////////////////////////////////
function _removeExtraInfo(url)
{
	var	idx=url.indexOf('?');
	if(-1!==idx){
		url=url.substring(0,idx);
		url+="*";
	}
	return url;
}
function _actionExists(actions,v){
	var	act;
	if(actions){
		for(var i=0;i<actions.length;++i){
			act=actions[i];
			if((act.script===v.script)&&
	           (act.url===v.url)){
					return true;
			}
		}
	}
	return false;
}
function _updateBeforeComplete(events,updates){
	if(updates){
		if(!events){
			events=[];
		}
		for(var i=updates.length-1;i>=0;--i){
			if(_actionExists(events,updates[i])){
			}else{
				events.unshift(updates[i]);
			}
		}
	}
	return events;
}
function updateUrlActionFile(args){
	var	path=getUrlActionPath();
	var	fso=getFSO();
	var	cur;
	if (fso.FileExists(path)){
		cur=parseJsonFile(path);
	}else{
		cur={};
	}

	var	popupUpdate=args.css?false:true;
	
	var	sav;
	if(args.emulation){
		sav={};
		sav.before=cur.before;
		sav.complete=cur.complete;
		sav.popup=cur.popup;
		sav.styleSheet=cur.styleSheet;
		
		sav.emulation=[];
		var	url=_removeExtraInfo(args.url);
		if(args.emulation!=="del"){
			sav.emulation.push({url:url,emulation:args.emulation});
		}
		if(cur){
			if(cur.emulation){
				for(idx in cur.emulation){
					var	v=cur.emulation[idx];
					if(url!==v.url){
						sav.emulation.push(v);
					}
				}
			}
		}
	}
	if(args.popup){
		
		sav={};
		sav.before=cur.before;
		sav.complete=cur.complete;
		sav.styleSheet=cur.styleSheet;
		sav.emulation=cur.emulation;

		sav.popup=[];
		if(args.popup!=="delegate"){
			sav.popup.push({url:args.url,popup:args.popup});
		}
		if(cur){
			if(cur.popup){
				for(var idx in cur.popup){
					var	v=cur.popup[idx];
					if(args.url!==v.url){
						sav.popup.push(v);
					}
				}
			}
		}
	}
	if(args.css){
		
		sav={};
		sav.before=cur.before;
		sav.complete=cur.complete;
		sav.popup=cur.popup;
		sav.emulation=cur.emulation;
		
		sav.styleSheet=[];
		var	url=_removeExtraInfo(args.url);
		if(args.css!=="default"){
			sav.styleSheet.push({url:url,css:args.css});
		}
		if(cur){
			if(cur.styleSheet){
				for(idx in cur.styleSheet){
					var	v=cur.styleSheet[idx];
					if(url!==v.url){
						sav.styleSheet.push(v);
					}
				}
			}
		}
	}
	if(args.before||args.complete){

		sav={};
		sav.before=cur.before;
		sav.complete=cur.complete;
		sav.popup=cur.popup;
		sav.styleSheet=cur.styleSheet;
		sav.emulation=cur.emulation;

		sav.before=_updateBeforeComplete(sav.before,args.before);
		sav.complete=_updateBeforeComplete(sav.complete,args.complete);
	}
	if(sav){
		var	json=JSON.stringify(sav,undefined," ");
		writeUnicodeTextFile(path,json);
		return true;
	}
	return false;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////
(function(){
	var	txt=DataObject.text;
	var	args=parseJson(txt);
	if(args){
		if(updateUrlActionFile(args)){
			App.reloadSetting("urlAction,");
		}
	}
})();