var myarr=[];

function render(){
	$(".result").html("");
	for (var i = 0; i < myarr.length; i++) {
		$(".result").append("<div>"+myarr[i]+"</div>");
	}
}
function getNum(){
	var num=$(".num").val();
	if (-1==num.search(/^[1-9]\d*$/)) {
		alert("必须为整数");
		$(".num").val("");
		return "err";
	}
	return num;
}

$(function(){
	$(".left-in").bind("click",function(){
		var num=getNum();
		if (num=="err") {
			return;
		}
		myarr.splice(0,0,num);
		render();
	});
	$(".right-in").bind("click",function(){
		var num=getNum();
		if (num=="err") {
			return;
		}
		myarr.push(num);
		render();
	});
	$(".left-out").bind("click",function(){
		var num=getNum();
		if (num=="err") {
			return;
		}
		myarr.splice(0,1);
		render();
	});
	$(".right-out").bind("click",function(){
		var num=getNum();
		if (num=="err") {
			return;
		}
		myarr.pop();
		render();
	});
});