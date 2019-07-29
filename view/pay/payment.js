//支付的URL
var ALIPAYSERVER='http://demo.dcloud.net.cn/helloh5/payment/alipay.php?total=';    
var WXPAYSERVER='http://demo.dcloud.net.cn/helloh5/payment/wxpay.php?total=';      
var wxChannel = null; // 微信支付  
var aliChannel = null; // 支付宝支付  
var channel = null; //支付通道 
var isPaySuccess = false;
(function($) {
	$.init();

	mui.back = function() {
		if (!isPaySuccess) {
			var btnArray = ['取消', '确定'];
			mui.confirm('确定要离开暂不支付订单吗？', ' ', btnArray, function(e) {
				if (e.index == 1) {
					//购物车 确认订单
					var SettlementCarGoods = plus.webview.getWebviewById("SettlementCarGoods.html");
					if (SettlementCarGoods) {
						plus.webview.close(SettlementCarGoods, "none");
					}
					//建议订单 确认订单
					var suggestOrderSubmit = plus.webview.getWebviewById("suggest.order.submit.html");
					if (suggestOrderSubmit) {
						plus.webview.close(suggestOrderSubmit, "none");
					}
					var self = plus.webview.currentWebview();
					self.close();
				}
			},"div")
		} else {
			var self = plus.webview.currentWebview();
			self.close();
		}
	};

})(mui)
// 所有方法都放到这里
mui.plusReady(function() {
	initEvent();
	plus.payment.getChannels(function(channels) {
		for (var i in channels) {
			if (channels[i].id == "wxpay") {
				wxChannel = channels[i];
			} else {
				aliChannel = channels[i];
			}
		}
	}, function(e) {
		alert("获取支付通道失败：" + e.message);
	});
	GoodsPayment();
	showWindow();
})

function initEvent() {
	// 监听“支付方式”单选框状态变化
	$('input[name="radio-pay"]').on('change', function() {
		var label = $('input[name="radio-pay"]:checked').prev();
		if ($(label).attr('data-pay') === 'pay-yue') {
			$('#btn-confirmPay').attr('href', '#confirmPay')
		} else if ($(label).attr('data-pay') === 'pay-weixin') {
			$('#btn-confirmPay').removeAttr('href')
		} else if ($(label).attr('data-pay') === 'pay-zhifubao') {
			$('#btn-confirmPay').removeAttr('href')
		}
	})
	$("body").on('tap', '#btn-confirmPay', function(event) {
		document.activeElement.blur();
		//判断输入金额
		var payMoney = $("#payMoney")[0].value;
		if (!payMoney || payMoney <= 0) {
			mui.toast("请输入支付金额");
			return false;
		}
		if (parseFloat(payMoney) > orderDetail.Order.payMoney) {
			mui.toast("支付金额不能大于未付款金额");
			return false;
		}
		//判断选择的支付方式
		var id = $("input[name='radio-pay']:checked").attr("data-id");
		if (!id) {
			mui.toast("请选择支付方式");
		} else {
			if (payMoney <= 0) {
				mui.toast("支付金额必须大于0");
				return false;
			}
			if(id=="yue"){
				if (orderDetail.AcountBalance.AcountBalance < payMoney) {
					mui.toast("账户余额不足");
					return false;
				}
				//余额支付
				if(!orderDetail.AcountBalance.HasPassword){
					var btnArray = ['否', '是'];
					mui.confirm('还没有支付密码，是否去设置？', ' ', btnArray, function(e) {
						if (e.index == 1) {
							openWindow("../setting/setPayPwd.html","setPayPwd.html",{});
						} 
					},"div")
					return false;
				}
			}else{
				ThirdPay(payMoney, id)
			}
		}
	}).on('tap', '.forgetPwd', function(event) {
		openWindow("../setting/setPayPwd.html","setPayPwd.html",{});
	});
	//支付弹出层关闭按钮事件
	$('.icon-close').on('click', function() {
		$('#confirmPay').removeClass('mui-active');
		$('.mui-backdrop').remove();
		var inputItem = $('.input-item');
		for (var i = 0; i < inputItem.length; i++) {
			$(inputItem[i]).val('');
		}
		arr = [];
		num = 0;
	})

	var arr = [];
	var num = 0;

	//响应键盘事件
	$('.key-item').on('touchstart', function() {
		$(this).addClass('selected')
	})
	$('.key-item').on('touchend', function() {
		$(this).removeClass('selected')
	})
	//输入密码
	$('.key-item').on('tap', function() {
		var value = $(this).text();
		var inputItem = $('.input-item');
		if (!$(this).hasClass('remove')) {
			if (num < 6) {
				$(inputItem[num]).val(value);
				if (num == 5) {
					var arr = [];
					for (var i = 0; i < inputItem.length; i++) {
						arr.push(inputItem[i].value)
					}
					arr = parseInt(arr.join(''));
					// $(".icon-close").trigger("click");
					payOrder(arr);
					num++;
					return false;
				}
				num++;
			}
		} else {
			if (num > 0) {
				num--;
				$(inputItem[num]).val('');
			}
		}
	})
}

