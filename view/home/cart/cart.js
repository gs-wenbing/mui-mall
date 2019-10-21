window.addEventListener('loadData', function(e) { //执行刷新
	pulldownRefresh();
});

(function($) {
	$.init({
		pullRefresh: {
			container: '.mui-content',
			down: {
				style: 'circle',
				offset: '10px',
				range: '64px',
				auto: true,
				callback: pulldownRefresh
			}
		}
	});
})(mui)

mui.plusReady(function () {
	
})
//编辑事件
var _btnEdit = document.querySelector(".btn-edit");
_btnEdit.addEventListener("tap", function() {
	if (goodsCarts.allCount > 0) {

		if (!$(this).hasClass('btn-complete')) {
			$(this).addClass('btn-complete').html('完成');
			$(".cartsum__body").addClass("mui-hidden");
			$(".btn-remove").removeClass("mui-hidden");
			goodsCarts.isDelete = true;
			goodsCarts.allCount = goodsCarts.GoodsList.length;
		} else {
			$(this).removeClass('btn-complete').html('编辑');
			$(".cartsum__body").removeClass("mui-hidden");
			$(".btn-remove").addClass("mui-hidden");
			goodsCarts.isDelete = false;
			goodsCarts.allCount = goodsCarts.GoodsList.length;
		}
	}
	if ($('.block-group').not('.disabled').length === 0) {
		$('.btn-remove').attr('disabled', 'disabled')
	}
}, false)

function pulldownRefresh() {
	GetShoppingCartList();
}

//获取购物车数据
function GetShoppingCartList() {
	var user = getUser();
	if (user == null) {
		mui('.mui-content').pullRefresh().endPulldownToRefresh();
		goodsCarts.GoodsList = [];
		goodsCarts.check_goods = [];
		goodsCarts.isCartEmpty = true;
		goodsCarts.allCount = 0;
		goodsCarts.isLogin = false;
		return false;
	}
	goodsCarts.user = user;
	goodsCarts.isLogin = true;
	var t1 = window.setTimeout(function(){
		goodsCarts.check_goods = [];
		goodsCarts.GoodsList = cartListByCache.GoodsList.slice();
		console.log(cartListByCache.GoodsList.length)
		if (cartListByCache.GoodsList.length == 0) {
			goodsCarts.isCartEmpty = true;
		} else {
			goodsCarts.isCartEmpty = false;
		}
		goodsCarts.allCount = goodsCarts.GoodsList.length;
		
		if (goodsCarts.allCount == 0) {
			$(".btn-edit").hide();
		} else {
			$(".btn-edit").show();
		}
		goodsCarts.$nextTick(function() { //渲染完成后触发事件
			mui('.mui-numbox').numbox();
		});
		
		mui('.mui-content').pullRefresh().endPulldownToRefresh();
	}, 500);
}

Vue.use(VueLazyload, {
	preLoad: 1.3,
	error: '../../../img/goods-default.gif',
	loading: '../../../img/goods-default.gif',
	attempt: 1
})
var goodsCarts = new Vue({
	el: '#app',
	data: {
		GoodsList: [], 
		check_goods: [], //已选择的普通商品
		isCartEmpty: false,
		allCount: 0, //有效商品总数
		isDelete: false,
		isLogin: true,
		user: getUser()
	},
	computed: {
		total_num: function() {
			//删除状态下
			var t_num = 0;
			if (this.isDelete) {
				t_num = this.check_goods.length;
			} else {
				t_num = this.check_goods.length;
			}
			return t_num;
		},
		total_price:function(){
			var t_price = 0;
			mui.each(this.check_goods, function(index, item) {
				t_price += Number(item.Price) * item.MinPCSAmount;
			})
			return t_price.toFixed(2);
		}
	},
	methods: {
		//删除商品
		deleteCart: function() {
			if (this.total_num <= 0) {
				mui.toast("请选择商品");
				return false;
			}
			var btnArray = ['否', '是'];
			mui.confirm('确定删除该商品吗？', '', btnArray, function(e) {
				if (e.index == 1) {
					mui.each(goodsCarts.check_goods, function(index, item) {
						goodsCarts.GoodsList.splice(goodsCarts.GoodsList.indexOf(item), 1)
					})
					if(goodsCarts.GoodsList.length==0){
						goodsCarts.isCartEmpty=true;
					}
					mui.toast("删除成功");
				}
			})
		},
		// 全选
		check_all: function() {
			$that = this;
			//删除状态下 全部选中
			if ($that.isDelete) {
				if (this.total_num != $that.allCount) {
					$that.check_goods = [];
					mui.each($that.GoodsList, function(index, item) {
						$that.check_goods.push(item);
					})
				} else {
					$that.check_goods = [];
				}
			} else {
				// 全选
				if (this.total_num != $that.allCount) {
					$that.check_goods = [];
					mui.each($that.GoodsList, function(index, item) {
						$that.check_goods.push(item);
					})
				} else {
					$that.check_goods = [];
				}
			}

		},
		submit: function() {
			openWindow("../../settlement/settlement.html","settlement.html",{});
		},
		tapNum: function(Goods) {
			var $that = this;
			if (mui.os.ios) {
				
			}else{
				var num = Goods.MinPCSAmount;
				var html = 
				'<div class="mui-numbox" style="width: 150px;height: 30px !important;margin: 10px;" data-numbox-min="1">' +
					'<button class="mui-btn mui-btn-numbox-minus" style="width: 25% !important;" type="button">-</button>' +
					'<input class="mui-input-numbox updateNum" style="width: 50.5% !important;"  type="number" />' +
					'<button class="mui-btn mui-btn-numbox-plus" style="width: 25% !important;" type="button">+</button>' +
				'</div>';
				var btnArray = ['取消', '确定'];
				mui.confirm(html, '修改购买数量', btnArray,
					function(e) {
						document.activeElement.blur(); //隐藏软键盘  
						if (e.index == 1) {
							Goods.MinPCSAmount = $('.updateNum').val();
						}
					}, "div");
				
				mui('.mui-numbox').numbox();
				var t1 = window.setTimeout(function(){
					$('.updateNum').val(parseInt(num)).focus();
				}, 100);
			}
		},
		toShopping: function() {
			var user = getUser();
			if (user == null) {
				goLogin("../../login/login.html", "home.html", "home.html", null)
				return false;
			}
			openWindow("../../search/search.html", "search.html", {})
		},
	},
	watch: {

	}
});


