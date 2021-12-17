import LotSvc from '@/api/Stg/Stg_LotSvc'

const lotstg = {
  state: {
    lotStgList: []
  },
  mutations: {
    SET_LOTSTG: (state, data) => {
      var codeIndex = state.lotStgList.findIndex(v => v.Id === data.Id)
      if (codeIndex >= 0) {
        state.lotStgList.splice(codeIndex, 1)
      }
      state.lotStgList.push(data)
    }
  },
  actions: {
    getLotStg({ commit, state }, id) {
      return new Promise(resolve => {
        var curData = state.lotStgList.find(v => v.Id === id)
        if (curData) {
          resolve(curData)
        } else {
          LotSvc.Get(id).then(result => {
            var data = result.Data
            commit('SET_LOTSTG', data)
            resolve(data)
          })
        }
      })
    }
  }
}

export default lotstg
