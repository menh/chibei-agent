// pages/region/school/school.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    school: {},
    dormitorys: [],
    category: 'dorm',
    agents:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var school = app.globalData.school;
    this.setData({
      school:school
    })
    // this.data.school.schoolId = 'S00000009';
    wx.startPullDownRefresh({});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
    this.getDormitorys(this.data.school.schoolId);
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

  getSchool: function(schoolId) {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selSchoolStatisticInfo.do',
      data: {
        schoolId: schoolId,
        conditionParam: 'schoolId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        self.getSchoolCallback(self, res.data[0]);
        wx.stopPullDownRefresh();
      },
      fail: function(res) {
        console.log("faile");
      }
    })
  },
  getSchoolCallback: function(self, school) {
    console.log('school:', school)
    self.setData({
      school: school
    })
  },


  getDormitorys: function(schoolId) {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selDormStatisticInfo.do',
      data: {
        schoolId: schoolId,
        conditionParam: 'schoolId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        self.getDormitorysCallback(self, res.data);
        wx.stopPullDownRefresh();
      },
      fail: function(res) {
        console.log("faile");
      }
    })
  },
  getDormitorysCallback: function(self, dormitorys) {
    dormitorys = dormitorys.sort(function(order1, order2) {
      if (order1.dormName < order2.dormName) {
        return -1;
      } else if (order1.dormName > order2.dormName) {
        return 1;
      } else {
        return 0;
      }
    })
    console.log('dormitorys:', dormitorys)
    self.setData({
      dormitorys: dormitorys
    })
  },

  navigate: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },

  tapDelete: function(e) {
    var self = this;
    wx.showModal({
      title: '是否删除',
      content: self.data.school.schoolName,
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          //调用接口
          self.delSchool(self, self.data.school)
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })

  },
  delSchool: function(self, school) {
    console.log(school);
    wx.showLoading({
      title: '正在载入'
    })

    wx.request({
      url: app.globalData.serverIp + 'delSchool.do',
      data: {
        schoolId: school.schoolId,
        conditionParam: 'schoolId'
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


  getAgents: function (schoolId) {
    var self = this;
    console.log('schoolId:', schoolId)
    wx.request({
      url: app.globalData.serverIp + 'selSchoolAgent.do',
      data: {
        schoolId: schoolId,
        conditionParam: 'schoolId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log('agent:', res.data)
        self.getAgentsCallback(self, res.data);
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        console.log("faile");
      }
    })
  },
  getAgentsCallback: function (self, agents) {
    self.setData({
      agents: agents
    })
  },

  tapDeleteAgent: function (e) {
    var self = this;
    var schoolAgentId = e.currentTarget.dataset.id;
    console.log(schoolAgentId)
    wx.showModal({
      title: '是否删除',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          //调用接口
          self.delAgent(self, schoolAgentId)
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })

  },
  delAgent: function (self, schoolAgentId) {
    console.log(schoolAgentId);
    wx.showLoading({
      title: '正在载入'
    })

    wx.request({
      url: app.globalData.serverIp + 'delSchoolAgent.do',
      data: {
        schoolAgentId: schoolAgentId,
        conditionParam: 'schoolAgentId'
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

  tapCategory: function (e) {
    let category = e.currentTarget.dataset.category;
    this.setData({
      category: category
    });
  },

  callMe: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  
  copyAgentInfo: function (e) {
    var openid = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var phone = e.currentTarget.dataset.phone;
    var room = e.currentTarget.dataset.room;
    wx.setClipboardData({
      data: 'name:' + name + ';phone:' + phone + ';openid:' + openid + ';room:' + room,
      success: function (res) {
        wx.showToast({
          title: '已复制代理信息',
        })
      },
    })
  }
})