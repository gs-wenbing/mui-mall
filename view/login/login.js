mui.init();
mui.plusReady(function() {

	var _submit = document.querySelector('.btn-submit');
	//监听点击事件
	_submit.addEventListener("tap", function() {
		var that = this;
		isLogout = true;
		var self = plus.webview.currentWebview();
		login(self, that)
	});
})

mui.back = function back() {
	var self = plus.webview.currentWebview();
	if (self.isLogoutOpr == 1) {
		var setting = plus.webview.getWebviewById("setting.html");
		if (setting) {
			plus.webview.close(setting, "none");
		}
		var home = plus.webview.getWebviewById('home.html');
		if(home){
			mui.fire(home, 'refrash_homeData');
		}
		var my = plus.webview.getWebviewById('my.html');
		if(my){
			mui.fire(my, 'refresh_my');
		}
		var cart = plus.webview.getWebviewById('cart.html');
		if(cart){
			mui.fire(cart, 'loadData');
		}
	}
	self.close();
	return true;
}

var LoginInfo = new Vue({
	el: ".mui-content",
	data: {
		LoginName: "15221355690",
		Password: "123456",
		isRemember: true,
	},
	created: function() {
		//记住密码
		if (StorageAPI.getStorage('isRemember') == 1) {
			this.LoginName = StorageAPI.getStorage("LoginName");
			this.Password = StorageAPI.getStorage("Password");
		}
	}
})

function login(self, that) {
	if (!LoginInfo.LoginName) {
		mui.toast("请输入手机号码");
		return false;
	}
	if (!LoginInfo.Password) {
		mui.toast("请输入密码");
		return false;
	}
	mui(that).button('loading');
	//模拟登陆
	var t1 = window.setTimeout(function(){
		mui(that).button('reset');
		document.activeElement.blur(); //隐藏软键盘  
		StorageAPI.setStorage("user-test", userInfoByCache);
		//记住密码
		if (LoginInfo.isRemember) {
			StorageAPI.setStorage("isRemember", 1);
			StorageAPI.setStorage("LoginName", LoginInfo.LoginName);
			StorageAPI.setStorage("Password", LoginInfo.Password);
		} else {
			StorageAPI.setStorage("isRemember", 0);
			var storage = window.localStorage;
			storage.removeItem('LoginName');
			storage.removeItem('Password');
		}
		var setting = plus.webview.getWebviewById("setting.html");
		if (setting) {
			plus.webview.close(setting, "none");
		}
		var home = plus.webview.getWebviewById('home.html');
		if(home){
			mui.fire(home, 'refrash_homeData');
		}
		
		var my = plus.webview.getWebviewById('my.html');
		if(my){
			mui.fire(my, 'refresh_my');
		}
		var cart = plus.webview.getWebviewById('cart.html');
		if(cart){
			mui.fire(cart, 'loadData');
		}
		
		var login = plus.webview.getWebviewById("login.html");
		if (login) {
			plus.webview.close(login, "none");
		}
	}, 1000);
}
