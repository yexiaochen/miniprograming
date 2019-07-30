//Page Object
Page({
  data: {
    // change tab
    activedIndex: 0,
    targetType: [
      {
        type: 'year',
        text: 'year',
        icon: '../../images/year.png'
      },
      {
        type: 'month',
        text: 'month',
        icon: '../../images/month.png'
      },
      {
        type: 'day',
        text: 'day',
        icon: '../../images/date.png'
      }
    ]
  },
  selectedType(event){
    let data = event.currentTarget.dataset;
    let {index, type} = data;
    this.setData({
      activedIndex: index
    })
    console.log('index:type', index, type, this.data)
  },
  //options(Object)
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  //item(index,pagePath,text)
  onTabItemTap: function (item) {

  }
});