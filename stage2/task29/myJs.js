/**
 * Created by 建瓴 on 2016/4/24.
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

function checkLength(str){
    var length = 0;
    for (var i=0; i<str.length; i++){
        var codeNum = str.charCodeAt(i);
        if (codeNum>=0&&codeNum<=128)
            length ++;
        else
            length += 2;
    }
    return length;
}

window.onload = function(){
    Util.addHandle($("button"), "click", function(){
        var input = $("input");
        var value = input.value;
        var result = document.getElementById("validateResult");
        if (value == ""){
            result.innerText = "姓名不能为空";
            result.style.color = "red";
            return;
        }
        //if (value.match(/^(\w|\d){4,16}$/))
        if (checkLength(value)>=4&&checkLength(value)<=16){
            result.innerText = "校验成功";
            result.style.color = "green";
        }else{
            result.innerText = "格式错误";
            result.style.color = "red";
        }
    });
}