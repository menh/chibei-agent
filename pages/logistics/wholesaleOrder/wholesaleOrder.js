// pages/region/school/school.js
const app = getApp()
const util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wholesale: {
      wholesaleOrder: {}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var wholesaleOrderId = options.wholesaleOrderId;
    // var wholesaleOrderId = 'W00000001n5Pho679';
    this.data.wholesale.wholesaleOrder.wholesaleOrderId = wholesaleOrderId;
    wx.startPullDownRefresh({})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
    this.getWholesale(this.data.wholesale.wholesaleOrder.wholesaleOrderId);
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


  getWholesale: function(wholesaleOrderId) {
    var self = this;

    wx.request({
      url: app.globalData.serverIp + 'selWholesaleOrder.do',
      data: {
        wholesaleOrderId: wholesaleOrderId,
        conditionParam: 'wholesaleOrderId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        self.getWholesaleCallback(self, res.data[0]);
        wx.stopPullDownRefresh();
      },
      fail: function(res) {
        console.log("faile");
      }
    })
  },
  getWholesaleCallback: function(self, wholesale) {
    wholesale = this.processOrderTime(wholesale);
    wholesale = this.processOrderPrice(wholesale);
    console.log('wholesale:', wholesale)
    self.setData({
      wholesale: wholesale
    })
  },

  processOrderTime: function(wholesale) {
    wholesale.wholesaleOrder.orderTimeTime = util.getTimeFromDate(wholesale.wholesaleOrder.orderTime);
    wholesale.wholesaleOrder.orderTimeDay = util.getDayFromDate(wholesale.wholesaleOrder.orderTime);
    return wholesale;
  },


  processOrderPrice:function(wholesale){
    var wholesaleOrderDetails = wholesale.wholesaleOrderDetail;
    for (var i = 0; i < wholesaleOrderDetails.length; i++){
      var wholesaleOrderDetail = wholesaleOrderDetails[i];
      wholesaleOrderDetail.price = parseInt(wholesaleOrderDetail.price * 100)
    }
    return wholesale;
  },
  callMe: function(e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  confirmService: function(e) {
    var self = this;
    wx.showModal({
      title: '确认送达',
      content: '确认货物已经送到用户手上',
      confirmColor: '#69BAC9',
      confirmText: '已送达',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          self.confirmServiceWholesale(self.data.wholesale.wholesaleOrder.wholesaleOrderId);
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  confirmServiceWholesale: function(wholesaleOrderId) {
    wx.showLoading({
      title: '正在载入'
    })
    wx.request({
      url: app.globalData.serverIp + 'updWholesaleOrder.do',
      data: {
        wholesaleOrderId: wholesaleOrderId,
        orderStatus: '已送达',
        conditionParam: 'wholesaleOrderId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log(res.data);
        wx.hideLoading();
        wx.startPullDownRefresh({});
      },
      fail: function(res) {
        wx.showModal({
          title: '错误',
          content: res.data,
          showCancel: false,
          confirmText: '我知道了',
        })
      }
    })
  },
  delWholesale:function(e){
    var self = this;
    wx.showModal({
      title: '删除订单',
      content: '该操作无法撤回，请谨慎操作',
      confirmColor: '#ff000',
      confirmText: '删除',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          self.delWholesaleOrder(self.data.wholesale.wholesaleOrder.wholesaleOrderId);
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  delWholesaleOrder:function(wholesaleOrderId){
    wx.showLoading({
      title: '正在载入'
    })
    wx.request({
      url: app.globalData.serverIp + 'delWholesaleOrder.do',
      data: {
        wholesaleOrderId: wholesaleOrderId,
        conditionParam: 'wholesaleOrderId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        wx.navigateBack({});
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
  }
})