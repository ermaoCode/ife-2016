var myarr=[];
function sleep(numberMillis) {
	var now = new Date();
	var exitTime = now.getTime() + numberMillis;
	while (true) {
		now = new Date();
		if (now.getTime() > exitTime)
			return;
	}
}
function render(){
	$(".result").html("");
	for (var i = 0; i < myarr.length; i++) {
		$(".result").append("<div><div style ='height:"+myarr[i]+"px'></div>");
	}
	// sleep(100);这个不知道怎么实现啊
}
function getNum(){
	var num=$(".num").val();
	if (-1==num.search(/^[1-9]\d*$/)||num>100||num<10) {
		alert("必须为10-100之间的整数");
		$(".num").val("");
		return "err";
	}
	return num;
}
function exchange(a,b){
	var c=myarr[a];
	myarr[a]=myarr[b];
	myarr[b]=c;
	render();
}
function quickSort(start,end){
	var a=start;
	var b=end;
	var key=a;
	if (a>=b) {
		return;
	}
	while(b>a){
		while(myarr[b]>=myarr[key])
			b--;
		if (b<a) break;
		exchange(b,key);
		key=b;
		while(myarr[a]<=myarr[key])
			a++;
		if (b<a) break;
		exchange(a,key);
		key=a;
	}
	quickSort(start,key-1);
	quickSort(key+1,end);
}

$(function(){
	myarr=[12,52,56,87,15,34,26,58];
	render();
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
	$(".sort").bind("click",function(){
		quickSort(0,myarr.length-1);
	});
});