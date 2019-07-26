
var URL_PIC = "http://res.genvana.cn/upload/";

(function(doc, win) {
	var w = document.documentElement.clientWidth;
	if (w > 750) {
		w = 750
	} else if (w < 320) {
		w = 320
	}
	var f = w / 750 * 100 + "px";
	document.documentElement.style.fontSize = f;
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function() {
			var clientWidth = docEl.clientWidth > 750 ? 750 : docEl.clientWidth;
			if (clientWidth > 750) {
				clientWidth = 750
			} else if (clientWidth < 320) {
				clientWidth = 320
			}
			if (!clientWidth) return;
			docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
		};

	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);





/**
 * 上传图片
 * base64
 * secondDir 路径
 * callback（isSuccess,data）
 */
function uploadImage(path, secondDir, w, h, callback) {
	var wd = plus.nativeUI.showWaiting();
	dealImage(path, {
		width: w,
		width: h,
	}, function(base64) {
		base64 = base64.slice(base64.indexOf("base64,") + "base64,".length);
		wd.close();
		//上传图片
		callback(true, path);
		// var task = plus.uploader.createUpload(UploadUrl, {
		// 		method: "POST"
		// 	},
		// 	function(t, status) { //上传完成
		// 		wd.close();
		// 		if (status == 200) {
		// 			console.log(t.responseText);
		// 			callback(true, t.responseText);
		// 		} else {
		// 			console.log("上传失败：" + status);
		// 			callback(false, "上传失败：" + status);
		// 			mui.toast("上传失败：" + status);
		// 		}
		// 	}
		// );
		// //参数
		// task.addData('upload', base64);
		// task.addData('secondDir', secondDir);
		// task.addData('ext', "JPG");
		// task.start();
	})
}
/**
 * 图片压缩，默认同比例压缩
 * @param {Object} path 
 *   pc端传入的路径可以为相对路径，但是在移动端上必须传入的路径是照相图片储存的绝对路径
 * @param {Object} obj
 *   obj 对象 有 width， height， quality(0-1)
 * @param {Object} callback
 *   回调函数有一个参数，base64的字符串数据
 */
function dealImage(path, obj, callback) {
	var img = new Image();
	img.src = path;
	img.onload = function() {
		var that = this;
		// 默认按比例压缩
		var w = that.width,
			h = that.height,
			scale = w / h;
		w = obj.width || w;
		h = obj.height || (w / scale);
		var quality = 0.7; // 默认图片质量为0.7
		//生成canvas
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		// 创建属性节点
		var anw = document.createAttribute("width");
		anw.nodeValue = w;
		var anh = document.createAttribute("height");
		anh.nodeValue = h;
		canvas.setAttributeNode(anw);
		canvas.setAttributeNode(anh);
		ctx.drawImage(that, 0, 0, w, h);
		// 图像质量
		if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
			quality = obj.quality;
		}
		// quality值越小，所绘制出的图像越模糊
		console.log("quality===" + quality);
		var base64 = canvas.toDataURL('image/jpeg', quality);
		// 回调函数返回base64的值
		callback(base64);
	}
}
/**
 * 转化为base64
 */
function getBase64Image(img) {
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, img.width, img.height);
	var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
	var dataURL = canvas.toDataURL("image/" + ext);
	return dataURL;
}

function getUser() {
	var user = null;
	if (!window.localStorage) {
		alert("浏览器支持localstorage");
	} else {
		var storage = window.localStorage;
		var str = storage.getItem("user-test");
		user = JSON.parse(str);
	}
	return user;
}

function setStorage(key, data) {
	if (!window.localStorage) {
		alert("浏览器支持localstorage");
	} else {
		var storage = window.localStorage;
		var jsonStr = JSON.stringify(data);
		storage.setItem(key, jsonStr);
	}
}

function getStorage(key) {
	var data = null;
	if (!window.localStorage) {
		alert("浏览器支持localstorage");
	} else {
		var storage = window.localStorage;
		var str = storage.getItem(key);
		data = JSON.parse(str);
	}
	return data;
}

function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + date.getHours() + seperator2 + date.getMinutes() +
		seperator2 + date.getSeconds();
	return currentdate;
}

function getDay() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
	return currentdate;
}
//自定义一个方法批量替换制定的字符 
function del_html_tags(str, reallyDo, replaceWith) {
	var e = new RegExp(reallyDo, "g");
	words = str.replace(e, replaceWith);
	return words;
}

/**
 * @param {Object} arg字符串转dom   parseDom("<div>"+GoodsDesc+"</div>")  
 */
function parseDom(arg) {
	var objE = document.createElement("div");
	objE.innerHTML = arg;
	return objE.childNodes;
};
/**
 * @param {Object} node  dom转字符串
 */
function nodeToString(node) {
	var tmpNode = document.createElement("div");
	tmpNode.appendChild(node);
	var str = tmpNode.innerHTML;
	tmpNode = node = null; // prevent memory leaks in IE  
	return str;
}

/**
 * 打开页面
 * url 页面
 * id  页面ID
 * extras 参数，Json
 */
function openWindow(url, id, extras) {
	mui.openWindow({
		url: url,
		id: id,
		extras: extras,
		waiting: {
			autoShow: false,
		}
	});
}
/**
 * 打开页面
 * url 页面
 * id  页面ID
 * title  标题
 * extras 参数，Json
 */
function createWindowWithTitle(url, id,title, extras) {
	plus.nativeUI.showWaiting();
	//注意titleColor值必须是大写的，否则在IOS上标题栏字体不显示
	var styles = { // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
		titleNView: { // 窗口的标题栏控件
			titleText: title, // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
			titleColor: "#FFFFFF", // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
			backgroundColor: "#E60012", // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
			autoBackButton: true
		}
	}
	plus.webview.create(url, id, styles, extras);
}
/**
 * 打开页面
 * url 页面
 * id  页面ID
 * extras 参数，Json
 */
function createWindow(url, id, extras) {
	plus.nativeUI.showWaiting();
	plus.webview.create(url, id, {}, extras);
}

function createGoodsDetail(goodsId) {
	plus.nativeUI.showWaiting();
	var styles = {
		"titleNView": { //详情页原生导航配置
			backgroundColor: '#E60021', //导航栏背景色
			titleText: '商品详情', //导航栏标题
			titleColor: '#FFFFFF', //文字颜色
			type: 'transparent', //透明渐变样式
			autoBackButton: true, //自动绘制返回箭头
			splitLine: { //底部分割线
				color: '#E60021'
			}
		}
	}
	var extras = {
		goodsId: goodsId
	}
	plus.webview.create("../detail/goods-detail.html", "goods-detail.html", styles, extras);
}

function showWindow() {
	var currentView = plus.webview.currentWebview();
	currentView.show('slide-in-right', 300);
	plus.nativeUI.closeWaiting();
}

function goLogin(loginPath, toView, toViewID, extras) {
	var param = {
		toView: toView,
		toViewID: toViewID,
		extras: extras
	}
	createWindow(loginPath, "login.html", param)
}
