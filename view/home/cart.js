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
    var user = getUser();
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
			goodsCarts.allCount = goodsCarts.GoodsList.length + goodsCarts.FullNumGoodsList.length;
			mui.each(goodsCarts.FullAmountGoodsList, function(index, FullAmount) {
				goodsCarts.allCount += FullAmount.GoodsList.length;
			})
			mui.each(goodsCarts.LadderGoodsList, function(index, LadderGoods) {
				goodsCarts.allCount += LadderGoods.GoodsList.length;
			})
			if (goodsCarts.InValidList) {
				goodsCarts.allCount += goodsCarts.InValidList.length;
			}
		} else {
			$(this).removeClass('btn-complete').html('编辑');
			$(".cartsum__body").removeClass("mui-hidden");
			$(".btn-remove").addClass("mui-hidden");
			goodsCarts.isDelete = false;
			goodsCarts.allCount = goodsCarts.GoodsList.length + goodsCarts.FullNumGoodsList.length;
			mui.each(goodsCarts.FullAmountGoodsList, function(index, FullAmount) {
				goodsCarts.allCount += FullAmount.GoodsList.length;
			})
			mui.each(goodsCarts.LadderGoodsList, function(index, LadderGoods) {
				goodsCarts.allCount += LadderGoods.GoodsList.length;
			})
		}
	}
	if ($('.block-group').not('.disabled').length === 0) {
		$('.btn-remove').attr('disabled', 'disabled')
	}
}, false)

function pulldownRefresh() {
	goodsCarts.CheckedGoodsSkuIDs = null;
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
		goodsCarts.GoodsList = [];
		goodsCarts.check_goods = [];
		goodsCarts.GoodsList = cartList.GoodsList;
		
		if (cartList.GoodsList.length == 0) {
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
			if(goodsCarts.isLogin==false || goodsCarts.user.CustomerType==6){
				$(".mui-content").css("margin-top","0px");
			}else{
				$(".mui-content").css("margin-top","30px");
			}
		});
		
		mui('.mui-content').pullRefresh().endPulldownToRefresh();
	}, 500);
}


var goodsCarts = new Vue({
	el: '#app',
	data: {
		URL_PIC: URL_PIC,
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
					DelCarGoods();
				}
			})
		},
		onCheckbox: function() {
			goodsCarts.CheckedGoods = [];
			var str = "";
			console.log(this.check_goods.length)
			mui.each(this.check_goods, function(index, item) {
				str += item.GoodsSkuID + ",";
				pushCheckGoods(item)
			})
			str = str.substring(0, str.lastIndexOf(','));
			this.CheckedGoodsSkuIDs = str;
			GetShoppingCartList();
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
					pulldownRefresh();
				} else {
					$that.check_goods = [];
					GetShoppingCartList();
				}
			}

		},
		submit: function() {
			SettlemtCarGoods();
		},
		toShopping: function() {
			var user = getUser();
			if (user == null) {
				goLogin("../login/login2.html", "home.html", "home.html", null)
				return false;
			}
			var extras = {
				GoodsClassID: "",
				type: "",
				keyWords: "",
				PmID: "",
			}
			createWindow("second-classfy.html", "second-classfy.html", extras)
		},
		toFullSales: function(PromotionID) {
			var extras = {
				GoodsClassID: "",
				type: "Ip",
				keyWords: "",
				PmID: PromotionID,
			}
			createWindow("second-classfy.html", "second-classfy.html", extras)
		},

		minusNum: function(Goods) {
			var $that = this;
			if (Goods.Checked == 1) {
				mui.each($that.CheckedGoods, function(index, CheckedItem) {
					if (CheckedItem.GoodsSkuID == Goods.GoodsSkuID) {
						CheckedItem.IsUpdate = 1;
						CheckedItem.MinPCSAmount = parseInt(Goods.MinPCSAmount) - 1;
					}
				})
			} else {
				var MallCheckoutput = {
					ShoppingCartID: Goods.ShoppingCartID,
					GoodsSkuID: Goods.GoodsSkuID,
					MinPCSAmount: parseInt(Goods.MinPCSAmount) - 1,
					MinPCS: Goods.MinPCS,
					IsUpdate: 1 //是否更新购物车数量 0否  1是
				}
				$that.CheckedGoods.push(MallCheckoutput);
				$that.CheckedGoodsSkuIDs = $that.CheckedGoodsSkuIDs + "," + Goods.GoodsSkuID;
			}
			console.log($that.CheckedGoodsSkuIDs)
			GetShoppingCartList();
		},
		watchNum: function(Goods) {
			var $that = this;
			if (Goods.Checked == 1) {
				mui.each($that.CheckedGoods, function(index, CheckedItem) {
					if (CheckedItem.GoodsSkuID == Goods.GoodsSkuID) {
						CheckedItem.IsUpdate = 1;
						CheckedItem.MinPCSAmount = Goods.MinPCSAmount;
					}
				})
			} else {
				var MallCheckoutput = {
					ShoppingCartID: Goods.ShoppingCartID,
					GoodsSkuID: Goods.GoodsSkuID,
					MinPCSAmount: Goods.MinPCSAmount,
					MinPCS: Goods.MinPCS,
					IsUpdate: 1 //是否更新购物车数量 0否  1是
				}
				$that.CheckedGoods.push(MallCheckoutput);
				$that.CheckedGoodsSkuIDs = $that.CheckedGoodsSkuIDs + "," + Goods.GoodsSkuID;
			}
			console.log($that.CheckedGoodsSkuIDs)
			GetShoppingCartList();
		},
		plusNum: function(Goods) {
			var $that = this;
			console.log("开始：" + $that.CheckedGoodsSkuIDs)
			if (Goods.Checked == 1) {
				mui.each($that.CheckedGoods, function(index, CheckedItem) {
					if (CheckedItem.GoodsSkuID == Goods.GoodsSkuID) {
						CheckedItem.IsUpdate = 1;
						CheckedItem.MinPCSAmount = parseInt(Goods.MinPCSAmount) + 1;
					}
				})
			} else {
				var MallCheckoutput = {
					ShoppingCartID: Goods.ShoppingCartID,
					GoodsSkuID: Goods.GoodsSkuID,
					MinPCSAmount: parseInt(Goods.MinPCSAmount) + 1,
					MinPCS: Goods.MinPCS,
					IsUpdate: 1 //是否更新购物车数量 0否  1是
				}
				$that.CheckedGoods.push(MallCheckoutput);
				$that.CheckedGoodsSkuIDs = $that.CheckedGoodsSkuIDs + "," + Goods.GoodsSkuID;
			}
			console.log("结束：" + $that.CheckedGoodsSkuIDs)
			GetShoppingCartList();
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
							$that.watchNum(Goods);
						}
					}, "div");
				
				mui('.mui-numbox').numbox();
				var t1 = window.setTimeout(function(){
					$('.updateNum').val(parseInt(num)).focus();
				}, 100);
			}
		},
	},
	watch: {

	}
});

