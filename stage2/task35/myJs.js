/**
 * Created by 建瓴 on 2016/4/24.
 */

//当前行总数
var lineNum = 1;
//获取行数，就算用户没有输入也是会显示一行的
function getLineNum(){
    return $("#cmd div").length+1;
}

//命令数组对象
var commands = [],
    commandStr = [];
//重新生成命令数组
//firstChild属性可以获取第一个文本节点的内容
//相应的jquery的方式是$("#cmd").contents().first() （children方法不会返回文本节点，但是contents会）
//生成命令数组之后根据其err值来将对应的行变色
//由于页面实现的原因，第一个命令每次都需要被单独对待

function generateCommands(){
    //先将命令字符串都提取出来
    var result = true;
    commandStr = [];
    commandStr[0] = $("#cmd").contents().first()[0].data;
    for (var i=0; i<$("#cmd").children().length; i++){
        commandStr[i+1] = $("#cmd div:eq("+i+")").text();
    }
    //然后再生成命令对象
    commands = [];
    for (var i=0; i<commandStr.length; i++){
        commands[i] = new Command(commandStr[i]);
        showColor(i, commands[i].err != 0);
        if (commands[i].err != 0){
            result = false;
        }
    }
    return result;
}

//命令类
function Command(str){
    this.err = 0;
    this.type = null;
    this.dir = null;
    this.steps = 1;
    this.res = str.split(" ");
    //if (this.res[0]!="GO"||this.res[0]!="TUN"||this.res[0]!="TRA"||this.res[0]!="MOV"){
    //    this.err = "unknow command " + this.res[0];
    //}
    switch (this.res[0]){
        case "GO":
            this.type = "GO";
            if (this.res.length > 2){
                this.err = "too many parameters, please use command like [ GO 2 ]."
            }else if (this.res.length == 2){
                if (!this.res[1].match(/^\d+$/g) || this.res[1]<=0){
                    this.err = "illegal parameter [STEPS] for 'GO' command. "
                }else{
                    this.steps = parseInt(this.res[1]);
                }
            }
            break;
        case "TUN":
            this.type = "TUN";
            if (this.res.length != 2){
                this.err = "too many/few parameters, please use command like [ TUN RIG ]."
            }else {
                switch (this.res[1]){
                    case "LEF":
                        this.dir = "LEF";
                        break;
                    case "RIG":
                        this.dir = "RIG";
                        break;
                    case "BAC":
                        this.dir = "BAC";
                        break;
                    default:
                        this.err = "illegal parameter [direction] for 'TUN' command. "
                        break;
                }
            }
            break;
        case "TRA":
            this.type = "TRA";
            if (this.res.length == 1){
                this.err = "too few parameters, please use command like [ TRA RIG ]."
                break;
            }
            switch (this.res[1]){
                case "LEF":
                    this.dir = "LEF";
                    break;
                case "TOP":
                    this.dir = "TOP";
                    break;
                case "RIG":
                    this.dir = "RIG";
                    break;
                case "BOT":
                    this.dir = "BOT";
                    break;
                default:
                    this.err = "illegal parameter [direction] for 'TUN' command. "
                    break;
            }
            if (this.res.length > 2){
                if (this.res.length > 3){
                    this.err = "too many parameters. ";
                }else if (!this.res[2].match(/^\d+$/g) || this.res[2]<=0){
                    this.err = "illegal parameter [STEPS] for 'TRA' command. "
                }else {
                    this.steps = parseInt(this.res[2]);
                }
            }
            break;
        case "MOV":
            this.type = "MOV";
            if (this.res.length == 1){
                this.err = "too few parameters, please use command like [ MOV RIG ]."
                break;
            }
            switch (this.res[1]){
                case "LEF":
                    this.dir = "LEF";
                    break;
                case "RIG":
                    this.dir = "RIG";
                    break;
                case "BAC":
                    this.dir = "BAC";
                    break;
                default:
                    this.err = "illegal parameter [direction] for 'MOV' command. "
                    break;
            }
            if (this.res.length > 2){
                if (this.res.length > 3){
                    this.err = "too many parameters. ";
                }else if (!this.res[2].match(/^\d+$/g) || this.res[2]<=0){
                    this.err = "illegal parameter [STEPS] for 'MOV' command. "
                }else {
                    this.steps = parseInt(this.res[2]);
                }
            }
            break;
        default:
            this.err = "unknow command " + this.res[0];
    }
}

