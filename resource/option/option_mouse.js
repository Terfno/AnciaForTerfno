var s_actionTabDefault={
	tabItem:{
		 LClick:"none"
		,RClick:"menu"
		,MClick:"close"
		,X1Click:"none"
		,X2Click:"none"
		,LDblClick:"none"
		,RDblClick:"none"
		,MDblClick:"none"
		,X1DblClick:"none"
		,X2DblClick:"none"
		,CtrlLClick:"none"
		,CtrlRClick:"none"
		,CtrlMClick:"none"
		,CtrlX1Click:"none"
		,CtrlX2Click:"none"
		,ShiftLClick:"none"
		,ShiftRClick:"none"
		,ShiftMClick:"none"
		,ShiftX1Click:"none"
		,ShiftX2Click:"none"
	}
	,tabBkgd:{
		 LClick:"none"
		,RClick:"menu"
		,MClick:"open.closed"
		,X1Click:"none"
		,X2Click:"none"
		,LDblClick:"new"
		,RDblClick:"none"
		,MDblClick:"none"
		,X1DblClick:"none"
		,X2DblClick:"none"
		,CtrlLClick:"none"
		,CtrlRClick:"none"
		,CtrlMClick:"none"
		,CtrlX1Click:"none"
		,CtrlX2Click:"none"
		,ShiftLClick:"none"
		,ShiftRClick:"none"
		,ShiftMClick:"none"
		,ShiftX1Click:"none"
		,ShiftX2Click:"none"
	}
}
,s_actionMouseDefault={
	 browser:{
		 LDblClick:"none"
		,RDblClick:"none"
		,X1Click:"back"
		,X2Click:"forward"
		,X1DblClick:"none"
		,X2DblClick:"none"
		,LWithWheelDown:"none"
		,LWithWheelUp:"none"
		,RWithWheelDown:"next.tab"
		,RWithWheelUp:"prev.tab"
		,CtrlWithWheelUp:"script:reserved\\zoom+5.js"
		,CtrlWithWheelDown:"script:reserved\\zoom-5.js"
		,ShiftWithWheelUp:"forward"
		,ShiftWithWheelDown:"back"
		,LWithMClick:"none"
		,RWithMClick:"close"
		,LWithRClick:"none"
		,RWithLClick:"none"
	}
}
s_mouseExcludeCmds={browserShiftWithWheelUp:",",browserShiftWithWheelUp:","}
;
/////////////////////////////////////////////////////////////////////////////////////
// internal
function _mouse_normalizeAction(curAction,baseAction){
	for(var pos in baseAction){
		if(!curAction[pos]){
			curAction[pos]={};
		}
		var	baseActions=baseAction[pos]
			,actions=curAction[pos];
		for(var action in baseActions){
			if(!actions[action]){
				actions[action]="none";
			}else{
				actions[action]=getCmdValue(actions[action]);
			}
		}
	}
}
function _mouse_loadAction(path,baseAction){
	var	action=parseJsonFile(path);
	if(action){
		_mouse_normalizeAction(action,baseAction);
	}else{
		//action=common_deepCopy(baseAction);
		action=baseAction;
	}
	return action;
}
function _mouse_selectOptionCmd(pos,action,cmdValue){
	var	name=pos+action,frm=document[name];
	if(frm&&frm.v&&frm.v.options){
		selectOptionCmd(frm.v.options,cmdValue);
	}
}
function _mouse_getSelectedCmd(pos, action){
	var	cmd,name=pos+action,frm=document[name];
	if(frm&&frm.v&&frm.v.options){
		cmd=frm.v.options[frm.v.options.selectedIndex].value;
	}
	return cmd;
}
function _mouse_isActionWithButton(action){
	return (-1!==action.indexOf("Ctrl")||-1!==action.indexOf("Shift")||-1!==action.indexOf("With"));
}
function _mouse_setDefault(pos,isWithButton){
	var	baseAction=-1!==pos.indexOf("tab")?s_actionTabDefault:s_actionMouseDefault
	,actions=baseAction[pos];
	for(var action in actions){
		if(isWithButton===_mouse_isActionWithButton(action)){
			_mouse_selectOptionCmd(pos,action,actions[action]);
		}
	}
}
function _mouse_attachInputEvent(){
	document.getElementById("actionTabItemSetDefault").onclick=function(){_mouse_setDefault("tabItem",false)}
	document.getElementById("actionTabBkgdSetDefault").onclick=function(){_mouse_setDefault("tabBkgd",false)}
	document.getElementById("actionTabWithKeySetDefault").onclick=function(){_mouse_setDefault("tabItem",true)}
	document.getElementById("actionTabBkgdWithKeySetDefault").onclick=function(){_mouse_setDefault("tabBkgd",true)}
	document.getElementById("browserXButtonSetDefault").onclick=function(){_mouse_setDefault("browser",false)}
	document.getElementById("browserWithButtonSetDefault").onclick=function(){_mouse_setDefault("browser",true)}
}
/////////////////////////////////////////////////////////////////////////////////////
// export
function mouse_getActionTabPath(){
	return getFSO().BuildPath(getSettingDirPath(),"ActionTab.json");
}
function mouse_getActionMousePath(){
	return getFSO().BuildPath(getSettingDirPath(),"ActionMouse.json");
}
function mouse_refreshAction(curAction){
	for(var pos in curAction){
		var	actions=curAction[pos];
		for(var action in actions){
			_mouse_selectOptionCmd(pos,action,actions[action]);
		}
	}
}
function _mouse_getUpdateAction(baseAction){
	var	updateAction={};
	for(var pos in baseAction){
		var	updateActions={},actions=baseAction[pos];
		for(var action in actions){
			var	excludeCmds,cmdObj,posAction=pos+action
			updateActions[action]=_mouse_getSelectedCmd(pos,action);
		}
		updateAction[pos]=updateActions;
	}
	return updateAction;
}
function _mouse_updateActionToSaveAction(updateAction){
	var	saveAction={};
	for(var pos in updateAction){
		var	saveActions={},actions=updateAction[pos];
		for(var action in actions){
			var	excludeCmds,cmdObj,posAction=pos+action
			
			//
			if(s_mouseExcludeCmds[posAction]){
				excludeCmds=s_mouseExcludeCmds[posAction]
			}
			cmdObj=cmdValueToCmdObj(actions[action],excludeCmds);
			if(cmdObj){
				saveActions[action]=cmdObj;
			}
		}
		saveAction[pos]=saveActions;
	}
	return saveAction;
}
function _mouse_getUpdateChanges(a1,a2){
	var	changed;
	for(var pos in a1){
		var	a1Actions=a1[pos],
			a2Actions=a2[pos];
		for(var action in a1Actions){
			if(a1Actions[action]!==a2Actions[action]){
				if(!changed){
					changed=[];
				}
				changed.push(pos+action);
			}
		}
	}
	return changed;
}
function _mouse_saveAction(baseAction,path){
	var	updateAction=_mouse_getUpdateAction(baseAction),
		nowAction=_mouse_loadAction(path,baseAction),
		thisChanged=_mouse_getUpdateChanges(updateAction,nowAction);
	if(thisChanged){
		
		// compare default
		if(common_isEqualDeep(updateAction,baseAction)){
			// remove current action file
			common_deleteFileKillError(path);
		}else{
			// not default
			var	saveAction=_mouse_updateActionToSaveAction(updateAction),
				json=JSON.stringify(saveAction,undefined," ");
			writeUnicodeTextFile(path,json);
		}
	}else{
		// no change
	}
	return thisChanged;
}
function mouse_saveAction(){
	var	changed={},thisChanged;
	changed.settings=[];
	changed.reloads=[];
	thisChanged=_mouse_saveAction(s_actionTabDefault,mouse_getActionTabPath());
	if(thisChanged){
		changed.settings=changed.settings.concat(thisChanged);
		changed.reloads.push("actionTab");
	}
	thisChanged=_mouse_saveAction(s_actionMouseDefault,mouse_getActionMousePath());
	if(thisChanged){
		changed.settings=changed.settings.concat(thisChanged);
		changed.reloads.push("actionMouse");
	}
	return changed;
}
(function(){
	// action tab
	var	actionTab=_mouse_loadAction(mouse_getActionTabPath(),s_actionTabDefault);
	mouse_refreshAction(actionTab);
	
	// action mouse
	var	actionMouse=_mouse_loadAction(mouse_getActionMousePath(),s_actionMouseDefault);
	mouse_refreshAction(actionMouse);

	// button event
	_mouse_attachInputEvent();
})();