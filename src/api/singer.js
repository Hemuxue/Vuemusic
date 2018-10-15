import jsonp from 'common/js/jsonp'
import {commonParams , options} from 'api/config'

export function getSingerList() {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
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