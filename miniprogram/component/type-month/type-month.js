import * as echarts from '../ec-canvas/echarts';
let chart = null;

function getVirtulData() {
  var date = +echarts.number.parseDate('2019-07-01');
  var end = +echarts.number.parseDate('2019-08-01');
  var dayTime = 3600 * 24 * 1000;
  var data = [];
  for (var time = date; time < end; time += dayTime) {
    let total = Math.floor(Math.random() * 20);
    let done = Math.floor(Math.random() * (total + 1));
    let percent = +(done / total).toFixed(1) || 0;
    data.push([
      echarts.format.formatTime('yyyy-MM-dd', time),
      percent,
      done,
      total
    ]);
  }
  return data;
}
var scatterData = getVirtulData();
function initChart(canvas, width, height, obj) {
  let ceilSize = Math.floor(width / 7);
  console.log('ceilSize', ceilSize);
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
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
      range: ['2019-07']
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
  lifetimes: {},
  methods: {
  }
})