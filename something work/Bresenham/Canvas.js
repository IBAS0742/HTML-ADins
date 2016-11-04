//定义全局变量（所有部件）
var canvas,          //前景
    canvas_,         //背景
    Canvas_Tool,     //画布工具类
    infodiv,         //提示框
    btn,             //功能按钮
    curType,         //画图类型
    angleSelector,   //角度选择器
    div_corver,      //角度选择器div
    colorControl = {
        width: 0.5,  //选择器大小
        deta: 0.25    //选择器间距
    },                //
    csp,              //csp对象
    div_angle,        //承载csp对象主元素的div
    perDiv            //扇形的角度输入
    ;

//div_angle.method = 0 旋转主体 1 角度选择  2 停止旋转
//div_angle.loc 初始位置
//div_angle.p 圆心位置
//div_angle.tmplen  临时变量
//div_angle.rotate  主体旋转角度（每次初始化为0）
//div_angle.deg   进度条的角度，初始化为 0.8

window.onload = function () {
    var deta = 10;                                                  //初始化截留大小
    curType = 1;                                                    //初始化画图类型
    canvas = document.getElementById("canvas");                     //初始化。。。
    canvas_ = document.getElementById("canvas_");                   //初始化。。。
    infodiv = document.getElementById("info");                      //初始化。。。
    btn = document.getElementById("btn");                           //初始化。。。
    div_angle = document.getElementById("div_angle");               //初始化。。。
    perDiv = document.getElementById("perDiv");                     //初始化。。。
    csp = CircleShapProcess();                                      //创建一个csp对象
    angleSelector = csp.Instance("div_corver");                     //初始化并创建一个csp对象示例
    canvas.width = document.body.clientWidth - deta;                //初始化。。。
    canvas.height = document.body.clientHeight - deta;              //初始化。。。
    canvas_.width = document.body.clientWidth - deta;               //初始化。。。
    canvas_.height = document.body.clientHeight - deta;             //初始化。。。
    div_angle.style.width = document.body.clientWidth - deta + "px";//初始化。。。
    div_angle.style.height =
        document.body.clientHeight - deta + "px";                   //初始化。。。
    perDiv.style.width = document.body.clientWidth - deta + "px";   //初始化。。。
    perDiv.style.height =
        document.body.clientHeight - deta + "px";                   //初始化。。。

    onload_();                                                      //加载Canvas工具对象
    colorControl.width = (                                          //
        (document.body.clientWidth > document.body.clientHeight) ?  //
        colorControl.width * document.body.clientHeight :
        colorControl.width * document.body.clientHeight);           //
    Canvas_Tool.refleshGrid();                                      //
    Canvas_Tool.bindingDrawToggle();                                //
    angleSelector.BindingFun(endEvent.endEventCircle);
    div_angle.onmousemove = angleSelectorEvent.mousemove;
    div_angle.onmousedown = angleSelectorEvent.mousedown;
    div_angle.method = 2;
    div_angle.loc = {x:0,y:0};
    div_angle.p = {x:0,y:0};
    div_angle.rotate = 0;
    div_angle.deg = 0;
    div_angle.tmplen = 0;
};

