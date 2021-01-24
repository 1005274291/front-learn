module.exports=function(source){
    //动态创建style
    //把source塞进style标签
    //把style放进文档头部
    return `
    const tag=document.createElement("style");
    tag.innerHTML=${source};
    document.head.appendChild(tag);
    `
}