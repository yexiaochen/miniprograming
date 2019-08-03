Component({
  properties: {
    componentHeight: Number
  },
  data: {
    inputFocus: true,
    modifyType: 0, // 0: add, 1: fix;
    fixIndex: 0,
    dateType: 0, // 0: today, 1: tomorrow
    TDTodoList: [], // today Todo list
    TMTodoList: [], // tomorrow Todo List
    currentTodo: '',
    // currentTodoIndex: ''
  },
  methods: {
    bindOk(event) {
      let { dateType, TDTodoList, modifyType, fixIndex } = this.data;
      if (dateType == 1) {
        this.setData({
          inputFocus: false
        })
        if(modifyType == 1){
          this.fixTomorrowList();
        } else {
          this.addTomorrowList();
        }
      }
    },
    addTomorrowList() {
      let { TMTodoList, currentTodo } = this.data;
      currentTodo && TMTodoList.unshift({
        todoContent: currentTodo
      });
      this.setData({
        currentTodo: '',
        // currentTodoIndex: '',
        TMTodoList
      })
    },
    fixTomorrowList() { 
      let {fixIndex, currentTodo, TMTodoList} = this.data;
      TMTodoList[fixIndex].todoContent = currentTodo;
      this.setData({
        currentTodo: '',
        TMTodoList
      })
    },
    selectType(event) {
      let data = event.currentTarget.dataset;
      let { type } = data;
      type = Number(!(+type));
      this.setData({
        dateType: type
      })
      console.log('dateType', type);
    },
    bindKeyInput(event) {
      let { TMTodoList } = this.data;
      let inputValue = event.detail.value;
      // let currentTodoIndex = inputValue.length == 0 ? '' : (TMTodoList.length + 1)
      this.setData({
        currentTodo: inputValue,
        // currentTodoIndex: currentTodoIndex
      });
    },
    fixDoneList(event) {
      let data = event.currentTarget.dataset;
      let { TMTodoList } = this.data;
      let { index } = data;
      this.setData({
        currentTodo: TMTodoList[index].todoContent,
        modifyType: 1,
        fixIndex: index,
        inputFocus: true
      })
    }
  }
})