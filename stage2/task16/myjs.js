/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var cityName = $.trim($("#aqi-city-input").val());
	var aqiValue = $.trim($("#aqi-value-input").val());
	if (-1==cityName.search(/^(\w|[\u4e00-\u9fa5])+$/)) {
		alert("城市名称必须为中英文字符");
		$("#aqi-city-input").val("");
		return;
	}
	if (-1==aqiValue.search(/^\d+$/)) {
		alert("空气质量必须为整数");
		$("#aqi-value-input").val("");
		return;
	}
	aqiData[cityName]=aqiValue;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	$("#aqi-table").html("");
	if(Object.getOwnPropertyNames(aqiData).length==0)//获取对象的属性个数
		return;
	$("#aqi-table").append("<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>");
	for(var e in aqiData){
		// 虽然在此作用域中e有效，但是将字符串添加到html中之后e变量就无效了，所以就需要先将e取值，再用引号包起来
		$("#aqi-table").append("<tr><td>"+e+"</td><td>"+aqiData[e]+"</td><td><button onclick='delBtnHandle(\""+e+"\")'>删除</button></td></tr>");
	}
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
	addAqiData();
	renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
	// do sth.
	delete aqiData[e];
	renderAqiList();
}

function init() {

	// 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
	$("#add-btn").bind("click", addBtnHandle);
	// 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数

}
$(function(){
	init();
});