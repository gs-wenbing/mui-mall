var orderDetail = new Vue({
	el: '#app',
	data: {
		order: {},
		items: [], //列表信息流数据
	},
	computed: {
		PayStatusClass:function(){
				//支付状态: 0：未收款 1：部分收款 2：已收款 ,
				if(this.order.PayStatus==0){
					return "icon-m-e1";
				}else if(this.order.PayStatus==1){
					return "icon-m-a1";
				}else if(this.order.PayStatus==2){
					return "icon-m-k1";
				}else{
					return "icon-m-e1";
				}
		},
		PayStatusName:function(){
				//支付状态: 0：未收款 1：部分收款 2：已收款 ,
				if(this.order.PayStatus==0){
					return "未付款";
				}else if(this.order.PayStatus==1){
					return "部分付款";
				}else if(this.order.PayStatus==2){
					return "已付款";
				}else{
					return "";
				}
		}
	},
	methods: {
		//取消订单
		cancelOrder: function() {
			mui('#btn-select').popover('hide');
			mui.toast("取消成功！");
		},
		//确认收货
		confirmReceive: function() {
			mui.toast("确认收货");
		},
		//立即付款
		pay: function() {
			var extras = {
				OrderID: this.order.OrderID,
			}
			createWindow("../pay/payment.html", "payment.html",  extras);
		},
		close:function() {
			$('#btn-select').removeClass('mui-active');
			$('.mui-backdrop').remove();
		},
	}
});
mui.plusReady(function() {
	getOrderDetail();
	showWindow();
})


function getOrderDetail() {
	setTimeout(function() {
		var data = orderDetailByCache;
		var totalSalePrice = 0;
		data.OrderDetailList.forEach(function(item) {
			totalSalePrice += (item.SalePrice * item.Amount);
		});
		orderDetail.order = data.Order;
		orderDetail.order.totalSalePrice = totalSalePrice;
		orderDetail.items = data.OrderDetailList;
	}, 500);
}

function updateOrderList(){
	var opener = plus.webview.getWebviewById("MyOrderList.html");
	mui.fire(opener,"refrash");
}

window.addEventListener('refrash', function(e) {
	updateOrderList();
	getOrderDetail();
})
