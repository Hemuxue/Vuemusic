export function addClass(el, className) {
    if(hasClass(el,className)){
        return
    }
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
}

export function hasClass(el,className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}

//val 表示 set ，get,同时也表示需要设置的值  。有值get，没值set
export function getData(el,name,val){
    const perfix = 'data-';
    name = perfix + name
    if(val){
        return el.setAttribute(name,val)
    }else{
        return el.getAttribute(name)
    }
}