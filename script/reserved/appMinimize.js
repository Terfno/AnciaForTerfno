var	style=App.CmdExec(0x7002),showWindowCmd;
if(style&0x20000000){
	showWindowCmd=9;
}else{
	showWindowCmd=6;
}
App.CmdExec(0x7000,showWindowCmd);