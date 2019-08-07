import * as echarts from '../ec-canvas/echarts';
let chart = null, option = null;


function getTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const fromDate = `${year}-${month}-01`;
  const toDate = new Date(`${year}`, `${month}`, 1);
  return {
    fromDate,
    toDate,
    year,
    month
  }
}

function getVirtulData() {
  let { fromDate, toDate } = getTime();
  let date = +echarts.number.parseDate(fromDate);
  let end = +echarts.number.parseDate(toDate);
  let dayTime = 3600 * 24 * 1000;
  let data = [];
  for (let time = date; time < end; time += dayTime) {
    let currentInfo,current = echarts.format.formatTime('yyyy-MM-dd', time);
    try {
      currentInfo = wx.getStorageSync(current);
    } catch (e) {
      console.log('error', e.message)
    }
    if(currentInfo){
      currentInfo = JSON.parse(currentInfo);
      let total = currentInfo.length;
      let done = 0;
      currentInfo.forEach(item => {
        if (item.status == 1) {
          done++;
        }
      });
      let percent = +(done / total).toFixed(1) || 0;
      data.push([
        current,
        percent,
        done,
        total
      ]);
    } else {
      data.push([
        current,
        0,
        0,
        0
      ])
    }
  };
  return data;
}
function initChart(canvas, width, height, obj) {
  var scatterData = getVirtulData();
  let {year, month} = getTime();
  let ceilSize = Math.floor(width / 7);
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  option = {
    tooltip: {
      position: function (pos, params, dom, rect, size) {
        let left = (size.viewSize[0] / 2) - (size.contentSize[0] / 2);
        return [left, "top"];
      },
      formatter: function (params) {
        let { value } = params;
        return `${value[2]} / ${value[3]}`;
      }
    },
    visualMap: {
      min: 0,
      max: 1,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 'bottom',
      precision: 1,
      inRange: {
        color: ['#fff', "#fcfcfc", "#cfcfcf", "#ccc", "#c9c9c9", "#9c9c9c", "#999", "#969696", '#696969']
      },
      dimension: 1,
      rich: {}
    },
    calendar: {
      top: 'middle',
      left: 'center',
      orient: 'vertical',
      cellSize: ceilSize,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#666',
          width: 1,
          type: 'solid'
        }
      },
      monthLabel: {
        show: false
      },
      yearLabel: {
        show: false
      },
      dayLabel: {
        firstDay: 1,
        nameMap: 'cn',
        rich: {}
      },
      range: [`${year}-${month}`]
    },
    series: [{
      type: 'heatmap',
      coordinateSystem: 'calendar',
      calendarIndex: 0,
      data: scatterData,
      label: {
        normal: {
          show: true,
          formatter: function (params) {
            var d = echarts.number.parseDate(params.value[0]);
            return d.getDate();
          },
          textStyle: {
            color: '#636363'
          },
          fontSize: 16,
          rich: {}  // Note: 解决字体大小不稳定变化；
        }
      },
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
    ec: { onInit: initChart } // Note: 应采用该初始化方式；
  },
  lifetimes: {
    attached: function () {
      if(option){
        let scatterData = getVirtulData();
        option.series[0].data = scatterData;
        chart.setOption(option,true)
      }
    }
  },
  methods: {
  }
})