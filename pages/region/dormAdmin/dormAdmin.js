// pages/region/containerAdmin/containerAdmin.js
const app = getApp()
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dorms: [],
    info: {
      dayTrd: 0,
      sevenDayLiveBoxNum: 0,
      dayToDealBoxNum: 0,
      remainToDealBoxNum: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    this.getDorms();

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

  getDorms: function() {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selDormStatisticInfo.do',
      data: {
        conditionParam: ''
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        self.getDormsCallback(self, res.data);
        wx.stopPullDownRefresh();
      },
      fail: function(res) {
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


  getDormsCallback: function(self, dorms) {
    self.setInfoByDorms(self, dorms)
    dorms = dorms.sort(function (order1, order2) {
      if (parseFloat(order1.dayTrd) < parseFloat(order2.dayTrd)) {
        return 1;
      } else if (parseFloat(order1.dayTrd) > parseFloat(order2.dayTrd)) {
        return -1;
      } else {
        return 0;
      }
    })
    self.setData({
      dorms: dorms
    })
    console.log('dorms:', dorms)
    // self.setContainersBySort(self.data.sortContainer, self.data.sortContainerFlag)
    // console.log('boxs:', boxs)
  },


  setInfoByDorms: function(self, dorms) {

    var info= {
      dayTrd: 0,
      sevenDayLiveBoxNum: 0,
      dayToDealBoxNum: 0,
      remainToDealBoxNum: 0
    };
    for (var i = 0; i < dorms.length; i++) {
      info.dayTrd += parseFloat(dorms[i].dayTrd);
      info.sevenDayLiveBoxNum += parseInt(dorms[i].sevenDayLiveBoxNum);
      info.dayToDealBoxNum += parseInt(dorms[i].dayToDealBoxNum);
      info.remainToDealBoxNum += parseInt(dorms[i].remainToDealBoxNum);
    }
    self.setData({
      info: info
    })
  },

  navigate: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },
})