//主角对象
var avater = {
    positionX: 0,//x坐标，范围为0-9,左上角为坐标原点
    positionY: 0,//y坐标，范围为0-9
    direction: 0,//方向，0123分别对应上右下左

    changeDirection: function(dir){
        switch (dir){
            case "TOP":
                this.direction = 0;
                break;
            case "RIG":
                this.direction = 1;
                break;
            case "BOT":
                this.direction = 2;
                break;
            case "LEF":
                this.direction = 3;
                break;
            default:
                break;
        }
        this.render();
    },
    turn: function(dir){
        switch (dir){
            case "LEF":
                this.direction --;
                if (this.direction < 0){
                    this.direction += 4;
                }
                break;
            case "RIG":
                this.direction ++;
                if (this.direction > 3){
                    this.direction -= 4;
                }
                break;
            case "BAC":
                this.direction += 2;
                if (this.direction > 3){
                    this.direction -= 4;
                }
                break;
            default:
                break;
        }
        this.render();
    },
    go: function(){
        switch (this.direction) {
            case 0:
                this.positionY -= 1;
                if (this.positionY < 0) {
                    this.positionY = 0;
                }
                break;
            case 1:
                this.positionX += 1;
                if (this.positionX > 9) {
                    this.positionX = 9;
                }
                break;
            case 2:
                this.positionY += 1;
                if (this.positionY > 9) {
                    this.positionY = 9;
                }
                break;
            case 3:
                this.positionX -= 1;
                if (this.positionX < 0) {
                    this.positionX = 0;
                }
                break;
            default:
                break;
        }
        this.render();
    },
    tra: function(dir){
        switch (dir){
            case "TOP":
                this.positionY -= 1;
                if (this.positionY < 0){
                    this.positionY = 0;
                }
                break;
            case "RIG":
                this.positionX += 1;
                if (this.positionX > 9){
                    this.positionX = 9;
                }
                break;
            case "BOT":
                this.positionY += 1;
                if (this.positionY > 9){
                    this.positionY = 9;
                }
                break;
            case "LEF":
                this.positionX -= 1;
                if (this.positionX < 0){
                    this.positionX = 0;
                }
                break;
            default:
                break;
        }
        this.render();
    },
    //渲染图片
    render: function(){
        $("#avater").css("left", (avater.positionX*50+50)+"px");
        $("#avater").css("top", (avater.positionY*50+50)+"px");
        $("#avater").css("-webkit-transform", "rotate("+(avater.direction*90)+"deg)");
        $("#avater").css("-moz-transform", "rotate("+(avater.direction*90)+"deg)");
        $("#avater").css("-ms-transform", "rotate("+(avater.direction*90)+"deg)");
        $("#avater").css("-o-transform", "rotate("+(avater.direction*90)+"deg)");
        $("#avater").css("transform", "rotate("+(avater.direction*90)+"deg)");
    }

    //go: function(steps){
    //    switch (this.direction){
    //        case 0:
    //            this.positionY -= steps;
    //            if (this.positionY < 0){
    //                this.positionY = 0;
    //            }
    //            break;
    //        case 1:
    //            this.positionX += steps;
    //            if (this.positionX > 9){
    //                this.positionX = 9;
    //            }
    //            break;
    //        case 2:
    //            this.positionY += steps;
    //            if (this.positionY > 9){
    //                this.positionY = 9;
    //            }
    //            break;
    //        case 3:
    //            this.positionX -= steps;
    //            if (this.positionX < 0){
    //                this.positionX = 0;
    //            }
    //            break;
    //        default:
    //            break;
    //    }
    //},
    //tun: function(dir){
    //    switch (dir){
    //        case "LEF":
    //            this.direction --;
    //            if (this.direction < 0){
    //                this.direction += 4;
    //            }
    //            break;
    //        case "RIG":
    //            this.direction ++;
    //            if (this.direction > 3){
    //                this.direction -= 4;
    //            }
    //            break;
    //        case "BAC":
    //            this.direction += 2;
    //            if (this.direction > 3){
    //                this.direction -= 4;
    //            }
    //            break;
    //        default:
    //            break;
    //    }
    //},
    //tra: function(dir, steps){
    //    switch (dir){
    //        case "TOP":
    //            this.positionY -= steps;
    //            if (this.positionY < 0){
    //                this.positionY = 0;
    //            }
    //            break;
    //        case "RIG":
    //            this.positionX += steps;
    //            if (this.positionX > 9){
    //                this.positionX = 9;
    //            }
    //            break;
    //        case "BOT":
    //            this.positionY += steps;
    //            if (this.positionY > 9){
    //                this.positionY = 9;
    //            }
    //            break;
    //        case "LEF":
    //            this.positionX -= steps;
    //            if (this.positionX < 0){
    //                this.positionX = 0;
    //            }
    //            break;
    //        default:
    //            break;
    //    }
    //},
    //mov: function(dir, steps){
    //    this.tun(dir);
    //}
}


