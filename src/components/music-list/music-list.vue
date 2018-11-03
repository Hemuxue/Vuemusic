<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" >{{title}}</h1>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper">
                <div class="play" v-show="songs.length > 0" ref="play">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <!-- 为图片设置一个模糊层 -->
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <!--添加一个层，主要用来实现向上滚动的效果  -->
        <scroll 
            @scroll="scroll" 
            :probe-type="probeType" 
            :listen-scroll="listenScroll"  
            :data="songs" 
            class="list" 
            ref="list">
            <div class="song-list-wrapper">
                <songs-list :songs="songs"></songs-list>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>
        
        

    </div>
    
</template>
<script>
import Scroll from 'base/scroll/scroll' 
import SongsList from 'base/song-list/song-list'
import {perfixStyle} from 'common/js/dom'
import loading from 'base/loading/loading'

const RESERVED_HEIGHT = 40
const transform = perfixStyle('transform')
const backdrop = perfixStyle('backdrop-filter')

export default {
    props:{
        bgImage:{
            type:String,
            default:''
        },
        songs:{
            type:Array,
            default:[]
        },
        title:{
            type:String,
            default:''
        }
    },
    computed:{
        bgStyle(){
            return `background-image:url(${this.bgImage})`
        }
    },
    created(){
        this.probeType = 3
        this.listenScroll = true
    },
    mounted(){
        //缓存这个变量，减少代码的重复量
        this.imageHeight = this.$refs.bgImage.clientHeight
        
        //在mounted钩子中获取到scroll的top值
        this.$refs.list.$el.style.top = `${this.imageHeight}px`
        //最大滚动距离
        this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    },
    data(){
        return {
            scrollY: 0
        }
    },
    methods:{
        scroll(pos){
            this.scrollY = pos.y
        },
        back(){
            this.$router.back()
        }
        
    },
    watch:{
        scrollY(newY){
            /*通过Math.max 来获得他滚动的最小距离,由于2个值都是负值
            所以当滚动到title下面的时候就停止滚动了。*/
            let translateY = Math.max(this.minTranslateY, newY)
            //设置一个zIndex，当滚动到指定距离时，改变index值
            let zIndex = 0
            //控制歌手img的缩放比例
            let scale = 1
            
            //高斯模糊效果
            let blur = 0
            //percent 是拉下的图片百分比。通过  scale = 1+percent 可以实现图片和列表的无缝连接
            const percent = Math.abs(newY / this.imageHeight)
            
            if(newY > 0){
                scale = 1 + percent
                zIndex = 10
            }else{
                blur = Math.min(20 * percent)
               
            }
            //实时让layor层进行滚动
            this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
            
            //ios 的渐进增强。安卓没有这个功能。
            this.$refs.filter.style[backdrop] = `blur(${blur}px)`
   
            
            if(newY < this.minTranslateY) {
                /*上面两个字都是负值 当滑动距离大于 -this.minTranslateY时，
                让zIndex变为10，可以实现图片把songlist遮罩，这个是把图片的
                高度设置为 RESERVED_HEIGHT ，padding 设置为 0即可 */
                zIndex = 10
                this.$refs.bgImage.style.paddingTop = 0
                this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
                this.$refs.play.style.display = 'none'

            }else{
                /* 当滚动距离小于的时候，则需要把样式归位复原。 */
                this.$refs.bgImage.style.paddingTop = '70%'
                this.$refs.bgImage.style.height = 0
                this.$refs.play.style.display = ''
            }
            this.$refs.bgImage.style.zIndex = zIndex
            this.$refs.bgImage.style[transform] = `scale(${scale})`
            
        }
    },
    components: {
        Scroll,
        SongsList,
        loading
    }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
    .music-list
        position fixed
        z-index 100
        top 0
        left 0
        bottom 0
        right 0
        background $color-background
        .back
            position absolute
            top 0
            left 6px
            z-index 50
            .icon-back
                display block
                padding 10px
                font-size $font-size-large-x
                color $color-theme
        .title
            position absolute
            top 0
            left 10%
            z-index 40
            width 80%
            no-wrap()
            text-align center
            line-height 40px
            font-size $font-size-large
            color $color-text
        .bg-image
            position relative
            width 100%
            height 0
            padding-top 70%
            transform-origin top
            background-size cover
            .play-wrapper
                position absolute 
                bottom 20px
                z-index 50
                width 100%
                .play
                    box-sizing border-box
                    width 135px
                    padding 7px 0
                    margin 0 auto 
                    text-align center
                    border 1px solid $color-theme
                    color $color-theme
                    border-radius 100px
                    font-size 0
                    .icon-paly
                        display inline-block
                        vertical-align middle
                        margin-right 6px
                        font-size: $font-size-medium-x
                    .text 
                        display inline-block
                        vertical-align middle
                        font-size $font-size-small

            .filter 
                position absolute
                top 0
                left 0
                width 100%
                height 100% 
                background rgba(7,17,27,0.4)           

        .bg-layer
            position relative
            height 100%
            background $color-background
        .list 
            position fixed
            top 0
            bottom 0
            width 100%
            // overflow hidden
            background $color-background
            .song-list-wrapper
                padding 20px 30px 
                box-sizing border-box
            .loading-container
                position absolute
                width 100%
                top 50%
                transform translateY(-50%)
</style>
