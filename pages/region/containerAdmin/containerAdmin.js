// pages/region/containerAdmin/containerAdmin.js
const app = getApp()
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    containers: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.startPullDownRefresh({});

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.getContainers();

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

  getContainers: function () {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selContainerStatisticInfo.do',
      data: {

      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        self.getContainersCallback(self, res.data);
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        wx.showModal({
          title: '错误',
          content: res.data,
          showCancel: false,
          confirmText: '我知道了',
        })
        wx.stopPullDownRefresh();
      }
    })

  },


  getContainersCallback: function (self, containers) {
    self.setData({
      containers:containers
    })
    console.log('containers:',containers)
    // self.setContainersBySort(self.data.sortContainer, self.data.sortContainerFlag)
    // console.log('boxs:', boxs)
  },
})