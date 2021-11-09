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
    getEnum({ commit, state }, { whseId, code }) {
      return new Promise(resolve => {
        var curData = state.enumList.find(v => v.WhseId === whseId && v.Code === code)
        if (curData) {
          resolve(curData)
        } else {
          EnumSvc.GetByCode(whseId, code).then(result => {
            var data = result.Data
            data.EnumItems = result.Data.EnumItems.sort((a, b) => a.Sort - b.Sort).slice(0)
            commit('SET_ENUM', data)
            resolve(data)
          })
        }
      })
    }
  }
}

export default cfenum
