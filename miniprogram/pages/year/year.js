//Page Object
Page({
  data: {
    yearHeight: 0,
    monthHeight: 0,
    // change tab
    activatedIndex: 0,
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
        type: 'date',
        text: 'date',
        icon: '../../images/date.png'
      }
    ]
  },
  selectedType(event) {
    let data = event.currentTarget.dataset;
    let { index } = data;
    this.setData({
      activatedIndex: index
    })
  },

  onLoad: function () {
    let height = {};
    let yearChartHeight,monthChartHeight,componentHeight;
    let query = wx.createSelectorQuery().in(this); // Note: 操作节点
    query.selectAll('#little_target, #target_type, #target_content').boundingClientRect(
      res => {
        res.map(item => {
          height[`${item.id}_height`] = item.height;
        })
        yearChartHeight = height.little_target_height - height.target_content_height - height.target_type_height;

        componentHeight = monthChartHeight = height.little_target_height - height.target_type_height - 48;


        this.setData({
          yearHeight: yearChartHeight,
          monthHeight: monthChartHeight
        })
      }
    ).exec();
  }

});