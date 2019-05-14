// pages/hello/hello.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    optionsOpenid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.optionsOpenid = options.openId;
    wx.hideShareMenu()
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
    wx.startPullDownRefresh({});
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
    var self = this;
    var optionsOpenid = this.data.optionsOpenid;
    if (optionsOpenid == undefined || optionsOpenid == null || optionsOpenid ==''){
      wx.login({
        success: res => {
          self.getOpenid(self, res.code, app.globalData.appid, app.globalData.secret);
        }
      })
    }else{
      self.getSchool(self,optionsOpenid);
    }
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

  getOpenid: function (self, code, appid, secret) {
    wx.showLoading({
      title: '正在登录',
    })
    wx.request({
      url: app.globalData.serverIp + 'getWxOpenId.do',
      method: 'POST',
      data: {
        code: code,
        appid: appid,
        secret: secret
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log("openid: " + res.data);
        app.globalData.openid = res.data
        self.getSchool(self, res.data);
      },
      fail: function (res) {
        wx.stopPullDownRefresh();
      }
    })
  },
  getSchool: function (self, openId) {
    wx.request({
      url: app.globalData.serverIp + 'selSchool.do',
      method: 'POST',
      data: {
        openId: openId,
        conditionParam: 'openId'
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        wx.stopPullDownRefresh();
        var school = null;
        if (res.data.length > 0) {
          school = res.data[0];
        }
        if (school != undefined && school != null && school.schoolId != undefined && school.schoolId != null && school.schoolId != '') {
          wx.hideLoading();
          app.globalData.school = school;
          console.log('school:', school)
          wx.switchTab({
            // url: '/pages/ranking/home/home',
            url: '/pages/region/school/school',
            // url: '/pages/logistics/home/home',
          })
        } else {
          wx.hideLoading();
          app.globalData.school = {};
          wx.navigateTo({
            url: '/pages/apply/apply',
          })
        }
      },
      fail: function (res) {
        wx.stopPullDownRefresh();
      }
    })
  },

})