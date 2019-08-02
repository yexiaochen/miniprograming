Component({
  properties: {
    componentHeight: Number
  },
  data: {
    dateType: 0, // 0: today, 1: tomorrow
    TDToDoList: [], // today Todo list
    TMToDoList: [] // tomorrow Todo List
  },
  methods: {
    selectType(event){
      let data = event.currentTarget.dataset;
      let {type} = data;
      type = Number(!(+type));
      this.setData({
        dateType: type
      })
    }
  }
})