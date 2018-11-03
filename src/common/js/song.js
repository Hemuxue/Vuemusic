export default class Song {

    constructor ({id, mid, singer, name, album, duration, image, url}){
        this.id = id 
        this.mid = mid 
        this.singer = singer 
        this.name = name 
        this.album = album 
        this.duration = duration 
        this.image = image 
        this.url = url 

    }
}

export function createSong(musicData,vkey){
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        //专辑的背景图
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        //歌曲的播放地址
        url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=${vkey}&guid=7475568433&uin=0&fromtag=66`
    })
}

/*由于musicData.singer 是一个数组 
，子元素的数组才存有歌手信息，然而我们需要的字符串，能够值运用到dom 上*/
function filterSinger(singer){
    let ret = []
    if(!singer){
        return ''
    }
    singer.forEach( (item) =>{
        ret.push(item.name)
    })
    return ret.join('/')
}