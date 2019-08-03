Component({
  properties: {
    componentHeight: Number
  },
  data: {
    inputFocus: true,
    modifyType: 0, // 0: add, 1: fix;
    dateType: 0, // 0: today, 1: tomorrow
    TDTodoList: [], // today Todo list
    TMTodoList: [], // tomorrow Todo List
    currentTodo: '',
  },
  methods: {
    bindOk(event) {
      let { dateType, TDTodoList, modifyType } = this.data;
      if (dateType == 1) {
          this.setData({
            inputFocus: false
          })
          this.addTomorrowList();
      }
    },
    addTomorrowList() {
      let { TMTodoList, currentTodo } = this.data;
      currentTodo && TMTodoList.unshift({
        todoContent: currentTodo
      });
      this.setData({
        currentTodo: '',
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
      let inputValue = event.detail.value;
      this.setData({
        currentTodo: inputValue,
      });
    },
    fixDoneList(event) {
      let data = event.currentTarget.dataset;
      let { TMTodoList } = this.data;
      let { index } = data;
      let tapTodoContent = TMTodoList[index].todoContent;
      TMTodoList.splice(index, 1);
      this.setData({
        currentTodo: tapTodoContent,
        inputFocus: true,
        TMTodoList
      })
    },
    deleteDoneItem(event){
      let data = event.currentTarget.dataset;
      let { TMTodoList } = this.data;
      let {index} = data;
      let self = this;
      wx.showModal({
        title: '删除',
        content: '放弃小目标？',
        confirmText: '放弃',
        cancelText: '坚持',
        success (res) {
          if (res.confirm) {
            TMTodoList.splice(index, 1);
            self.setData({
              TMTodoList
            })
          }
        }
      })
    }
  }
})