var qiao = {};
qiao.on = function(obj, event, func){
	$(document).off(event, obj).on(event, obj, func);
};

// 对mui以及nativejs相关封装
qiao.h = {};

// page相关
qiao.h.normalStyle = {top:'45px',bottom:0};
qiao.h.normalPage = function(id){
	return qiao.h.page(id, {styles : qiao.h.normalStyle});
};
qiao.h.centerStyle = {top:'45px',bottom:'50px'};
qiao.h.centerPage = function(id){
	return qiao.h.page(id, {styles:qiao.h.centerStyle});
};
qiao.h.page = function(id, options){
	var url = id + '.html';

	options.id = id;
	options.url = url;
	return options;
};
qiao.h.indexPage = function(){
	return plus.webview.getWebviewById(plus.runtime.appid);
};
qiao.h.currentPage = function(){
	return plus.webview.currentWebview();
};
qiao.h.getPage = function(id){
	return id ? plus.webview.getWebviewById(id) : null;
};
qiao.h.show = function(id, ani, time, func){
	if(id) plus.webview.show(id, ani, time, func);
};
qiao.h.hide = function(id, ani, time){
	if(id) plus.webview.hide(id, ani, time);
};
qiao.h.fire = function(id, name, values){
	mui.fire(qiao.h.getPage(id), name, values);
};

// 以下为UI封装------------------------------------------------------------------------------
// upload
qiao.h.upload = function(options){
	if(!options) return;
	
	var url = options.url;
	var filepath = options.filepath;
	var datas = options.datas || [];
	var success = options.success;
	var fail = options.fail;
	if(url && filepath){
		var task = plus.uploader.createUpload(url, {
				method: "POST",
				blocksize: 204800,
				priority: 100
			},
			function(t, status){
				if(status == 200){
					if(success) success(t);
				}else{
					if(fail) fail(status);
				}
			}
		);
		task.addFile(filepath, {key: 'file'});
		if(datas && datas.length){
			for(var i=0; i<datas.length; i++){
				var data = datas[i];
				task.addData(data.key, data.value);
			}
		}
		task.start();
	}
};

// nativeui相关
qiao.h.tip = function(msg, options){
	plus.nativeUI.toast(msg,options);
};
qiao.h.waiting = function(titile, options){
	plus.nativeUI.showWaiting(titile, options);
};
qiao.h.closeWaiting = function(){
	plus.nativeUI.closeWaiting();
};

// popover
qiao.h.pop = function(){
	mui('.mui-popover').popover('toggle');
};

// actionsheet
qiao.h.sheet = function(title, btns,func){
	if(title && btns && btns.length > 0){
		var btnArray = [];
		for(var i=0; i<btns.length; i++){
			btnArray.push({title:btns[i]});
		}
		
		plus.nativeUI.actionSheet({
			title : title,
			cancel : '取消',
			buttons : btnArray
		}, function(e){
			if(func) func(e);
		});
	}
};

// 提示框相关
qiao.h.modaloptions = {
	title 	: 'title',
	abtn	: '确定',
	cbtn	: ['确定','取消'],
	content	: 'content'
};
qiao.h.alert = function(options, ok){
	var opt = $.extend({}, qiao.h.modaloptions);
	
	opt.title = '提示';
	if(typeof options == 'string'){
		opt.content = options;
	}else{
		$.extend(opt, options);
	}
	
	plus.nativeUI.alert(opt.content, function(e){
		if(ok) ok();
	}, opt.title, opt.abtn);
};
qiao.h.confirm = function(options, ok, cancel){
	var opt = $.extend({}, qiao.h.modaloptions);
	
	opt.title = '确认操作';
	if(typeof options == 'string'){
		opt.content = options;
	}else{
		$.extend(opt, options);
	}
	
	plus.nativeUI.confirm(opt.content, function(e){
		var i = e.index;
		if(i == 0 && ok) ok();
		if(i == 1 && cancel) cancel();
	}, opt.title, opt.cbtn);
};
qiao.h.prompt = function(options, ok, cancel){
	var opt = $.extend({}, qiao.h.modaloptions);
	
	opt.title = '输入内容';
	if(typeof options == 'string'){
		opt.content = options;
	}else{
		$.extend(opt, options);
	}
	
	plus.nativeUI.prompt(opt.content, function(e){
		var i = e.index;
		if(i == 0 && ok) ok(e.value);
		if(i == 1 && cancel) cancel(e.value);
	}, opt.title, opt.content, opt.cbtn);
};

// 以下为插件封装------------------------------------------------------------------------------
// 本地存储相关
qiao.h.length = function(){
	return plus.storage.getLength();
};
qiao.h.key = function(i){
	return plus.storage.key(i);
};
qiao.h.getItem = function(key){
	if(key){
		for(var i=0; i<qiao.h.length(); i++) {
			if(key == plus.storage.key(i)){
				return plus.storage.getItem(key);
			}
		};
	}
	
	return null;
};
qiao.h.insertItem = function(key, value){
	plus.storage.setItem(key, value);
};
qiao.h.delItem = function(key){
	plus.storage.removeItem(key);
};
qiao.h.clear = function(){
	plus.storage.clear();
};