var exDic = {
    firstUsing : [true,true,true],   //分别对应画线，画弧，画饼图
    tip : [
        "绘制直线：鼠标点击栅格中一点，并按住不松开，然后拖动鼠标直到目的点，放开鼠标，即可。",
        "类似直线的方法先绘制一个圆，然后单击屏幕（非绿色圆），按提示操作。",
        "类似直线的方法绘制一个圆，然后输入n个和为1的数字，圆将被分割为n部分。"
    ],
    curTip : 0,
    showTipFirst : function(n){
        this.curTip = n;
        if (this.firstUsing[n]) {
            this.firstUsing[n] = false;
            TipAlert.apply(this.tip[n],10);
        }
    },
    showTip : function(){
        TipAlert.apply(this.tip[this.curTip],10);
    },
    //鼠标动作绑定事件
    tFn : function(n){
    },
    //选择角度完成处罚事件
    enFn : function(){
    },
    makeTable : function(le,ri){
        var len = le.length > ri.length ? ri.length : le.length;
        var str = "<table><tbody>";
        for (var i = 0;i < len;i++) {
            str += "<tr><td>" + le[i] + "</td><td>" + ri[i] + "</td></tr>";
        }
        str += "</tbody></table>";
        return str;
    },
    //(x,y) r
    setCoverLoc: function ( r, x, y, lit,fn,efn) {
        var max;
        if (fn) {
            this.tFn = fn;
        }
        if (efn) {
            this.enFn = efn;
        }
        x -= r;
        y -= r;
        x *= lit;
        y *= lit;
        r *= lit;
        r += 2;
        if (r * 2 < 50) {
            r = 25;
            max = 50;
        } else if (r * 2 > 800){
            r = 400;
            max = 800;
        } else {
            max = r * 2;
        }
        angleSelector.SetpbSize(max);
        angleSelector.SetLocation(x,y);
        div_angle.style.visibility = "visible";
        div_angle.p.x = x;
        div_angle.p.y = y;
        angleSelector.SetProcess(0.8);
    },
    showInput : function(){
        perDiv.style.visibility = "visible";
    },
    calcAngle : function(x,y){
        var a2 = div_angle.tmplen * div_angle.tmplen,
            b2 = this.calcDidT(div_angle.p.x,div_angle.p.y,x,y),
            b = Math.sqrt(b2),
            c2 = this.calcDidT(x,y,div_angle.loc.x,div_angle.loc.y),
            d = (2 * div_angle.tmplen * b);
        if (d) {
            return Math.acos((a2 + b2 - c2) / d);
        } else {
            return 0;
        }
    },
    calcDid : function(x,y,xx,yy){
        return Math.sqrt(
            this.calcDidT(x,y,xx,yy)
        );
    },
    calcDidT : function(x,y,xx,yy) {
        return (xx - x) * (xx - x)
            + (yy - y) * (yy - y);
    },
    calcFTAngle : function() {
        var beginDeg = div_angle.rotate - 90 + 720;
        var endDeg = beginDeg + div_angle.deg * 360 + 720;
        return [(beginDeg % 360).toFixed(2),(endDeg % 360).toFixed(2)];
    }
};

var endEvent = {
    //绘制弧形的结束事件
    endEventCircle : function(evn){
        var angle = exDic.calcFTAngle();
        console.log("rotate : " + div_angle.rotate + "\tdeg : " + div_angle.deg);
        console.log("beginDeg : " + angle[0] + "\tendDeg : " + angle[1]);
        exDic.enFn(angle[0],angle[1]);
        div_angle.method = 2;
        div_angle.style.visibility = "hidden";
        div_angle.loc.x = evn.clientX;
        div_angle.loc.y = evn.clientY;
        div_angle.rotate = 0;
        div_angle.deg = 0.8;
        div_angle.style.transform = "rotate(0deg)";
        this.first = true;
    },
    //绘制扇形填充的结束事件
    endEventArc : function(){

    }
};

var angleSelectorEvent = {
	tip : ['选择起始角度','选择跨越角度大小','选择完成'],
	first : true,
    mousemove : function(evn){
        if (div_angle.method == 0) {
            var deg = exDic.calcAngle(evn.clientX,evn.clientY);
            div_angle.rotate += deg;
            div_angle.rotate %= 360;
            angleSelector.ele.style.transform = "rotate(" + div_angle.rotate + "deg)";
        } else if (div_angle.method == 1) {
            var deg = exDic.calcAngle(evn.clientX,evn.clientY);
            div_angle.deg -= deg / 360;
            while (div_angle.deg < 0) {
                div_angle.deg += 1;
            }
            angleSelector.SetProcess(div_angle.deg);
        } else if (div_angle.method == 2) {
            //Nothing to do
            return;
        }
        var angle = exDic.calcFTAngle();
        exDic.tFn(angle);
    },
    mousedown : function(){
        div_angle.method++;
        div_angle.method %= 3;
        div_angle.tmplen = exDic.calcDid(
            div_angle.loc.x,
            div_angle.loc.y,
            div_angle.p.x,
            div_angle.p.y
        )
		if (this.first) {
			return;
		} else {
			TipAlert.apply(angleSelectorEvent.tip[div_angle.method],2,['ti']);
		}
    }
};

