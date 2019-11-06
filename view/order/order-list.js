
mui.init({
	beforeback: function() {
		if($('#btn-open').hasClass('show')){
			var t1 = window.setTimeout(function(){
				var btn = document.getElementById("btn-open");
				mui.trigger(btn, 'tap');
			}, 100); 
			return false;
		}else {
			return true;
		}
	},
});
var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset, generatedCount = 0;
mui.plusReady(function() {
	//动画部分
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = document.getElementById('pullUp');
	pullUpOffset = pullUpEl.offsetHeight;
	myScroll = new iScroll('wrapper', {
		useTransition: true,
		topOffset: pullDownOffset,
		scrollbarClass: 'myScrollbar',
		hScrollbar: false,
		vScroll: true,
		hideScrollbar: false ,//是否隐藏滚动条  
		onRefresh: function() {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';
			} else if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
			}
		},
		onScrollMove: function() {
			document.activeElement.blur(); //隐藏软键盘  
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
				this.minScrollY = -pullDownOffset;
			} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新';
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
				this.maxScrollY = pullUpOffset;
			}
		},
		onScrollEnd: function() {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = ''; //加载中
				pullAction(0);
			} else if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = ''; //加载中
				pullAction(1);
			}
		}
	});
	var self = plus.webview.currentWebview();
	orderInfo.Status = self.Status;
	loadAction();
})

var PageIndex = 0;
var PageSize = 10;

/**
 * 第一次加载数据，View还没有初始化
 * 参数是从上个页面带过来的
 */
