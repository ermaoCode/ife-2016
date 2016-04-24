/**
 * Created by 建瓴 on 2016/4/17.
 */

$ = function(s) {return document.querySelector(s);};
var Util = {
    addHandle: function(element, type, handler) {
        //跨浏览器实现event对象
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
}

//渲染时间间隔
var interval = 100;
var Pi = 3.14;

/*
    render 函数用于绘制当前飞船位置
 */
function render(){
    for (var i=0; i<4; i++){
        var obj = document.getElementById("rail"+i);
        if (space.rail[i].ship == null){
            obj.style.transform = "rotate(0deg)";
            obj.style.display = "none";
            continue;
        }else if (obj.style.display == "none"){
            obj.style.display = "block";
        }
        var strValue = "rotate("+space.rail[i].ship.position+"deg)";
        obj.style.transform=strValue;
        obj.style.WebkitTransform=strValue;
        document.getElementById("power"+i).innerText = space.rail[i].ship.power;
        //obj.style.MozTransform=strValue;
        //obj.style.OTransform=strValue;
        //obj.style.msTransform=strValue;
    }
}
//飞船对象
function Spaceship(radius){
    //飞行速度
    this.speed = 20;
    //相对于起点旋转的角度
    this.position = 0;
    this.radius = radius;

    this.power = 100;
    this.chargeSpeed = 2;//充电速率
    this.burnRate = 5;//功率

    this.isFlying = false;

    this.startFlying = function(){
        this.isFlying = true;
    },
    this.stopFlying = function(){
        this.isFlying = false;
    },
    this.charge = function(time){
        this.power += time/1000*this.chargeSpeed;
        if (this.power > 100)
            this.power = 100;
    },
    this.fly = function(time){
        this.position += time*this.speed*360/(1000*2*Pi*this.radius);
        this.power -= time/1000*this.burnRate;
        if (this.power < 0 ){
            this.power = 0;
            this.stopFlying();
        }
    }

}
//轨道对象
function Rail(radius){
    this.ship = null;
    this.radius = radius;
    this.launchShip = function(){
        this.ship = new Spaceship(this.radius);
        this.ship.isFlying = true;
    };
    this.destroyShip = function(){
        this.ship = null;
    };
    this.startFlying = function(){
        this.ship.startFlying();
    };
    this.stopFlying = function(){
        this.ship.stopFlying();
    };
}


var space = {
    rail: [],
    init: function(){
        for(var i=0; i<4; i++){
            this.rail[i] = new Rail(i*55+115);
        }
    }
}

function Command(str){
    //正确的str 应该是 LAUNCH 1 格式的
    this.err = 0;
    this.res = str.split(" ");
    if (this.res.length != 2)
        this.err = "too many/less parameters, please use command like CREATE/DESTROY/LAUNCH/STOP 0/1/2/3";
    else if (this.res[0]!="LAUNCH"&&this.res[0]!="DESTROY"&&this.res[0]!="CREATE"&&this.res[0]!="STOP")
        this.err = "unkown parameter " + this.res[0];
    else if (this.res[1]!="1"&&this.res[1]!="2"&&this.res[1]!="3"&&this.res[1]!="0")
            this.err = "no spaceship named " + this.res[1];
}

var console = {
    showMessage: function(str){
        $("#console-text").innerHTML += "<br>"+str;
    },
    exec: function(command){//此处功能分块做的不是很好，也许语法错误在这里检查比较好
        switch(command.res[0]){
            case "CREATE":
                if (space.rail[command.res[1]].ship != null){
                    return this.showMessage("this ship is already exist");
                }
                this.showMessage("CREATE ship succeed");
                space.rail[command.res[1]].launchShip();
                break;
            case "DESTROY":
                if (space.rail[command.res[1]].ship == null){
                    return this.showMessage("this ship isn't exist");
                }
                this.showMessage("DESTROY ship succeed");
                space.rail[command.res[1]].destroyShip();
                break;
            case "LAUNCH":
                if (space.rail[command.res[1]].ship == null){
                    return this.showMessage("this ship isn't exist");
                }
                if (space.rail[command.res[1]].ship.isFlying){
                    return this.showMessage("this ship was flying");
                }
                this.showMessage("LAUNCH ship succeed");
                space.rail[command.res[1]].startFlying();
                break;
            case "STOP":
                if (space.rail[command.res[1]].ship == null){
                    return this.showMessage("this ship isn't exist");
                }
                if (!space.rail[command.res[1]].ship.isFlying){
                    return this.showMessage("this ship was stop");
                }
                this.showMessage("STOP ship succeed");
                space.rail[command.res[1]].stopFlying();
                break;
            default:
                return this.showMessage("unknow mistake!");
        }
    },
    sendCommand: function(str){
        var command = new Command(str);
        if (command.err!=0)
            return this.showMessage(command.err);
        //模拟30%的丢包率
        if (Math.random() < 0.3)
            setTimeout(function(){console.showMessage("command lost")}, 1000);
        else
            setTimeout(function(){console.exec(command)}, 1000);
    },

    init: function(){
        Util.addHandle($("#send"), "click", function(){
            console.sendCommand($("#cmd").value);
        });
        Util.addHandle($("#cmd"), "keydown", function(e){
            if(e.keyCode==13)
                console.sendCommand($("#cmd").value);
        });
    }
}
//
window.onload = function(){
    space.init();
    console.init();
    var timer = setInterval(function(){
        //充电
        for(var i in space.rail){
            if (space.rail[i].ship != null){
                space.rail[i].ship.charge(interval);
                if ( space.rail[i].ship.isFlying){
                    space.rail[i].ship.fly(interval);
                }
            }
        }
        render();
    },interval)

}