function GoodsPayment() {
	var self = plus.webview.currentWebview();
	var OrderID = self.OrderID;
	//获取数据
}
var orderDetail = new Vue({
	el: '.mui-content',
	data: {
		Order: {
			OrderNo:"20193884958800001",
			TotalAmount:"23.78",
			payMoney:"12.45",
		},
		TotalMoney:0,
		AcountBalance: {
			AcountBalance:100,
			HasPassword:true
		},
		user: getUser(),
	},
	methods:{
		goXianxiaPay:function(){
			var self = plus.webview.currentWebview();
			var param = {
				PayAmount:$("#payMoney")[0].value,
				OrderID:orderDetail.Order.OrderID,
				isInvoice:self.isInvoice
			}
			createWindow("OfflineSelectAccount.html", "OfflineSelectAccount.html", param)
		}
	}
});
//产生随机数函数
function RndNum(n) {
	var rnd = "";
	for (var i = 0; i < n; i++)
		rnd += Math.floor(Math.random() * 10);
	return rnd;
}

//三方支付
function ThirdPay(payMoney, id) {
	
	// 从服务器请求支付订单  
	var PAYSERVER = '';
	if (id == 'alipay') {
		PAYSERVER = ALIPAYSERVER;
		channel = aliChannel;
	} else if (id == 'wxpay') {
		PAYSERVER = WXPAYSERVER;
		channel = wxChannel;
	} else {
		plus.nativeUI.alert("不支持此支付通道！", null, "捐赠");
		return;
	}
	var xhr = new XMLHttpRequest();
	var amount = 0.01;
	xhr.onreadystatechange = function() {
		switch (xhr.readyState) {
			case 4:
				if (xhr.status == 200) {
					//支付
					plus.payment.request(channel, xhr.responseText, function(result) {
						console.log(JSON.stringify(result));
						isPaySuccess = true;
						var param = {
							OrderID: orderDetail.Order.OrderID,
							isSuccess: 1,
						}
						openWindow("pay-success.html", "pay-success.html", param);
					}, function(error) {
						mui.alert('支付失败', ' ', function() {},"div");
					});
				} else {
					mui.alert('获取订单信息失败！', ' ', function() {},"div");
				}
				break;
			default:
				break;
		}
	}
	xhr.open('GET', PAYSERVER + amount);
	xhr.send();
}


//余额支付
function payOrder(psd) {
	var param = {};
	var balanceAmout = orderDetail.AcountBalance.AcountBalance;
	param.PayAmount = $("#payMoney")[0].value;;
	console.log(JSON.stringify(param));
	if (parseFloat(param.PayAmount) <= 0) {
		mui.toast("支付金额必须大于0");
		return false;
	}

	if (parseFloat(balanceAmout) < parseFloat(param.PayAmount)) {
		mui.toast("账户余额不足");
		return false;
	}

	if (param.PayPassword == "") {
		mui.toast("请输入密码");
		return false;
	}
	var param = {
		OrderID: orderDetail.Order.OrderID,
		isSuccess: 1,
	}
	openWindow("pay-success.html", "pay-success.html", param)
}
