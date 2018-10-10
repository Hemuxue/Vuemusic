<template>
    <div class="slider" ref="slider">
        <!-- 要通过Bsroll实现录播图，
        由于设置了overflow所以横向不能撑开，需要设计者sliderGroup的宽度 -->
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div>

        <div class="dots">
            <span class="dot" v-for="(item,index) of dots" :key="item" 
            :class="{active: currentPageIndex === index}"  ></span>
        </div>

        
    </div>
</template>
<script>
import BScroll from "better-scroll";
import { addClass } from "common/js/dom.js";


export default {
    props: {
        loop: {
            type: Boolean,
            default: true
        },
        autoPlay: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 4000
        }
    },
    data(){
        return {
            dots: [],
            currentPageIndex: 0
        }
    },
    //当数据被修改的时候去渲染better-scroll 是一个很好的选择，作者说的！！！
    mounted() {
        setTimeout(() => {
        /*选择20ms的原因是浏览器的刷新频率是16ms左右，稍微多一点是 一个经验值*/
            this._setSliderWidth();
            //这里一定要再initSlider前面执行initDots，因为_initSlider为了无缝轮播会新增2个dom
            this._initDots();
            this._initSlider();
            if(this.autoPlay) {
                this._play()
            }
        }, 20);
        //window监听 resize ->窗口大小改变事件
        window.addEventListener('resize', ()=>{
            if(!this.slider){
                return
            }
            this._setSliderWidth(true);
            //在宽度改变之后，通过调用slider.refresh() 来更新下slider
            //但是不能从电脑端到手机端的转换，转换依旧是有问题的。
            this.slider.refresh()
            
        })
    },
    activated() {
        if(this.autoPlay){
            this._play();
        }
    },
    deactivated() {
        clearTimeout(this.timer)
    },
    beforeDestroy() {
        clearTimeout(this.timer)
    },
    methods: {
        _setSliderWidth(isResize) {
            //获取所有的子节点
            this.children = this.$refs.sliderGroup.children;
            let width = 0;
            //获取父级的视口高度，来作为轮播的宽度
            let sliderWidth = this.$refs.slider.clientWidth;
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i];
                /*由于参数传递的时候不能直接把 .slider-item 直接传递 
                        这样耦合太强，在slider.vue 里面手动给节点加class
                        模块化思想，addClass可能还会复用，所以单独抽离一个模块，要用的时候直接用*/
                addClass(child, "slider-item");
                child.style.width = sliderWidth + "px";
                width += sliderWidth;
            }
            //当loop 为true 时，better-scroll 会克隆2个dom保证无缝轮播
            if (this.loop && !isResize) {
                width += 2 * sliderWidth;
            }
            this.$refs.sliderGroup.style.width = width + "px";
        },
        //添加轮播图下面的小圆点
        _initDots(){
            this.dots = new Array(this.children.length)
        },
        _initSlider() {
            this.slider = new BScroll(this.$refs.slider, {
                scrollX: true,
                scrollY: false,
                momentum: false,//快速滚动时不开启滑动惯性
                snap: {
                    loop: this.loop,
                    threshold: 0.3,
                    speed: 400
                },
                //最新版写法更新了
                // snap: true,
                // snapLoop: this.loop,
                // snapThreshold: 0.3,
                // snapSpeed: 400,
                // click: true
                /*老师说这个click ，会在better-scroll内部派发一个时间，阻止默认行为。
                但是新版的可能已经没有问题了。不删除依旧能点击*/
            })
            /* 当better-scroll 触发滚动的时候会派发一个srollEnd事件，只要监听这个事件就能知道发生了滚动
            通过 this.slider.getCurrentPage().pageX 获取当前的滚动index值 */
            this.slider.on('scrollEnd', () =>{
                let pageIndex = this.slider.getCurrentPage().pageX
                // if (this.loop) {
                //     //当设置了循环时有拷贝的dom，所以需要给index值减 1
                //   新版本已经不用减了
                // }
                this.currentPageIndex = pageIndex
                
                if(this.autoPlay) {
                    clearTimeout(this.timer)
                    this._play()
                }
            })
            
        },
        _play(){
            
            // let pageIndex = this.currentPageIndex + 1
            // if(pageIndex == this.dots.length ){
            //     console.log('inter')
            //     pageIndex = -1
            // }
            
            /*使用next -> 跳转下一个页面。可以实现无缝轮播 。
            使用 goTopage 是跳转到指定index的图片，这样还会出现最后一页无法轮播的情况，
            自己处理 index的话 ，达不到完美的无缝轮播*/

            this.timer = setTimeout( () =>{
                this.slider.next()
            },this.interval)
        },
        
    },
    
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.slider {
    min-height: 1px;

    .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;

        .slider-item {
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;

            a {
                display: block;
                width: 100%;
                overflow: hidden;
                text-decoration: none;

                img {
                    display: block;
                    width: 100%;
                }
            }
        }
    }

    .dots {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 12px;
        text-align: center;
        font-size: 0;

        .dot {
            display: inline-block;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;

            &.active {
                width: 20px;
                border-radius: 5px;
                background: $color-text-ll;
            }
        }
    }
}
</style>
