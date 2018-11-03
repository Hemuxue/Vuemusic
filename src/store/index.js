import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
/*strict:debug 检测 state的修改是不是通过mutations ，如果不是则会报错，
如果开启严格模式会影响性能，不要再线上环境开启*/
// const debug = process.env.NODE_ENV !== 'pruduction'
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    //如果是在开发环境，debug为true，也就开启了严格模式，它会检测你state的修改是否来自于mutations，如果不是，会报一个警告
    // strict:debug,
    plugins: [createLogger()],
})