function onload_(){
    Canvas_Tool = (function (can, can_, info_, btn_,extDIC, lit_) {
        var canvas = can,                               //上层
            context = can.getContext("2d"),             //上层
            canvas_ = can_,                             //底层
            context_ = can_.getContext("2d"),           //底层
            info = info_,                               //显示消息
            btn = btn_,                                 //功能按钮
            extDic = extDIC,                            //外部方法（再扩展内部就崩溃了）
            curContext = context,                       //当前使用画布
            width = can.clientWidth,                    //画布宽度
            height = can.clientHeight,                  //画布高度
            lit = (typeof lit_ == "number") ? lit_ : 8, //栅格单位大小
            lineDic = {
                start: {
                    x: 0,
                    y: 0
                },                             //起始点
                end: {
                    x: 0,
                    y: 0
                },                               //终止点
                oldEnd: {
                    x: 0,
                    y: 0
                }                             //中间终止点
            },                            //线条数据包
            circleDic = {
                r: 0,                                   //半径
                or: 0,                                  //旧半径
                o: {
                    x: 0,
                    y: 0
                },                                      //圆心坐标
                ang: {
                    start: 0,
                    end: 0
                },                                      //选取角度
                next : false                            //是否已经选好圆心半径
            },                    //圆数据包
            draw = false,
            binding = 0,                                //画图绑定事件，1为圆，0为线
            infoLoc = [
                [0,height],
                [width,height],
                [0,0],
                [width,0],
            ],                            //信息窗口位置集合[[上←][上→][下←][下→]]
            infoToLoc = {
                x : 0,
                y : 0
            },                    //信息窗口目的位置
            colors = [
                "antiquewhite",
                "chartreuse",
                "darkorange",
                "deeppink",
                "deepskyblue",
                "fuchsia",
                "ghostwhite",
                "gold",
                "greenyellow",
                "khaki",
                "lavender",
                "lightblue",
                "lightgreen",
                "lightsalmon",
                "mediumslateblue",
                "orange",
                "orchid",
                "palegreen",
                "royalblue",
                "salmon",
                "skyblue",
                "springgreen",
                "tomato",
                "turquoise",
                "violet",
                "whitesmoke",
                "yellow"
            ];                             //扇形颜色
        canvas.somethingBindding = function () { };
        canvas_.somethingBindding = function () { };
        //更新栅格并清除背景
        var refleshGrid = function () {
            var style_ = context.strokeStyle;
            context.clearRect(0, 0, width, height);
            context_.clearRect(0, 0, width, height);
            context.strokeStyle = "rgba(173, 247, 243, 0.32)";
            var i;
            for (i = lit; i < width; i += lit) {
                context.beginPath();
                context.lineTo(i, 0);
                context.lineTo(i, height);
                context.closePath();
                context.stroke();
            }
            for (i = lit; i < height; i += lit) {
                context.beginPath();
                context.lineTo(0,i);
                context.lineTo(width,i);
                context.closePath();
                context.stroke();
            }
            context.strokeStyle = style_;
        };
        //画一个块
        var fillARect = function (x, y, color) {
            var style_ = curContext.fillStyle;
            curContext.fillStyle = (color) ? color : curContext.fillStyle;
            curContext.fillRect(x * lit + 1, y * lit + 1, lit - 2, lit - 2);
            curContext.fillStyle = style_;
        };
        //清除一个块
        var clearARect = function (x, y, color) {
            curContext.clearRect(
                x * lit + 1,
                y * lit + 1,
                lit - 2,
                lit - 2
             );
        };
        //清除画布
        function clearAll() {
            context_.clearRect(
                0,
                0,
                width,
                height
            );
        };
        ///////////////////////////////////以下三个函数不为所用//////////////////////////////////////
        //画一条线（我随想出来的画直线函数）
        var drawALine = function (x, y, xx, yy, color, fn) {
            var dx = xx - x;
            var dy = yy - y;
            var k = dy / dx;
            var state = 0;
            if (xx == x && y == yy) {
                return;
            }
            /*////////////////
            // //    2   // //
            //    //   //   //
            // 1    //    0 //
            //    //  //    //
            // //   3    // //
            ////////////////*/
            if (dx > dy) {
                //45°以下
                if (dy) {
                    if (k < 1 && k > -1) {
                        state = 0;
                    } else {
                        state = 3;
                    }
                }
            } else {
                //45°以上
                if (dy) {
                    if (k < 1 && k > -1) {
                        state = 1;
                    } else {
                        state = 2;
                    }
                }
            }
            fillARectLineHelp(x, y, xx, yy, color, fn, state % 2, parseInt(state / 2));
        };
        //画线上点的辅助函数
        //dir：是否进行镜像翻转
        //tr：是否进行轴翻转
        var fillARectLineHelp = function (x, y, xx, yy, color, fn, dir, tr) {
            var k,
                deta = 1;
            if (tr == 1) {
                //以y为标准
                k = (xx - x) / (yy - y);
                if (yy < y) {
                    deta = -1;
                }
                for (y += deta, yy += deta; y != yy; y += deta) {
                    x += deta * k;
                    fn(parseInt(x + 0.5), y, color);
                }
            } else {
                //以x为标准
                k = (yy - y) / (xx - x);
                if (xx < x) {
                    deta = -1;
                }
                for (x += deta, xx += deta; x != xx; x += deta) {
                    y += deta * k;
                    fn(x,parseInt(y + 0.5), color);
                }
            }
        };
        //画线时鼠标移动的辅助函数
        var lineMoveHelp = function () {
            //  斜率
            //var k;
            //清除旧点
            //k = (lineDic.start.y - lineDic.oldEnd.y) / (lineDic.start.x - lineDic.oldEnd.x);
            drawALine(lineDic.start.x, lineDic.start.y, lineDic.oldEnd.x, lineDic.oldEnd.y, "white", clearARect);
            //console.log(lineDic);
            //画新点
            //k = (lineDic.start.y - lineDic.end.y) / (lineDic.start.x - lineDic.end.x);
            drawALine(lineDic.start.x, lineDic.start.y, lineDic.end.x, lineDic.end.y, "#abc", fillARect);
            //修改旧点坐标
            lineDic.oldEnd.x = lineDic.end.x;
            lineDic.oldEnd.y = lineDic.end.y;
        };
        //Bresenham 的画直线和圆弧方法
        var Bresenham = {
            line: {
                drawLineHelp: function (x, y, xx, yy) {
                    var dx = xx - x,
                        dy = yy - y;
                    /*////////////////////////////
                    /////        ////        /////
                    ///  //  3   ////  2   //  ///
                    ///    //    ////    //    ///
                    ///  4   //  ////  //   1  ///
                    ///        ////////        ///
                    //////////////////////////////
                    ///        ////////        ///
                    ///  5   //  ////  //  8   ///
                    ///    //    ////    //    ///
                    ///  //  6   ////  7   //  ///
                    /////        ////        /////
                    ////////////////////////////*/
                    if (x * y > 0) {
                        //1/3->1/2/5/6
                        if (dx > 0) {
                            //1/2
                            if (dy > dx) {
                                return 2;
                            } else {
                                return 1;
                            }
                        } else {
                            //5/6
                            if (dy > dx) {
                                return 5;
                            } else {
                                return 6;
                            }
                        }
                    } else {
                        //2/4->3/4/7/8
                        if (dy > 0) {
                            //3/4
                            if (-dx > dy) {
                                return 4;
                            } else {
                                return 3;
                            }
                        } else {
                            //7/8
                            if (dx > -dy) {
                                return 8;
                            } else {
                                return 7;
                            }
                        }
                    }

                },
                //(x,y) => (xx,yy) 用color颜色使用fn函数画出
                drawLine : function(x,y,xx,yy,color,fn,arr,ind,cxx,cyy) {
                    var d,
                        dx = Math.abs(xx - x),
                        dy = Math.abs(yy - y),
                        ty = 0,
                        t,
                        ix,
                        iy,
                        cx,
                        cy,
                        n2dy,
                        n2dydx,
                        d,
                        state,
                        deta;
                    if (x == xx && y == yy) {
                        return;
                    }
                    //state = this.drawLineHelp(x, y, xx, yy);
                    if (dx < dy) {
                        ty = 1;
                        t = x;
                        x = y;
                        y = t;
                        t = xx;
                        xx = yy;
                        yy = t;
                        t = dx;
                        dx = dy;
                        dy = t;
                    }

                    ix = (xx - x) > 0 ? 1 : -1;
                    iy = (yy - y) > 0 ? 1 : -1;
                    cx = x;
                    cy = y;
                    n2dy = dy * 2;
                    n2dydx = (dy - dx) * 2;
                    d = dy * 2 - dx;

                    if (ty) {
                        while (cx != xx) {
                            if (d < 0) {
                                d += n2dy;
                            } else {
                                cy += iy;
                                d += n2dydx;
                            }
                            fn(cy, cx, color);
                            if (arr) {
                                arr[cy - cxx][cx - cyy] = ind;
                            }
                            cx += ix;
                        }
                    } else {
                        while (cx != xx) {
                            if (d < 0) {
                                d += n2dy;
                            } else {
                                cy += iy;
                                d += n2dydx;
                            }
                            fn(cx, cy, color);
                            if (arr) {
                                arr[cx - cxx][cy - cyy] = ind;
                            }
                            cx += ix;
                        }
                    }
                },
                lineMoveHelp: function () {
                    //清除旧点
                    this.drawLine(lineDic.start.x, lineDic.start.y, lineDic.oldEnd.x, lineDic.oldEnd.y, "white", clearARect);
                    //画上新点
                    this.drawLine(lineDic.start.x, lineDic.start.y, lineDic.end.x, lineDic.end.y, "#abc", fillARect);
                    //修改旧点坐标
                    lineDic.oldEnd.x = lineDic.end.x;
                    lineDic.oldEnd.y = lineDic.end.y;
                }
            },
            circle: {
                //临时输出
                tempArr : [],
                curInd : 0,
                //是否填充
                fill : false,
                r : 0,
                //是否选择好角度
                deg : false,
                //判断角度是否在限定范围内
                judgeFn : function(){return true;},
                //小角度到大角度的判断方法
                judgeFnOne : function(deg) {
                    if (deg >= this.fromdeg && deg <= this.todeg) {
                        return false;
                    } else {
                        return true;
                    }
                },
                //大角度到小角度的判断方法
                judgeFnTwo : function(deg) {
                    if (deg > this.todeg && deg < this.fromdeg) {
                        return true;
                    } else {
                        return false;
                    }
                },
                fromdeg : 0,
                todeg : 0,
                circleRMoveHelp: function () {
                    //清除旧圆
                    this.drawRCircle(circleDic.o.x, circleDic.o.y, circleDic.or,"white", clearARect);
                    //画新圆
                    this.drawRCircle(circleDic.o.x, circleDic.o.y, circleDic.r, "gray",fillARect);
                    //交换数据
                    circleDic.or = circleDic.r;
                },
                CircleEightFun: function (cx, cy, x, y, color, fn) {
                    this.circleDrawWithDeg(+ x, + y, color, fn,cx,cy);  //0-45
                    this.circleDrawWithDeg(+ y, + x, color, fn,cx,cy);  //45-90
                    this.circleDrawWithDeg(- y, + x, color, fn,cx,cy);  //90-135
                    this.circleDrawWithDeg(- x, + y, color, fn,cx,cy);  //135-180
                    this.circleDrawWithDeg(- x, - y, color, fn,cx,cy);  //180-225
                    this.circleDrawWithDeg(- y, - x, color, fn,cx,cy);  //225-270
                    this.circleDrawWithDeg(+ y, - x, color, fn,cx,cy);  //270-315
                    this.circleDrawWithDeg(+ x, - y, color, fn,cx,cy);  //315-360
                },
                circleDrawWithDeg : function(x,y,color,fn,cx,cy){
                    if (this.deg) {
                        var len = extDic.calcDid(x,y,0,0),
                            deg = Math.acos(x / len) / Math.PI * 180;
                        if (y < 0) {
                            deg = 360 - deg;
                        }
                        if (this.judgeFn(deg)) {
                            return;
                        }
                    }
                    if (this.fill) {
                        this.fill(cx,cy,cx + x,cy + y,color,fn,this.tempArr,this.curInd,cx - this.r,cy - this.r);
                    } else {
                        fn(cx + x,cy + y,color);
                    }
                },
                drawRCircle: function (cx, cy, r, color, fn) {
                    var x = 0,
                        y = r,
                        yi,
                        d = 3 - 2 * r;
                    while (x <= y) {
                        this.CircleEightFun(cx,cy,x,y,color,fn);
                        if (d < 0) {
                            d += 4 * x + 6;
                        } else {
                            d += 4 * (x - y) + 10;
                            y--;
                        }
                        x++;
                    }
                }
            }
        };
        ///////////////////////////////////以下为画直线事件//////////////////////////////////////////
        var drawLineBinding = function () {
            canvas.onmousedown = drawLineEvent.onmousedownLine;
            canvas.onmousemove = drawLineEvent.onmousemoveLine;
            canvas.onmouseup = drawLineEvent.onmouseupLine;
            info.tableLeft = ["from X","from Y","to X","to Y"];
        };
        //画线鼠标事件
        var drawLineEvent = {
            onmousedownLine: function(evn) {
                //console.log(evn.clientX + "_" + evn.clientY);
                draw = true;
                lineDic.start.x = parseInt(evn.clientX / lit);
                lineDic.start.y = parseInt(evn.clientY / lit);
                lineDic.end.x = parseInt(evn.clientX / lit);
                lineDic.end.y = parseInt(evn.clientY / lit);
                lineDic.oldEnd.x = parseInt(evn.clientX / lit);
                lineDic.oldEnd.y = parseInt(evn.clientY / lit);
                fillARect(parseInt(evn.clientX / lit), parseInt(evn.clientY / lit));
            },
            onmousemoveLine :function (evn) {
                if (draw) {
                    lineDic.end.x = parseInt(evn.clientX / lit);
                    lineDic.end.y = parseInt(evn.clientY / lit);
                    info.style.visibility = "visible";
                    info.innerHTML = extDic.makeTable(
                            info.tableLeft,
                            [
                                lineDic.start.x,
                                lineDic.start.y,
                                lineDic.end.x,
                                lineDic.end.y
                            ]
                     );
                    if (evn.clientY + 120 > height) {
                        info.style.top = evn.clientY -80 + "px";
                    } else {
                        info.style.top = evn.clientY + 10 + "px";
                    }
                    if (evn.clientX + 90 > width) {
                        info.style.left = evn.clientX - 80 + "px";
                    } else {
                        info.style.left = evn.clientX + 10 + "px";
                    }
                    Bresenham.line.lineMoveHelp();
                    btn.style.zIndex = -1;
                }
            },
            onmouseupLine: function () {
                if (draw) {
                    //var k = (lineDic.start.y - lineDic.end.y) / (lineDic.start.x - lineDic.end.x);
                    curContext = context_,
                    fillARect(lineDic.start.x, lineDic.start.y);
                    Bresenham.line.drawLine(lineDic.start.x, lineDic.start.y, lineDic.end.x, lineDic.end.y, "black", fillARect);
                    curContext = context,
                    Bresenham.line.drawLine(lineDic.start.x, lineDic.start.y, lineDic.end.x, lineDic.end.y, "black", clearARect);
                    clearARect(lineDic.start.x, lineDic.start.y);
                    draw = false;
                }
                info.style.visibility = "hidden";
                btn.style.zIndex = 1;
            }
        };
        ///////////////////////////////////以下为画圆弧事件//////////////////////////////////////////
        var drawCircleBinding = function () {
            other.endFunction = drawCircleEventHelp.r_and_o_EndFunction;
            canvas.onmousedown = drawCircleEvent.onmousedownCircle;
            canvas.onmousemove = drawCircleEvent.onmousemoveCircle;
            canvas.onmouseup   = drawCircleEvent.onmouseupCircle;
            extDic.tFn = function(angle){
                info.tableRight[3] = angle[0] + "deg";
                info.tableRight[4] = angle[1] + "deg";
                info.innerHTML = extDic.makeTable(info.tableLeft,info.tableRight);
            }
            extDic.enFn = function(fromdeg,todeg){
                fromdeg = parseFloat(fromdeg);
                todeg = parseFloat(todeg);
                Bresenham.circle.drawRCircle(circleDic.o.x,circleDic.o.y,circleDic.or,"",clearARect);
                Bresenham.circle.deg = true;
                if (fromdeg < todeg) {
                    Bresenham.circle.judgeFn = Bresenham.circle.judgeFnOne;
                } else {
                    Bresenham.circle.judgeFn = Bresenham.circle.judgeFnTwo;
                }
                Bresenham.circle.fromdeg = fromdeg;
                Bresenham.circle.todeg = todeg;
                curContext = context_;
                Bresenham.circle.drawRCircle(circleDic.o.x,circleDic.o.y,circleDic.or,"black",fillARect);
                curContext = context;
                info.style.visibility = "hidden";
                btn.style.zIndex = 1;
            }
        };
        //画圆弧鼠标事件和扇形填充公用
        var drawCircleEvent = {
            onmousedownCircle: function (evn) {
                circleDic.o.x = parseInt(evn.clientX / lit);
                circleDic.o.y = parseInt(evn.clientY / lit);
                circleDic.o.r = 0;
                circleDic.o.or = 0;
                circleDic.next = true;
                circleDic.ang.start = 0;
                circleDic.ang.end = 360;
                Bresenham.circle.deg = false;
                draw = true;
                btn.style.zIndex = -1;
                info.tableLeft = ["x","y","r"];
            },
            onmousemoveCircle: function (evn) {
                if (draw) {
                    drawCircleEventHelp.rHelp(evn);
                    Bresenham.circle.circleRMoveHelp();
                    this.somethingBindding = other.endFunction;
                    info.tableRight = [
                        circleDic.o.x,
                        circleDic.o.y,
                        circleDic.r,
                    ];
                    info.innerHTML = extDic.makeTable(info.tableLeft,info.tableRight);
                    info.style.visibility = "visible";
                    if (evn.clientY + 120 > height) {
                        info.style.top = evn.clientY - 80 + "px";
                    } else {
                        info.style.top = evn.clientY + 10 + "px";
                    }
                    if (evn.clientX + 90 > width) {
                        info.style.left = evn.clientX - 80 + "px";
                    } else {
                        info.style.left = evn.clientX + 10 + "px";
                    }
                }
            },
            onmouseupCircle: function () {
                if (draw) {
                    info.tableLeft = ["x","y","r","from","to"];
                    this.somethingBindding(this);
                    info.style.visibility = "hidden";
                    btn.style.zIndex = 1;
                }
                draw = false;
            }
        };
        var drawCircleEventHelp = {
            rHelp: function (e) {
                circleDic.r = parseInt(Math.sqrt(
                                                    Math.pow(circleDic.o.x - parseInt(e.clientX / lit), 2) +
                                                    Math.pow(circleDic.o.y - parseInt(e.clientY / lit), 2)
                                                 ) + 0.5);
            },
            //绑定选择好圆心和半径后触发事件
            r_and_o_EndFunction: function (e) {
                //1.将选择器画布强行前置
                //已经交由外部实现

                //2.移动信息窗口到屏幕角落
                loc = 0;
                //loc += (circleDic.o.y * lit > height / 2) ? 0 : 2;
                loc += (circleDic.o.x * lit > width / 2) ? 0 : 1;
                infoToLoc.x = infoLoc[loc][0] > 0 ? infoLoc[loc][0] - 140 : 0 + 10;
                infoToLoc.y = infoLoc[loc][1] > 0 ? infoLoc[loc][1] - 140 : 0 + 10;
                other.moveObjToLoc(info, infoToLoc);

                //3.为外部设定信息窗口的回调事件
				//已经交由外部实现

                //4.初始化选择器的位置和参数
                extDic.setCoverLoc(
                    circleDic.r,
                    circleDic.o.x,
                    circleDic.o.y,
                    lit
                 );
            }
        };
        ///////////////////////////////////以下为画扇形事件//////////////////////////////////////////
        var drawFillArcBinding = function(){
            other.endFunction = fanShapedHelp.endFunction;
            Bresenham.circle.judgeFn = Bresenham.circle.judgeFnOne;
            canvas.onmousedown = drawCircleEvent.onmousedownCircle;
            canvas.onmousemove = drawCircleEvent.onmousemoveCircle;
            canvas.onmouseup   = drawCircleEvent.onmouseupCircle;
        };
        var fanShapedHelp = {
            endFunction : function(){
                //1.将选择器画布强行前置
                //已经交由外部实现

                //2.移动信息窗口到屏幕角落
                loc = 0;
                //loc += (circleDic.o.y * lit > height / 2) ? 0 : 2;
                loc += (circleDic.o.x * lit > width / 2) ? 0 : 1;
                infoToLoc.x = infoLoc[loc][0] > 0 ? infoLoc[loc][0] - 140 : 0 + 10;
                infoToLoc.y = infoLoc[loc][1] > 0 ? infoLoc[loc][1] - 140 : 0 + 10;
                other.moveObjToLoc(info, infoToLoc);

                //3.为外部设定信息窗口的回调事件
                extDic.enFn = function(arrStr) {
                    //这里默认返回一个数组，表示分割好的每一个扇形的占比
                    var arr = [];
                    var t = 0;
                    var ind = 1;
                    var r = circleDic.r;
                    if (arrStr) {
                        arrStr.split(',')
                            .forEach(function(i,j){
                                arr.push(parseFloat(i));
                        });
                    } else {
                        arr = [1];
                    }
                    Bresenham.circle.drawRCircle(circleDic.o.x,circleDic.o.y,circleDic.or,"",clearARect);
                    Bresenham.circle.deg = true;
                    Bresenham.circle.r = r;
                    Bresenham.circle.fill = Bresenham.line.drawLine;
                    Bresenham.circle.curInd = 1;
                    Bresenham.circle.tempArr = new Array(2 * r + 1);
                    for (var i = 0;i < 2 * r + 1;i++) {
                        Bresenham.circle.tempArr[i] = new Array(2 * r + 1);
                    }
                    Bresenham.circle.tempArr[r][r] = 1;
                    curContext = context_;
                    while (arr[0] <= 0 && arr.length) {
                        arr.shift();
                    }
                    if (!arr.length) {
                        arr = [1];
                    }
                    fillARect(circleDic.o.x,circleDic.o.y);
                    while (arr.length) {
                        Bresenham.circle.fromdeg = t * 360;
                        Bresenham.circle.todeg = (t + arr[0]) * 360;
                        curContext = context_;
                        Bresenham
                            .circle
                                .drawRCircle(
                                    circleDic.o.x,
                                    circleDic.o.y,
                                    circleDic.or,
                                    colors[ind % colors.length],
                                    fillARect
                        );
                        ind++;

                        t += arr[0];
                        arr.shift();

                        Bresenham.circle.curInd++;
                    }
                    var ia,
                        id,
                        ja,
                        jd,
                        rr = r * 2 + 1,
                        need = false,
                        c = 0;
                    for (var i = 0;i < rr;i++) {
                        for (var j = 0;j < rr;j++) {
                            need = true;
                            c = 0;
                            if (!Bresenham.circle.tempArr[i][j]) {
                                ia = (i + 1) % rr;
                                id = (i - 1);
                                ja = (j + 1) % rr;
                                jd = (j - 1);
                                //id,j
                                if (id >= 0) {
                                    if (Bresenham.circle.tempArr[id][j]) {
                                        c = Bresenham.circle.tempArr[id][j];
                                    } else {
                                        need = false;
                                    }
                                }
                                //ia,j
                                if (ia && need) {
                                    if (Bresenham.circle.tempArr[ia][j]) {
                                        c = Bresenham.circle.tempArr[ia][j];
                                    } else {
                                        need = false;
                                    }
                                }
                                //i,jd
                                if (jd >= 0 && need) {
                                    if (Bresenham.circle.tempArr[i][jd]) {
                                        c = Bresenham.circle.tempArr[i][jd];
                                    } else {
                                        need = false;
                                    }
                                }
                                //i,ja
                                if (ja && need) {
                                    if (Bresenham.circle.tempArr[i][ja]) {
                                        c = Bresenham.circle.tempArr[i][ja];
                                    } else {
                                        need = false;
                                    }
                                }
                                if (need) {
                                    fillARect(i + circleDic.o.x - r,j + circleDic.o.y - r,colors[c % colors.length]);
                                }
                            }
                        }
                    }
                    curContext = context;
                    Bresenham.circle.fill = false;
                    Bresenham.circle.deg = false;
                };

                //4.初始化选择器的位置和参数
                extDic.showInput();
            }
        };
        ////////////////////一下对象为圆弧和扇形公用对象，承载对象
        var other = {
            //obj ：
            //toLoc : {x : 0,y : 0}
            moveObjToLoc: function (obj, toLoc) {
                obj.style.top = toLoc.y + "px";
                obj.style.left = toLoc.x + "px";
            },
            endFunction : function(){}
        };
        return {
            raiseGrid : function(){
                lit++;
                refleshGrid();
            },
            downGrid: function () {
                lit--;
                refleshGrid();
            },
            refleshGrid: refleshGrid,
            fillARect: fillARect,
            clearAll: clearAll,
            bindingDrawToggle: function () {
                switch (binding) {
                    case 0:
                        drawLineBinding();
                        break;
                    case 1:
                        drawCircleBinding();
                        break;
                    case 2:
                        drawFillArcBinding();
                        break;
                    default:
                        drawLineBinding();
                        binding = 0;
                }
                extDic.showTipFirst(binding);
                binding++;
                binding %= 3;
            }
        }
    })(canvas, canvas_, infodiv, btn,exDic);
}

