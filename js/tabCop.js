/*!*/

//emmmm
/*
4a+b = 184
2a+b = 84
a=50
b=-16
*/

// 如果是一个一级tab(不包含可收缩tab),请使用这个谢谢.
// 在层级id里加上```small```以自动触发.
// 请将所需的按钮放在同一层级,用position来改变顺序.
function resize(layer){
    let container = document.getElementsByClassName(layer)[0].parentElement.parentElement.parentElement//(?)
    
    if(!container.className.includes("shrink")){
        container.classList.replace('extend','shrink')
        container.style.maxHeight = "34px"
    }
    else{
        let layersCount = 0
        for(i in layers){
            if(layers[i].row == layers[layer].row && tmp[i].layerShown) layersCount ++
        }
        container.classList.replace('shrink','extend')
        container.style.maxHeight = layersCount*50-16+"px"
    }
}

//废了 待维修

/* // 如果是一个二级或以上(包含至少一个可收缩tab)的tab,请使用这个谢谢.
// 在层级id里加上```metaSmall```以自动触发.
// 也可以同时加上small触发small的特性.
//!!!如果要使用的话,请添加一个key为subLayers的属性.例如: sublayers:["layer1 small","layer1-1","layer1-2","layer2 small","layer2-1"], 这些tab所在的*整一层级*将会被收缩.
function fullResize(layer){
    resize(layer)
    let layers = document.getElementsByClassName(layer)
    for(i in layers){
        if(!layers[i].className) continue
        if(layers[i].className.includes("metaSmall")) continue
        if(!layers[i].className.includes("small")) continue
        let container = layers[i].parentElement.parentElement.parentElement
        if(container.className.includes("shown")){
            container.classList.replace('shown','hidden')
            container.style.maxHeight = "4px"
        }
        else{
            let layersCount = 1
            for(a in layers){
                if(layers[a].row == layers[i].row) layersCount ++
            }
            container.classList.replace('hidden','shown')
            container.style.maxHeight = layersCount*58-25+"px"
        }
    }
}

 */