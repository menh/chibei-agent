 //app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    const self = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  globalData: {
    userInfo: null,
    //serverIp: 'http://localhost:8080/bubee/',
    // serverIp: 'http://203.195.196.254/snack_box_http/',
    serverIp: 'https://www.gzfjcyd.com/chibei/',
    // serverIp: 'https://www.gzfjcyd.com/snack_box_http/',
    // serverIp: 'https://www.gzfjcyd.com/snack_box_backstage/',
    openid: '',
    school:{},
    appid: 'wx7cbd42a2820d87e5',
    secret: "009741eed978535a82ea3adfc64f4fd2",
    mchId: "1505544541",
  }
})