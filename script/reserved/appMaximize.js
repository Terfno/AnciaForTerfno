var	style=App.CmdExec(0x7002),showWindowCmd;
if(style&0x01000000){
	showWindowCmd=9;
}else{
	showWindowCmd=3;
}
App.CmdExec(0x7000,showWindowCmd);