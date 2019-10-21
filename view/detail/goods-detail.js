(function($) {
	$.init({
		beforeback: function() {
			//设置系统状态栏样式 (可选值:dark,light,UIStatusBarStyleDefault,UIStatusBarStyleBlackOpaque)
			plus.navigator.setStatusBarStyle('UIStatusBarStyleDefault');
			return true;
		},
	});
})(mui)
function showWindow() {
	var currentView = plus.webview.currentWebview();
	currentView.show('slide-in-right', 300);
	plus.nativeUI.closeWaiting();
}
mui.plusReady(function() {
	showWindow();
	getGoodsDetail();
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		var index = this.getAttribute('data-index');
		if (index == 0 || index == 2) {
			gotoHome(index);
		} else if (index == 3) {
			mui.toast("已收藏");
		} else if (index == 4) {
			AddShoppingCar();
		} else if (index == 5) {
			openWindow("../settlement/settlement.html","settlement.html",{});
		}
	});
	mui.previewImage();
});
Vue.use(VueLazyload, {
	preLoad: 1.3,
	error: '../../img/goods-default.gif',
	loading: '../../img/goods-default.gif',
	attempt: 1
})
var goodsDetail = new Vue({
	el: '#goodsDetail',
	data: {
		Goods: {},
		GoodsSkuList: [],
		GetGoodsPicURL: [],
		GoodsUnitTemplateList: [],
		selectSku: {}, //选中属性对象的商品sku
		selectUnitTemplate: {}, //选中包装规格
		inputNum: 1,
		cartNum: 6,
	},
	methods: {
		toShopping: function(PromotionID) {
			var extras = {
				GoodsClassID: "",
				type: "Ip",
				keyWords: "",
				PmID: PromotionID,
			}
			openWindow("second-classfy.html", "second-classfy.html", extras)
		}
	}
});
/**
 * 商品详情数据
 */
function getGoodsDetail() {
	var self = plus.webview.currentWebview();
	var goodsId = self.goodsId;
	console.log("goodsId:::::::::::" + goodsId);
	window.setTimeout(function() {
		var data = detail;
		//描述图片信息
		var GoodsDesc = decodeURIComponent(data.Goods.GoodsDesc);
		// console.log(GoodsDesc);
		GoodsDesc = GoodsDesc.replace(new RegExp("{IMGIP}", 'g'), "res.genvana.cn");

		var htmlDOM = parseDom("<div>" + GoodsDesc + "</div>")
		var imgs = htmlDOM[0].getElementsByTagName('img');
		mui.each(imgs, function(i, img) {
			img.setAttribute("data-preview-src", "");
			img.setAttribute("data-preview-group", "2");
		})
		data.Goods.GoodsDesc = nodeToString(htmlDOM[0]);

		goodsDetail.Goods = data.Goods;
		goodsDetail.GoodsSkuList = data.GoodsSku;
		goodsDetail.GoodsUnitTemplateList = data.GoodsUnitTemplateList;
		goodsDetail.GetGoodsPicURL = data.GetGoodsPicURL;

		goodsDetail.$nextTick(function() {
			mui(".mui-slider").slider({
				interval: 5000, //如果你想自动3000ms滑动一下就写上这个。 
			});
			//设置状态栏的背景颜色
			// plus.navigator.setStatusBarBackground('#262630');
			//设置系统状态栏样式 (可选值:dark,light,UIStatusBarStyleDefault,UIStatusBarStyleBlackOpaque)
			plus.navigator.setStatusBarStyle('dark');
		})
	}, 500);
}



//添加购物车
function AddShoppingCar() {
	goodsDetail.cartNum++;
	mui.toast("已添加，请到购物车查看");
}

function gotoHome(index) {
	if (index == 2) {
		var taskList = plus.webview.getWebviewById('cart.html');
		mui.fire(taskList, 'loadData');
	}
	var search = plus.webview.getWebviewById('search.html');
	if (search) {
		plus.webview.close(search, "none");
	}
	var main = plus.webview.getLaunchWebview();
	mui.fire(main, 'refresh', {
		index: index
	});
	mui.back();
}

var scrollTimeout = null;
var scrollendDelay = 1500; // ms
$(document).ready(function() {
	var p = 0,
		t = 0;
	$(window).scroll(function() {
		p = $(this).scrollTop();
		if (t != p) {
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop > 44) {
				//设置系统状态栏样式 (可选值:dark,light,UIStatusBarStyleDefault,UIStatusBarStyleBlackOpaque)
				plus.navigator.setStatusBarStyle('UIStatusBarStyleDefault');
			} else {
				//设置系统状态栏样式 (可选值:dark,light,UIStatusBarStyleDefault,UIStatusBarStyleBlackOpaque)
				plus.navigator.setStatusBarStyle('dark');
			}
		}
		setTimeout(function() {
			t = p;
		}, 0)
	})
})

/**
 * 属性
 */
$('.block-attr__body').on('click', '.inline-attr__val', function() {
	if ($(this).hasClass('active')) return false;
	$('.inline-attr__val').removeClass('active');
	$(this).addClass('active');
})
/**
 * 包装
 */
$('.block-attr__body').on('click', '.inline-pack__val', function() {
	if ($(this).hasClass('active')) return false;
	$('.inline-pack__val').removeClass('active');
	$(this).addClass('active');
})
