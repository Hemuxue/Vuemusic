<template>
    <div class="recommend">
        <div class="recommend-content">
            <!-- 给一个recommend.length 的原因是 获取数据为一个异步的过程，
            有可能，slider里面的mounted钩子执行完了，数据才回来，
            就会导致添加宽段失败 -->
            <div v-if="recommends.length" class="slider-wrapper">
                <slider>
                    <div v-for="item of recommends" :key="item.id">
                        <a :href="item.linkUrl">
                            <img :src="item.picUrl" alt="">
                        </a>
                    </div>
                </slider>
            </div>
            <div class="recommend-list">
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
    name: 'recommend',
    data(){
        return {
            recommends: []
        }
    },
    created(){
        this._getRecommend()
    },
    methods: {
        _getRecommend(){
            getRecommend().then((res) =>{
                if(res.code === ERR_OK){
                    this.recommends = res.data.slider
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
    @import '~common/stylus/variable.styl'
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
            .recommend-list
                .list-title
                    height 65px
                    line-height 65px
                    text-align center
                    font-size $font-size-medium
                    color $color-theme
                    
            
</style>
