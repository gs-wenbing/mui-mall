mui.plusReady(function() {
	var search = document.getElementById("search");
	//监听input框键盘事件
	search.addEventListener("keypress", function(e) {
		//当e.keyCode的值为13 即，点击前往/搜索 按键时执行以下操作
		if (e.keyCode == 13) {
			document.activeElement.blur(); //隐藏软键盘  
			var t1 = window.setTimeout(function() {
				classInfo.gotoGoodsClass('')
			}, 500); //使用字符串执行方法
		}
	});
	var classInfo = new Vue({
		el: "#app",
		data: {
			GoodsClassList: [],
			URL_PIC: URL_PIC,
			searchString: "",
		},
		computed: {
			mui_col_xs: function() {
				if (os.isTablet) {
					return "mui-col-xs-2";
				} else {
					return "mui-col-xs-4";
				}
			},
		},
		created: function() {
			this.GoodsClassList = classList;
			var newslist = document.getElementsByClassName('mui-slider-item');
			window.addEventListener('newsCallBack', function(event) {
				var cnt = event.detail.cnt; //从父页面获得需要切换到的选项内容的标签  
				//尝试通过css来进行控制->结果失败……  
				$(".mui-slider-item").removeClass('mui-active');
				newslist[cnt].className = "mui-slider-item mui-control-content mui-active";
			});
		},
		methods: {
			gotoGoodsClass: function(GoodsClassID) {
				document.activeElement.blur(); //隐藏软键盘  
				var extras = {
					GoodsClassID: GoodsClassID,
					type: "",
					keyWords: this.searchString
				}
				createWindow("second-classfy.html", "second-classfy.html", extras);
				this.searchString = "";
			},
			swichTab: function(index) {
				mui('#slider').slider().gotoItem(index);
			},
			hideUnVisibleData: function(list) {
				var $that = this;
				mui.each(list, function(index, item) {
					if (item.IsVisible == 0) {
						$that.GoodsClassList.push(item);
					}
				})
			}
		}

	})
	classInfo.$nextTick(function() {
		//阻尼系数
		var deceleration = mui.os.ios ? 0.003 : 0.0009;
		mui('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true, //是否显示滚动条
			deceleration: deceleration
		});
	})

})

var os = function() {
	var ua = navigator.userAgent,
		isWindowsPhone = /(?:Windows Phone)/.test(ua),
		isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
		isAndroid = /(?:Android)/.test(ua),
		isFireFox = /(?:Firefox)/.test(ua),
		isChrome = /(?:Chrome|CriOS)/.test(ua),
		isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(
			ua)),
		isPhone = /(?:iPhone)/.test(ua) && !isTablet,
		isPc = !isPhone && !isAndroid && !isSymbian;
	return {
		isTablet: isTablet,
		isPhone: isPhone,
		isAndroid: isAndroid,
		isPc: isPc
	};
}();

function toFeedbook() {
	createWindowWithTitle('../setting/feedback.html', 'feedback.html',"建议反馈",  {})
}
