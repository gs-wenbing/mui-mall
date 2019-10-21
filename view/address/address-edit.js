(function($, doc) {
	mui.init();
	$.plusReady(function() {
		if (mui.os.android) {
			var height = (plus.display.resolutionHeight+0.5) + "px";
			plus.webview.currentWebview().setStyle({
				height: height
			});
		}
		
		var self = plus.webview.currentWebview();
		editAddress.RecieveAddress = self.editAddress;
		console.log(JSON.stringify(editAddress.RecieveAddress))
		var _getParam = function(obj, param) {
			return obj[param] || '';
		};
		var cityPicker = new $.PopPicker({
			layer: 3
		});
		cityPicker.setData(cityData);
		if(editAddress.RecieveAddress){
			// 设定省初始值  
			cityPicker.pickers[0].setSelectedValue(editAddress.RecieveAddress.RecieverProvinceID, 0, function() {
				// 设定市初始值  
				cityPicker.pickers[1].setSelectedValue(editAddress.RecieveAddress.RecieverCityID, 0, function() {
					// 设定区初始值  
					cityPicker.pickers[2].setSelectedValue(editAddress.RecieveAddress.RecieverCountyID);
				});
			});
		}
		var showCityPicker = doc.getElementById('showCityPicker');

		showCityPicker.addEventListener('tap', function(event) {
			document.activeElement.blur(); //隐藏软键盘  
			cityPicker.show(function(items) {
				showCityPicker.value = _getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " + _getParam(
					items[2], 'text');
				showCityPicker.setAttribute("data-provinceID", _getParam(items[0], 'value'));
				showCityPicker.setAttribute("data-cityID", _getParam(items[1], 'value'));
				showCityPicker.setAttribute("data-countyID", _getParam(items[2], 'value'));
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
		}, false);
		editAddress.$nextTick(function(){
		})
	})
})(mui, document);

var editAddress = new Vue({
	el: "#app",
	data: {
		RecieveAddress: {},
		title: "编辑收货地址",
	},
	methods:{
		saveAddressData:function() {
			mui.toast(editAddress.RecieveAddress != null ? "修改成功" : "新增成功");
		}
	}
})

