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


mui.plusReady(function() {
	if (isIPhoneX()) {
		IPhoneXCSS();
	}else{
		// 66px=44+22:   (标题栏高度+状态栏高度)
		$(".classfy").css("top","66px");
		$(".classfy").css("height","46px");
		// 112 = 44+46+22  (标题栏高度+标题栏下方的tab高度+状态栏高度)
		$(".mui-content").css("padding-top","112px !important");
	}
	if (mui.os.android) {
		var height = (plus.display.resolutionHeight+0.5) + "px";
		plus.webview.currentWebview().setStyle({
			height: height
		});
	}
	var self = plus.webview.currentWebview();
	var keyWords = self.keyWords;
	pulldownRefresh();
	GoodsSearch.$nextTick(function() {
		showWindow();
		// mui('#offCanvasContentScroll').scroll().scrollTo(0, 0, 100);
	})
});

var pageIndex =0;
var pageSize = 10;
//下拉刷新
function pulldownRefresh() {
	pageIndex = 0;
	$(".underline").css('display', 'none');
	if(mui('.mui-content').pullRefresh()){
		mui('.mui-content').pullRefresh().enablePullupToRefresh();
	}
	window.setTimeout(function() {
		GoodsSearch.MallGoodsList = goodsList[pageIndex];
		// GoodsSearch.BrandList = data.BrandList;
		GoodsSearch.ClassList = classList;
		mui(".mui-content").pullRefresh().endPulldownToRefresh();
		pageIndex++;
		console.log(pageIndex+"===");
	}, 500);
}
//上拉加载更多
function pullupLoading(){
	console.log(pageIndex+"==="+goodsList.length);
	if(pageIndex===goodsList.length){
		return false;
	}
	window.setTimeout(function() {
		//模拟加载数据
		var list = goodsList[pageIndex];
		if (list.length<pageSize) {
			$(".underline").css('display', 'block');
			mui('.mui-content').pullRefresh().disablePullupToRefresh();
		}else{
			$(".underline").css('display', 'none');
		}
		GoodsSearch.MallGoodsList = GoodsSearch.MallGoodsList.concat(list);
		mui('.mui-content').pullRefresh().endPullupToRefresh();
		pageIndex++;
	}, 500);
}
var GoodsSearch = new Vue({
	el: '.mui-content',
	data: {
		MallGoodsList: [],
		BrandList: [],
		ClassList: [],
	},
	computed: {
		classObject: function(index) {
			return function(index) {
				if (this.MallGoodsList[index].IsPromotion == 1) { //促销
					return "icon-tag-cuxiao";
				} else if (this.MallGoodsList[index].IsUnmarketable == 1) { //清仓
					return "icon-tag-qingcang";
				} else if (this.MallGoodsList[index].IsHot == 1) { //热销
					return "icon-tag-hot";
				} else if (this.MallGoodsList[index].IsNew == 1) { //新品
					return "icon-tag-new";
				} else {
					return "";
				}
			}
		}
	},
	methods: {
		//关键字搜索
		searchKey: function() {
			search();
		},
		//重置
		reSetSearch: function() {
			$(".mui-selected").removeClass("mui-selected");
			$(".btns-item").removeClass("active");
			$('.widget-body__offCanvasSide1').html('');
			$('.widget-body__offCanvasSide2').html('');
			document.activeElement.blur(); //隐藏软键盘  
		},
		//确定
		queRsearch: function() {
			document.activeElement.blur(); //隐藏软键盘  
			mui('#offCanvasWrapper').offCanvas('close');
			search();
		},
		gotoGoodsDetail: function(goodsId) {
			createGoodsDetail(goodsId);
		}
	}
});

function search() {
	pageIndex = 1;
	getMallGoodsList();
}


function IPhoneXCSS(){
	if(plus.navigator.isImmersedStatusbar() && isIPhoneX()){
	    //.mui-bar-nav
	    var nav = document.querySelector(".header-boxz");
	    if(nav){
	        nav.style.cssText="height:88px; padding-top: 44px;";
	    } else {
	        return;
	    }
		//.mui-bar-nav ~ .classfy
		var classfy = document.querySelector(".classfy");
		if (classfy) {
		    // classfy.style.top = "88px";
			classfy.style.cssText="top:88px;height: 46px;";
		} else {
		    return;
		}
	    //.mui-bar-nav ~ .mui-content
	    var content = document.querySelector(".mui-content");
	    if (content) {
	        content.style.paddingTop = "134px";
	    } else {
	        return;
	    }
	}
}
