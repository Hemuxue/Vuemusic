import jsonp from 'common/js/jsonp'
import {commonParams , options} from 'api/config'
import Axios from '../../node_modules/axios';

export function getSingerList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
    const data = Object.assign({}, commonParams ,{
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        g_tk: 1664029744
    })

    return jsonp(url,data,options)
}
export function getSingerDetail(singerId){
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

    const data = Object.assign({},commonParams,{
        hostUin:0,
        needNewCode:0,
        playform:'yqq',
        order:'listen',
        begin:0,
        num:100,
        songstatus:1,
        singermid: singerId,
        g_tk: 1664029744

    })

    return jsonp(url,data,options)
}

export function getVkeyData(mid) {
    const url = '/api/getVkeyData'
    const data = Object.assign({},commonParams,{
      songmid:mid,
      filename:'C400'+mid+'.m4a',
      g_tk: 862298068,
      hostUin: 0,
      platform: 'yqq',
      needNewCode: 0,
      cid: 205361747,
      guid: 7475568433,
      uin:0,
      format: 'json',
    })
    return Axios.get(url,{
      params:data
  }).then((res) => {
      return Promise.resolve(res.data)
  })
}