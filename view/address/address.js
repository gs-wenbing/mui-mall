
mui.init()
mui.plusReady(function() {
	GetReceAddressList();
});
window.addEventListener('loadData', function(e) { //执行刷新
	GetReceAddressList();
});

//获取地址列表
function GetReceAddressList() {
	setTimeout(function() {
		var data = addressByCache;
		RecieveAddress.RecieveAddressList = data.RecieveAddressList;
		RecieveAddress.$nextTick(function(){
			showWindow();
			mui('.mui-scroll-wrapper').scroll();
		})
	}, 500);
}
var RecieveAddress = new Vue({
	el: ".mui-page-content",
	data: {
		RecieveAddressList: []
	},
	methods: {
		/**
		 * 订单里面选择收货地址
		 * @param {Object} index
		 */
		selectResAddress: function(index) {
			var self = plus.webview.currentWebview();
			if (self.selectOneAddress) {
				var settlement = plus.webview.getWebviewById('settlement.html');
				if(settlement){
					mui.fire(settlement, 'initAddress', {
						address: RecieveAddress.RecieveAddressList[index]
					});
				}
				mui.back();
			}
		},
		
		addNewAdress: function(){
			var param = {
				title: "新增收货地址"
			}
			createWindowWithTitle("address-edit.html", "address-edit.html","新增收货地址");
		},
		editAddress: function(index){
			var param = {
				editAddress: RecieveAddress.RecieveAddressList[index],
				title: "编辑收货地址"
			}
			createWindowWithTitle("address-edit.html", "address-edit.html","编辑收货地址", param);
		},
		deleteAddress: function(RecieveAddressID){
			var btnArray = ['否', '是'];
			mui.confirm('确定把该地址删除？', '', btnArray, function(e) {
				if (e.index == 1) {
					mui.toast("删除成功");
				}
			})
		},
		setDefault: function(address,i){
			var k = 0
			$("input[name='checkbox']").each(function() {
				this.checked = false;
				if(i==k){
					this.checked = true;
				}
				k++;
			});
			
			if(address.IsDefault == 1){
				return false;
			}
			mui.each(this.RecieveAddressList,function(index,item){
				item.IsDefault = 0;
				if(item.RecieveAddressID==address.RecieveAddressID){
					item.IsDefault = 1;
					mui.toast("设置成功");
				}
			})
		}
	}
})
/**
 * 重写back
 */
mui.back = function() {
	//判断是否需要选择收货地址
	var self = plus.webview.currentWebview();
	if (self.selectOneAddress) {
		if (RecieveAddress.RecieveAddressList.length == 0) {
			var settlement = plus.webview.getWebviewById('settlement.html');
			if(settlement){
				mui.fire(settlement, 'initAddress', {
					address: null
				});
			}
		}
	}
	self.close();
	//返回true,继续页面关闭逻辑
	return true;
};
