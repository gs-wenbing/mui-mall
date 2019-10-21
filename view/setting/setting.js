mui.init();

mui.plusReady(function() {
	userInfo.user = getUser();
	
	//主列表点击事件
	mui('.mui-scroll').on('tap', 'a', function() {
		var href = this.getAttribute('href');
		
		if(href == "phone.html"){
			var phone = "021-56559797-298";
			var btnArray=['取消','拨打'];
			mui.confirm('是否拨打 '+phone+' ?',' ',btnArray,function(e){
			    if(e.index == 1){
			        plus.device.dial(phone,false);
			    }
			},"div");
			return;
		}
		
		//非plus环境，直接走href跳转
		if (!mui.os.plus) {
			location.href = href;
			return;
		}
		var id = this.getAttribute("data-wid");
		if (!id) {
			id = href;
		}
		var title = this.getAttribute("title");
		if (href && ~href.indexOf('.html')) {
			var extras = {
				Status: ""
			}
			if (userInfo.user) {
				//打开新窗口
				if(href.indexOf("address")>0){
					openWindowWithTitle(href, id,title, extras)
				}else{
					openWindowWithTitle(href, id,title, null)
				}
			} else {
				var islogin = this.getAttribute("data-login");
				if (islogin == 1) {
					goLogin("../login/login.html", "home.html", "home.html", "", null)
				} else {
					openWindowWithTitle(href, id,title, null)
				}
			}
		}
	});
});

 
var userInfo = new Vue({
	el: ".mui-fullscreen",
	data: {
		user: {},
	},
	methods:{
		logout:function() {
			if (!window.localStorage) {
				alert("浏览器支持localstorage");
			} else {
				var storage = window.localStorage;
				
				storage.removeItem('user-test');
				var params = {
					isLogoutOpr: 1
				}
				openWindow("../login/login.html", "login.html", params)
			}
		}
	}
})