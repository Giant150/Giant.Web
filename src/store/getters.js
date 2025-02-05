const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  whseId: state => state.user.whseId,
  storerId: state => state.user.storerId,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  lotStgs: state => state.stglot.lotStgList
}

export default getters
