//弹出对话框，并在规定时间内渐变消失
var TipAlert = (function () {
	var tmpDiv = document.createElement("div");
	var added = false;
	var content_;
	var queue = [];
	var setContent = function(content) {
		if (content) {
			content_ = content.toString();
		}
	}
	var add = function(){
		document.body.appendChild(tmpDiv);
	}
	//内容，时间，样式名称，承载容器id
    var Apply = function (content,time_,className,str) {
        //alert-info alert-danger alert-success alert-warning
		if (!content) {
			content = content_;
		}
        if (typeof str != "string") {
			if (!added) {
				add();
			}
            div = tmpDiv;
        } else {
			div = document.getElementById(str);
		}
        if (typeof time_ != "number") {
            time_ = 3;
        }
        if (className) {
			if (div.classList.length) {
				div.classList.forEach(function(i){
					div.classList.remove(i);
				});
			}
			if (className instanceof Array) {
				className.forEach(function(i){
					div.classList.add(i);
				});
			} else {
				div.classList.add(className);
			}
        }
        div.classList.add("ta-TipAlert");
        div.innerText = content;
        if (typeof div.style.animation) {
            div.style.animationName = "ta-dispear";
            div.style.animationDuration = time_ + 's';
            setTimeout(function () {
                div.style.animationName = "";
                div.style.animationDuration = "";
            }, time_ * 1000);
        } else if (typeof div.style.webkitAnimation) {
            div.style.webkitAnimationName = "ta-dispear";
            div.style.webkitAnimationDuration = time_ + 's';
            setTimeout(function () {
                div.style.webkitAnimationName = "";
                div.style.webkitAnimationDuration = "";
            }, time_ * 1000);
        }
    };
    return {
        apply : Apply,
		setContent : setContent
    };
})();

