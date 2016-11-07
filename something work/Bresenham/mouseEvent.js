var mouseEvent = (function() {
	eventName = {
		"down" : ["onmousedown","ontouchstart"],
		"move" : ["onmousemove","ontouchmove"],
		"up" : ["onmouseup","ontouchend"],
		//"cancel" : ["","touchcancel"],
		//"over" : ["","mouseover"]
	};
	addEventName = {
		"down" : ["mousedown","touchstart"],
		"move" : ["mousemove","touchmove"],
		"up" : ["mouseup","touchend"],
		//"cancel" : ["","touchcancel"],
		//"over" : ["","mouseover"]
	};
	function getMouseEvent(event_,on) {
		var ip = window.navigator.userAgent.toLowerCase().indexOf("iphone"),
			an = window.navigator.userAgent.toLowerCase().indexOf("android"),
			wi = window.navigator.userAgent.toLowerCase().indexOf("windows"),
			ev = (on)?addEventName : eventName;
		var mobile = ip + an;
		if (mobile < 0) {
			return [ev[event_][0],0];
		} else {
			return [ev[event_][1],1];
		}
	};
	function getAllMouseEvent(){
		var ip = window.navigator.userAgent.toLowerCase().indexOf("iphone"),
			an = window.navigator.userAgent.toLowerCase().indexOf("android"),
			wi = window.navigator.userAgent.toLowerCase().indexOf("windows");
		var tar = (an + ip) > 0?1:0;
		var obj = {};
		for (var i in eventName) {
			obj[i] = eventName[i][tar];
		}
		return obj;
	};
	function tryAll(){
		var obj = {};
		for (var i in eventName) {
			obj[i + "0"] = eventName[i][0];
		}
		for (var i in eventName) {
			obj[i + "1"] = eventName[i][1];
		}
		return obj;
	};
	function binding(this_,event_,fn,re) {
		var e = getMouseEvent(event_,true);
		var fn_;
		if (parseInt(e[1]) >= 0) {
			fn_ = function(e_){
				fn(e_);
				//binding others fn
			}
			console.log(fn_);
		} else {
			fn_ = function(e_){
				e_.preventDefault();
				fn(e_);
			}
		}
		if (re && this_[e[0]]) {
			while (this_[e[0]].length) {
				this_.removeEventListener(e[0],this_[e[0]].shift(),false);
			}
		}
		if (this_[e[0]]) {
			this_[e[0]].push(fn_);
		} else {
			this_[e[0]] = [fn_];
		}
		this_.addEventListener(e[0],fn_,false);
	};
	function getLocation(e) {
		switch(event.type){
		case "touchstart":
			return [event.touches[0].clientX,event.touches[0].clientY];
			break;
		case "touchend":
			return [event.changedTouches[0].clientX,event.changedTouches[0].clientY];
			break;
		case "touchmove":
			event.preventDefault();
			return [event.touches[0].clientX,event.touches[0].clientY];
			break;
		default :
			return [event.clientX,event.clientY];
		}
	};
	return {
		getMouseEvent : getMouseEvent,
		getAllMouseEvent : getAllMouseEvent,
		tryAll : tryAll,
		binding : binding,
		getLocation : getLocation
	};
})()
