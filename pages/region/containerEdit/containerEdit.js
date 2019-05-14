// pages/region/dormitoryEdit/dormitoryEdit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    container: {
      dormitoryId:'',
      containerId: '',
      containerName: '',
      boxNum:0,
      dayAvgTrd:0,
      dayToDealBoxNum:0,
      dayTrd:0,
      lastDayTrd:0,
      remainToDealBoxNum:0,
      sevenDayLiveBoxNum:0,
      thirtyDayLiveBoxNum:0,
    },
    isEdit: false,
    interfaceName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self = this;
    var isEdit = options.isEdit;
    var interfaceName = options.interfaceName;
    var dormId = options.dormId;
    var containerId = options.containerId;

    self.setData({
      isEdit: isEdit,
      interfaceName: interfaceName
    })

    //编辑
    if (isEdit == 'true') {
      wx.setNavigationBarTitle({
        title: '编辑宿舍'
      });
      this.data.container.containerId = containerId;
      this.getContainer(containerId);
    } //添加
    else {
      wx.setNavigationBarTitle({
        title: '添加宿舍'
      });
      this.data.container.dormId = dormId;
    }

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



  getContainer: function (containerId) {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selContainer.do',
      data: {
        containerId: containerId,
        conditionParam: 'containerId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data)
        self.getContainerCallback(self, res.data[0]);
      },
      fail: function (res) {
        console.log("faile");
      }
    })
  },
  getContainerCallback: function (self, container) {
    self.setData({
      container: container 
    })
  },


  editRadioChange: function (e) {

  },

  editInputChange: function (e) {
    var value = e.detail.value;
    var name = e.currentTarget.dataset.name;
    if (name == 'containerName') {
      this.data.container.containerName = value;
    }
  },

  editSubmit: function (e) {
    var self = this;
    var container = this.data.container;
    if (self.checkInput(container)) {
      wx.showModal({
        title: '请确认信息',
        content: "宿舍名:" + container.containerName,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            self.addContainer(self, container);
            //调用接口
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    } else {
      wx.showModal({
        content: '请填写全部目录信息',
        showCancel: false
      })
    }
  },
  checkInput: function (container) {
    if (container.containerName.length < 1) {
      return false;
    }
    return true;
  },

  addContainer: function (self, container) {
    console.log(container);
    wx.showLoading({
      title: '正在载入'
    })

    wx.request({
      url: app.globalData.serverIp + self.data.interfaceName,
      data: {
        dormId: container.dormId,
        containerId: container.containerId,
        containerName: container.containerName,
        boxNum: container.boxNum,
        dayAvgTrd: container.dayAvgTrd,
        dayToDealBoxNum: container.dayToDealBoxNum,
        dayTrd: container.dayTrd,
        lastDayTrd: container.lastDayTrd,
        remainToDealBoxNum: container.remainToDealBoxNum,
        sevenDayLiveBoxNum: container.sevenDayLiveBoxNum,
        thirtyDayLiveBoxNum: container.thirtyDayLiveBoxNum,
        conditionParam: 'containerId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        wx.navigateBack({})
      },
      fail: function (res) {
        console.log("faile");
        console.log(res.data);
        wx.hideLoading();
      }
    })
  },
})