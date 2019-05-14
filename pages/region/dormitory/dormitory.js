// pages/region/school/school.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dormitory: {},
    containers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dormId = options.dormId;
    this.data.dormitory.dormId = dormId;
    wx.startPullDownRefresh({})

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onPullDownRefresh: function () {
    this.getDormitory(this.data.dormitory.dormId);
    this.getContainers(this.data.dormitory.dormId);
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


  getDormitory: function (dormId) {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selDormStatisticInfo.do',
      data: {
        dormId: dormId,
        conditionParam: 'dormId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log('dormitory:', res.data)
        self.getDormitoryCallback(self, res.data[0]);
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("faile");
      }
    })
  },
  getDormitoryCallback: function (self, dormitory) {
    self.setData({
      dormitory: dormitory
    })
  },

  getContainers: function (dormId) {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selContainerStatisticInfo.do',
      data: {
        dormId: dormId,
        conditionParam: 'dormId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log('containers:', res.data)
        self.getContainersCallback(self, res.data);
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("faile");
      }
    })
  },
  getContainersCallback: function (self, containers) {
    self.setData({
      containers: containers
    })
  },

  navigate: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },

  tapDelete: function(e) {
    var self = this;
    wx.showModal({
      title: '是否删除',
      content: self.data.dormitory.dormName,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          //调用接口
          self.delDormitory(self, self.data.dormitory)
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })

  },
  delDormitory: function (self, dormitory) {
    console.log(dormitory);
    wx.showLoading({
      title: '正在载入'
    })

    wx.request({
      url: app.globalData.serverIp + 'delDorm.do',
      data: {
        dormId: dormitory.dormId,
        conditionParam: 'dormId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log(res.data);
        wx.hideLoading();
        wx.navigateBack({})
      },
      fail: function(res) {
        console.log("faile");
        console.log(res.data);
        wx.hideLoading();
      }
    })
  }
})