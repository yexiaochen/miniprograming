//Page Object
Page({
  data: {
    yearHeight: 0,
    monthHeight: 0,
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
        type: 'date',
        text: 'date',
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

  onLoad: function (options) {
    let height = {};
    let query = wx.createSelectorQuery().in(this);
    query.selectAll('#little_target, #target_type, #target_content').boundingClientRect(
      res => {
        res.map(item => {
          height[`${item.id}_height`] = item.height;
        })
        let yearChartHeight = height.little_target_height - height.target_content_height - height.target_type_height - 20;

        let monthChartHeight = height.little_target_height - height.target_type_height - 50;
        
        this.setData({
          yearHeight: yearChartHeight,
          monthHeight: monthChartHeight
        })
      }
    ).exec();
  }

});