function loadAction() {
	
	setTimeout(function() {
		var data = orderListByCache[0];
		orderInfo.orderList = data;
		PageIndex++;
		
		if(orderInfo.orderList.length==0){
			pullUpEl.style.display="none"
		}else{
			pullUpEl.style.display="block"
		}
		if (data.length < PageSize) {
			pullUpEl.style.display="none"
		}
		
		orderInfo.$nextTick(function() {
			myScroll.refresh();
			init();
		})
		
	}, 500);
}
//加载类型0=下拉刷新 1=上拉加载
function pullAction(pullType) {
	if(pullType==0){
		PageIndex = 0;
	}else{
		if(pullUpEl.style.display=="none"){
			return false;
		}
	}
	if(PageIndex===orderListByCache.length){
		pullUpEl.style.display="none"
		return false;
	}
	setTimeout(function() {
		var data = orderListByCache[PageIndex];
		if (pullType == 0) {
			orderInfo.orderList = data;
		} else {
			orderInfo.orderList = orderInfo.orderList.concat(data);
		}
		PageIndex++;
		if(orderInfo.orderList.length==0){
			pullUpEl.style.display="none"
		}else{
			pullUpEl.style.display="block"
		}
		if (data.length < PageSize) {
			pullUpEl.style.display="none"
		}
		orderInfo.$nextTick(function() {
			myScroll.refresh();
		})
		
	}, 500);
}
var orderInfo = new Vue({
	el: '#app',
	data: {
		orderList: [],
		Status: "",
		OrderID: ""
	},
	computed:{
		//根据状态返回样式名称（订单状态 0 已提交 10商家已受理 20部分已发货 30 已发货 40已收货 50交易完成 60交易关闭）
        getStyleByStatus:function() {
			return function(status){
				 switch (status) {
				    case 0:
				        return "badge-lightYellow";
				    case 10:
				    case 20:
				    case 30:
				    case 40:
				        return "badge-lightGreen";
				    case 50:
				        return "badge-lightPurple";
				    default:
				        return "badge-lightGray";
				}
			}
        }
	},
	methods: {
		toOrderDetail: function(OrderID) {
			var extras = {
				OrderID: OrderID
			}
			UIAPI.openWindowWithTitle("order-detail.html", "order-detail.html","订单详情", extras)
		},

		toPayment: function(OrderID) {
			var extras = {
				OrderID: OrderID,
			}
			UIAPI.openWindow("../pay/payment.html", "payment.html",  extras);
		},

		showCancleBox: function(OrderID) {
			orderInfo.OrderID = OrderID;
			mui('#btn-select').popover('show');
		},
		//取消订单
		cancelOrder: function() {
			mui('#btn-select').popover('hide');
			mui.toast("取消成功！");
		},
		close:function() {
			$('#btn-select').removeClass('mui-active');
			$('.mui-backdrop').remove();
		}
	}
});
var event_f = function(e){e.preventDefault();}
function init() {
	//监听箭头点击事件弹出分类面板
	$('#btn-open').on('tap', function() {
		if (!$(this).hasClass('show')) {
			var top_value = $(document).scrollTop()||document.documentElement.scrollTop || document.body.scrollTop;
			$('.collapse-panel-1').css("margin-top",top_value+20);
			
			$(this).addClass('show'); //改变按钮状态
			$('.collapse-panel-1').addClass('show'); //改变面板状态
			$('.btn-open-icon').addClass('reverse'); //改变按钮图标位置
			$('<div class="collapse-fixed collapse-fixed-1"></div>').appendTo('body'); //添加遮罩层
			//禁止页面滚动
			document.body.addEventListener('touchmove', event_f, { passive: false });
		} else {
			$(this).removeClass('show'); //改变按钮状态
			$('.collapse-panel-1').removeClass('show'); //改变面板状态
			$('.btn-open-icon').removeClass('reverse'); //改变按钮图标位置
			$('.collapse-fixed-1').remove();
			//删除 禁止页面滚动
			document.body.removeEventListener('touchmove', event_f, { passive: false });
		}
	})
	$('body').on('tap', '.collapse-fixed-1', function() {
		$('#btn-open').removeClass('show'); //改变按钮状态
		$('.collapse-panel-1').removeClass('show'); //改变面板状态
		$('.btn-open-icon').removeClass('reverse'); //改变按钮图标位置
		$(this).remove();
		document.body.removeEventListener('touchmove', event_f, { passive: false });
		document.activeElement.blur(); //隐藏软键盘  
	})

	// 监听订单状态分类面板 按钮选择事件
	$('.collapse-panel__body').each(function(index, el) {
		$(el).on('tap', '.btns-item', function() {
			scrollTo(0,0);
			var top_value = $(document).scrollTop()||document.documentElement.scrollTop || document.body.scrollTop;
			console.log(top_value);
			$('.collapse-panel-1').css("margin-top",top_value+20);
			
			if (!$(this).hasClass('active')) {
				$(el).find('.btns-item.active').removeClass('active');
				$(this).addClass('active');
			} else {
				$(this).removeClass('active');
			}
			$('.order-nav-item.active').removeClass('active');
			pullAction(0);
			// closePop();
		})
	})

	// 监听分类导航栏目选中事件
	$('.order-nav').on('tap', '.order-nav-item', function() {
		if (!$(this).hasClass('active') && !$(this).hasClass('btn-open')) {
			$('.order-nav-item.active').removeClass('active');
			$(this).addClass('active');
			//弹出层 设置非选中
			$('.collapse-panel__body').each(function(index, el) {
				$(el).find('.btns-item.active').removeClass('active');
			})
			pullAction(0);
			closePop();
		}
	})
	//监听单选框状态变化
	$('input[name="reason-radio"]').on('change', function () {
		if ($(this).val() == "2"){
			$("#cancelReason").css("width","6.83rem");
			$("#cancelReason").show();
		}else{
			$("#cancelReason").css("width","6.83rem");
			$("#cancelReason").hide();
		}
	})
	window.addEventListener('tap', function(e) {
		 e.target.className == 'mui-backdrop mui-active' && e.stopPropagation();
    },true);
};

function closePop(){
	if($('#btn-open').hasClass('show')){
		var t1 = window.setTimeout(function(){
			var btn = document.getElementById("btn-open");
			mui.trigger(btn, 'tap');
		}, 500); 
		// window.clearTimeout(t1); //去掉定时器 
	}
}

window.addEventListener('refrash', function(e) {
	orderInfo.orderList = [];
	pullAction(0);
})
