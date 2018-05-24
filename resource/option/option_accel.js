// error????
//loadScript("jquery.poshytip.min.js");
//loadCss("tip-yellowsimple.css");

function initTip(){
	var	addBtn=$("#idAppAccelAdd");
	addBtn.poshytip({
		className: 'tip-yellowsimple',
		showTimeout: 1,
		alignTo: 'target',
		alignX: 'center',
		offsetY: 5,
		allowTipHover: false,
		hideTimeout :-1
	});
}

function findAccel(list,spKey,accelKey){
	var	findIdx=-1
		,cnt=list.count-1;	// for add
	for(var i=0;i<cnt;++i){
		if( (list.accel(i,0)===spKey) &&
			(list.accel(i,1)===accelKey)){
			findIdx=i;
			break;
		}
	}
	return findIdx;
}

function getSpKey(ev){
	var	spKey=0x0;
	if(ev.shiftKey)	spKey|=0x04;
	if(ev.ctrlKey)	spKey|=0x08;
	if(ev.altKey)	spKey|=0x10;
	return spKey;
}

function getSpKeyString(spKey){
	spKey&=~0x01;
	var	txt="";
	switch(spKey){
	case 0x04:	txt="Shift + ";					break;
	case 0x08:	txt="Ctrl + ";					break;
	case 0x0C:	txt="Ctrl + Shift + ";			break;
	case 0x10:	txt="Alt + ";					break;
	case 0x14:	txt="Shift + Alt + ";			break;
	case 0x18:	txt="Ctrl + Alt + ";			break;
	case 0x1C:	txt="Ctrl + Shift + Alt + ";	break;
	}
	return txt;
}

var s_singleAccelCheck;
function _isSinglekeyShortcutEnable(){
	if(!s_singleAccelCheck)s_singleAccelCheck=document.singlekeyShortcut.v;
	return s_singleAccelCheck.checked;
}

function _singlekeyShortcutOnOff(on){
	if(!s_singleAccelCheck)s_singleAccelCheck=document.singlekeyShortcut.v;
	s_singleAccelCheck.checked=on;
}

