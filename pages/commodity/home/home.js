// pages/commodity/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    school:{},
    cates: [],
    isSort: false,
    type:'retail'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      school:app.globalData.school
    })
    wx.startPullDownRefresh({});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getAllCates();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  sortEntry: function(e) {
    var cates = this.data.cates;
    for (var i = 0; i < cates.length; i++) {
      cates[i].initOrder = i;
      cates[i].finalOrder = i;
    }
    console.log(cates)
    this.setData({
      isSort: true,
      cates:cates
    })
  },
  sortSure: function(e) {
    var self = this;
    var cates = this.data.cates;
      wx.showModal({
        title: '确认',
        content: "确认排序吗",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            self.updCategoryReorderByCates(self,cates)
            //调用接口
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
  },
  sortCancel: function (e) {
    var cates = this.sortCatesByInitOrder(this.data.cates);
    this.setData({
      isSort: false,
      cates:cates
    })
  },
  sortUp: function(e) {
    var cates = this.data.cates;
    var categoryId = e.currentTarget.dataset.id;

    var index = this.findCateIndexByCategoryId(cates,categoryId);
    var cates = this.upCateByIndex(cates,index);

    cates = this.sortCatesByFinalOrder(cates);

    this.setData({
      cates:cates
    })
  },
  sortDown: function(e) {
    var cates = this.data.cates;
    var categoryId = e.currentTarget.dataset.id;

    var index = this.findCateIndexByCategoryId(cates, categoryId);
    var cates = this.downCateByIndex(cates, index);

    cates = this.sortCatesByFinalOrder(cates);

    this.setData({
      cates: cates
    })
  },

  updCategoryReorderByCates: function (self, cates) {
    wx.showLoading({
      title: '',
    })
    var categoryReorderString = self.getReorderStringByCates(cates);
    console.log(categoryReorderString);
    wx.request({
      url: app.globalData.serverIp + 'updCategoryReorder.do',
      data: {
        categoryReorderString: categoryReorderString
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

  getReorderStringByCates:function(cates){
    var reorderString = '';
    for (var i = 0; i < cates.length; i++) {
      reorderString += 'categoryId:' + cates[i].categoryId + '&reorder:' + cates[i].finalOrder + '|'
    }
    reorderString = reorderString.substr(0, reorderString.length - 1);
    console.log(reorderString);
    return reorderString;
  },
  upCateByIndex: function (cates, index) {
    if (index == 0) {
      return cates;
    }
    cates[index - 1].finalOrder++;
    cates[index].finalOrder--;
    return cates;
  },

  downCateByIndex: function (cates, index) {
    if (index == cates.length) {
      return cates;
    }
    cates[index + 1].finalOrder--;
    cates[index].finalOrder++;
    return cates;
  },

  findCateIndexByCategoryId:function(cates,categoryId){
    for(var i = 0;i<cates.length;i++){
      if(cates[i].categoryId == categoryId){
        return i;
      }
    }
    return -1;
  },


  sortCatesByInitOrder: function (cates) {
    var compare = function (order1, order2) {
      if (order1.initOrder < order2.initOrder) {
        return -1;
      } else if (order1.initOrder > order2.initOrder) {
        return 1;
      } else {
        return 0;
      }
    }
    return cates.sort(compare);
  },
  sortCatesByFinalOrder: function (cates) {
    var compare = function (order1, order2) {
      if (order1.finalOrder < order2.finalOrder) {
        return -1;
      } else if (order1.finalOrder > order2.finalOrder) {
        return 1;
      } else {
        return 0;
      }
    }
    return cates.sort(compare);
  },

  getAllCates: function() {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selCategory.do',
      data: {
        schoolId: self.data.school.schoolId,
        conditionParam: 'schoolId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        self.getAllCatesCallback(self,res.data);
        wx.stopPullDownRefresh();
      },
      fail: function(res) {
        console.log("faile");
      }
    })
  },

  getAllCatesCallback: function (self, categorys) {
    console.log('categorys:',categorys)
    self.setData({
      cates: categorys,
      isSort: false
    })
  },

  navigate: function (e) {
    if(this.data.isSort){
      return
    }
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },
  changeType: function (e) {
    if (this.data.isSort) {
      return 
    }

    let type = e.currentTarget.dataset.type;
    var cates;
    if(type == 'retail'){
      cates = this.data.catesRetail;
    }else{
      cates = this.data.catesWholesale;
    }
    this.setData({
      type: type,
      cates:cates
    });
  }
})