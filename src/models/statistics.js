const StatisticsModel = {
  namespace: 'statistics',
  state: {
    last: Date(),
    loading: false,
    interval: 1,
    numNewuser: 1,
    numNewrecommend: 1,
    nameStylelike: 'fengge',
    numStylelike: 1,
    nameStylecollect: 'fengge',
    numStylecollect: 1,
    nameStylecomment: 'fengge',
    numStylecomment: 1,
    nameDesignpost: 'desi',
    numDesignpost: 1,
    nameDesignfollow: 'desi',
    numDesignfollow: 1,
    nameDesigncomment: 'desi',
    numDesigncomment: 1,
    nameDesignlike: 'desi',
    numDesignlike: 1,
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: {
    // 根据state请求并更新state（刷新时使用
    * refresh(_, { put, call, delay }) {
      yield put({
        type: 'save',
        payload: {
          loading: true,
        },
      });
      // call api
      yield call(() => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, 1000);
        });
      });
      // set date
      yield put({
        type: 'save',
        payload: {
          last: Date(),
          loading: false,
        },
      });
    },
    // 先改变state时间间隔，然后调用refresh按照当前state更新信息（切换间隔时使用
    * fetch({ payload }, { put }) {
      const { interval } = payload;
      yield put({
        type: 'save',
        payload: {
          interval,
        },
      });
      yield put({
        type: 'refresh',
      });
    },
  },
}

export default StatisticsModel;
