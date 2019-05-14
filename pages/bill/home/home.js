// pages/bill/home/home.js
const app = getApp()
const util = require('../../../utils/util.js')

Page({

   data: {
    bills: [],
    billsNoMention: [],
    billsHadMention: [],
    billsAll: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    this.getBills();
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


  getBills: function() {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selContainerSaleController.do',
      data: {
        conditionParam: ''
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        // console.log(res.data)
        self.getBillsCallback(res.data.reverse());
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


  getBillsCallback: function(billsAll) {
    billsAll = this.setServiceChargeOfBills(billsAll);
    billsAll = this.setDayOfBills(billsAll);
    var billsNoMention = this.getNoMentionBills(billsAll);
    var billsHadMention = this.getHadMentionBills(billsAll);

    console.log('billsAll:', billsAll)
    console.log('billsNoMention:', billsNoMention)
    console.log('billsHadMention:', billsHadMention)

    this.setData({
      bills: billsAll,
      billsAll: billsAll,
      billsHadMention: billsHadMention,
      billsNoMention: billsNoMention,
    })
  },
  getHadMentionBills: function(billsAll) {
    var billsHadMention = [];
    for (var i = 0; i < billsAll.length; i++) {
      var bill = billsAll[i];
      if (bill.state == '已提现') {
        billsHadMention.push(bill)
      }
    }
    return billsHadMention;
  },
  getNoMentionBills: function(billsAll) {
    var billsNoMention = [];
    for (var i = 0; i < billsAll.length; i++) {
      var bill = billsAll[i];
      if (bill.state == '未提现') {
        billsNoMention.push(bill)
      }
    }
    return billsNoMention;
  },
  setDayOfBills: function(bills) {
    for (var i = 0; i < bills.length; i++) {
      var bill = bills[i];
      var recordDate = util.string2Date(bill.recordDate);
      var date = new Date(recordDate);
      date.setDate(recordDate.getDate() - 1);
      bill.recordDateDay = util.getDayFromDate(util.date2String(date))
    }
    return bills;
  },
  setServiceChargeOfBills: function(bills) {
    for (var i = 0; i < bills.length; i++) {
      var bill = bills[i];
      bill.serviceCharge = (parseInt(bill.dayTrd * 100) - parseInt(bill.toCash * 100)) / 100;
    }
    return bills;
  },

  containerSaleMention: function(e) {
    var containerSaleId = e.currentTarget.dataset.id;
    var self = this;
    wx.showModal({
      title: '设为提现',
      content: '是否要将该记录设为已提现？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          self.mentionContainerSale(containerSaleId);
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  mentionContainerSale: function(containerSaleId) {
    var self = this;
    wx.showLoading({
      title: '',
    });
    console.log(containerSaleId)
    wx.request({
      url: app.globalData.serverIp + 'updContainerSaleController.do',
      data: {
        containerSaleId: containerSaleId,
        state: '已提现',
        conditionParam: 'containerSaleId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log(res)
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


  tapDeleteContainerSale: function(e) {
    var containerSaleId = e.currentTarget.dataset.id;
    var self = this;
    wx.showModal({
      title: '删除',
      content: '是否要删除该记录',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          self.delContainerSale(containerSaleId);
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  delContainerSale: function(containerSaleId) {
    var self = this;
    wx.showLoading({
      title: '',
    });
    console.log(containerSaleId)
    wx.request({
      url: app.globalData.serverIp + 'delContainerSaleController.do',
      data: {
        containerSaleId: containerSaleId,
        conditionParam: 'containerSaleId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log(res)
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

  navigate: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },
})