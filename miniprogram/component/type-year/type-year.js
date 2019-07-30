const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const day = date.getDate();
const now = `${year}-${month+1}-${day}`;
const fromDate = `${year}-01-01`;
const toDate = `${year+1}-01-01`;

Component({
  data: {
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
    yearType: [
      {
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
    spliceBundle(dataName, days){
      let daysArray = Array.from({length: days}).map((item, index) => ({day: index}));
      let n = 0;
      while(daysArray.length >=0){
        let spliceDays = daysArray.splice(0, 10);
        this.setData({
          [`${dataName}[${n++}]`]: spliceDays
        })
      }
      console.log('this.data.total', this.data, daysArray)
    },
    computeDays(){
      let yearOrlife;
      if(this.data.fromDate != fromDate || this.data.toDate != toDate){
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
      let fromTime = Date.parse(this.data.fromDate);
      let toTime = Date.parse(this.data.toDate);
      let nowTime = Date.parse(now);
      let Conversion = (time) => Math.round((time)/(24*60*60*1000));
      let totalTime = toTime - fromTime; 
      let exhaustedTime = nowTime - fromTime;
      let leavedTime = toTime - nowTime;
      let totalDays = exhaustedTime >= 0? Conversion(totalTime): 0;
      let exhaustedDays = exhaustedTime >= 0 ?Conversion(exhaustedTime): 0;
      let leavedDays = leavedTime >= 0 ? Conversion(leavedTime):0;
      let totalTips = exhaustedTime >= 0 ? `${yearOrlife}也就 ${totalDays} 天` : `你怕不是地球人吧`;
      let exhaustedTips = exhaustedTime >= 0 ? `已过去了 ${exhaustedDays} 天` : `你回到未来时，捎上我`;
      let leavedTips = leavedTime >= 0 ? `还剩下 ${leavedDays} 天` : `你回到过去时，捎上我`;
      this.setData({
        total: Array.from({length: 960}),
        leavedDays,
        exhaustedDays,
        totalDays,
        totalTips,
        exhaustedTips,
        leavedTips
      })
      // this.spliceBundle('total', totalDays);
      console.log('reserved', totalTips, exhaustedTips, leavedTips);
    },
    bindFromDateChange(event){
      let value = event.detail.value;
      this.setData({
        fromDate: value || fromDate
      })
      this.computeDays();
      console.log('from', value)
    },
    bindToDateChange(event){
      let value = event.detail.value;
      this.setData({
        toDate: value || toDate
      })
      this.computeDays();
      console.log('to', value)
    },
    selectedYearType(event){
      let data = event.currentTarget.dataset;
      let {type} = data;
      if(type == 'year'){
        this.setData({
          fromDate: fromDate,
          toDate: toDate,
          activeYearType: type
        })
      }else{
        this.setData({
          fromDate: now,
          toDate: `${year+100}-${month+1}-${day}`,
          activeYearType: type
        })
      }
      this.computeDays();
    },
    selectedType(event){
      let data = event.currentTarget.dataset;
      let {index, type} = data;
      this.setData({
        activedIndex: index
      })
      console.log('index:type', index, type, this.data)
    }
  }
})