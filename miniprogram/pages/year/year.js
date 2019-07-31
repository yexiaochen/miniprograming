//Page Object
Page({
  data: {
    yearHeight: 0,
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
  selectedType(event) {
    let data = event.currentTarget.dataset;
    let { index, type } = data;
    this.setData({
      activedIndex: index
    })
    console.log('index:type', index, type, this.data)
  },

  //options(Object)
  onLoad: function (options) {
    let height = {};
    let query = wx.createSelectorQuery().in(this);
    query.selectAll('#little_target, #target_type, #target_content').boundingClientRect(
      res => {
        res.map(item => {
          height[`${item.id}_height`] = item.height;
        })
        let chartHeight = height.little_target_height - height.target_content_height - height.target_type_height - 20;
        this.setData({
          yearHeight: chartHeight
        })
      }
    ).exec();
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