/**
 * 向后端请求用户的菜单，动态生成路由
 */

import EnumSvc from '@/api/CF/CF_EnumSvc'

const cfenum = {
  state: {
    enumList: []
  },
  mutations: {
    SET_ENUM: (state, data) => {
      var codeIndex = state.enumList.findIndex(v => v.Id === data.Id)
      if (codeIndex >= 0) {
        state.enumList.splice(codeIndex, 1)
      }
      state.enumList.push(data)
    }
  },
  actions: {
    getEnum({ commit, state }, data) {
      return new Promise(resolve => {
        var curData = state.enumList.find(v => v.WhseId === data.whseId && v.Code === data.code)
        if (curData) {
          resolve(curData)
        } else {
          EnumSvc.GetByCode(data.whseId, data.code).then(result => {
            commit('SET_ENUM', result.Data)
            resolve(result.Data)
          })
        }
      })
    }
  }
}

export default cfenum
