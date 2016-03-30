/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData;

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState ;

/**
 * 渲染图表
 */
function renderChart() {
    $(".aqi-chart-wrap").html("");
    var weekcounter = 0;
    var weektotal = 0;

    var lastmonth = 1; 
    var thismonth = 0;
    var monthtotal = 0;

    var dat = new Date("2016-01-01");
    var datStr = '';
    datStr = getDateStr(dat);
    while (aqiSourceData[pageState['nowSelectCity']].hasOwnProperty(datStr)) {
        switch (pageState['nowGraTime']) {
            case "day":
            $(".aqi-chart-wrap").append("<div class='day'><div class='gra' style='height:"+aqiSourceData[pageState['nowSelectCity']][datStr]+"px' title='"+aqiSourceData[pageState['nowSelectCity']][datStr]+"'></div></div>");
                break;
            case "week":
            weektotal+=aqiSourceData[pageState['nowSelectCity']][datStr];
            if (weekcounter==6) {
                weektotal=Math.ceil(weektotal/7);
                $(".aqi-chart-wrap").append("<div class='week'><div class='gra' style='height:"+weektotal+"px' title='"+weektotal+"'></div></div>");
                weektotal=0;
                weekcounter=0;
            }else
                weekcounter++;
                break;
            case "month":
            thismonth=dat.getMonth() + 1;
            if (thismonth==lastmonth) {
                monthtotal+=aqiSourceData[pageState['nowSelectCity']][datStr];
            }else{
                lastmonth=thismonth;
                var yesterday=new Date();//此处不知道能不能
                yesterday.setDate(dat.getDate()-1);
                var days=yesterday.getDate();//上个月有多少天
                monthtotal=Math.ceil(monthtotal/days);
                $(".aqi-chart-wrap").append("<div class='month'><div class='gra' style='height:"+monthtotal+"px' title='"+monthtotal+"'></div></div>");
                monthtotal=0;
            }
                break;
        }
        dat.setDate(dat.getDate() + 1);
        datStr = getDateStr(dat);
    }
    //如果是周或者月的话，就会剩余一点没有画出来，需要在这里补上去
    if (pageState['nowGraTime']!="day") {
        if (pageState['nowGraTime']=="week") {
            weektotal = Math.ceil(weektotal / weekcounter);
            $(".aqi-chart-wrap").append("<div class='week'><div class='gra' style='height:" + weektotal + "px' title='"+weektotal+"'></div></div>");
        }
        if (pageState['nowGraTime']=="month") {
            var yesterday = new Date();
            yesterday.setDate(dat.getDate() - 1);
            var days = yesterday.getDate(); //本月已过多少天
            monthtotal = Math.ceil(monthtotal / days);
            $(".aqi-chart-wrap").append("<div class='month'><div class='gra' style='height:" + monthtotal + "px' title='"+monthtotal+"'></div></div>");
        }
    }

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化 
    if (pageState['nowGraTime']==$("input[type='radio']:checked").val()) 
        return;
    // 设置对应数据
    pageState['nowGraTime']=$("input[type='radio']:checked").val();
    // 调用图表渲染函数
    renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化 
    if (pageState['nowSelectCity']==$("select").val()) 
        return;
    // 设置对应数据
    pageState['nowSelectCity']=$("select").val();
    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    $("#form-gra-time input[name=gra-time]").bind('click', graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    for (var city in aqiSourceData) {
        $("#city-select").append("<option>"+city+"</option>");
    }
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    $("#city-select").change(citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
}
$(function(){
    aqiSourceData = {
        "北京": randomBuildData(500),
        "上海": randomBuildData(300),
        "广州": randomBuildData(200),
        "深圳": randomBuildData(100),
        "成都": randomBuildData(300),
        "西安": randomBuildData(500),
        "福州": randomBuildData(100),
        "厦门": randomBuildData(100),
        "沈阳": randomBuildData(500)
    };
    pageState = {
        nowSelectCity: -1,
        nowGraTime: "day"
    };
    init();
    pageState['nowSelectCity']=$("select").val();
    renderChart();
});