/**
 * 向后端请求用户的菜单，动态生成路由
 */

import ConfigSvc from '@/api/CF/CF_ConfigSvc'

const cfconfig = {
  state: {
    configList: []
  },
  mutations: {
    SET_CONFIG: (state, data) => {
      var codeIndex = state.configList.findIndex(v => v.Id === data.Id)
      if (codeIndex >= 0) {
        state.configList.splice(codeIndex, 1)
      }
      state.configList.push(data)
    }
  },
  actions: {
    getConfig({ commit, state }, { whseId, code }) {
      return new Promise(resolve => {
        var config = state.configList.find(v => v.WhseId === whseId && v.Code === code)
        if (config) {
          resolve(config)
        } else {
          ConfigSvc.GetByCode(whseId, code).then(result => {
            commit('SET_CONFIG', result.Data)
            resolve(result.Data)
          })
        }
      })
    }
  }
}

export default cfconfig
