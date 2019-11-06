var app_config = {
	version: '1.0.0',
	cssArr: [
		'css/mui.min.css',
		'css/style.css',
		'css/iconfont.css'
	],
	jsArr: [
		'js/mui.min.js',
		'js/vue.js',
		'js/zepto.min.js',
		'js/api.js'
	],
}

// 动态加载解决app重启时候缓存问题。
Array.prototype._distinct = function() {
	var arr = this,
		result = [],
		_result = [],
		len = arr.length;
	arr.forEach(function(v, i, arr) {
		var _v = v.split('/')[v.split('/').length - 1];
		if(_result.indexOf(_v) === -1) {
			result.push(v);
			_result.push(_v);
		} else {
			//替换默认引入文件
			result[_result.indexOf(_v)] = v;
			_result[_result.indexOf(_v)] = _v;
		}
	})
	return result;
};
/**
 * @param {Object} lev 相对于view目录的相对路径的层级 0、2、3
 * @param {Object} cssArr
 */
function link(lev,cssArr) {
	if(lev === 2){
		addPrefix(app_config.cssArr,'../../');
	}else if(lev === 3){
		addPrefix(app_config.cssArr,'../../../');
	}
	var cssArr = app_config.cssArr.concat(cssArr || [])._distinct();
	
	for(var i = 0; i < cssArr.length; i++) {
		document.write('<link rel="stylesheet" href="' + cssArr[i] + '?version=' + app_config.version + '"/>');
	}
}

/**
 * @param {Object} lev 相对于view目录的相对路径的层级 0、2、3
 * @param {Object} jsArr
 */
function script(lev,jsArr) {
	if(lev === 2){
		addPrefix(app_config.jsArr,'../../');
	}else if(lev === 3){
		addPrefix(app_config.jsArr,'../../../');
	}
	var jsArr = app_config.jsArr.concat(jsArr || [])._distinct();
	
	for(var i = 0; i < jsArr.length; i++) {
		document.write('<script src="' + jsArr[i] + '?version=' + app_config.version + ' type="text/javascript" charset="utf-8"><\/script>');
	}
}

function addPrefix(arr,prefix){
	for(var i = 0; i < arr.length; i++) {
		 arr[i] = prefix+arr[i]
	}
}