var	g_vkeys=[
	// event keycode, virtual:0x1, with spkey, display string
	  [0x08, 0x1, 0x0, "Backspace"]
	, [0x09, 0x1, 0x0, "Tab"]
	, [0x1B, 0x1, 0x0, "Escape"]
	, [0x20, 0x1, 0x0, "Space"]
	, [0x21, 0x1, 0x0, "Page Up"]
	, [0x22, 0x1, 0x0, "Page Down"]
	, [0x23, 0x1, 0x0, "End"]
	, [0x24, 0x1, 0x0, "Home"]
	, [0x25, 0x1, 0x0, "Left"]
	, [0x26, 0x1, 0x0, "Up"]
	, [0x27, 0x1, 0x0, "Right"]
	, [0x28, 0x1, 0x0, "Down"]
	, [0x29, 0x1, 0x0, "Select"]
	, [0x2A, 0x1, 0x0, "Print"]
	, [0x2B, 0x1, 0x0, "Execute"]
	, [0x2C, 0x1, 0x0, "SnapShot"]
	, [0x2D, 0x1, 0x0, "Insert"]
	, [0x2E, 0x1, 0x0, "Delete"]
	, [0x2F, 0x1, 0x0, "Help"]
	, [0x30, 0x1, 0x8, "0"]
	, [0x31, 0x1, 0x8, "1"]
	, [0x32, 0x1, 0x8, "2"]
	, [0x33, 0x1, 0x8, "3"]
	, [0x34, 0x1, 0x8, "4"]
	, [0x35, 0x1, 0x8, "5"]
	, [0x36, 0x1, 0x8, "6"]
	, [0x37, 0x1, 0x8, "7"]
	, [0x38, 0x1, 0x8, "8"]
	, [0x39, 0x1, 0x8, "9"]
	, [0x41, 0x1, 0x8, "A"]
	, [0x42, 0x1, 0x8, "B"]
	, [0x43, 0x1, 0x8, "C"]
	, [0x44, 0x1, 0x8, "D"]
	, [0x45, 0x1, 0x8, "E"]
	, [0x46, 0x1, 0x8, "F"]
	, [0x47, 0x1, 0x8, "G"]
	, [0x48, 0x1, 0x8, "H"]
	, [0x49, 0x1, 0x8, "I"]
	, [0x4A, 0x1, 0x8, "J"]
	, [0x4B, 0x1, 0x8, "K"]
	, [0x4C, 0x1, 0x8, "L"]
	, [0x4D, 0x1, 0x8, "M"]
	, [0x4E, 0x1, 0x8, "N"]
	, [0x4F, 0x1, 0x8, "O"]
	, [0x50, 0x1, 0x8, "P"]
	, [0x51, 0x1, 0x8, "Q"]
	, [0x52, 0x1, 0x8, "R"]
	, [0x53, 0x1, 0x8, "S"]
	, [0x54, 0x1, 0x8, "T"]
	, [0x55, 0x1, 0x8, "U"]
	, [0x56, 0x1, 0x8, "V"]
	, [0x57, 0x1, 0x8, "W"]
	, [0x58, 0x1, 0x8, "X"]
	, [0x59, 0x1, 0x8, "Y"]
	, [0x5A, 0x1, 0x8, "Z"]
	, [0x60, 0x1, 0x8, "numpad0"]
	, [0x61, 0x1, 0x8, "numpad1"]
	, [0x62, 0x1, 0x8, "numpad2"]
	, [0x63, 0x1, 0x8, "numpad3"]
	, [0x64, 0x1, 0x8, "numpad4"]
	, [0x65, 0x1, 0x8, "numpad5"]
	, [0x66, 0x1, 0x8, "numpad6"]
	, [0x67, 0x1, 0x8, "numpad7"]
	, [0x68, 0x1, 0x8, "numpad8"]
	, [0x69, 0x1, 0x8, "numpad9"]
	, [0x6F, 0x1, 0x8, "/"]
	, [0x6E, 0x1, 0x8, "."]
	, [0x6D, 0x1, 0x8, "Minus"]
	, [0x6B, 0x1, 0x8, "Plus"]
	, [0x6A, 0x1, 0x8, "*"]
	, [0x70, 0x1, 0x0, "F1"]
	, [0x71, 0x1, 0x0, "F2"]
	, [0x72, 0x1, 0x0, "F3"]
	, [0x73, 0x1, 0x0, "F4"]
	, [0x74, 0x1, 0x0, "F5"]
	, [0x75, 0x1, 0x0, "F6"]
	, [0x76, 0x1, 0x0, "F7"]
	, [0x77, 0x1, 0x0, "F8"]
	, [0x78, 0x1, 0x0, "F9"]
	, [0x79, 0x1, 0x0, "F10"]
	, [0x7A, 0x1, 0x0, "F11"]
	, [0x7B, 0x1, 0x0, "F12"]
	, [0x7C, 0x1, 0x0, "F13"]
	, [0x7D, 0x1, 0x0, "F14"]
	, [0x7E, 0x1, 0x0, "F15"]
	, [0x7F, 0x1, 0x0, "F16"]
	, [0x80, 0x1, 0x0, "F17"]
	, [0x81, 0x1, 0x0, "F18"]
	, [0x82, 0x1, 0x0, "F19"]
	, [0x83, 0x1, 0x0, "F20"]
	, [0x84, 0x1, 0x0, "F21"]
	, [0x85, 0x1, 0x0, "F22"]
	, [0x86, 0x1, 0x0, "F23"]
	, [0x87, 0x1, 0x0, "F24"]
	, [0xBB, 0x1, 0x8, "Plus(OEM)"]
	, [0xBD, 0x1, 0x8, "Minus(OEM)"]
];

function findVKey(keyCode){
	var	vkeyLen=g_vkeys.length;
	for(var vkey_i=0;vkey_i<vkeyLen;++vkey_i){
		if(g_vkeys[vkey_i][0]===keyCode){
			return vkey_i;
		}
	}
	return -1;
}

