<template>
    <div class="recommend">
        
        <!-- 这里滚轮不了的原因是数据还没没返回的时候，scroll 已经初始化完毕了，
        所以需要当数据发生改变时，调用scroll.refresh() -->
        <scroll ref="scroll" class="recommend-content" :data="discList">
            

            <!-- 由于better-scroll 只能对一个元素进行设置滚动，所以需要一个外层包裹 -->
            <div>

                <!-- 给一个recommend.length 的原因是 获取数据为一个异步的过程，
            有可能，slider里面的mounted钩子执行完了，数据才回来，
            就会导致添加宽段失败 -->
                <div v-if="recommends.length" class="slider-wrapper">
                    <slider>
                        <div v-for="item of recommends" :key="item.id">
                            <a :href="item.linkUrl">
                                <!-- 当fastclick 跟 better-scroll 对点击事件发生冲突时，
                                可以在目标dom上增加一个 class="needslick" ,
                                当fastClick发现dom 上面有这个class名时，就不会阻止点击事件 -->
                                <img @load="loadImage" :src="item.picUrl" alt="">
                            </a>
                        </div>
                    </slider>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌曲推荐</h1>
                    <ul>
                        <li v-for="item of discList" class="item" >
                            <div class="icon">
                                <img v-lazy="item.imgurl" width="60" height="60" >
                            </div>
                            <div class="text">
                                <h2 class="name" v-html="item.creator.name"></h2>
                                <p class="desc" v-html="item.dissname"></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container" v-show="!discList.length">
                <loading></loading>
            </div>
            
            
        </scroll>
    </div>
</template>
<script>
import {getRecommend ,getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
import scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
export default {
    name: 'recommend',
    data(){
        return {
            recommends: [],
            discList:[]
        }
    },
    created(){
        
        this._getRecommend()
        this._getDiscList() 
        
    },
    methods: {
        _getRecommend(){
            getRecommend().then((res) =>{
                if(res.code === ERR_OK){
                    this.recommends = res.data.slider
                }
            })
        },
        _getDiscList(){
            getDiscList().then((res) =>{
                console.log(res.data.list)
                if(res.code === ERR_OK){
                    this.discList = res.data.list
                }
            })
        },
        loadImage(){
            /* 监听图片加载事件的原因是：
                由于之传入了discList 来作为scroll 是否重新计算的监听data 。
                如果出现轮播图区域的数据请求比discList区域的数据回来的慢，
                那么就会少计算一个轮播图图片的高度，导致不能滚动到最底部 
                所以给轮播图区域的图片加一个 load事件监听，只要出现加载完毕了，
                就调用一次scroll组件里面的refresh方法，方法里面调用了scroll的refresh接口
                重新计算scroll高度。 
                由于只要有一个图片加载完了，就知道了高度了，不要计算多次，所以加锁，防止多次刷新scroll浪费效率*/
            if(!this.checkLoade){
                this.$refs.scroll.refresh()
                this.checkLoade = true
            }
            
        }
    },
    components: {
        Slider,
        scroll,
        Loading
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
                .item
                    display flex
                    box-sizing border-box
                    /*垂直居中*/
                    align-items center
                    padding 0 20px 20px 20px
                    .icon
                        flex 0 0 60px
                        width 60px
                        padding-right 20px
                    .text
                        display flex
                        flex-direction column
                        justify-content center 
                        flex 1
                        line-height 20px
                        overflow hidden
                        font-size $font-size-medium
                        .name
                            margin-bottom 10px
                            color $color-text
                        .desc
                            color $color-text-dark
            .loading-container
                position absolute
                width 100%
                top:50%
                transform translateY(-50%)
            



</style>