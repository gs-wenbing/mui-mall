var main, menu, mask = mui.createMask(_closeMenu);
var showMenu = false;
mui.init({
	swipeBack: false,
	beforeback: back,
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

function back() {
	if (showMenu) {
		//菜单处于显示状态，返回键应该先关闭菜单,阻止主窗口执行mui.back逻辑；
		closeMenu();
		return false;
	} else {
		//菜单处于隐藏状态，执行返回时，要先close菜单页面，然后继续执行mui.back逻辑关闭主窗口；
		menu.close('none');
		return true;
	}
}

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
	
	//plusReady事件后，自动创建menu窗口；
	main = plus.webview.currentWebview();
	//setTimeout的目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅；
	setTimeout(function() {
		menu = mui.preload({
			id: 'class-menu',
			url: 'class-menu.html',
			styles: {
				left: "20%",
				width: '80%',
				zindex: 9997
			}
		});
	}, 500);
	//加载数据
	pulldownRefresh();
	GoodsSearch.$nextTick(function() {
		showWindow();
	})
});

var pageIndex =0;
var pageSize = 10;
/**
 * 下拉刷新
 */
function pulldownRefresh() {
	pageIndex = 0;
	$(".underline").css('display', 'none');
	if(mui('.mui-content').pullRefresh()){
		mui('.mui-content').pullRefresh().enablePullupToRefresh();
	}
	window.setTimeout(function() {
		GoodsSearch.MallGoodsList = goodsList[pageIndex];
		if(mui('.mui-content').pullRefresh()){
			mui(".mui-content").pullRefresh().endPulldownToRefresh();
		}
		pageIndex++;
	}, 500);
}
/**
 * 上拉加载更多
 */
function pullupLoading(){
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
	el: '#app',
	data: {
		MallGoodsList: []
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
			filterGoods();
		},
		gotoGoodsDetail: function(goodsId) {
			createGoodsDetail(goodsId);
		}
	}
});
/**
 * 筛选商品
 */
function filterGoods(){
	//模拟
	var wd = plus.nativeUI.showWaiting();
	window.setTimeout(function() {
		wd.close();
	}, 1000);
}

/*
 * 显示菜单菜单
 */
function openMenu() {
	if (!showMenu) {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if (mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "static";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "0px";
		}
		//侧滑菜单处于隐藏状态，则立即显示出来；
		//显示完毕后，根据不同动画效果移动窗体；
		menu.show('none', 0, function() {
			menu.setStyle({
				left: '20%',
				transition: {
					duration: 150
				}
			});
		});
		//显示主窗体遮罩
		mask.show();
		showMenu = true;
	}
}

function closeMenu(e) {
	//窗体移动
	_closeMenu(e);
	//关闭遮罩
	mask.close();
}

/**
 * 关闭侧滑菜单(业务部分)
 */
function _closeMenu(e) {
	if (showMenu) {
		//解决android 4.4以下版本webview移动时，导致fixed定位元素错乱的bug;
		if (mui.os.android && parseFloat(mui.os.version) < 4.4) {
			document.querySelector("header.mui-bar").style.position = "fixed";
			//同时需要修改以下.mui-contnt的padding-top，否则会多出空白；
			document.querySelector(".mui-bar-nav~.mui-content").style.paddingTop = "44px";
		}
		//主窗体开始侧滑；
		menu.setStyle({
			left: '100%',
			transition: {
				duration: 150
			}
		});
		//等窗体动画结束后，隐藏菜单webview，节省资源；
		setTimeout(function() {
			menu.hide();
		}, 300);
		showMenu = false;
		//接受选择参数
		if(e && e.detail){
			//价格、品牌、类型、分类
			console.log(JSON.stringify(e.detail));
			//筛选
			filterGoods();
		}
	}
}
document.getElementById("show-btn").addEventListener('tap', openMenu);
//关闭菜单；
window.addEventListener("menu:swiperight", closeMenu);

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
