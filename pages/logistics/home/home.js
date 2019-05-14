// pages/region/home/home.js
const app = getApp()
const util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'part',
    wholesales: [],
    wholesalesAll:[],
    wholesalesPart:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.test();
    wx.startPullDownRefresh({});
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
    this.getWholesales();
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
  navigate: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },
  getWholesales: function() {
    var self = this;

    var date = new Date();
    date.setDate(date.getDate() - 14);
    var beginDate = util.date2String(date)
    var endDate = util.date2String(new Date());
    console.log('beginDate:', beginDate);
    console.log('endDate:',endDate)

    wx.request({
      url: app.globalData.serverIp + 'selWholesaleOrderAndAgent.do',
      data: {
        beginDate:beginDate,
        endDate:endDate
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        self.getWholesalesCallback(self, res.data);
        wx.stopPullDownRefresh();
      },
      fail: function(res) {
        console.log("faile");
      }
    })
  },
  getWholesalesCallback: function (self, wholesalesRes) {
    wholesalesRes = this.getHadPaidwholesales(wholesalesRes);
    wholesalesRes = this.processOrderTime(wholesalesRes);
    console.log('wholesalesRes:', wholesalesRes);

    var wholesalesAll = wholesalesRes;
    var wholesalesPart = this.getWholesalesPart(wholesalesRes);
    var wholesales = this.data.type == 'part' ? wholesalesPart : wholesalesAll;
     
    self.setData({
      wholesales: wholesales,
      wholesalesAll: wholesalesAll,
      wholesalesPart: wholesalesPart
    })
  },

  getWholesalesPart:function(wholesalesRes){
    var wholesalesPart = [];
    for (var i = 0; i < wholesalesRes.length; i++) {
      var wholesaleItem = wholesalesRes[i];
      if (wholesaleItem.wholesaleOrder.orderStatus == '未送达') {
        wholesalesPart.push(wholesaleItem);
      }
    }
    return wholesalesPart;
  },

  processOrderTime: function(wholesaleOrders) {
    for (var i = 0; i < wholesaleOrders.length; i++) {
      var wholesaleOrderItem = wholesaleOrders[i];
      wholesaleOrderItem.wholesaleOrder.orderTimeTime = util.getTimeFromDate(wholesaleOrderItem.wholesaleOrder.orderTime);
      wholesaleOrderItem.wholesaleOrder.orderTimeDay = util.getDayFromDate(wholesaleOrderItem.wholesaleOrder.orderTime);
    }
    return wholesaleOrders;
  },

  getHadPaidwholesales: function(wholesales) {

    var wholesalesTemp = [];
    for (var i = 0; i < wholesales.length; i++) {
      var wholesaleItem = wholesales[i];
      if (wholesaleItem.wholesaleOrder.orderStatus != '未支付') {
        wholesalesTemp.push(wholesaleItem);
      }
    }
    return wholesalesTemp.reverse();
  },

  callMe: function(e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  navigate: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },
  changeType: function (e) {
    let type = e.currentTarget.dataset.type;

    var wholesales;
    if (type == 'part') {
      wholesales = this.data.wholesalesPart;
    } else {
      wholesales = this.data.wholesalesAll;
    }

    this.setData({
      type: type,
      wholesales: wholesales
    });
  },

  //0-10000
  test: function (e) {
    for (var i = 30000; i < 50000; i++) {
      // console.log(i)
      wx.request({
        url: 'https://weixin.ibanling.com/jdzfpay/api/item_rooms',
        data: {
          room_id: '' + i,
          sid: 'user_oOq1ws8ZbxxBrxTkBGtsDQiWsIS8_2',
        },
        method: 'GET',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.data[0] != undefined) {
            var andress = res.data.data[0];
            var temp = '';
            temp += 'room_id:' + andress.id + ' | ';
            temp += '宿舍位置:' + andress.room_name + ' | ';
            temp += '加入:' + andress.insert_time + ' | ';
            temp += '最后消费:' + andress.last_trade_time + ' | ';
            // temp += '盘点时间:' + andress.pandian_time + ' | ';
            temp += '剩余商品金额:' + andress.left_money / 100;
            console.log(temp);
          }
        },
        fail: function (res) {
          wx.hideNavigationBarLoading()
          wx.showToast({
            title: '连接失败',
            icon: 'none'
          })
        }
      });
    }
  },
})