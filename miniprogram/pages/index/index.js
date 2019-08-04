import Soup from './soup.js';

const soupLength = Soup.soup.length;


console.log('soup', Soup);
Page({
  /**
   * 页面的初始数据
   */
  data: {
    soup: "今天也要加油啊",
    canClick: true
  },

  navigateTo(event) {
    wx.navigateTo({
      url: '../about/about',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
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
  },

  drinkSoup: function () {
    if (!this.data.canClick) return;
    this.setData({
      canClick: false
    })
    wx.showLoading({
      title: '加载中',
    })
    this.simulateAjax().then(res => {
      wx.hideLoading();
      this.setData({
        soup: res,
        canClick: true
      })
    }).catch(error => {
      wx.hideLoading();
      this.setData({
        soup: "鸡汤要一口一口喝，你太急啦",
        canClick: true
      })
      console.error('simulateAjax:', err.message)
    })
  },

  simulateAjax: function () {
    return new Promise(resolve => {
      setTimeout(() => {
        let index = Math.floor(Math.random() * soupLength);
        let soup = Soup.soup[index]["text"];
        resolve(soup);
      }, 1500)
    })
  }
})