// pages/region/dormitoryEdit/dormitoryEdit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agent: {
      openId:'',
      containerId:'',
      name:'',
      grade:'',
      nickName:'',
      sex:'',
      phone:'',
      wechatAvatar:'/image/operation/person.png',
      room:'',
      withdrawCashPermission:''
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
    var containerId = options.containerId;
    var openId = options.openId;

    self.setData({
      isEdit: isEdit,
      interfaceName: interfaceName
    })

    //编辑
    if (isEdit == 'true') {
      wx.setNavigationBarTitle({
        title: '编辑代理'
      });
      this.data.agent.openId = openId;
      this.getAgent(openId);
      // this.searchOneBox(options.boxId);
    } //添加
    else {
      wx.setNavigationBarTitle({
        title: '添加代理'
      });
      this.data.agent.containerId = containerId;
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

  getAgent: function (openId) {
    var self = this;
    console.log('openId:',openId)
    wx.request({
      url: app.globalData.serverIp + 'selAgent.do',
      data: {
        openId: openId,
        conditionParam: 'openId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log('agent:', res.data)
        self.getAgentCallback(self, res.data[0]);
        wx.stopPullDownRefresh();
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
  getAgentCallback: function (self, agent) {
    self.setData({
      agent: agent
    })
  },

  editRadioChange: function (e) {
    var value = e.detail.value;
    var name = e.currentTarget.dataset.name;
    if (name == 'grade') {
      this.data.agent.grade = value;
    } else if (name == 'sex') {
      this.data.agent.sex = value;
    } else if (name == 'withdrawCashPermission') {
      this.data.agent.withdrawCashPermission = value;
    }
  },

  editInputChange: function (e) {
    var value = e.detail.value;
    var name = e.currentTarget.dataset.name;
    if (name == 'openId') {
      this.data.agent.openId = value;
    } else if (name == 'name') {
      this.data.agent.name = value;
    } else if (name == 'nickName') {
      this.data.agent.nickName = value;
    } else if (name == 'phone') {
      this.data.agent.phone = value;
    } else if (name == 'wechatAvatar') {
      this.data.agent.wechatAvatar = value;
    } else if (name == 'room') {
      this.data.agent.room = value;
    } 
  },


  editSubmit: function (e) {
    var self = this;
    var agent = this.data.agent;
    if (self.checkInput(agent)) {
      wx.showModal({
        title: '请确认信息',
        content: "代理名:" + agent.name,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            self.addAgent(self, agent);
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

  checkInput: function (agent) {
    console.log(agent)
    if (agent.openId.length < 1) {
      return false;
    } else if (agent.name.length < 1) {
      return false;
    } else if (agent.grade.length < 1) {
      return false;
    } else if (agent.nickName.length < 1) {
      return false;
    } else if (agent.sex.length < 1) {
      return false;
    } else if (agent.phone.length < 1) {
      return false;
    } else if (agent.wechatAvatar.length < 1) {
      return false;
    } else if (agent.room.length < 1) {
      return false;
    } else if (agent.withdrawCashPermission.length < 1) {
      return false;
    }
    return true;
  }, 

  addAgent: function (self, agent) {
    console.log(agent);
    wx.showLoading({
      title: '正在载入'
    })

    wx.request({
      url: app.globalData.serverIp + self.data.interfaceName,
      data: {
        openId: agent.openId,
        containerId: agent.containerId,
        name: agent.name,
        grade: agent.grade,
        nickName: agent.nickName,
        sex: agent.sex,
        phone: agent.phone,
        wechatAvatar: agent.wechatAvatar,
        room: agent.room,
        withdrawCashPermission: agent.withdrawCashPermission,
        conditionParam: 'openId'
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
        wx.showModal({
          title: '错误',
          content: res.data,
          showCancel: false,
          confirmText: '我知道了',
        })
        wx.hideLoading();
      }
    })
  },
})