function compareAccelList(left,right){
	var	leftCnt=left.count,rightCnt=right.count
		,isEqual=(leftCnt===rightCnt);
	if(isEqual){
		for(var i=0;i<leftCnt;++i){
			if((left.accel(i,0)!==right.accel(i,0))||
			   (left.accel(i,1)!==right.accel(i,1))||
			   (left.accel(i,2)!==right.accel(i,2))){
				isEqual=false;
				break;
			}
		}
	}
	return isEqual;
}

function eventToAccelInfo(ev){
	var	keyCode=ev.keyCode,spKey=getSpKey(ev),spTxt="",keyTxt="";

	// ctrl,shift,alt
	if(0x10===keyCode||0x11===keyCode||0x12===keyCode){
		keyInfo=$(ev.target).data("keyInfo");
		if(undefined!==keyInfo){
			keyTxt=keyInfo.keyTxt;
			keyCode=keyInfo.keyCode;
		}
		spKey|=0x1;
	}else{
		// virtual key
		var	vkey_i=findVKey(keyCode);
		if(-1!==vkey_i){
			withSpKey=g_vkeys[vkey_i][2];
			if (withSpKey) {
				if (!_isSinglekeyShortcutEnable()&&(0===spKey))spKey=withSpKey;
			}
			spKey|=g_vkeys[vkey_i][1];
			keyTxt=g_vkeys[vkey_i][3];
		}else{
			// debug
			if(false){
				keyTxt+=keyCode.toString();
				keyTxt+="(0x";
				keyTxt+=keyCode.toString(16);
				keyTxt+=")";
				keyTxt+=" "+String.fromCharCode(keyCode);
			}
		}
	}

	var	accel=null;
	if(keyTxt&&keyTxt.length){
		// save accel key for press only ctrl,shift,alt
		$(ev.target).data("keyInfo",{keyTxt:keyTxt,keyCode:keyCode});
		accel={virt:spKey,key:keyCode,text:getSpKeyString(spKey)+keyTxt};
	}
	return accel;
}

function inputAccel(ev){
	var	keyCode=ev.keyCode,accelKey=keyCode,spKey=getSpKey(ev);

	// tab, numlock
	if((0x00===spKey&&0x9===keyCode)||(0x90===keyCode)){
		return true;
	}

	// return
	if(0x0D===keyCode){
		optionApply();
		return false;
	}

	var	info=eventToAccelInfo(ev);
	if(!info){
		return false;
	}
	
	var	input=$(ev.target)
		,accel=input.data("accel")
		,list=accel.list
		,isAdd=(accel.index==null)
		,index=(isAdd?list.count-1:accel.index)
		,sameIndex=findAccel(list,info.virt,info.key)
		,isFind=(-1!==sameIndex&&index!=sameIndex);

	input.val(info.text);
	list.accel(index,0)=info.virt;
	list.accel(index,1)=info.key;
	input.toggleClass("cAccelNg",isFind);
	input.addClass("cMod",!isFind);
	if(isAdd){
		var	contentId=input.attr("contentId")
			,addBtn=$("#"+contentId+"Add")
			,ng=$("#"+contentId+"Ng");
		addBtn.attr("disabled",isFind);
		if(isFind){
			ng.show();
		}else{
			ng.hide();
		}
		addBtn.poshytip(isFind?"hide":"show");
	}
	return false;
}

function changeAccelCmd(elem){
	var	accel=$.data(elem,"accel")
		,list=accel.list
		,idx=(accel.index!=null?accel.index:list.count-1);
	list.accel(idx,2)=elem.value;
}

function addAccel(btn){
	var	contentId=$(btn).attr("contentId")
		,formCmd=document.forms[contentId+"Cmd"]
		,content=$("#"+contentId)
		,accel=content.data("accel");
	refreshAccel(contentId,accel.list,true);
	btn.disabled=true;
	var	formInput=document.forms[contentId+"Input"];
	formInput.v.value="";
	formInput.v.focus();
	selectOption(formCmd.v.options,"none");
	$(btn).poshytip("hide");
}

function delAccel(btn,accel,isDel){
	var	div=$("#"+accel.contentId+accel.index);
	$(":input:not(button)",div).attr("disabled",isDel);
	accel.list.markDel(accel.index)=isDel;
	$(":first",btn).text(isDel?"取消":"削除");
	$(btn).toggleClass("cAccelDel cAccelDelCancel");
}

