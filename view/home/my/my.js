mui.init();

var userInfo = new Vue({
	el: "#app",
	data: {
		user: getUser()
	},
	methods: {
		/**
		 * 跳转到设置页面
		 */
		toSetting:function(){
			openWindow("../../setting/setting.html", "setting.html", "账户设置", null);
		},
		/**
		 * 未登录时去登录
		 */
		login: function() {
			openWindow("../../login/login.html", "home.html", "home.html", null)
		},
		/**
		 * 跳转到订单
		 * @param {Object} status 订单状态
		 */
		toOrder: function(status) {
			var extras = {
				Status: status
			}
			if (!this.user) {
				goLogin("../../login/login.html", "", "", extras)
				return false;
			}
			openWindow("../../order/order-list.html", "order-list.html", extras);
		},
		/**
		 * @param {Object} href
		 * @param {Object} title
		 */
		toFunction: function(href, title) {
			var extras = {
				Status: ""
			}
			if (!this.user) {
				goLogin("../../login/login.html", href, id, extras)
				return false;
			}
			mui.toast("跳转...")
		},
		/**
		 * 打电话
		 * @param {Object} phone
		 */
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
window.addEventListener('refresh_my', function(e) { //执行刷新
	userInfo.user = {};
	userInfo.user = getUser();
});