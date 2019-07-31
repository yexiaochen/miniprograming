Page({
  /**
   * 页面的初始数据
   */
  data: {
    soup: "今天也要加油啊",
    canClick: true
  },

  refresh: function (obj) {
    if (!this.data.canClick) return;
    this.setData({
      canClick: false
    })
    let { message } = obj
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: "crawler",
      success: res => {
        wx.hideLoading();
        this.setData({
          soup: res.result,
          canClick: true
        })
      },
      fail: err => {
        wx.hideLoading();
        this.setData({
          soup: message || "鸡汤要一口一口喝，你太急啦",
          canClick: true
        })
        console.error('[云函数] [crawler] templateMessage.send 调用失败：', err)
      }
    })
  }
})