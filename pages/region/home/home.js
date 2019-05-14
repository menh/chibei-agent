// pages/region/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schools: [
      // {
      //   schoolId: 'S0000001',
      //   schoolName: "广州中医药大学",
      //   text: '0'
      // }, {
      //   schoolId: 'S0000001',
      //   schoolName: "广州中医药大学",
      //   text: '0'
      // }

    ],
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
    this.getSchools();
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
  navigate: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },
  getSchools:function(){
    var self = this;

    wx.request({
      url: app.globalData.serverIp + 'selSchoolStatisticInfo.do',
      data: {
        conditionParam:''
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log('schools:',res.data)
        self.getSchoolsCallback(self,res.data);
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("faile");
      }
    })
  },
  getSchoolsCallback:function(self,schools){
    self.setData({
      schools:schools
    })
  }
})