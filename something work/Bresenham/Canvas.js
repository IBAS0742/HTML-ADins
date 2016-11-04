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
    div_angle         //承载csp对象主元素的div
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
    csp = CircleShapProcess();                                      //创建一个csp对象
    angleSelector = csp.Instance("div_corver");                     //初始化并创建一个csp对象示例
    canvas.width = document.body.clientWidth - deta;                //初始化。。。
    canvas.height = document.body.clientHeight - deta;              //初始化。。。
    canvas_.width = document.body.clientWidth - deta;               //初始化。。。
    canvas_.height = document.body.clientHeight - deta;             //初始化。。。
    div_angle.style.width = document.body.clientWidth - deta + "px";//初始化。。。
    div_angle.style.height =
        document.body.clientHeight - deta + "px";                   //初始化。。。
    onload_();                                                      //初始化。。。
    colorControl.width = (                                          //
        (document.body.clientWidth > document.body.clientHeight) ?  //
        colorControl.width * document.body.clientHeight :
        colorControl.width * document.body.clientHeight);           //
    Canvas_Tool.refleshGrid();                                      //
    Canvas_Tool.bindingDrawToggle();                                //
    angleSelector.BindingFun(angleSelectorEvent.endEvent);
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

var angleSelectorEvent = {
	tip : ['选择起始角度','选择跨越角度大小','选择完成'],
	first : true,
    mousemove : function(){
        if (div_angle.method == 0) {
            var deg = exDic.calcAngle(event.clientX,event.clientY);
            div_angle.rotate += deg;
            div_angle.rotate %= 360;
            angleSelector.ele.style.transform = "rotate(" + div_angle.rotate + "deg)";
        } else if (div_angle.method == 1) {
            var deg = exDic.calcAngle(event.clientX,event.clientY);
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
    },
    endEvent : function(){
        var angle = exDic.calcFTAngle();
        console.log("rotate : " + div_angle.rotate + "\tdeg : " + div_angle.deg);
        console.log("beginDeg : " + angle[0] + "\tendDeg : " + angle[1]);
        exDic.enFn(angle[0],angle[1]);
        div_angle.method = 2;
        div_angle.style.visibility = "hidden";
        div_angle.loc.x = event.clientX;
        div_angle.loc.y = event.clientY;
        div_angle.rotate = 0;
        div_angle.deg = 0.8;
        div_angle.style.transform = "rotate(0deg)";
		this.first = true;
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
            },                              //线条数据包
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
                next : false,                           //是否已经选好圆心半径
            },                            //圆数据包
            draw = false,
            binding = 0,                                //画图绑定事件，1为圆，0为线
            infoLoc = [
                [0,height],
                [width,height],
                [0,0],
                [width,0],
            ],                              //信息窗口位置集合[[上←][上→][下←][下→]]
            infoToLoc = {
                x : 0,
                y : 0
            };                            //信息窗口目的位置
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
        }
        //清除一个块
        var clearARect = function (x, y, color) {
            curContext.clearRect(
                x * lit + 1,
                y * lit + 1,
                lit - 2,
                lit - 2
             );
        }
        //清除画布
        function clearAll() {
            context_.clearRect(
                0,
                0,
                width,
                height
            );
        }
        //画一条线
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
        }
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
                drawLine(x,y,xx,yy,color,fn) {
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
                deg : false,
                //判断角度是否在限定范围内
                judgeFn : function(){return true;},
                judgeFnOne : function(deg) {
                    if (deg >= this.fromdeg && deg <= this.todeg) {
                        return false;
                    } else {
                        return true;
                    }
                },
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
                        var len = exDic.calcDid(x,y,0,0),
                            deg = Math.acos(x / len) / Math.PI * 180;
                        if (y < 0) {
                            deg = 360 - deg;
                        }
                        if (this.judgeFn(deg)) {
                            return;
                        }
                    }
                    fn(cx + x,cy + y,color);
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

        var drawLineBinding = function () {
            canvas.onmousedown = drawLineEvent.onmousedownLine;
            canvas.onmousemove = drawLineEvent.onmousemoveLine;
            canvas.onmouseup = drawLineEvent.onmouseupLine;
            info.tableLeft = ["from X","from Y","to X","to Y"];
        };
        //画线鼠标事件
        var drawLineEvent = {
            onmousedownLine: function() {
                //console.log(event.clientX + "_" + event.clientY);
                draw = true;
                lineDic.start.x = parseInt(event.clientX / lit);
                lineDic.start.y = parseInt(event.clientY / lit);
                lineDic.end.x = parseInt(event.clientX / lit);
                lineDic.end.y = parseInt(event.clientY / lit);
                lineDic.oldEnd.x = parseInt(event.clientX / lit);
                lineDic.oldEnd.y = parseInt(event.clientY / lit);
                fillARect(parseInt(event.clientX / lit), parseInt(event.clientY / lit));
            },
            onmousemoveLine :function () {
                if (draw) {
                    lineDic.end.x = parseInt(event.clientX / lit);
                    lineDic.end.y = parseInt(event.clientY / lit);
                    info.style.visibility = "visible";
                    info.innerHTML = exDic.makeTable(
                            info.tableLeft,
                            [
                                lineDic.start.x,
                                lineDic.start.y,
                                lineDic.end.x,
                                lineDic.end.y
                            ]
                     );
                    if (event.clientY + 120 > height) {
                        info.style.top = event.clientY -80 + "px";
                    } else {
                        info.style.top = event.clientY + 10 + "px";
                    }
                    if (event.clientX + 90 > width) {
                        info.style.left = event.clientX - 80 + "px";
                    } else {
                        info.style.left = event.clientX + 10 + "px";
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
        ///////////////////////////////////以下为画圆弧//////////////////////////////////////////
        var drawCircleBinding = function () {
            canvas.onmousedown = drawCircleEvent.onmousedownCircle;
            canvas.onmousemove = drawCircleEvent.onmousemoveCircle;
            canvas.onmouseup   = drawCircleEvent.onmouseupCircle;
            info.tableLeft = ["x","y","r","from","to"];
            exDic.tFn = function(angle){
                info.tableRight[3] = angle[0] + "deg";
                info.tableRight[4] = angle[1] + "deg";
                info.innerHTML = exDic.makeTable(info.tableLeft,info.tableRight);
            }
            exDic.enFn = function(fromdeg,todeg){
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
        //画圆弧鼠标事件
        var drawCircleEvent = {
            onmousedownCircle: function () {
                //if (circleDic.next) {
                //    circleDic.next = false;
                //} else {
                    circleDic.o.x = parseInt(event.clientX / lit);
                    circleDic.o.y = parseInt(event.clientY / lit);
                    circleDic.o.r = 0;
                    circleDic.o.or = 0;
                    circleDic.next = true;
                    circleDic.ang.start = 0;
                    circleDic.ang.end = 360;
                    Bresenham.circle.deg = false;
                //}
                draw = true;
            },
            onmousemoveCircle: function () {
                if (draw) {
                    //if (circleDic.next) {
                        drawCircleEventHelp.rHelp(event);
                        Bresenham.circle.circleRMoveHelp();
                        this.somethingBindding = drawCircleEventHelp.r_and_o_EndFunction;
                        info.tableRight = [
                            circleDic.o.x,
                            circleDic.o.y,
                            circleDic.r,
                            0,0
                        ];
                        info.innerHTML = exDic.makeTable(info.tableLeft,info.tableRight);
                        info.style.visibility = "visible";
                        if (event.clientY + 120 > height) {
                            info.style.top = event.clientY - 80 + "px";
                        } else {
                            info.style.top = event.clientY + 10 + "px";
                        }
                        if (event.clientX + 90 > width) {
                            info.style.left = event.clientX - 80 + "px";
                        } else {
                            info.style.left = event.clientX + 10 + "px";
                        }
                        btn.style.zIndex = -1;
                    //} else {
                    //  this.somethingBindding = drawCircleEventHelp.angleEndFunction;
                    //  drawCircleEventHelp.angleHelp(event);
                    //}
                }
            },
            onmouseupCircle: function () {
                if (draw) {
                    this.somethingBindding(this);
                    //info.style.visibility = "hidden";
                    //btn.style.zIndex = 1;
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
                e.somethingBindding = drawCircleEventHelp.angleEndFunction;
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
                exDic.setCoverLoc(
                    circleDic.r,
                    circleDic.o.x,
                    circleDic.o.y,
                    lit
                 );

            }
        }
        var other = {
            //obj ：
            //toLoc : {x : 0,y : 0}
            moveObjToLoc: function (obj, toLoc) {
                obj.style.top = toLoc.y + "px";
                obj.style.left = toLoc.x + "px";
            }
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
                    default:
                        drawLineBinding();
                        binding = 0;
                }
                binding = 1 - binding;
            },
            executeCanvasBindding: function () {
                canvas.somethingBindding();
                canvas.somethingBindding = function () { };
            }
        }
    })(canvas, canvas_, infodiv, btn,exDic);
}

function bindingToggle(e) {
    Canvas_Tool.bindingDrawToggle();
    curType = 1 - curType;
    e.innerText = (curType == 1)?"Circle":"Line";
}