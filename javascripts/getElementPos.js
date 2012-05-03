/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-4-20
 * Time: 下午5:03
 * To change this template use File | Settings | File Templates.
 */
function getElementPos(element){
    var actualLeft = element.offsetLeft;
    var actualTop = element.offsetTop;
    var current = element.offsetParent;

    while (current !==null){
        actualLeft += current.offsetLeft;
        actualTop += current. offsetTop;
        current = current.offsetParent;
    }

    return {
        x:actualLeft,
        y:actualTop
    }
}

function getElementRelPos(container,event){
    var pos=getElementPos(container);
    var left=pos.x;
    var top=pos.y;
    var mouseX = event.clientX - left + window.pageXOffset;
    var mouseY = event.clientY - top + window.pageYOffset;
    return {
        x: mouseX,
        y: mouseY
    };
}
