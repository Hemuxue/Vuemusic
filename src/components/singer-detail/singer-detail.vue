<template>
    <transition name="slide">
        <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
    </transition>
    
</template>
<script>
import { mapGetters } from "vuex";
import {getSingerDetail,getVkeyData} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
    data(){
        return {
            songs:[]
        }
    }, 
    computed:{
        title(){
            return this.singer.name
        },
        bgImage(){
            return this.singer.avatar
        },
        ...mapGetters([
            /*这个印射的是getter 文件里面的 singer ，
            就相当于再这个vue实例中挂载了'singer' 属性，可以直接去获取*/
            'singer'
        ])
    },
    created() {
        this._getSingerDetail()
        
    },
    methods:{
        _getSingerDetail(){
            /*防止用户再详情页面刷新了页面，获取不到id，
            因为id 是在singer组件里面，点击歌手时设置的state.如果刷新了页面。
            state里面的singer数据是空对象所以无法获取id，
            回退到歌手页面，让用户再次选择*/
            if(!this.singer.id) {
                this.$router.push('/singer')
            }
            getSingerDetail(this.singer.id).then((res) =>{
                if( res.code === ERR_OK){
                    this.songs = this._nomollizeSongs(res.data.list)
                    console.log(this.songs )
                }
            })
            console.log(this.singer)
        },
        _nomollizeSongs(list){
            let ret = []
            console.log(list)
            list.forEach( (item) =>{
                let {musicData} = item
                //必须要有songid和albummid才能把这个数据放到ret数组中去
                if(musicData.songid && musicData.albummid) {
                    getVkeyData(musicData.songmid).then( (res) =>{
                        if( res.code === ERR_OK){
                            const svkey = res.data.items
                            const songeVkey = svkey[0].vkey
                            //通过工厂方法将这个处理好的对象放入ret数组中
                            
                            ret.push(createSong(musicData,songeVkey))
                        }
                        
                    }) 
                    
                }
            })
            return ret
        }
    },
    components:{
        MusicList
    }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
    .slide-enter-active,.slide-leave-active
        transition all 0.3s
    .slide-enter,.slide-leave-to
        transform translate3d(100%,0,0)
</style>
