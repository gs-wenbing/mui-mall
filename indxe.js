mui.init();
var firsts = null;
mui.back = function back() {
	//首次按键，提示‘再按一次退出应用’
	if (!firsts) {
		firsts = new Date().getTime();
		plus.nativeUI.toast('再按一次退出应用');
		setTimeout(function() {
			firsts = null;
		}, 2000);
	} else {
		if (new Date().getTime() - firsts < 1000) {
			plus.runtime.quit();
		}
	}
}

window.addEventListener('refresh', function(e) { //执行刷新
	console.log(e.detail.index)
	var btn = null;
	if (e.detail.index == 1) {
		btn = document.getElementById("tab1");
	} else if (e.detail.index == 2) {
		btn = document.getElementById("tab2");
	} else if (e.detail.index == 3) {
		btn = document.getElementById("tab3");
	} else {
		btn = document.getElementById("defaultTab");
	}
	mui.trigger(btn, 'tap');
	//切换选项卡高亮
	var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
	if (btn != current) {
		current.classList.remove('mui-active');
		btn.classList.add('mui-active');
	}
});

//底部选项卡切换跳转
(function jumpPage() {
	//跳转页面
	var subpages = ['view/home/main/home.html', 'view/home/classify/classify.html', 'view/home/cart/cart.html', 'view/home/my/my.html'];
	var ids = ['home.html', 'classify.html', 'cart.html', 'my.html'];
	var aniShow = {};
	//当前激活选项
	var activeTab = ids[0];
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
				bottom: '88px', 
				styles: {
					"render": "always", //一直渲染
				}
			};
		}
		var self = plus.webview.currentWebview();
		try{
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
		}catch(e){
			console.log(e);
		}
		
		// 获取本地应用资源版本号
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {

			wgtVer = inf.version;
			console.log("当前应用版本：" + wgtVer);
		});
		plus.webview.show(activeTab, "fade-in", 300);
	});
	
	
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
var wgtVer = null;
// 检测更新
function getSDRoot() {
	// 导入android.os.Environment类对象
	var environment = plus.android.importClass("android.os.Environment");
	// 判断SD卡是否插入
	if (environment.getExternalStorageState() !== environment.MEDIA_MOUNTED) {
		plus.nativeUI.toast('没有找到SD卡');
		return;
	}
	return environment.getExternalStorageDirectory();
}

function checkUpdate() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		switch (xhr.readyState) {
			case 4:
				plus.nativeUI.closeWaiting();
				if (xhr.status == 200) {
					console.log("检测更新成功：" + xhr.responseText);
					var newVer = xhr.responseText;
					var visionInfo = JSON.parse(newVer)
					var reg = new RegExp("\\.", 'g');
					if (wgtVer && newVer && (wgtVer.replace(reg, "") < visionInfo.VersionName.replace(reg, ""))) {
						mui.confirm('检测到新版本，是否更新？', '', ['取消', '确认'], function(e) {
							if (e.index == 1) {
								downWgt(visionInfo.VersionPath);
							}
						});
					} else {
						console.log("无新版本可更新！");
					}
				} else {
					console.log("检测更新失败！");
				}
				break;
			default:
				break;
		}
	}
	var url = checkUrl + "?time=" + Math.random();
	console.log(url)
	xhr.open('GET', url);
	xhr.send();
}

function downWgt(apkUrl) {
	var title = "正在更新，请不要退出...";
	var wd = plus.nativeUI.showWaiting(title);
	var options = {
		method: "GET",
		filename: "_doc/download/brand.apk"
	};
	dtask = plus.downloader.createDownload(apkUrl, options);
	dtask.addEventListener("statechanged", function(task, status) {
		if (!dtask) {
			wd.close();
			return;
		}
		switch (task.state) {
			case 1: // 开始
				console.log("开始下载...");
				break;
			case 2: // 已连接到服务器
				console.log("链接到服务器...");
				break;
			case 3: // 已接收到数据
				title = (task.downloadedSize / 1024 / 1024).toFixed(2) + " M /" + (task.totalSize / 1024 / 1024).toFixed(2) +
					" M";
				// console.log("下载数据更新:" + title);
				wd.setTitle("下载进度:" + title)
				break;
			case 4: // 下载完成
				wd.close();
				console.log("下载完成！");
				installWgt(task.filename); // 安装包
				break;
			default:
				break;
		}
	});
	dtask.start();
}
// 更新应用资源
function installWgt(path) {
	plus.nativeUI.showWaiting("安装文件...");
	console.log(path);
	plus.runtime.install(path, {}, function() {
		plus.nativeUI.closeWaiting();
		console.log("安装文件成功！");
		plus.nativeUI.alert("应用资源更新完成！", function() {
			plus.runtime.restart();
		});
	}, function(e) {
		plus.nativeUI.closeWaiting();
		console.log("安装文件失败[" + e.code + "]：" + e.message);
		plus.nativeUI.alert("安装文件失败[" + e.code + "]：" + e.message);
	});
}