function bindingToggle(e) {
    Canvas_Tool.bindingDrawToggle();
    if (curType == 2) {
        e.innerText = "Line";
    } else if (curType == 0) {
        e.innerText = "Circle";
    } else if (curType == 1) {
        e.innerText = "Fill Arc";
    }
    curType++;
    curType %= 3;
}



/***
 * 说明
 * 1）程序开始是，先初始化全部全局部件，
 * 2）初始化角度选择器对象
 * 3）初始化Canvas工具对象
 * 4）开始交回用户执行
 * */

/***
 * Canvas 工具对象说明
 * 1)初始化过程
 *      1）整体布局刷新（栅格刷新，内部数据及对象初始化）
 *      2）完成当前绘制事件绑定（一开始绑定事件为绘制直线）
 * 2)绘制时绑定过程
 *      1）绑定三个事件（鼠标按下，鼠标移动，鼠标放开）
 *      2）修改提示框中的提示内容
 *      3）对于圆弧和扇形，绑定绘制圆完成时的后续事件
 * 3)圆弧和扇形后续事件绑定
 *      1）修改other对象中的endFunction方法
 *      2）随后的鼠标事件绑定内容完全一致
 * 4)圆弧和扇形后续事件的不同点
 *      1）圆弧将按照返回的角度绘制弧
 *          1）修改选择器为前置（实际上是在第四步算带完成的）
 *          2）修改提示框的位置
 *          3）设置外部返回动作（通过修改exDic对象的enFn事件）
 *          4）初始化选择器的位置和大小（同时完成第一步）
 *      2）扇形将按照返回的数值从零度开始分割圆，绘制扇形
 *          1）同上1）
 *          2）同上2）
 *          3）另外设置返回动作
 *          4）另外设置选择器
 * 5)其他绑定事件/元素/方法说明
 *      1）绘制过程中绘制函数是动态绑定的，有drawARect和clearARect方法
 *      2）元素curContext是动态绑定的，只有全部事件完成时，才会绘制到后景的context中
 * */

/***
 * csp对象说明
 * 1）由该对象创建的实例化对象必须传入元素ID，并且csp对象是生成器对象，不是最终态的对象
 * 2）由对象创建的实例化对象必须绑定一个完成事件
 * 3）这里创建的实例化对象是被部分重写的，该对象并不是作为角度选择器而编写的
 * */

/***
 * */

