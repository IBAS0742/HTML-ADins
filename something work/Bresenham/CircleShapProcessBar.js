function CircleShapProcess() {
    return (function(){
        var dir = ["left","right"];
        var copytarget = function(){
            var t = target.constructor();
            for (var i in target) {
                t[i] = target[i];
            }
            return t;
        }
        var invoke = function(){
            this.ele = document.getElementById(this.id);
            this.ele.innerHTML = "";
            var width = parseFloat(this.ele.getAttribute("width")),
                height = parseFloat(this.ele.getAttribute("height"));
            if (width && height) {
                if (width < height) {
                    this.length = width;
                } else {
                    this.length = height;
                }
            }
            if (!this.length) {
                this.length = 100;
            }
            this.ele.style.width = this.length + "px";
            this.ele.style.height = this.length + "px";
            build(this);
            this.SetpbWidth();
            this.SetBarColor();
            this.SetFunColor();
            this.SetProcess();
            this.RefleshClip();
        }
        //设置进度条宽度
        var setpbWidth = function(bw) {
            var bWidth;
            if (bw) {
                bWidth = parseFloat(bw);
                this.ele.setAttribute("barWidth",bw);
            } else {
                bWidth = parseFloat(this.ele.getAttribute("barWidth"));
            }
            if (bWidth > 1 || bWidth <= 0) {
                return ;
            } else {
                bWidth /= 2;
                setpbWidthHelp(this["circle"][0],bWidth,this.length);
                setpbWidthHelp(this["circle"][1],bWidth,this.length);
                setpbWidthHelp(this["mark"][0],bWidth,this.length);
                setpbWidthHelp(this["mark"][1],bWidth,this.length);
                this["fun"].style.top = this["fun"].style.left = bWidth * this.length + "px";
                this["fun"].style.borderWidth = (0.5 - bWidth) * this.length + "px";
            }
            this.RefleshClip();
        }
        var setpbWidthHelp = function(obj,w,len){
            obj.style.borderWidth = w * len + "px";
            obj.style.width = 2 * (0.5 - w) * len + "px";
            obj.style.height = 2 * (0.5 - w) * len + "px";
        }
        //设置主体大小
        var setpbSize = function(length){
            length = parseInt(length);
            if (length) {
                this.length = length;
                this.ele.style.width = length + "px";
                this.ele.style.height = length + "px";
            }
            this.SetpbWidth();
        }
        //修改clip
        //e为target复制对象
        //d为左右标记，0为左，1为右
        var createClip = function(e,d) {
            var len = e.length;
            var str = "rect(0,";
            if (d) {
                str += 0.5 * len + "," + len + ",0)";
            } else {
                str += len + "," + len + "," + 0.5 * len + ")";
            }
            return str;
        }
        //刷新部件的切块
        var refleshClip = function() {
            this["mark"][0].style.clip = createClip(this,1);
            this["circle"][1].style.clip = createClip(this,1);
            this["mark"][1].style.clip = createClip(this,0);
            this["circle"][0].style.clip = createClip(this,0);
        }
        //设置进度条颜色
        var setBarColor = function(color_) {
            var color = "";
            if (color_) {
                color = color_;
                this.ele.setAttribute("barColor",color);
            } else {
                color = this.ele.getAttribute("barColor");
            }
            if (color) {
                this["mark"][0].style.borderColor = color;
                this["mark"][1].style.borderColor = color;
            }
        }
        //设置功能键颜色
        var setFunColor = function(color_){
            var color = "";
            if (color_) {
                color = color_;
                this.ele.setAttribute("funColor",color);
            } else {
                color = this.ele.getAttribute("funColor");
            }
            if (color) {
                this["fun"].style.borderColor = color;
            }
        }
        var newDiv = function(str){
            return document.createElement("div");
        }
        //生成整体进度条
        var build = function(e){
            //out
            var out = newDiv();
            out.classList.add("csp-out");
            e.ele.appendChild(out);
            e["mark"] = [];
            e["circle"] = [];
            e["rotate"] = [];
            //left
            out.appendChild(buildHelp(e,0));
            //right
            out.appendChild(buildHelp(e,1));
            //function
            var fn = newDiv();
            fn.classList.add("csp-funlit");

            var fun = newDiv();
            fun.classList.add("csp-fun");

            out.appendChild(fn);
            fn.appendChild(fun);
            e["fun"] = fun;
        }
        //辅助生成函数
        var buildHelp = function(e,d) {
            var litoutout = newDiv();
            litoutout.classList.add("csp-litoutout");
            litoutout.classList.add("csp-litout-" + dir[d]);

            //旋转块
            var litout = newDiv();
            litout.classList.add("csp-litout");
            litout.classList.add("csp-litout-" + dir[d]);
            e["rotate"].push(litout);

            var one = newDiv();
            one.classList.add("csp-" + dir[d]);

            var circle = newDiv();
            var mark = newDiv();
            circle.classList.add("csp-circle");
            circle.classList.add("csp-circle-" + dir[d]);
            circle.classList.add("csp-leave-" + dir[d]);
            mark.classList.add("csp-circle");
            mark.classList.add("csp-circle-" + dir[d]);
            mark.classList.add("csp-leave-" + dir[d]);
            mark.classList.add("csp-mark");
            e["circle"].push(circle);
            e["mark"].push(mark);

            litoutout.appendChild(litout);
            litout.appendChild(one);
            one.appendChild(circle);
            one.appendChild(mark);
            return litoutout;
        }
        //创建新的target复制对象
        var create = function(id){
            var t = copytarget();
            t.id = id;
            return t;
        }
        //设置进度
        var setProcess = function(pro) {
            var pros;
            if (pro) {
                pros = pro;
            } else {
                pros = parseFloat(this.ele.getAttribute("process"));
            }
            if (pros < 0 || pros > 1) {
                return;
            } else {
                if (pros == 0) {
                    this["rotate"][1].style.transform = "rotate(0deg)";
                    this["rotate"][0].style.transform = "rotate(0deg)";
                    return;
                } else if (pros == 1) {
                    this["rotate"][1].style.transform = "rotate(180deg)";
                    this["rotate"][0].style.transform = "rotate(180deg)";
                    return;
                }
                if (pros > 0.5) {
                    this["rotate"][1].style.transform = "rotate(180deg)";
                    this["rotate"][0].style.transform = "rotate(" + (pros - 0.5) * 360 + "deg)";
                    return;
                } else {
                    this["rotate"][0].style.transform = "rotate(0deg)";
                    this["rotate"][1].style.transform = "rotate(" + pros * 360 + "deg)";
                }
            }
        }
        //
        var bindingFun = function(fn) {
            if (fn) {
                this["fun"].onclick = fn;
            }
        }
        //
        var setLocation = function(x,y){
            this.ele.style.top = parseFloat(y) + "px";
            this.ele.style.left = parseFloat(x) + "px";
        }
        //model
        var target = {
            id : "",
            ele : null,
            length : 0,
            Invoke : invoke,
            SetpbWidth : setpbWidth,
            SetpbSize : setpbSize,
            SetBarColor : setBarColor,
            SetFunColor : setFunColor,
            SetProcess : setProcess,
            BindingFun : bindingFun,
            RefleshClip : refleshClip,
            SetLocation : setLocation
        };
        return {
            Instance : function(id){
                var tar = create(id);
                tar.Invoke();
                return tar;
            }
        };
    })();
}
