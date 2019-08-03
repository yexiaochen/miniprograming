function getTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const monthStr = String(month).length == 1 ? `0${month}` : month;
  const dayStr = String(day).length == 1 ? `0${day}` : day;
  const todayStr = `${year}-${monthStr}-${dayStr}`;

  const tomorrow = new Date(`${year}`, `${monthStr}`, `${day + 1}`);
  const tomorrowMonth = tomorrow.getMonth() + 1;
  const tomorrowDay = tomorrow.getDate();
  const tomorrowMonthStr = String(tomorrowMonth).length == 1 ? `0${tomorrowMonth}` : tomorrowMonth;
  const tomorrowDayStr = String(tomorrowDay).length == 1 ? `0${tomorrowDay}` : tomorrowDay;
  const tomorrowStr = `${year}-${tomorrowMonthStr}-${tomorrowDayStr}`;
  return {
    todayStr,
    tomorrowStr,
    day
  }
}

function clearData() {
  let { todayStr, tomorrowStr, day } = getTime();
  if (day == 1) {
    try {
      let today = wx.getStorageSync(todayStr);
      let tomorrow = wx.getStorageSync(tomorrowStr);
      let birthDay = wx.getStorageSync('birthDay');
      let deathDay = wx.getStorageSync('deathDay');
      wx.clearStorageSync();
      wx.setStorageSync(todayStr, today);
      wx.setStorageSync(tomorrowStr, tomorrow);
      wx.setStorageSync('birthDay', birthDay);
      wx.setStorageSync('deathDay', deathDay);
    } catch (e) {
      console.log('clearData', e.message);
    }
  }
}

Component({
  data: {
    inputFocus: true,
    modifyType: 0, // 0: add, 1: fix;
    dateType: 0, // 0: today, 1: tomorrow
    TDTodoList: [], // today Todo list
    TMTodoList: [], // tomorrow Todo List
    currentTodo: ''
  },
  lifetimes: {
    attached: function () {
      clearData();
      let { todayStr, tomorrowStr } = getTime();
      wx.getStorage({
        key: todayStr,
        success: res => {
          this.setData({
            TDTodoList: JSON.parse(res.data)
          })
        }
      });
      wx.getStorage({
        key: tomorrowStr,
        success: res => {
          this.setData({
            TMTodoList: JSON.parse(res.data)
          })
        }
      });
    }
  },
  methods: {
    hadDone(event) {
      let data = event.currentTarget.dataset;
      let { index, status } = data;
      let { TDTodoList } = this.data;
      TDTodoList[index].status = Number(!status);
      this.setData({
        TDTodoList
      })
    },
    bindOk() {
      let { todayStr } = getTime();
      let { dateType, TDTodoList } = this.data;
      if (dateType == 1) {
        this.setData({
          inputFocus: false,
        })
        this.addTomorrowList();
      } else {
        wx.setStorageSync(todayStr, JSON.stringify(TDTodoList));
        wx.showToast({
          title: '本地保存成功',
          icon: 'success',
          duration: 2000
        })
      }
    },
    addTomorrowList() {
      let { tomorrowStr } = getTime();
      let { TMTodoList, currentTodo } = this.data;
      currentTodo && TMTodoList.unshift({
        todoContent: currentTodo,
        status: 0 // 0: 未完成； 1: 已完成；
      });
      this.setData({
        currentTodo: '',
        TMTodoList
      });
      try {
        wx.setStorageSync(tomorrowStr, JSON.stringify(TMTodoList))
      } catch (e) {
        console.log('setStorageSync:error', e.message)
      }
    },
    selectType(event) {
      let data = event.currentTarget.dataset;
      let { type } = data;
      type = Number(!(+type));
      this.setData({
        dateType: type
      })
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
    deleteDoneItem(event) {
      let data = event.currentTarget.dataset;
      let { TMTodoList } = this.data;
      let { index } = data;
      wx.showModal({
        title: '删除',
        content: '放弃小目标？',
        confirmText: '放弃',
        cancelText: '坚持',
        success: res => {
          if (res.confirm) {
            TMTodoList.splice(index, 1);
            this.setData({
              TMTodoList
            })
          }
        }
      })
    }
  }
})