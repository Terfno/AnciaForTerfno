// selectable command
var g_supportCmds=[
 "none"
,"menu"
,"new"
,"new.tab"
,"localhome"
,"new.localhome"
,"blankpage"
,"new.blankpage"
,"duplicate"
,"isolate"
,"back"
,"forward"
,"refresh"
,"refresh.all"
,"stop"
,"stop.all"
,"home"
,"home.all"
,"mpanel"
,"save"
,"print"
,"preview"
,"setup.page"
,"property"
,"selectall"
,"add.favorites"
,"focus.addressbar"
,"focus.searchbar"
,"focus.browser"
,"setup.mousegesture"
,"setup.dropaction"
,"next.tab"
,"prev.tab"
,"find"
,"close"
,"close.left"
,"close.right"
,"close.except"
,"close.lock"
,"close.tabgroup"
,"close.tabgroup.except"
,"refresh.tabgroup"
,"nav.lock"
,"fontsize.revert"
,"source"
,"source.select"
,"up"
,"capture"
,"show.addresshist"
,"internetoption"
,"privacyreport"
,"security.image"
,"security.video"
,"security.sound"
,"security.script"
,"security.java"
,"security.runax"
,"security.downloadax"
,"locktoolbar"
,"cut"
,"copy"
,"paste"
,"delete"
,"undo"
,"redo"
,"option"
,"auto.textlink"
,"auto.imageresize"
,"auto.hilite"
,"open.closed"
,"isearch"
,"refresh.isearch"
,"hilite"
,"add.hilite"
,"clear.hilite"
,"refresh.hilite"
,"certificatedialog"
,"lasttab"
,"save.tab"
,"caretbrowsing"
,"statusbar"
,"show.hilitebar"
,"exit"
,"about"
,"browseremulation"
,"urlaction"
,"sidebarpin"
,"sidebarcontrol"
,"tabSnapshot"
,"tabmanager"
,"fullWindow"
,"fullScreen"
,"freezechecker"
]
// fill cmd select items flag
,g_cmdFlags={
	// key: setting name
	// val: addCmdFlags
	//		0x01: prevent menu cmd
	//		0x02: prevent normal cmd
	//		0x04: prevent script cmd
	//		0x08: prevent search cmd
	//		0x10: add drop script cmd
	 X1Click:0
	,X2Click:0
	,X1DblClick:0
	,X2DblClick:0
	,tabItemLClick:0
	,tabItemRClick:0
	,tabItemMClick:0
	,tabItemX1Click:0
	,tabItemX2Click:0
	,tabItemLDblClick:0
	,tabItemRDblClick:0
	,tabItemMDblClick:0
	,tabItemX1DblClick:0
	,tabItemX2DblClick:0
	,tabItemCtrlLClick:0
	,tabItemCtrlRClick:0
	,tabItemCtrlMClick:0
	,tabItemCtrlX1Click:0
	,tabItemCtrlX2Click:0
	,tabItemShiftLClick:0
	,tabItemShiftRClick:0
	,tabItemShiftMClick:0
	,tabItemShiftX1Click:0
	,tabItemShiftX2Click:0
	,tabBkgdLClick:0
	,tabBkgdRClick:0
	,tabBkgdMClick:0
	,tabBkgdX1Click:0
	,tabBkgdX2Click:0
	,tabBkgdLDblClick:0
	,tabBkgdRDblClick:0
	,tabBkgdMDblClick:0
	,tabBkgdX1DblClick:0
	,tabBkgdX2DblClick:0
	,tabBkgdCtrlLClick:0
	,tabBkgdCtrlRClick:0
	,tabBkgdCtrlMClick:0
	,tabBkgdCtrlX1Click:0
	,tabBkgdCtrlX2Click:0
	,tabBkgdShiftLClick:0
	,tabBkgdShiftRClick:0
	,tabBkgdShiftMClick:0
	,tabBkgdShiftX1Click:0
	,tabBkgdShiftX2Click:0
	,dropUpLink:0x12
	,dropUpText:0x12
	,dropShiftUpLink:0x12
	,dropShiftUpText:0x12
	,dropCtrlUpLink:0x12
	,dropCtrlUpText:0x12
	,dropShiftCtrlUpLink:0x12
	,dropShiftCtrlUpText:0x12
	,dropDownLink:0x12
	,dropDownText:0x12
	,dropShiftDownLink:0x12
	,dropShiftDownText:0x12
	,dropCtrlDownLink:0x12
	,dropCtrlDownText:0x12
	,dropShiftCtrlDownLink:0x12
	,dropShiftCtrlDownText:0x12
	,dropLeftLink:0x12
	,dropLeftText:0x12
	,dropShiftLeftLink:0x12
	,dropShiftLeftText:0x12
	,dropCtrlLeftLink:0x12
	,dropCtrlLeftText:0x12
	,dropShiftCtrlLeftLink:0x12
	,dropShiftCtrlLeftText:0x12
	,dropRightLink:0x12
	,dropRightText:0x12
	,dropShiftRightLink:0x12
	,dropShiftRightText:0x12
	,dropCtrlRightLink:0x12
	,dropCtrlRightText:0x12
	,dropShiftCtrlRightLink:0x12
	,dropShiftCtrlRightText:0x12
}
// cue banner text
,g_cueBannerTxt={
	 idAppAccelInput:"ショートカットキーを入力"
	,idUrlActionBeforeInput:"URLのパターンを入力"
	,idUrlActionCompleteInput:"URLのパターンを入力"
	,idStyleSheetInput:"URLのパターンを入力"
	,idProxyNameInput:"設定の名前を入力"
	,idProxyServerInput:"プロキシサーバ名を入力"
	,idProxyBypassInput:"プロキシを使用しないアドレスを入力"
}
// script attributes
,SCRIPTACTION_COMMAND="command,"
,SCRIPTACTION_URLACTION="urlAction,"
,SCRIPTACTION_DROP="drop,"
;