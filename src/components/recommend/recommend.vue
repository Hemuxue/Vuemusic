<template>
    <div class="recommend">
        <div class="recommend-content">
            <!-- 给一个recommend.length 的原因是 获取数据为一个异步的过程，
            有可能，slider里面的mounted钩子执行完了，数据才回来，
            就会导致添加宽段失败 -->
            <div v-if="recomments.length" class="slider-wrapper">
                <slider>
                    <div v-for="item of recomments" :key="item.id">
                        <a :href="item.linkUrl">
                            <img :src="item.picUrl" alt="">
                        </a>
                    </div>
                </slider>
            </div>
            <div class="recomment-list">
                <h1 class="list-title">热门歌曲推荐</h1>
            </div>
        </div>
    </div>
</template>
<script>
import {getRecommend} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
export default {
    name: 'recomment',
    data(){
        return {
            recomments: []
        }
    },
    created(){
        this._getRecommend()
    },
    methods: {
        _getRecommend(){
            getRecommend().then((res) =>{
                if(res.code === ERR_OK){
                    this.recomments = res.data.slider
                }
            })
        }
    },
    components: {
        Slider
    }
}
</script>
<style lang="stylus" scoped>
    .recommend
        position fixed
        width 100%
        top 88px
        bottom 0
        .recommend-content
            height 100%
            overflow hidden
            .slider-wrapper
                position relative
                width 100%
                overflow hidden
            
</style>
