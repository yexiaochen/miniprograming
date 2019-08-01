import * as echarts from '../ec-canvas/echarts';
let chart = null;
function getVirtulData() {
  var date = +echarts.number.parseDate('2017-02-01');
  var end = +echarts.number.parseDate('2017-03-01');
  var dayTime = 3600 * 24 * 1000;
  var data = [];
  for (var time = date; time < end; time += dayTime) {
    data.push([
      echarts.format.formatTime('yyyy-MM-dd', time),
      Math.floor(Math.random() * 10000)
    ]);
  }
  return data;
}
var scatterData = getVirtulData();
function initChart(canvas, width, height, obj) {
  console.log('this', this);
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    tooltip: {
      position: ['40%',"0" ]
    },
    visualMap: {
      min: 0,
      max: 1000,
      calculable: true,
      orient: 'horizontal',
      left: 'right',
      top: 'bottom',
      inRange: {
        color: ['#fff',"#fcfcfc","#cfcfcf", "#ccc", "#c9c9c9","#9c9c9c", "#999", "#969696", '#696969']
      }
    },
    calendar: {
      top: '80',
      bottom: '50',
      left: 'center',
      orient: 'vertical',
      cellSize: 'auto',
      yearLabel: {
        show: false
      },
      dayLabel: {
          firstDay: 1,
          nameMap: 'cn'
      },
      range: ['2017-02']
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
            color: '#fff'
          }
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
    ec: { onInit: initChart}
  },
  lifetimes: {},
  methods: {
  }
})