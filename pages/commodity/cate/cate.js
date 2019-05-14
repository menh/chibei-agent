// pages/region/school/school.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: {},
    goods: [],
    isSort:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var categoryId = options.categoryId;
    // var categoryId = 'C00000001'
    this.data.category.categoryId = categoryId;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.startPullDownRefresh({})
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getCategory(this.data.category.categoryId);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



  sortEntry: function (e) {
    var goods = this.data.goods;
    for (var i = 0; i < goods.length; i++) {
      goods[i].initOrder = i;
      goods[i].finalOrder = i;
    }
    console.log(goods)
    this.setData({
      isSort: true,
      goods: goods
    })
  },
  sortSure: function (e) {
    var self = this;
    var goods = this.data.goods;
    wx.showModal({
      title: '确认',
      content: "确认排序吗",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          self.updGoodsReorderByCates(self, goods)
          //调用接口
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  sortCancel: function (e) {
    var goods = this.sortGoodsByInitOrder(this.data.goods);
    this.setData({
      isSort: false,
      goods: goods
    })
  },
  sortUp: function (e) {
    var goods = this.data.goods;
    var goodId = e.currentTarget.dataset.id;

    var index = this.findGoodIndexByCategoryId(goods, goodId);
    var goods = this.upGoodByIndex(goods, index);

    goods = this.sortGoodsByFinalOrder(goods);

    this.setData({
      goods: goods
    })
  },
  sortDown: function (e) {
    var goods = this.data.goods;
    var goodId = e.currentTarget.dataset.id;

    var index = this.findGoodIndexByCategoryId(goods, goodId);
    var goods = this.downGoodByIndex(goods, index);

    goods = this.sortGoodsByFinalOrder(goods);

    this.setData({
      goods: goods
    })
  },



  updGoodsReorderByCates: function (self, goods) {
    wx.showLoading({
      title: '',
    })
    var goodReorderString = self.getReorderStringByGoods(goods);
    console.log(goodReorderString);
    wx.request({
      url: app.globalData.serverIp + 'updGoodReorder.do',
      data: {
        goodReorderString: goodReorderString
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        wx.startPullDownRefresh();
      },
      fail: function (res) {
        wx.showModal({
          title: '错误',
          content: res.data,
          showCancel: false,
          confirmText: '我知道了',
        })
      }
    })

  },

  getReorderStringByGoods: function (goods) {
    var reorderString = '';
    for (var i = 0; i < goods.length; i++) {
      reorderString += 'goodId:' + goods[i].goodId + '&reorder:' + goods[i].finalOrder + '|'
    }
    reorderString = reorderString.substr(0, reorderString.length - 1);
    console.log(reorderString);
    return reorderString;
  },
  upGoodByIndex: function (goods, index) {
    if (index == 0) {
      return goods;
    }
    goods[index - 1].finalOrder++;
    goods[index].finalOrder--;
    return goods;
  },

  downGoodByIndex: function (goods, index) {
    if (index == goods.length) {
      return goods;
    }
    goods[index + 1].finalOrder--;
    goods[index].finalOrder++;
    return goods;
  },

  findGoodIndexByCategoryId: function (goods, goodId) {
    for (var i = 0; i < goods.length; i++) {
      if (goods[i].goodId == goodId) {
        return i;
      }
    }
    return -1;
  },


  sortGoodsByInitOrder: function (goods) {
    var compare = function (order1, order2) {
      if (order1.initOrder < order2.initOrder) {
        return -1;
      } else if (order1.initOrder > order2.initOrder) {
        return 1;
      } else {
        return 0;
      }
    }
    return goods.sort(compare);
  },
  sortGoodsByFinalOrder: function (goods) {
    var compare = function (order1, order2) {
      if (order1.finalOrder < order2.finalOrder) {
        return -1;
      } else if (order1.finalOrder > order2.finalOrder) {
        return 1;
      } else {
        return 0;
      }
    }
    return goods.sort(compare);
  },


  getCategory: function (categoryId) {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selCategoryGood.do',
      data: {
        categoryId: categoryId,
        conditionParam: 'categoryId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        self.getCategoryCallback(self, res.data[0]);
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("faile");
      }
    })
  },
  getCategoryCallback: function (self, categoryGood) {
    console.log('category:', categoryGood)
    self.setData({
      goods:[]
    })
    self.setData({
      category: categoryGood.category,
      goods: categoryGood.good,
      isSort: false
    })
  },

  navigate: function (e) {
    if (this.data.isSort) {
      return
    }
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },

  tapDeleteCategory: function (e) {
    var self = this;
    wx.showModal({
      title: '是否删除',
      content: self.data.category.categoryName,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          //调用接口
          self.delCategory(self, self.data.category)
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })

  },
  delCategory: function (self, category) {
    console.log(category);
    wx.showLoading({
      title: '正在载入'
    })
    wx.request({
      url: app.globalData.serverIp + 'delCategory.do',
      data: {
        categoryId: category.categoryId,
        conditionParam: 'categoryId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        wx.navigateBack({})
      },
      fail: function (res) {
        console.log("faile");
        console.log(res.data);
        wx.hideLoading();
      }
    })
  },

  tapDeleteGood: function (e) {
    var self = this;
    var goodId = e.currentTarget.dataset.id;
    var goodName = e.currentTarget.dataset.name;
    wx.showModal({
      title: '是否删除',
      content: goodName,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          //调用接口
          self.delGood(self, goodId)
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })

  },
  delGood: function (self, goodId) {
    console.log(goodId);
    wx.showLoading({
      title: '正在载入'
    })
    wx.request({
      url: app.globalData.serverIp + 'delGood.do',
      data: {
        goodId: goodId,
        conditionParam: 'goodId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        wx.startPullDownRefresh({});
      },
      fail: function (res) {
        console.log("faile");
        console.log(res.data);
        wx.hideLoading();
      }
    })
  },
})