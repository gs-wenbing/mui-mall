## 首先说明一下项目结构：
![image](https://github.com/ButBueatiful/dotvim/raw/master/screenshots/vim-screenshot.jpg)
* img目录存放静态图片
* data目录存放模拟的数据
* js目录存放公用的js工具
* view目录存放html页面
* index.html 首页，也是启动页面，启动页可以在manifest.json中配置
* manifest.json APP的配置信息，具体怎么配置的参照http://ask.dcloud.net.cn/article/94

## 首页底部的Tab
html页面<br>
```
<nav class="mui-bar mui-bar-tab footerBar">
	<a id="defaultTab" class="mui-tab-item ft-tab-item mui-active" href="home.html">
		<span class=" mui-icon iconfont icon-m-ao"></span>
		<span class="mui-tab-label">首页</span>
	</a>
	<a id="tab1" class="mui-tab-item ft-tab-item" href="classify.html">
		<span class="mui-icon iconfont icon-m-am"></span>
		<span class="mui-tab-label">分类</span>
	</a>
	<a id="tab2" class="mui-tab-item ft-tab-item" href="cart.html">
		<span class="mui-icon iconfont icon-m-y"></span>
		<span class="mui-tab-label">购物车</span>
	</a>
	<a id="tab3" class="mui-tab-item ft-tab-item" href="my.html">
		<span class="mui-icon iconfont icon-m-aq"></span>
		<span class="mui-tab-label">我的</span>
	</a>
</nav>
```
js代码
```
//底部选项卡切换跳转
(function jumpPage() {
	//跳转页面
	var subpages = ['view/home/home.html', 'view/home/classify.html', 'view/home/cart.html', 'view/home/my.html'];
	var ids = ['home.html', 'classify.html', 'cart.html', 'my.html'];
	var aniShow = {};
	//创建子页面，首个选项卡页面显示，其它均隐藏；
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary"); 
		var subpage_style = {
			top: '0px',
			bottom: '51px'
		};
		//设置bottom绝对位置
		//iphoneX中出现遮挡底部tab现象,采用js判断屏幕大小方式改变bottom值
		//isIPhoneX() 要在plusReady后调用
		if (isIPhoneX()) {
			subpage_style = {
				top: '0px',
				bottom: '88px', //34px
				styles: {
					"render": "always",
				}
			};
		}
		var self = plus.webview.currentWebview();
		for (var i = 0; i < 4; i++) {
			var temp = {};
			var sub = plus.webview.create(subpages[i], ids[i], subpage_style);
			if (i > 0) {
				sub.hide();
			} else {
				temp[ids[i]] = "true";
				mui.extend(aniShow, temp);
			}
			self.append(sub);
		}
	});
	//当前激活选项
	var activeTab = ids[0];

	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		e.preventDefault();
		var targetTab = this.getAttribute('href');
		if (targetTab == activeTab) {
			return;
		}
		//显示目标选项卡
		//若为iOS平台或非首次显示，则直接显示
		if (mui.os.ios || aniShow[targetTab]) {
			plus.webview.show(targetTab);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetTab] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetTab, "fade-in", 300);
		}
		//隐藏当前;
		plus.webview.hide(activeTab);
		//更改当前活跃的选项卡
		activeTab = targetTab;
	});
})()

```
注意iphoneX中出现遮挡底部tab现象,采用js判断屏幕大小方式改变bottom值，isIPhoneX()，isIPhoneX() 要在plusReady后调用。


