// pages/region/schoolEdit/schoolEdit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    school:{
      schoolName:''
    }, 
    isEdit:false,
    interfaceName:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var isEdit = options.isEdit;
    var interfaceName = options.interfaceName;
    var schoolId = options.schoolId;

    self.setData({
      isEdit: isEdit,
      interfaceName:interfaceName
    })
    //编辑
    if (isEdit == 'true') {
      wx.setNavigationBarTitle({
        title: '编辑学校'
      });
      this.getSchool(schoolId);
    } //添加
    else {
      wx.setNavigationBarTitle({
        title: '添加学校'
      });
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

  getSchool: function (schoolId) {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selSchool.do',
      data: {
        schoolId: schoolId,
        conditionParam: 'schoolId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data)
        self.getSchoolCallback(self, res.data[0]);
      },
      fail: function (res) {
        console.log("faile");
      }
    })
  },
  getSchoolCallback: function (self, school) {
    self.setData({
      school: school
    })
  },
  editInputChange:function(e){
    var value = e.detail.value;
    var name = e.currentTarget.dataset.name;
    if (name == 'schoolName') {
      this.data.school.schoolName = value;
    }
  },
  editSubmit: function (e) {
    var self = this;
    var school = this.data.school;
    if (self.checkInput(school)) {
      wx.showModal({
        title: '请确认信息',
        content: "学校名:" + school.schoolName,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            self.addSchool(self,school);
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
  checkInput: function (school){
    if (school.schoolName.length < 1){
      return false;
    }
    return true;
  },

  addSchool: function (self,school) {
    console.log(school);
    wx.showLoading({
      title: '正在载入'
    })

    wx.request({
      url: app.globalData.serverIp + self.data.interfaceName,
      data: {
        schoolId:school.schoolId,
        schoolName:school.schoolName,
        conditionParam:'schoolId'
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