import * as echarts from '../ec-canvas/echarts';
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const day = date.getDate();
const now = `${year}-${month+1}-${day}`;
const fromDate = `${year}-01-01`;
const toDate = `${year+1}-01-01`;

let chart = null;

function initChart(canvas, width, height, obj) {
  console.log('this', this);
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
      axisLine: { // 坐标轴线
        lineStyle: { // 属性lineStyle控制线条样式
          width: 5,
          color: [
            obj.lineColor ,[1, '#ccc']
          ]
        }
      },
      axisTick: { // 坐标轴小标记
        length: 15, // 属性length控制线长
        lineStyle: { // 属性lineStyle控制线条样式
          color: 'auto',
        }
      },
      splitLine: { // 分隔线
        length: 20, // 属性length控制线长
        lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
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
    chartHeight: Number // 简化的定义方式
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
    attached: function() {
      this.computeDays();
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    echartInit(e){
      let percent = (this.data.exhaustedDays / this.data.totalDays).toFixed(2) || 0;
      let chartConfig = {
        max: this.data.totalDays,
        value: this.data.exhaustedDays,
        lineColor: [percent, '#666']
      }
      initChart(e.detail.canvas, e.detail.width, this.data.chartHeight,chartConfig)
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
      let iOSFromTime = this.data.fromDate.replace(/-/g, '/');
      let iOSToTime = this.data.toDate.replace(/-/g, '/');
      let iOSNowTime = now.replace(/-/g, '/');
      let fromTime = Date.parse(this.data.fromDate) || Date.parse(iOSFromTime);
      let toTime = Date.parse(this.data.toDate) || Date.parse(iOSToTime);
      let nowTime = Date.parse(now) || Date.parse(iOSNowTime);
      let fromTime = Date.parse(this.data.fromDate);
      let toTime = Date.parse(this.data.toDate);
      let nowTime = Date.parse(now);
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
      })
      let percent = (exhaustedDays / totalDays).toFixed(2) || 0;
      if (chart) chart.setOption({series: {max: totalDays, data: [{value: exhaustedDays}], axisLine: {lineStyle: {color: [[percent, '#666'] ,[1, '#ccc']]}}}});
      // this.spliceBundle('total', totalDays);
      console.log('reserved', totalTips, exhaustedTips, leavedTips);
    },
    bindFromDateChange(event) {
      let query = this.createSelectorQuery();
      query.select('#the-id').boundingClientRect(function(rect){
        console.log('rect', rect)
      }).exec()
      let value = event.detail.value;
      this.setData({
        fromDate: value || fromDate
      })
      this.computeDays();
      console.log('from', value)
    },
    bindToDateChange(event) {
      let value = event.detail.value;
      this.setData({
        toDate: value || toDate
      })
      this.computeDays();
      console.log('to', value)
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
        this.setData({
          fromDate: `${1990}-${month+1}-${day}`,
          toDate: `${2090}-${month+1}-${day}`,
          activeYearType: type
        })
      }
      this.computeDays();
    },
    selectedType(event) {
      let data = event.currentTarget.dataset;
      let {
        index,
        type
      } = data;
      this.setData({
        activedIndex: index
      })
      console.log('index:type', index, type, this.data)
    }
  }
})