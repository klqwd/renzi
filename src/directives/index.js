export const imgerror = {
    //什么时候 去换图片地址
    inserted(el, binding, vnode) {
        //el dom
        //binding 当前指令的相关信息
       
        el.onerror = function () {
            el.src=binding.value
        }
    }
}