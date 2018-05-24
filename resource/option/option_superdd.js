/////////////////////////////////////////////////////////////////////////////////////
//
var	typeLink=0;
var	typeText=1;

if (typeof superdd!=='object'){
	superdd={};
	
(function (superdd) {
	var keys=["","Shift","Ctrl","ShiftCtrl"]
	,dirs=["Up","Down","Left","Right"],settings=[]
	,typeNames=["Link","Text"];
	
	function buildSettingPath(isDefault,type){
		var	fso=getFSO();
		var	filenames=["drop_link.json","drop_text.json"];
		var	filename=filenames[type];
		if (isDefault){
			return fso.BuildPath(getResourceDirPath(),filename);
		}
		return fso.BuildPath(getSettingDirPath(),"customize/"+filename);
	}
	
	function setToForm(type,setting){
		var	brz=setting.browser;
		if(!brz){
			return ;
		}
		var	typeName=typeNames[type];
		for(valName in brz){
			var	frm=document[valName+typeName];
			if(frm&&frm.v&&frm.v.options){
				selectOptionCmd(frm.v.options,getCmdValue(brz[valName]));
			}
		}
	}

	function fillDropCmd(setting){
		if(!setting.browser){
			setting.browser={};
		}
		var brz=setting.browser;
		for(var key=0;key<keys.length;++key){
			for(var dir=0;dir<dirs.length;++dir){
				var	valName="drop"+keys[key]+dirs[dir];
				if(!brz[valName]){
					brz[valName]={}
				}
			}
		}
	}
	
	function loadSetting(type){
		var	path=buildSettingPath(false,type);
		if (!getFSO().FileExists(path)){
			path=buildSettingPath(true,type);
		}
		var setting=parseJsonFile(path);
		fillDropCmd(setting);
		return setting;
	}
	
	function refresh(type){
		if (settings[type]){
			return;
		}
		var setting=loadSetting(type);
		if (setting){
			settings[type]=setting;
			setToForm(type,setting);
		}
	}
	superdd.refreshAll=function(){
		refresh(typeLink);
		refresh(typeText);
	}
	
	function reload(type){
		var setting=loadSetting(type);
		if (setting&&settings[type]){
			settings[type].btn=setting.btn;
		}
	}
	
	superdd.reloadAll=function(){
		reload(typeLink);
		reload(typeText);
	}
	
	function setDefault(type){
		
		var	setting=settings[type];
		if(setting){
			var	path=buildSettingPath(true,type);
			var def=parseJsonFile(path);
			setting.browser=def.browser;
			fillDropCmd(setting);
			setToForm(type,setting);
		}
	}

	superdd.setDefaultAll=function(){
		setDefault(typeLink);
		setDefault(typeText);
	}
	
	function getCurrentSetting(type){
		var	typeName=typeNames[type];
		var	brz={};
		for (var key=0;key<keys.length; ++key){
			for (var dir=0;dir<dirs.length;++dir){
				var	valName="drop"+keys[key]+dirs[dir];
				var	frm=document[valName+typeName];
				if(frm&&frm.v&&frm.v.options){
					var cmd=frm.v.options[frm.v.options.selectedIndex].value;
					var	obj=cmdValueToCmdObj(cmd);
					if (obj){
						var	txt=getCmdTxt(cmd);
						if (txt){
							obj.txt=txt;
						}
						brz[valName]=obj;
					}
				}
			}
		}
		return brz;
	}

	function save(type){
		var	brz=getCurrentSetting(type);

		// comp current setting value
		var	forCheck={browser:common_deepCopy(brz)};
		fillDropCmd(forCheck);
		var	nowSetting=loadSetting(type);
		if (common_isEqualDeep(nowSetting.browser,forCheck.browser)){
			// no change
			return false;
		}

		// save
		var	setting=settings[type];
		setting.browser=brz;
		var	path=buildSettingPath(false,type);
		var	json=JSON.stringify(setting,undefined," ");
		writeUnicodeTextFile(path,json);
		return true;
	}
	
	superdd.saveAll=function(){
		var	changed=false;
		if(save(typeLink)){
			changed=true;
		}
		if(save(typeText)){
			changed=true;
		}
		return changed;
	}
})(superdd);
}

(function(){
	superdd.refreshAll();
	document.getElementById("superDragDropSetDefault").onclick=function(){superdd.setDefaultAll()}
})();