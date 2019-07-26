mui.init()
mui.plusReady(function() {
	getSettlementInfo();
});
var payOrder = new Vue({
	el: "#el-box",
	data: {
		URL_PIC: URL_PIC,
		RecieveAddress: null,
		GoodsList: [],
		AmountInfo: {
			CouponAmount: 0,
			CouponName: "",
			Description: "",
			CouponOrderAmount: 0,
			GoodsCuXiaoYouHui:0,
			GoodsTotalAmount: 0,
		},
		IsCoupon: true,
		user: getUser(),
		TotalAmount: 0,
	},
	methods: {
		/**
		 * 提交订单
		 */
		submit: function() {
			if (!payOrder.RecieveAddress.RecieveAddressID || payOrder.RecieveAddress.RecieveAddressID == 0) {
				mui.toast("请添加或选择收货地址！");
				return false;
			}
			createWindow("../pay/payment.html","payment.html",{});
		},
		gotoAddressManage: function() {
			//去选择收货地址
			var param = {
				selectOneAddress: true
			}
			createWindowWithTitle("../address/address.html", "address.html","地址管理", param);
		}
	}

});
function getSettlementInfo() {
	
	window.setTimeout(function() {
		var data = settelementDataByCache;
		mui.each(data.RecieveAddressList, function(index, address) {
			//取默认地址，如果没有默认地址就取第一条地址
			if (index == 0) {
				payOrder.RecieveAddress = address;
			}
			if (address.IsDefault == 1) {
				payOrder.RecieveAddress = address;
			}
		})
		
		payOrder.AmountInfo.CouponAmount = data.CouponAmount;
		payOrder.AmountInfo.CouponName = data.CouponName;
		payOrder.AmountInfo.Description = data.Description;
		payOrder.AmountInfo.GoodsCuXiaoYouHui = data.GoodsCuXiaoYouHui;
		payOrder.AmountInfo.CouponOrderAmount = data.CouponOrderAmount;
		payOrder.AmountInfo.GoodsTotalAmount = data.GoodsTotalAmount;
		
		payOrder.GoodsList = data.GoodsList;
		showWindow();
		payOrder.$nextTick(function() { //渲染完成后触发事件
		
			var height = $("#adress-detail").height();
			$(window).scroll(function() {
				if ($(window).scrollTop() >= height) {
					$("#address").show();
				} else {
					$("#address").hide();
				}
			})
		});
	}, 500);
}


var RecieveAddressID = "";

//执行刷新
window.addEventListener('initAddress', function(e) {
	payOrder.RecieveAddress = e.detail.address;
	if(payOrder.RecieveAddress){
		$(".mui-content").css("padding-bottom","100px !important");
	}else{
		$(".mui-content").css("padding-bottom","60px !important");
	}
});

