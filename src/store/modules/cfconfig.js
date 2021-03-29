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
    getConfig({ commit, state }, data) {
      return new Promise(resolve => {
        var config = state.configList.find(v => v.WhseId === data.whseId && v.Code === data.code)
        if (config) {
          resolve(config)
        } else {
          ConfigSvc.GetByCode(data.whseId, data.code).then(result => {
            commit('SET_CONFIG', result.Data)
            resolve(result.Data)
          })
        }
      })
    }
  }
}

export default cfconfig
