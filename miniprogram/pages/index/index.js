Page({

  /**
   * 页面的初始数据
   */
  data: {
    soup: "今天也要加油啊",
    canClick: true
  },

  refresh: function(obj){
    if(!this.data.canClick) return;
    this.setData({
      canClick: false
    })
    let {message} = obj
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    
  }
})