mui.init({
	beforeback: function() {
		var main = plus.webview.getWebviewById('my.html');
		mui.fire(main, 'refresh_my');
		//返回true,继续页面关闭逻辑
		return true;
	}
})
var UserInfo = new Vue({
	el: ".mui-page-content",
	data: {
		User: {},
		CustomerEnter: {}
	},
	methods: {
		updateHeader: function() {
			qiao.h.sheet('选择照片', ['拍照', '相册'], function(e) {
				var index = e.index;
				if (index == 1) choiceCamera();
				if (index == 2) choicePic();
			});
		}
	}
})
mui.plusReady(function() {
	getAccountDetail();
})

function getAccountDetail() {
	var user = StorageAPI.getUser();
	UserInfo.User = user;
	
}

function choiceCamera() {
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(p) {
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			setImg(entry.toLocalURL());
		}, function(e) {});
	}, function(e) {}, {
		index: 1,
		filename: "_doc/camera/"
	});
}

function choicePic() {
	plus.gallery.pick(function(path) {
		setImg(path);
	}, function(e) {}, {
		filter: 'image'
	});
}

function setImg(src) {
	NetAPI.uploadImage(src, "employees", 500, 500, function(isSuccess, serverPath) {
		if (isSuccess) {
			//修改用户头像
			UserInfo.User.HeadImageUrl = serverPath;
		}
	});
}
