var app = {};
app.config = {};
app.config.debug = true;
app.config.URL = "http://api.xxxxx.cn/api/MobileAccess/GetData";

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
	
	window.onload = function() {
		addScriptTag(
			'https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query=ip&co=&resource_id=6006&t=1562124098965&ie=utf8&oe=gbk&cb=foo&format=json&tn=baidu'
		);
	}
	if(app.config.debug){
		app.config.URL = "http://192.168.1.213:8061/api/MobileAccess/GetData";
	}
})(document, window);

var IPInfo;

function addScriptTag(src) {
	var script = document.createElement('script');
	script.setAttribute("type", "text/javascript");
	script.src = src;
	document.body.appendChild(script);
}

function foo(data) {
	try {
		var json = data.data[0];
		if(json){
			IPInfo = json;
		}
	} catch (err) {
		log("error:>>>>>>>>>" + err)
	}
};


var NetAPI = {
	getRequestParams:function() {
		var request = {
			RequestKey: "",
			UserID: "0",
			UserName: "",
			Sign: "",
			RequestTime:"",
			ClientIP: "127.0.0.1",
			LogType: "",
		}
	
		var user = StorageAPI.getUser();
		if (user != null) {
			request.UserName = user.UserNo;
			request.UserID = user.UserAccountID;
		} 
		if(IPInfo){
			request.ClientIP = IPInfo.origip;
		}
		request.RequestTime = UtilsAPI.getNowFormatDate();
		request.RequestKey = UtilsAPI.guid();
		return request;
	},
	callSignApi:function(Control, Action, param, callback) {
		log(Control + "/" + Action+">>>>>>>>>"+JSON.stringify(param));
		var request = this.getRequestParams();
		request.Data = param;
		request.LogType = Control + "/" + Action;
		mui.ajax(URL, {
			data: request,
			dataType: 'json',
			type: 'post',
			timeout: 10000,
			async: true,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: function(data) {
				if (data.IsSuccess) {
					callback(true, data.Data, "", data.Message);
				} else {
					callback(false, null, data.ErrMsg, data.ErrCode);
					mui.toast(data.ErrMsg);
				}
			},
			error: function(xhr, type, errorThrown) {
				var msg = "系统异常，请联系客服";
				if ("timeout" == type) {
					msg = "网络连接超时";
				} else if ("abort" == type) {
					msg = "网络请求失败，请检查您的网络设置";
				}
				mui.toast(msg);
				log(Control + "/" + Action + JSON.stringify(xhr));
				callback(false, null, msg);
			}
		});
	},
	/**
	 * 上传图片
	 * base64
	 * secondDir 路径
	 * callback（isSuccess,data）
	 */
	uploadImage:function(path, secondDir, w, h, callback) {
		UIAPI.showWaiting();
		UtilsAPI.dealImage(path, {
			width: w,
			width: h,
		}, function(base64) {
			base64 = base64.slice(base64.indexOf("base64,") + "base64,".length);
			UIAPI.closeWaiting();
			//上传图片
			callback(true, path);
			// var task = plus.uploader.createUpload(UploadUrl, {
			// 		method: "POST"
			// 	},
			// 	function(t, status) { //上传完成
			// 		wd.close();
			// 		if (status == 200) {
			// 			log(t.responseText);
			// 			callback(true, t.responseText);
			// 		} else {
			// 			log("上传失败：" + status);
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
	},
}

var UtilsAPI = {
	
	
	guid:function() {
		function S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
	},
	/**
	 * 图片压缩，默认同比例压缩
	 * @param {Object} path 
	 *   pc端传入的路径可以为相对路径，但是在移动端上必须传入的路径是照相图片储存的绝对路径
	 * @param {Object} obj
	 *   obj 对象 有 width， height， quality(0-1)
	 * @param {Object} callback
	 *   回调函数有一个参数，base64的字符串数据
	 */
	dealImage:function(path, obj, callback) {
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
			log("quality===" + quality);
			var base64 = canvas.toDataURL('image/jpeg', quality);
			// 回调函数返回base64的值
			callback(base64);
		}
	},
	/**
	 * 转化为base64
	 */
	getBase64Image:function(img) {
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, img.width, img.height);
		var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
		var dataURL = canvas.toDataURL("image/" + ext);
		return dataURL;
	}
	
}


