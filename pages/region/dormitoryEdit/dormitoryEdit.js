// pages/region/dormitoryEdit/dormitoryEdit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dormitory: {
      schoolId: '',
      dormName: '',
    },
    isEdit: false,
    interfaceName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
 
    var self = this;
    var isEdit = options.isEdit;
    var interfaceName = options.interfaceName;
    var schoolId = options.schoolId;
    var dormId = options.dormId;
    console.log(options)

    self.setData({
      isEdit: isEdit,
      interfaceName: interfaceName
    })
    //编辑
    if (isEdit == 'true') {
      wx.setNavigationBarTitle({
        title: '编辑学校'
      });
      this.getDorm(dormId);
    } //添加
    else {
      wx.setNavigationBarTitle({
        title: '添加学校'
      });
      this.data.dormitory.schoolId = schoolId;
      console.log(this.data.dormitory.schoolId)
    }
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


  getDorm: function (dormId) {
    console.log('dormId:',dormId);
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selDorm.do',
      data: {
        dormId: dormId,
        conditionParam: 'dormId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data)
        self.getDormCallback(self, res.data[0]);
      },
      fail: function (res) {
        console.log("faile");
      }
    })
  },
  getDormCallback: function (self, dormitory) {
    self.setData({
      dormitory: dormitory
    })
  },

  editRadioChange: function(e) {

  },

  editInputChange: function(e) {
    var value = e.detail.value;
    var name = e.currentTarget.dataset.name;
    if (name == 'dormName') {
      this.data.dormitory.dormName = value;
    }
  },

  editRadioChange: function(e) {
    var value = e.detail.value;
    var name = e.currentTarget.dataset.name;
    if (name == 'dormSex') {
      this.data.dormitory.dormSex = value;
    }
  },

  editSubmit: function(e) {
    var self = this;
    var dormitory = this.data.dormitory;
    if (self.checkInput(dormitory)) {
      wx.showModal({
        title: '请确认信息',
        content: "学校名:" + dormitory.dormName,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            self.addDormitory(self, dormitory);
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
  checkInput: function(dormitory) {
    console.log(dormitory)
    if (dormitory.dormName.length < 1) {
      return false;
    }
    return true;
  },

  addDormitory: function(self, dormitory) {
    console.log(dormitory);
    console.log(app.globalData.serverIp + self.data.interfaceName);
    wx.showLoading({
      title: '正在载入'
    })

    wx.request({
      url: app.globalData.serverIp + self.data.interfaceName,
      data: {
        dormId: dormitory.dormId,
        schoolId: dormitory.schoolId,
        dormName: dormitory.dormName,
        conditionParam:'dormId'
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
})