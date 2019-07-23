mui.init({
	pullRefresh: {
		container: '.mui-content',
		down: {
			style: 'circle',
			offset: '10px',
			range: '64px',
			auto: false,
			callback: pulldownRefresh
		},
		up: {
			auto: false, //可选,默认false.自动上拉加载一次
			contentrefresh: '正在加载...',
			contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
			callback: pullupLoading
		}
	}
});
mui(".mui-slider").slider({
	interval: 4000, //自动轮播周期，若为0则不自动播放，默认为0；
	scrollTime: 500
});
var mallGoods = new Vue({
	el: '.bg-gray',
	data: {
		items: [],
		user: getUser()
	},
	computed: {
		BarBackground: function() {
			return function(index) {
				var iii = index % 4;
				if (iii == 1) {
					return "background-color:#019DE6";
				} else if (iii == 2) {
					return "background-color:#C08EF0";
				} else if (iii == 3) {
					return "background-color:#6CE50D";
				} else {
					return "background-color:#E60012";
				}
			}
		},
	},
	methods: {
		gotoGoodsClass: function(ParantClassID, GoodsClassID, type) {
			document.activeElement.blur(); //隐藏软键盘  
			if (type && !this.user) {
				goLogin("../login/login2.html", "", "", null)
				return false;
			}
			var keyWords = mui("#search-input")[0].value;
			var extras = {
				ParantClassID: ParantClassID,
				GoodsClassID: GoodsClassID,
				type: type,
				keyWords: keyWords
			}
			createWindow("second-classfy.html", "second-classfy.html", extras)
			mui("#search-input")[0].value = "";
		},

		gotoGoodsDetail: function(goodsId) {
			createGoodsDetail(goodsId);
		},
		scanCode: function() {
			createWithoutTitle('barcode_custom.html', {
				titleNView: {
					type: 'transparent',
					titleText: '扫一扫',
					autoBackButton: true,
					buttons: [{
						fontSrc: '_www/helloh5.ttf',
						text: '\ue401',
						fontSize: '18px',
						onclick: 'javascript:switchFlash()'
					}]
				}
			});
		},
		onInput: function() {
			if (mui.os.ios) {
				//禁止页面滚动
				scrollTo(0,0);
				document.body.addEventListener('touchmove', event_f, { passive: false });
			}
			$("#search-input").focus(); 
		},
		
	}
});
var event_f = function(e){e.preventDefault();}
$(document).on('focusin', function () {
　　//软键盘弹出的事件处理
});
$(document).on('focusout', function () {
　　//软键盘收起的事件处理
	//删除 禁止页面滚动
	document.body.removeEventListener('touchmove', event_f, { passive: false });
});


window.addEventListener('refrash_homeData', function(e) { //执行刷新
	GetMallGoodsList();
});

mui.plusReady(function() {
	plus.screen.lockOrientation("portrait-primary"); 
	
	var topoffset = '45px';
	var header = document.getElementById('header');
	if (plus.navigator.isImmersedStatusbar()) {
		// 兼容immersed状态栏模式 // 获取状态栏高度并根据业务需求处理，这里重新计算了子窗口的偏移位置 
		topoffset = (Math.round(plus.navigator.getStatusbarHeight()) + 45);
		header.style.height = topoffset + 'px';
		header.style.paddingTop = (topoffset - 45) + 'px';
	}
	GetMallGoodsList();

	var search = document.getElementById("search-input");
	//监听input框键盘事件
	search.addEventListener("keypress", function(e) {
		//当e.keyCode的值为13 即，点击前往/搜索 按键时执行以下操作
		if (e.keyCode == 13) {
			e.preventDefault();
			document.activeElement.blur(); //隐藏软键盘  
			var t1 = window.setTimeout(function() {
				mallGoods.gotoGoodsClass('', '', '');
			}, 500);
		}
	});
})



function pulldownRefresh() {
	classIndex = 0;
	goodsGroupIndex = 0
	var t1 = window.setTimeout(function(){
		mallGoods.items=[];
		convertMallData(homeGoodsList, classList[0]);
		mui(".mui-content").pullRefresh().endPulldownToRefresh();
		classIndex++;
	}, 1000);
}

//加载更多，以分类为页数
function pullupLoading() {
	//首页显示5个分类 
	if (classIndex==5 || classList.length == classIndex) {
		mui('.mui-content').pullRefresh().disablePullupToRefresh();
		return false;
	}
	var t1 = window.setTimeout(function(){
		convertMallData(homeGoodsList, classList[classIndex]);
		mui('.mui-content').pullRefresh().endPullupToRefresh();
		classIndex++;
	}, 1000);
}


function GetMallGoodsList() {
	var wd = plus.nativeUI.showWaiting();
	var t1 = window.setTimeout(function(){
		convertMallData(homeGoodsList, classList[0]);
		wd.close();
		classIndex++;
	}, 1000);
}

//显示数据的索引 不同于classIndex，goodsGroupIndex小于等于classIndex，因为分类里面的商品会为空
var goodsGroupIndex = 0
//分类的索引
var classIndex = 0;

function convertMallData(goodsList, classInfo) {
	mallGoods.items.push({
		GoodsClassID: classInfo != null ? classInfo.GoodsClassID : "",
		GoodsClassName: classInfo != null ? classInfo.GoodsClassName : "",
		MallGoodsList1: [],
		MallGoodsList2: []
	});
	mui.each(goodsList, function(index, item) {
		if (index < 2) {
			mallGoods.items[goodsGroupIndex].MallGoodsList1.push(item);
		} else {
			//  if (index < 15)
			mallGoods.items[goodsGroupIndex].MallGoodsList2.push(item);
		}
	})
	goodsGroupIndex++;
}


