var zoom=CurrentTab.zoom;
if(100==zoom) zoom=125;
else if(125==zoom) zoom=150;
else zoom=100;
CurrentTab.zoom=zoom;