//执行一条命令
function execCommand(cmd){
    var counter = cmd.steps;
    var timer = null;
    switch (cmd.type){
        case "GO"://执行steps次前进操作
            var i = 1;
            timer = setInterval(function(){
                i++;
                if (counter < i) {
                    clearInterval(timer);
                }
                avater.go();
            }, 1000);
            break;
        case "TUN"://执行一次转向操作
            var i = 1;
            timer = setInterval(function(){
                i++;
                if (counter < i) {
                    clearInterval(timer);
                }
                avater.turn(cmd.dir);
            }, 1000);
            break;
        case "TRA"://执行steps次平移操作
            var i = 1;
            timer = setInterval(function(){
                i++;
                if (counter < i) {
                    clearInterval(timer);
                }
                avater.tra(cmd.dir);
            }, 1000);
            break;
        case "MOV"://先执行一次转向操作，再执行steps次前进操作
            setTimeout(function(){
                avater.turn(cmd.dir);
                var i = 1;
                timer = setInterval(function(){
                    i++;
                    if (counter < i) {
                        clearInterval(timer);
                    }
                    avater.go();
                }, 1000);
            },1000);
            break;
        default:
            break;
    }
}

//执行多条命令
function execCommands(cmds, counter){
    execCommand(cmds[counter]);
    if (counter+1 < cmds.length){
        if (cmds[counter].type == "MOV"){//由于mov命令转向操作未算进steps里面，所以要续一秒~~
            setTimeout(function(){
                execCommands(cmds, counter+1)
            },(cmds[counter].steps+1)*1000);
        }else{
            setTimeout(function(){
                execCommands(cmds, counter+1)
            },cmds[counter].steps*1000);
        }
    }


}

//显示错误行号
function showColor(i, err){
    //alert("A err in line "+i);
    if (i==0){
        err?$("#line1").css("background-color","yellow"):$("#line1").css("background-color","#333");
    }else{
        $("#cmd div")[i-1].classList.toggle('test-yellow', err);
    }
}
var lock = false;
$(function () {
    $("#line1").click(function () {
        document.getElementsByClassName("cmd")[0].scrollTop = 0;
    });
    $("#cmd").keyup(function(e){
        //var n = getLineNum();
        //if (lineNum != n){
        //    generateCommands();
        //    lineNum = n;
        //}
        //if (e.keyCode == 13){
        //    generateCommands();
        //    execCommands(commands, 0);//从第0条开始执行
        //}
        generateCommands();//这样效率会很低。。。但是看起来很顺眼啊~~实时报错
    })
    $("#exec").click(function(){
        if(generateCommands()){
            if (!lock){
                lock = true;
                execCommands(commands, 0);//从第0条开始执行
                lock = false;
            }

        }
    });
    $("#reset").click(function(){
        $("#cmd").html("");
    });
});