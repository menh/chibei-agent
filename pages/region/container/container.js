// pages/region/school/school.js
const app = getApp()
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    container: {},
    category: 'box',
    sortBox: 'box',
    boxs: [],
    agents: [],
    bills: [],
    isSort:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var containerId = options.containerId;
    this.data.container.containerId = containerId;
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
    this.getContainer(this.data.container.containerId);
    this.getAgents(this.data.container.containerId);
    this.getBoxs(this.data.container.containerId);
    this.getBills(this.data.container.containerId);
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


  getBills: function (containerId) {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selContainerSaleController.do',
      data: {
        containerId:containerId,
        conditionParam: 'containerId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // console.log(res.data)
        self.getBillsCallback(res.data.reverse());
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


  getBillsCallback: function (bills) {
    bills = this.setServiceChargeOfBills(bills);
    bills = this.setDayOfBills(bills);
    console.log('bills:', bills)

    this.setData({
      bills: bills,
    })
  },
  setDayOfBills: function (bills) {
    for (var i = 0; i < bills.length; i++) {
      var bill = bills[i];
      var recordDate = util.string2Date(bill.recordDate);
      var date = new Date(recordDate);
      date.setDate(recordDate.getDate() - 1);
      bill.recordDateDay = util.getDayFromDate(util.date2String(date))
    }
    return bills;
  },
  setServiceChargeOfBills: function (bills) {
    for (var i = 0; i < bills.length; i++) {
      var bill = bills[i];
      bill.serviceCharge = (parseInt(bill.dayTrd * 100) - parseInt(bill.toCash * 100)) / 100;
    }
    return bills;
  },

  containerSaleMention: function (e) {
    var containerSaleId = e.currentTarget.dataset.id;
    var self = this;
    wx.showModal({
      title: '设为提现',
      content: '是否要将该记录设为已提现？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          self.mentionContainerSale(containerSaleId);
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  mentionContainerSale: function (containerSaleId) {
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
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        wx.startPullDownRefresh({});
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


  tapDeleteContainerSale: function (e) {
    var containerSaleId = e.currentTarget.dataset.id;
    var self = this;
    wx.showModal({
      title: '删除',
      content: '是否要删除该记录',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          self.delContainerSale(containerSaleId);
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  },
  delContainerSale: function (containerSaleId) {
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
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        wx.startPullDownRefresh({});
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









  getContainer: function(containerId) {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selContainerStatisticInfo.do',
      data: {
        containerId: containerId,
        conditionParam: 'containerId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log('container:', res.data)
        self.getContainerCallback(self, res.data[0]);
        wx.stopPullDownRefresh();
      },
      fail: function(res) {
        console.log("faile");
      }
    })
  },
  getContainerCallback: function(self, container) {
    self.setData({
      container: container
    })
  },


  getBoxs: function(containerId) {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selBox.do',
      data: {
        containerId: containerId,
        conditionParam: 'containerId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log('box:', res.data)
        self.getBoxsCallback(self, res.data);
        wx.stopPullDownRefresh();
      },
      fail: function(res) {
        console.log("faile");
      }
    })
  },
  getBoxsCallback: function(self, boxs) {
    boxs = self.processDateForBoxs(boxs); //对时间进行处理
    boxs = self.processDataForBoxs(boxs); //对数据进行处理
    self.setData({ //更新box，及其显示模式
      boxs: boxs
    })
  },


  processDateForBoxs: function(boxs) { //为盒子处理时间
    for (var i = 0; i < boxs.length; i++) {
      var temp = boxs[i];
      temp.attendDateDay = util.getDayFromDate(temp.attendDate);
      temp.attendDateTime = util.getTimeFromDate(temp.attendDate);
      temp.lastSuppleDateDay = util.getDayFromDate(temp.lastSuppleDate);
      temp.lastSuppleDateTime = util.getTimeFromDate(temp.lastSuppleDate);
      temp.lastPurchaseDateDay = util.getDayFromDate(temp.lastPurchaseDate);
      temp.lastPurchaseDateTime = util.getTimeFromDate(temp.lastPurchaseDate);
      temp.visitDateDay = util.getDayFromDate(temp.visitDate);
      temp.visitDateTime = util.getTimeFromDate(temp.visitDate);
    }

    return boxs;
  },
  processDataForBoxs: function(boxs) { //处理剩余商品
    for (var i = 0; i < boxs.length; i++) {
      var temp = boxs[i];
      temp.residualNum = temp.goodsNum - temp.sellNum;
    }
    return boxs;
  },

  getAgents: function(containerId) {
    var self = this;
    console.log('containerId:', containerId)
    wx.request({
      url: app.globalData.serverIp + 'selAgent.do',
      data: {
        containerId: containerId,
        conditionParam: 'containerId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log('agent:', res.data)
        self.getAgentsCallback(self, res.data);
        wx.stopPullDownRefresh();
      },
      fail: function(res) {
        console.log("faile");
      }
    })
  },
  getAgentsCallback: function(self, agents) {
    self.setData({
      agents: agents
    })
  },

  navigate: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },
  tapCategory: function(e) {
    let category = e.currentTarget.dataset.category;
    this.setData({
      category: category
    });
  },
  tapSort: function (e) {
    let sortBox = e.currentTarget.dataset.sort;
    if (sortBox == this.data.sortBox) {
      this.data.sortBoxFlag = (this.data.sortBoxFlag == 0 ? 1 : 0);
    }
    this.setBoxsBySort(sortBox, this.data.sortBoxFlag);
    this.setData({
      sortBox: sortBox
    });
  },


  setBoxsBySort: function (sortBox, sortBoxFlag) {
    var compare;
    if (sortBox == 'box') {
      compare = function (order1, order2) { //比较函数
        if (parseInt(order1.boxId) < parseInt(order2.boxId)) {
          return -1;
        } else if (parseInt(order1.boxId) > parseInt(order2.boxId)) {
          return 1;
        } else {
          return 0;
        }
      }
    } else if (sortBox == 'room') {
      compare = function (order1, order2) { //比较函数
        if (order1.room < order2.room) {
          return 1;
        } else if (order1.room > order2.room) {
          return -1;
        } else {
          return 0;
        }
      }
    } else if (sortBox == 'proportion') {
      compare = function (order1, order2) { //比较函数
        if (order2.sellRatio == 'null' || parseFloat(order1.sellRatio) < parseFloat(order2.sellRatio)) {
          return 1;
        } else if (order1.sellRatio == 'null' || parseFloat(order1.sellRatio) > parseFloat(order2.sellRatio)) {
          return -1;
        } else {
          return 0;
        }
      }
    } else if (sortBox == 'surplus') {
      compare = function (order1, order2) { //比较函数
        if (order1.residualNum < order2.residualNum) {
          return -1;
        } else if (order1.residualNum > order2.residualNum) {
          return 1;
        } else {
          return 0;
        }
      }

    } else if (sortBox == 'time') {
      compare = function (order1, order2) { //比较函数
        if (order2.lastPurchaseDate == '' || order2.lastPurchaseDate == 'null' || parseInt(order1.lastPurchaseDate) > parseInt(order2.lastPurchaseDate)) {
          return 1;
        } else if (order1.lastPurchaseDate == '' || order1.lastPurchaseDate == 'null' || parseInt(order1.lastPurchaseDate) < parseInt(order2.lastPurchaseDate)) {
          return -1;
        } else {
          return 0;
        }
      }
    }
    this.setData({
      boxs: sortBoxFlag == 0 ? this.data.boxs.sort(compare) : this.data.boxs.sort(compare).reverse()
    })

  },
  
  tapDelete: function(e) {
    var self = this;
    wx.showModal({
      title: '是否删除',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          //调用接口
          self.delContainer(self, self.data.container)
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })

  },
  delContainer: function(self, container) {
    console.log(container);
    wx.showLoading({
      title: '正在载入'
    })

    wx.request({
      url: app.globalData.serverIp + 'delContainer.do',
      data: {
        containerId: container.containerId,
        conditionParam: 'containerId'
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
  },

  tapDeleteAgent: function (e) {
    var self = this;
    var openId = e.currentTarget.dataset.openid;
    console.log(openId)
    wx.showModal({
      title: '是否删除',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          //调用接口
          self.delAgent(self, openId)
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })

  },
  delAgent: function (self, openId) {
    console.log(openId);
    wx.showLoading({
      title: '正在载入'
    })

    wx.request({
      url: app.globalData.serverIp + 'delAgent.do',
      data: {
        openId: openId,
        conditionParam: 'openId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        wx.startPullDownRefresh({})
      },
      fail: function (res) {
        console.log("faile");
        console.log(res.data);
        wx.hideLoading();
      }
    })
  },
  copyContainerInfo: function (e) {
    var containerId = e.currentTarget.dataset.id;
    wx.setClipboardData({
      data: 'ocR1W4_-WJJH-SMFgpdDKTmngvew' + containerId,
      success: function (res) {
        wx.showToast({
          title: '已复制登录信息',
        })
      },
    })
  },
  copyAgentInfo: function (e) {
    var openid = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.setClipboardData({
      data: 'name:' + name + ';openid:'+openid,
      success: function (res) {
        wx.showToast({
          title: '已复制代理信息',
        })
      },
    })
  }
})