<template>
    <list-view :data="singers"></list-view>
</template>
<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'

const HOT_NAME = '热门'
const HOT_SINGER_LENGTH = '10'
export default {
    name: 'singer',
    data() {
        return {
            singers: []
        }
    },
    components:{
        ListView
    },
    created() {   
        this._getSingerList()     
    },
    methods: {
        _getSingerList() {
            getSingerList().then((res) =>{
                if(res.code === ERR_OK){
                    this.singers = this._nomalizeSinger(res.data.list)
                }
            })
        },
        /*通过singerList 构建出我们需要的数据结构 */
        _nomalizeSinger (list){
            let map = {
                hot: {
                    title:HOT_NAME,
                    items: []
                }
            }
            list.forEach((item,index) => {
                /* 通过最大的hot人数，简答的取前十名 
                通过Singer 类来减少 avatar 这个参数的每次拼接，减少代码量*/
                if(index < HOT_SINGER_LENGTH) {
                    map.hot.items.push(new Singer({                
                        id:item.Fsinger_mid,
                        name:item.Fsinger_name,
                    }))
                }
                /* 上面只对 HOT_SINGER_LENGTH 前的进行操作，下面的是每个都要进行操作 */
                const key = item.Findex
                /* 通过 hash 数据去重的方式，来构建 a-z 26个字母的数据结构 */
                if(!map[key]){
                    map[key] = {
                        title:key,
                        items:[]
                    }
                }
                /* 添加 key值对应的歌手 的信息 */
                map[key].items.push( new Singer({
                    id:item.Fsinger_mid,
                    name:item.Fsinger_name,
                }))
            });
            /*为了得到有序列表，我们需要处理map
            hot 是热门歌手列表
            ret 是A-Z的歌手类别*/
            let hot = []
            let ret = []
            for (let key in map){
                let val = map[key]
                if(val.title.match(/[a-zA-Z]/g)){
                    ret.push(val)
                }else if (val.title === HOT_NAME){
                    hot.push(val)
                }
                
            }
            /*对 ret 进行 A-Z的字母排序 */
            ret.sort((a,b) =>{
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })

            return hot.concat(ret)
        }
    }
}
</script>
<style lang="stylus" scoped>
    position fixed
        top 88px
        bottom 0
        width 100%

</style>
