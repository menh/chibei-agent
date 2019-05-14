// pages/region/schoolEdit/schoolEdit.js
const app = getApp()
const upng = require('../../../utils/UPNG.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good: {
      categoryId: '',
      goodId: '',
      goodName: '',
      goodPic: '/image/operation/add3.png',
      goodUnit: '',
      price: '',
      cost: '',
      reorder: '100',
      valid: '是'
    },
    isEdit: false,
    interfaceName: '',
    isCanvasShow: false,
    categoryMultiIndex: 0,
    categoryMultiArray: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    var isEdit = options.isEdit;
    var interfaceName = options.interfaceName;
    var goodId = options.goodId;
    var categoryId = options.categoryId;

    //测试用
    // var isEdit = false;
    // var interfaceName = 'addGood.do';
    // var goodId = '';
    // var categoryId = 'C00000001';

    self.setData({
      isEdit: isEdit,
      interfaceName: interfaceName
    })
    //编辑
    if (isEdit == 'true') {
      wx.setNavigationBarTitle({
        title: '编辑商品'
      });
      //获取good与category后将category根据good的category设置
      this.getGood(goodId);
    } //添加
    else {
      wx.setNavigationBarTitle({
        title: '添加商品'
      });
      this.data.good.categoryId = categoryId;
      //获取category后将category根据good的categoryId设置
      this.getCategory(categoryId);
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

  getCategory: function(categoryId) {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selCategory.do',
      data: {
        schoolId: app.globalData.school.schoolId,
        conditionParam: 'schoolId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        self.getCategoryCallback(self, res.data, categoryId);
      },
      fail: function(res) {
        console.log("faile");
      }
    })
  },

  getCategoryCallback: function(self, categorys, categoryId) {
    console.log('categorys:',categorys)
    var categoryMultiIndex = self.getCategoryMultiIndexFromCategorys(categorys, categoryId);
    self.setData({
      categoryMultiIndex: categoryMultiIndex,
      categoryMultiArray: categorys
    })
  },
  getCategoryMultiIndexFromCategorys: function (categorys, categoryId) {
    var categoryMultiIndex = 0;
    for (var i = 0; i < categorys.length; i++) {
      var item = categorys[i];
      if (item.categoryId == categoryId) {
        categoryMultiIndex = i;
        return categoryMultiIndex;
      }
    }
    return categoryMultiIndex;
  },

  categoryChange: function(e) {
    console.log(e.detail.value)
    var category = this.data.categoryMultiArray[e.detail.value];
    console.log('category:', category)
    this.setData({
      categoryMultiIndex: e.detail.value,
      ['good.categoryId']: category.categoryId
    })
    console.log('good:', this.data.good)
  },

  getGood: function(goodId) {
    var self = this;
    wx.request({
      url: app.globalData.serverIp + 'selGoodBase64.do',
      data: {
        goodId: goodId,
        conditionParam: 'goodId'
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log(res.data)
        self.getGoodCallback(self, res.data[0]);
      },
      fail: function(res) {
        console.log("faile");
      }
    })
  },
  getGoodCallback: function(self, good) {
    self.getCategory(good.categoryId);
    self.setWholesaler(good.wholesaler);
    console.log(good)
    self.setData({
      good: good
    })
  },

  setWholesaler: function(wholesaler) {
    var wholesalerMultiArray = this.data.wholesalerMultiArray;
    if (wholesaler != undefined && wholesaler != null && wholesaler != '') {
      for (var i = 0; i < wholesalerMultiArray.length; i++) {
        var wholesalerTemp = wholesalerMultiArray[i];
        if (wholesaler == wholesalerTemp) {
          this.setData({
            wholesalerMultiIndex: [i]
          })
          break;
        }
      }
    }
  },


  editPickerChange: function(e) {
    var value = e.detail.value;
    var name = e.currentTarget.dataset.name;

    if (name == 'wholesaler') {
      this.setData({
        wholesalerMultiIndex: value
      });
      var wholesalerMultiArray = this.data.wholesalerMultiArray;
      var wholesalerMultiIndex = this.data.wholesalerMultiIndex;
      this.data.good.wholesaler = wholesalerMultiArray[wholesalerMultiIndex[0]];
    }
  },

  editRadioChange: function(e) {
    var value = e.detail.value;
    var name = e.currentTarget.dataset.name;
    if (name == 'valid') {
      this.data.good.valid = value;
    }
  },

  editInputChange: function(e) {
    var value = e.detail.value;
    var name = e.currentTarget.dataset.name;
    if (name == 'goodName') {
      this.data.good.goodName = value;
    } else if (name == 'wholesaleGoodName') {
      this.data.good.wholesaleGoodName = value;
    } else if (name == 'price') {
      this.data.good.price = value;
    } else if (name == 'wholesalePrice') {
      this.data.good.wholesalePrice = value;
    } else if (name == 'cost') {
      this.data.good.cost = value;
    } else if (name == 'goodUnit') {
      this.data.good.goodUnit = value;
    } else if (name == 'saleVolume') {
      this.data.good.saleVolume = value;
    }
  },
  editSubmit: function(e) {
    var self = this;
    var good = this.data.good;
    console.log(good)
    if (self.checkInput(good)) {
      wx.showModal({
        title: '请确认信息',
        content: good.goodName,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            self.addGood(self, good);
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
  checkInput: function(good) {
    if (good.goodName.length < 1) {
      return false;
    } else if (good.goodPic.length < 50) {
      return false;
    } else if (good.categoryId.length < 1) {
      return false;
    } else if (good.goodUnit.length < 1) {
      return false;
    } else if (good.price.length < 1) {
      return false;
    } else if (good.cost.length < 1) {
      return false;
    } else if (good.valid.length < 1) {
      return false;
    }
    return true;
  },

  addGood: function(self, good) {
    console.log(good);
    wx.showLoading({
      title: '正在载入'
    })

    wx.request({
      url: app.globalData.serverIp + self.data.interfaceName,
      data: {
        goodId: good.goodId,
        categoryId: good.categoryId,
        goodName: good.goodName,
        goodPic: good.goodPic,
        price: good.price,
        cost: good.cost,
        goodUnit: good.goodUnit,
        valid: good.valid,
        reorder: good.reorder,
        conditionParam: 'goodId'
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
  changeGoodPic: function(e) {
    const self = this;
    self.setData({
      isCanvasShow: true
    })
    // const platform = wx.getSystemInfoSync().platform;
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album'],
      success(res) {
        wx.showLoading({
          title: '正在替换图片',
        })
        const canvas = wx.createCanvasContext('canvas-choose-image');
        canvas.drawImage(res.tempFilePaths[0], 0, 0, 200, 200);
        canvas.draw(true, () => {
          console.log('hello')
          // 2. 获取图像数据
          wx.canvasGetImageData({
            canvasId: 'canvas-choose-image',
            x: 0,
            y: 0,
            width: 200,
            height: 200,
            success(res) {
              // if (platform === 'ios') {
              //   // 兼容处理：ios获取的图片上下颠倒 
              //   res = self.reverseImgData(res)
              // }
              // 3. png编码
              let pngData = upng.encode([res.data.buffer], res.width, res.height)
              // 4. base64编码
              let base64 = 'data:image/jpeg;base64,' + wx.arrayBufferToBase64(pngData)
              wx.hideLoading();
              wx.showToast({
                title: '替换成功',
              })
              self.setData({
                ["good.goodPic"]: base64,
                isCanvasShow: false
              })
              console.log(self.data.good)
            }
          })
        })

      },
      fail: function(res) {
        self.setData({
          isCanvasShow: false
        })
      }
    })
  }
})