$("button.cAccelAdd:enabled").live("click", function(ev){
	addAccel(ev.target);
});

$("button.cAccelDel,button.cAccelDelCancel").live("click",function(ev){
	var	isDel=(-1===ev.target.className.indexOf("cAccelDelCancel"))
		,accel=$.data(ev.target,"accel");
	delAccel(ev.target,accel,isDel);
});

$("input.cAccelInput").live("keydown",function(ev){
	return inputAccel(ev);
});

$("input.cAccelInput").live("focus blur",function(ev){
	var	isPrevent=("focusin"===ev.type);
	g_ext.preventTransAccel(isPrevent);
	return true;
});

$("form[name=idAppAccelInput]").live("focus blur",function(ev){
	toggleCueBanner(ev,g_cueBannerTxt[ev.target.form.name]);
});

/* change が動かない
$("select.cAccelCmdHidden").live("change",function(ev){
	changeAccelCmd(ev.target);
	return false;
});
*/

function refreshAccel(contentId,list,isAdd){
	var	content=$$(contentId);
	var	cnt=list.count,parent=$(content)
		,headData={contentId:contentId,list:list};
	parent.data("accel",headData);
	if(! isAdd){
		parent.empty();
		var	head=$("[name="+contentId+"Input] [name=v],[name="+contentId+"Cmd] [name=v]");
		head.data("accel",headData);
	}else{
		// remove "empty" content
		if(3==content.firstChild.nodeType){
			parent.empty();
		}
	}
	if(cnt){
		var	ev=document.createEventObject()
			,textInputBase=$("<input type=text name=v class=cAccelInput>")
			,selectCmdBase=$("<select name=v class=cSelectCmd>")
			,btnDelBase=$("<button>")
			,c=document.createElement;
		//btnDelBase.css("width","8em");
		btnDelBase.append($("<span>削除</span>")).addClass("cAccelDel");
		for(var i=cnt-1;i>=0;--i){
			var	virt=list.accel(i,0)
				,key=list.accel(i,1)
				,cmd=list.accel(i,2)
				,accel={contentId:contentId,list:list,index:i}
				,div=$("<div>").text(": ").attr("id",contentId+i)
				,formInput=$(c("<form name="+contentId+"Input"+i+">"))
				,textInput=textInputBase.clone();
			textInput.data("accel",accel);
			if(isAdd){
				div.addClass("cAdd cHide");
				textInput.addClass("cMod");
			}
			var	formCmd=$(c("<form name="+contentId+"Cmd"+i+" class=cDummy>"));
			var selectCmd=selectCmdBase.clone();
			selectCmd.data("accel",accel);
			selectCmd.change(function(ev){changeAccelCmd(ev.target)});
			var	btnDel=btnDelBase.clone().data("accel",accel);
			
			ev.shiftKey=(virt&0x4?true:false);
			ev.ctrlKey=(virt&0x8?true:false);
			ev.altKey=(virt&0x10?true:false);
			ev.keyCode=key;
			ev.target=textInput.get(0);
			var	info=eventToAccelInfo(ev);
			if(info){
				textInput.val(info.text);
			}
			
			var	optCmd=selectCmd.get(0).options;
			optCmd.length=1;
			optCmd[0].value=cmd;
			optCmd[0].text=getCmdDisplayName(cmd);
			
			div .append(formInput.append(textInput))
				.append(formCmd.append(selectCmd))
				.append(btnDel);
			
			if(isAdd&&parent.get(0).firstChild){
				$(parent.get(0).firstChild).before(div);
			}else{
				parent.append(div);
			}
			if(isAdd){
				div.slideDown("n");
				break;
			}
		}
	}else{
		parent.text("なし");
	}
	// for accel add
	list.add(0,0,"none");
}

function setDefaultAccel(){
	_singlekeyShortcutOnOff(false);
	refreshAccel("idAppAccel",g_setting.defaultAccelList,false);
}

(function(){
	var	save=_isSinglekeyShortcutEnable();
	_singlekeyShortcutOnOff(true);
	refreshAccel("idAppAccel",g_setting.accelList,false);
	_singlekeyShortcutOnOff(save);

	initTip();
})();