/*
Mode :
	blue
	green
	red
	yellow
*/
function toast(title, mode) {
	var glyphicon = "";
	switch(mode) {
		case 'blue':
			glyphicon = "glyphicon glyphicon-info-sign";
			break;
		case 'green':
			glyphicon = "glyphicon glyphicon-ok";
			break;
		case 'red':
			glyphicon = "glyphicon glyphicon-remove";
			break;
		case 'yellow':
			glyphicon = "glyphicon glyphicon-exclamation-sign";
			break;
	}
	iziToast.show({
		title: title,
		color: mode, // blue, red, green, yellow
		icon: glyphicon,
		position: 'bottomRight'
	});
};


function setTabs(tabId, dd = false, opt = 0) {
	$(".navtabs").removeClass('active');
	$("#" + tabId).addClass('active');
	if (dd) {
		$("#" + tabId + "_" + opt).addClass('active');
	}
}