// URL, activeにするときtrue, 作成インデックス(-1でオプション設定位置)
var	activate=((Context.tabFlags&0x4)===0);
var	tab=App.NewTab("about:blank",activate,Context.NewTabPosition);