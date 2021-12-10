import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
// import permission from './modules/permission'

// dynamic router permission control (Experimental)
import permission from './modules/async-router'
import cfenum from './modules/cfenum'
import cfconfig from './modules/cfconfig'
import stglot from './modules/stglot'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    cfenum,
    cfconfig,
    stglot
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
