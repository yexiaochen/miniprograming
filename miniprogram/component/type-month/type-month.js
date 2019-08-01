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
    tooltip : {},
    legend: {
        data: ['工作', '娱乐', '睡觉'],
        bottom: 20
    },
    calendar: {
        top: '30',
        left: '35',
        orient: 'horizontal',
        cellSize: 'auto',
        yearLabel: {
            show: false
        },
        dayLabel: {
            margin: 20,
            firstDay: 1,
            nameMap: 'en'
        },
        monthLabel: {
            align: "center",
            margin: 10,
            nameMap: 'cn',
            fontSize: 18
        },
        range: ['2017-02']
    },
    series: [{
        id: 'label',
        type: 'scatter',
        coordinateSystem: 'calendar',
        symbolSize: 1,
        label: {
            normal: {
                show: true,
                formatter: function (params) {
                    return echarts.format.formatTime('dd', params.value[0]);
                },
                // pisition: 'insideTopLeft',
                // distance: 100,
                // offset: [-15, -15],
                textStyle: {
                    color: '#ccc',
                    fontSize: 23,
                    fontWeight: 'bold'
                }
            }
        },
        data: scatterData
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
    ec: {}
  },
  lifetimes: {},
  methods: {
    echartInit(e){
      initChart(e.detail.canvas, e.detail.width, e.detail.height)
    }
  }
})