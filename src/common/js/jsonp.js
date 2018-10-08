import originJSONP from 'jsonp'

export default function jsonp(url,data,option) {
    /*因为url拼接的做开始是用 ？方式，所以需要判断判断下是否有？ 没有就添加？
    正是因为这个原因需要 再param函数的返回值判断是否去除 &*/
    url += (url.indexOf('?') < 0 ? '?':'&') + param(data)
    return new Promise((resolve,reject) => {
        originJSONP(url,option,(err,data) => {
            //这为 fn 成功这调用resolve ，在 .then 后面处理返回的数据
            if(!err){
                resolve(data)
            }else{
                reject(err)
            }
        })
    })
}

function param(data){
    let url = ''
    for(var k in data){
        let value = data[k] !== undefined ? data[k] : ''
        url += `&${k}=${encodeURIComponent(value)}`
    }
    //判断是否有data，如果有则把前面的&去掉（因为前面已经有data了），没有则直接返回 ‘’
    return url ? url.substring(1) : ''
}