function pushCheckGoods(goods) {
	var MallCheckoutput = {
		ShoppingCartID: 0,
		GoodsSkuID: 0,
		MinPCSAmount: 0,
		MinPCS: 0,
		IsUpdate: 0 //是否更新购物车数量 0否  1是
	}
	MallCheckoutput.ShoppingCartID = goods.ShoppingCartID;
	MallCheckoutput.GoodsSkuID = goods.GoodsSkuID;
	MallCheckoutput.MinPCSAmount = goods.MinPCSAmount;
	MallCheckoutput.MinPCS = goods.MinPCS;
	goodsCarts.CheckedGoods.push(MallCheckoutput);
}

//排序
function sortAmount(Promotion1, Promotion2) {
	return Promotion2.PreferentialAmount - Promotion1.PreferentialAmount;
}
//删除
function DelCarGoods() {
	var ids = "";
	mui.each(goodsCarts.check_goods, function(index, item) {
		ids += item.ShoppingCartID + ",";
	})
	mui.each(goodsCarts.check_FullAmountGoods, function(index, item) {
		ids += item.ShoppingCartID + ",";
	})
	mui.each(goodsCarts.check_FullNumGoods, function(index, item) {
		ids += item.ShoppingCartID + ",";
	})
	mui.each(goodsCarts.check_LadderGoods, function(index, item) {
		ids += item.ShoppingCartID + ",";
	})

	var wd = plus.nativeUI.showWaiting();
	callApi("api/Mall/DeleteShoppingCartByIDS", ids, true, function(isSuccess, data, ErrMsg) {
		wd.close();
		if (isSuccess) {
			pulldownRefresh();
			mui.toast("删除成功");
		}
	});
}

//结算
function SettlemtCarGoods() {
	var wd = plus.nativeUI.showWaiting();
	var user = getUser();
	//根据客户ID 获取有效的客户合同
	callApi("api/customer/GetContractMainByUserAccountID", user.UserAccountID, true, function(isSuccess, data, ErrMsg) {
		wd.close();
		if (isSuccess) {
			var ids = "";
			mui.each(goodsCarts.check_goods, function(index, item) {
				ids += item.ShoppingCartID + ",";
			})
			mui.each(goodsCarts.check_FullAmountGoods, function(index, item) {
				ids += item.ShoppingCartID + ",";
			})
			mui.each(goodsCarts.check_FullNumGoods, function(index, item) {
				ids += item.ShoppingCartID + ",";
			})
			mui.each(goodsCarts.check_LadderGoods, function(index, item) {
				ids += item.ShoppingCartID + ",";
			})
			ids = ids.substring(0, ids.lastIndexOf(','));
			if (ids != "") {
				var extras = {
					ids: ids
				}
				var webviewShow = createWindow("../order/SettlementCarGoods.html", "SettlementCarGoods.html", extras);
			}
		} else {
			mui.alert('合同未生效，暂时不能采购！');
		}
	});
}

function toFeedbook() {
	createWindowWithTitle('../setting/feedback.html', 'feedback.html',"建议反馈",  {})
}
