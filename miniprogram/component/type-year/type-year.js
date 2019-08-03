import * as echarts from '../ec-canvas/echarts';
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const day = date.getDate();
const now = `${year}-${month + 1}-${day}`;
const fromDate = `${year}-01-01`;
const toDate = `${year + 1}-01-01`;

let chart = null;

function initChart(canvas, width, height, obj) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    series: [{
      name: '一生',
      type: 'gauge',
      z: 3,
      min: 0,
      max: obj.max,
      splitNumber: 5,
      radius: '70%',
      startAngle: 90,
      endAngle: -269,
      axisLine: {
        lineStyle: {
          width: 5,
          color: [
            obj.lineColor, [1, '#ccc']
          ]
        }
      },
      axisTick: {
        length: 15,
        lineStyle: {
          color: 'auto',
        }
      },
      splitLine: {
        length: 20,
        lineStyle: {
          color: 'auto'
        }
      },
      axisLabel: {
        show: false
      },
      pointer: {
        width: 5
      },
      title: {
        show: false
      },
      detail: {
        show: false
      },
      data: [{
        value: obj.value
      }]
    }]
  };

  chart.setOption(option);
  return chart;
}

Component({
  properties: {
    chartHeight: Number
  },
  data: {
    ec: {},
    fromDate: fromDate,
    toDate: toDate,
    totalDays: 0,
    exhaustedDays: 0,
    leavedDays: 0,
    total: [],
    exhausted: [],
    totalTips: '',
    exhaustedTips: '',
    leavedTips: '',
    activeYearType: 'year',
    yearType: [{
      type: 'year',
      text: '是一年'
    },
    {
      type: 'life',
      text: '还是一辈子'
    }
    ]
  },
  lifetimes: {
    attached: function () {
      wx.getStorage({
        key: 'key',
        success: res => {
          this.setData({
            fromDate: res.data
          })
          console.log(res.data)
        }
      })
      this.computeDays();
    }
  },
  methods: {
    echartInit(e) {
      let percent = (this.data.exhaustedDays / this.data.totalDays).toFixed(2) || 0;
      let chartConfig = {
        max: this.data.totalDays,
        value: this.data.exhaustedDays,
        lineColor: [percent, '#696969']
      }
      // Note： 动态注入宽高
      initChart(e.detail.canvas, e.detail.width, this.data.chartHeight, chartConfig)
    },
    computeDays() {
      let yearOrlife;
      if (this.data.fromDate != fromDate || this.data.toDate != toDate) {
        yearOrlife = '我这一生';
        this.setData({
          activeYearType: 'life'
        })
      } else {
        yearOrlife = '这一年'
        this.setData({
          activeYearType: 'year'
        })
      }
      // Note: iOS parse 处理方式
      let iOSFromTime = this.data.fromDate.replace(/-/g, '/');
      let iOSToTime = this.data.toDate.replace(/-/g, '/');
      let iOSNowTime = now.replace(/-/g, '/');
      let fromTime = Date.parse(this.data.fromDate) || Date.parse(iOSFromTime);
      let toTime = Date.parse(this.data.toDate) || Date.parse(iOSToTime);
      let nowTime = Date.parse(now) || Date.parse(iOSNowTime);
      let Conversion = (time) => Math.round((time) / (24 * 60 * 60 * 1000));
      let totalTime = toTime - fromTime;
      let exhaustedTime = nowTime - fromTime;
      let leavedTime = toTime - nowTime;
      let totalDays = exhaustedTime >= 0 ? Conversion(totalTime) : 0;
      let exhaustedDays = exhaustedTime >= 0 ? Conversion(exhaustedTime) : 0;
      let leavedDays = leavedTime >= 0 ? Conversion(leavedTime) : 0;
      let totalTips = exhaustedTime >= 0 ? `${yearOrlife}也就 ${totalDays} 天` : `你怕不是地球人吧`;
      let exhaustedTips = exhaustedTime >= 0 ? `已过去了 ${exhaustedDays} 天` : `你回到未来时，捎上我`;
      let leavedTips = leavedTime >= 0 ? `还剩下 ${leavedDays} 天` : `你回到过去时，捎上我`;
      this.setData({
        leavedDays,
        exhaustedDays,
        totalDays,
        totalTips,
        exhaustedTips,
        leavedTips
      });
      let percent = (exhaustedDays / totalDays).toFixed(2) || 0;
      if (chart) chart.setOption({ series: { max: totalDays, data: [{ value: exhaustedDays }], axisLine: { lineStyle: { color: [[percent, '#696969'], [1, '#ccc']] } } } });
    },
    bindFromDateChange(event) {
      let value = event.detail.value;
      let { activeYearType } = this.data;
      if (activeYearType == 'life') {
        wx.setStorage({
          key: "birthDay",
          data: value
        })
      }
      this.setData({
        fromDate: value || fromDate
      })
      this.computeDays();
    },
    bindToDateChange(event) {
      let value = event.detail.value;
      let { activeYearType } = this.data;
      if (activeYearType == 'life') {
        wx.setStorage({
          key: "deathDay",
          data: value
        })
      }
      this.setData({
        toDate: value || toDate
      })
      this.computeDays();
    },
    selectedYearType(event) {
      let data = event.currentTarget.dataset;
      let {
        type
      } = data;
      if (type == 'year') {
        this.setData({
          fromDate: fromDate,
          toDate: toDate,
          activeYearType: type
        })
      } else {
        try {
          var birthDay = wx.getStorageSync('birthDay')
          var deathDay = wx.getStorageSync('deathDay')
        } catch (e) {
          console.log('birthDay', e.message);
        }
        this.setData({
          fromDate: birthDay || `${1990}-${month + 1}-${day}`,
          toDate: deathDay || `${2090}-${month + 1}-${day}`,
          activeYearType: type
        })
      }
      this.computeDays();
    },
    selectedType(event) {
      let data = event.currentTarget.dataset;
      let {
        index
      } = data;
      this.setData({
        activatedIndex: index
      })
    }
  }
})