// pages/region/schoolEdit/schoolEdit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: {
      categoryId:'',
      categoryName:'',
      schoolId:'',
      reorder:'100',
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
    var categoryId = options.categoryId;
    var schoolId = options.schoolId;

    self.setData({
      isEdit: isEdit,
      interfaceName: interfaceName
    })
    //编辑
    if (isEdit == 'true') {
      wx.setNavigationBarTitle({
        title: '编辑目录'
      });
      this.getCategory(categoryId);
    } //添加
    else {
      wx.setNavigationBarTitle({
        title: '添加目录'
      });
      this.data.category.schoolId = schoolId;
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

  getCategory: function (categoryId) {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selCategory.do',
      data: {
        categoryId: categoryId,
        conditionParam: 'categoryId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data)
        self.getCategoryCallback(self, res.data[0]);
      },
      fail: function (res) {
        console.log("faile");
      }
    })
  },
  getCategoryCallback: function (self, category) {
    console.log(category)
    self.setData({
      category: category
    })
  },


  editRadioChange: function (e) {
    var value = e.detail.value;
    var name = e.currentTarget.dataset.name;
    if (name == 'categoryType') {
      this.data.category.categoryType = value;
    } else if (name == 'valid') {
      this.data.category.valid = value;
    }
  },

  editInputChange: function (e) {
    var value = e.detail.value;
    var name = e.currentTarget.dataset.name;
    if (name == 'categoryName') {
      this.data.category.categoryName = value;
    }
  },
  editSubmit: function (e) {
    var self = this;
    var category = this.data.category;
    if (self.checkInput(category)) {
      wx.showModal({
        title: '请确认信息',
        content: "目录名:" + category.categoryName,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            self.addCategory(self, category);
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
  checkInput: function (category) {
    if (category.categoryName.length < 1) {
      return false;
    }
    return true;
  },

  addCategory: function (self, category) {
    console.log(category);
    wx.showLoading({
      title: '正在载入'
    })

    wx.request({
      url: app.globalData.serverIp + self.data.interfaceName,
      data: {
        categoryId: category.categoryId,
        schoolId: category.schoolId,
        categoryName: category.categoryName,
        reorder: category.reorder,
        conditionParam: 'categoryId'
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