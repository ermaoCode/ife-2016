/**
 * getData方法
 * 读取id为source的列表，获取其中城市名字及城市对应的空气质量
 * 返回一个数组，格式见函数中示例
 */
function getData() {
	/*
	data = [
	  ["北京", 90],
	  ["北京", 90]
	  ……
	]
	*/
	var data = [];
	$("#source li").each(function(index) {
		data[index]=[];//需要先声明为数组
		data[index].push($(this).text().match(/.*(?=空气)/)[0]);
		data[index].push($(this).children("b").text());
	});
	// str.match(/.*(?=空气)/) 这样可以匹配城市名
	return data;
}
/**
 * sortAqiData
 * 按空气质量对data进行从小到大的排序
 * 返回一个排序后的数组
 */
function sortAqiData(data) {
	return data.sort(function(a, b){
		return b[1]-a[1];//a-b就是升序
	});
}
// *****************
// 以下为将数字转换为中文的函数。。。懒得自己写了
function transferNum(num) {
        var input = String(num);
        var unit = ["", "十", "百", "千", "万", "十万", "百万", "千万"];
        var chineseNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        var l = input.length;
        var a = new Array(l);
        var b = new Array(l);
        var result = "";
        for (var i = 0; i < l; i++) {
            a[i] = input.substr(i, 1);
            b[i] = chineseNum[a[i]];
            result += b[i] + unit[l - i - 1];
        }
        return result;
    }

/**
 * render
 * 将排好序的城市及空气质量指数，输出显示到id位resort的列表中
 * 格式见ul中的注释的部分
 */
function render(data) {
	for (var i = 0; i < data.length; i++) {
		$("#resort").append("<li>第"+transferNum(i+1)+"名"+data[i][0]+"的空气质量为"+data[i][1]);//计数器看书上
	}
	
}

function btnHandle() {
	var aqiData = getData();
	aqiData = sortAqiData(aqiData);
	render(aqiData);
}


function init() {
	// 在这下面给sort-btn绑定一个点击事件，点击时触发btnHandle函数
	$("#sort-btn").one("click", btnHandle);//one就是只会响应一次的bind
}
$(function(){
	init();
});