// web sql
qiao.h.db = function(name, size){
	var db_name = name ? name : 'db_test';
	var db_size = size ? size : 2;
	
	return openDatabase(db_name, '1.0', 'db_test', db_size * 1024 * 1024);
};
qiao.h.update = function(db, sql){
	if(db &&sql) db.transaction(function(tx){tx.executeSql(sql);});
};
qiao.h.query = function(db, sql, func){
	if(db && sql){
		db.transaction(function(tx){
			tx.executeSql(sql, [], function(tx, results) {
				func(results);
			}, null);
		});
	}
};

// 以下为功能封装------------------------------------------------------------------------------
// 退出
qiao.h.exit = function(){
	qiao.h.confirm('确定要退出吗？', function(){
		plus.runtime.quit();
	});
};
// 刷新
qiao.h.endDown = function(selector){
	var sel = selector ? selector : '#refreshContainer';
	mui(sel).pullRefresh().endPulldownToRefresh();
};

// qiniu
qiao.qiniu = {
	ak : '3YhXI8s0TsYLyEv_irq7aKGsQsmN6i3WoERBtnyY',
	sk : '9lWh6588LIrQcrMpTagR0f19KV_BcRvtgu5Z1mFU',
	pr : 'http://7xl3r9.com1.z0.glb.clouddn.com/',
	scope : 'uikoo9-facepp',
};
qiao.qiniu.deadline = function(){
	return Math.round(new Date().getTime() / 1000) + 3600;
};
qiao.qiniu.genScope = function(src){
	var scope = qiao.qiniu.scope;
	if(src){
		var ss = src.split('.');
		qiao.qiniu.file = qiao.qiniu.uid() + '.' + ss[ss.length - 1];
		scope = scope + ':' + qiao.qiniu.file;
	}
	
	return scope;
};
qiao.qiniu.uid = function(){
	return Math.floor(Math.random()*100000000+10000000).toString();
};
qiao.qiniu.uptoken = function(src) {
    //SETP 1
	var putPolicy = '{"scope":"' + qiao.qiniu.genScope(src) + '","deadline":' + qiao.qiniu.deadline() + '}';

    //SETP 2
    var encoded = qiao.encode.base64encode(qiao.encode.utf16to8(putPolicy));

    //SETP 3
    var hash = CryptoJS.HmacSHA1(encoded, qiao.qiniu.sk);
    var encoded_signed = hash.toString(CryptoJS.enc.Base64);

    //SETP 5
    var upload_token = qiao.qiniu.ak + ":" + qiao.encode.safe64(encoded_signed) + ":" + encoded;
    return upload_token;
};
qiao.qiniu.url = function(key){
	return qiao.qiniu.pr + qiao.qiniu.file;
};

// qiniu encode
qiao.encode = {};
qiao.encode.utf16to8 = function(str){
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
};
qiao.encode.utf8to16 = function(str){
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += str.charAt(i - 1);
                break;
            case 12:
            case 13:
                // 110x xxxx 10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx 10xx xxxx 10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
};
qiao.encode.base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
qiao.encode.base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
qiao.encode.base64encode = function(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += qiao.encode.base64EncodeChars.charAt(c1 >> 2);
            out += qiao.encode.base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += qiao.encode.base64EncodeChars.charAt(c1 >> 2);
            out += qiao.encode.base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += qiao.encode.base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += qiao.encode.base64EncodeChars.charAt(c1 >> 2);
        out += qiao.encode.base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += qiao.encode.base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += qiao.encode.base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
};
qiao.encode.base64decode = function(str){
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = qiao.encode.base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1) break;
        /* c2 */
        do {
            c2 = qiao.encode.base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1) break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61) return out;
            c3 = qiao.encode.base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1) break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61) return out;
            c4 = qiao.encode.base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1) break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
};
qiao.encode.safe64 = function(base64){
    base64 = base64.replace(/\+/g, "-");
    base64 = base64.replace(/\//g, "_");
    return base64;
};

// face pp
qiao.facepp = {
	ak : '3bbeeac39cd5e8600d2cb05ac97f15fd',
	sk : '4lf9qM6e7GVLVAfKYITYx9R7GX6_5Taa'
};
qiao.facepp.do = function(options){
	var url = options.url; 
	var attr = options.attr || 'gender,age';
	var method = options.method || 'detection/detect';
	var success = options.success;
	var fail = options.fail;
    new FacePP(qiao.facepp.ak, qiao.facepp.sk).request(method, {
      url: url,
      attribute: attr
    }, function(err, result) {
		if(err){
			fail();
		}else{
			success(result);
		}
    });
};