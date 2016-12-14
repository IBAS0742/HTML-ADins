overSubmit();

var pingfen = [];

function overSubmit() {
	var str = window.location.href;
	if (str.substr(0,str.indexOf('?')) == "http://202.192.224.129/Jwweb/jxkp/Stu_WSKP_pj.aspx") {
		selectEase();
		getSubmit().click();
	}
}

function selectEase(input){
	if (input == null || typeof input == "undefined") {
		var input = [];
	}
	var count = 0;
	var inputs = document.getElementsByTagName("input");
	var pCount = 2;

	Array.prototype.slice.call(inputs).forEach(

		function(i){

			if (i.getAttribute("djdm") == "01"{
				i.click();
				input[count] = i;

				count++;
			}

		}
	);

	return input;
}

function getSubmit() {
	var btn = document.getElementsByTagName("input");
	var obj = null;
	Array.prototype.slice.call(btn).forEach(function(i){
		if (i.type == "button") {
			if (i.name.toLowerCase() == "submit") {
				obj = i;
				return i;
			}
		}
	});
	return obj;
}