var StorageAPI = {
	getUser:function() {
		var user = null;
		if (!window.localStorage) {
			alert("浏览器支持localstorage");
		} else {
			var storage = window.localStorage;
			var str = storage.getItem("user-test");
			user = JSON.parse(str);
		}
		return user;
	},
	
	setStorage:function(key, data) {
		if (!window.localStorage) {
			alert("浏览器支持localstorage");
		} else {
			var storage = window.localStorage;
			var jsonStr = JSON.stringify(data);
			storage.setItem(key, jsonStr);
		}
	},
	
	getStorage:function(key) {
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
}

var DateAPI = {
	getNowFormatDate:function() {
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
	},
	
	getDay:function() {
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
}




var UIAPI={
	showWaiting: function(msg) {
		plus.nativeUI.showWaiting(msg || "加载中...");
	},
	closeWaiting: function() {
		plus.nativeUI.closeWaiting()
	},
	
	/**
	 * @param {Object} arg字符串转dom   parseDom("<div>"+GoodsDesc+"</div>")  
	 */
	parseDom:function (arg) {
		var objE = document.createElement("div");
		objE.innerHTML = arg;
		return objE.childNodes;
	},
	/**
	 * @param {Object} node  dom转字符串
	 */
	nodeToString:function(node) {
		var tmpNode = document.createElement("div");
		tmpNode.appendChild(node);
		var str = tmpNode.innerHTML;
		tmpNode = node = null; // prevent memory leaks in IE  
		return str;
	},
	closePages:function(pageIDs){
		for(var i = 0; i < pageIDs.length; i++) {
			var page = plus.webview.getWebviewById(pageIDs[i]);
			if(page){
				plus.webview.close(page, "none");
			}
		}
	},
	openWindowWithTitle:function(url, id,title, extras){
		mui.openWindow(url, id, {
				extras: extras,
				show: {
					event: "loaded", //在当前页面加载,加载完在跳转
				},
				styles:{
					titleNView: { // 窗口的标题栏控件
						titleText: title, // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
						titleColor: "#FFFFFF", // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
						backgroundColor: "#E60012", // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
						autoBackButton: true
					}
				},
				waiting: {
					autoShow: true, //自动显示等待框，默认为true
					//title: '正在加载...' //等待对话框上显示的提示内容
				}
		})
		
	},
	
	openWindow:function(url, id, extras){
		mui.openWindow(url, id, {
				extras: extras,
				show: {
					event: "loaded" //在当前页面加载,加载完在跳转
				},
				waiting: {
					autoShow: true, //自动显示等待框，默认为true
					//title: '正在加载...' //等待对话框上显示的提示内容
				}
		})
	},
	openGoodsDetail:function(path,goodsId) {
		mui.openWindow(path, "goodsDetail.html", {
			extras: {
				goodsId: goodsId
			},
			styles:{
				"titleNView": {
					backgroundColor: '#E60021',
					titleText: '商品详情',
					titleColor: '#FFFFFF',
					type: 'transparent',
					autoBackButton: true,
					splitLine: {
						color: '#E60021'
					}
				}
			},
			show: {
				event: "loaded", //在当前页面加载,加载完在跳转
			},
			waiting: {
				autoShow: true, //自动显示等待框，默认为true
				//title: '正在加载...' //等待对话框上显示的提示内容
			}
		})
	},
	goLogin:function(loginPath, toView, toViewID, extras) {
		var param = {
			toView: toView,
			toViewID: toViewID,
			extras: extras
		}
		this.openWindow(loginPath, "login.html", param)
	}
	
}

function log(data) {
	if(app.config.debug) {
		// typeof(data) typeof 太耗时了
		// if(typeof(data) == "object") {
		// 	console.log(JSON.stringify(data));
		// } else {
			console.log(data);
		// }
	}
}










