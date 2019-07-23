mui.init();
mui.plusReady(function() {
	//点击设置
	mui(".personalCenter-header").on('tap', '.btn-set', function() {
		createWindow("../setting/setting.html", "setting.html", "账户设置", null);
	})
	//全部订单
	mui(".my-order").on('tap', 'a', function() {
		var extras = {
			Status: ""
		}
		if (userInfo.isLogin==false) {
			goLogin("../login/login2.html", "../order/MyOrderList.html", "MyOrderList.html",  extras)
			return false;
		}
		createWindow("../order/MyOrderList.html", "MyOrderList.html", extras)
	})
	//点击我的订单
	mui('.my-order').on('tap', '.link-item', function(e) {
		var status = this.getAttribute('data-status');
		var extras = {
			Status: status
		}
		if (userInfo.isLogin==false) {
			goLogin("../login/login2.html", "../order/MyOrderList.html", "MyOrderList.html", extras)
			return false;
		}
		if (status != 100) {
			createWindow("../order/MyOrderList.html", "MyOrderList.html", extras);
		} else {
			createWindow("../order/refund.apply.list.html", "refund.apply.list.html", extras);
		}
	});
	//点击我的工具
	mui('.my-tools').on('tap', '.link-item', function(e) {
		var id = this.getAttribute('data-id');
		var href = this.getAttribute('herf');
		var title = this.getAttribute("data-title");

		if (href && ~href.indexOf('.html')) {
			var extras = {
				Status: ""
			}
			if (userInfo.isLogin==false) {
				goLogin("../login/login2.html", href, id, title, extras)
				return false;
			}
			createWindow(href, id, title, extras);
		}
	});
});

var userInfo = new Vue({
	el: "#app",
	data: {
		URL_PIC: URL_PIC,
		userAcount: {},
		user: {},
		isLogin: false
	},
	methods: {
		login: function() {
			goLogin("../login/login2.html", "home.html", "home.html", null)
		},
		goFunction: function(href, title) {
			var extras = {
				Status: ""
			}
			if (this.isLogin==false) {
				goLogin("../login/login2.html", href, id, extras)
				return false;
			}
			var hrefArr = href.split("/");
			if(href.indexOf("goodsprice.index")>0){
				createWindowWithTitle("../mytools/" + href, hrefArr[hrefArr.length - 1],"客户商品价格管理", extras)
			}else{
				createWindow("../mytools/" + href, hrefArr[hrefArr.length - 1], extras);
			}
		},
		applyAgent: function() {
			createWindowWithTitle('apply.agent.html', 'apply.agent.html',"申请代理",  {})
		},
		updatePsd: function() {
			createWindowWithTitle('../setting/resetLoginPwd.html', 'resetLoginPwd.html',"重置登录密码",  {})
		},
		dial: function(phone) {
			if(!phone){
				mui.toast("电话号码不能为空")
				return false;
			}
			var btnArray=['取消','拨打'];
            mui.confirm('是否拨打 '+phone+' ?',' ',btnArray,function(e){
                if(e.index == 1){
                    plus.device.dial(phone,false);
                }
            },"div");
		}
	}
})
