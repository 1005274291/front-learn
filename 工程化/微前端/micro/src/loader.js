export async function importHtml(entry){
    //解析html 生成css和js
    // 加载子应用入口 根据子应用的url地址解析出我们需要展示在基座应用上的内容
    let content =await loadSource(entry)
    console.log(content)

    //解析script
    const scripts=await parseScript(content,entry)
    //解析css
    const {css,styles}=parseCss(content,entry)
    
    //解析body
    const body=parseBody(content)
    console.log({
        scripts,
        css,
        styles,
        body
    })
}


function loadSource(url){
    return window.fetch(url).then(res=>res.text())
}

const ATTR_RE=/["'=\w\s]*/.source //略过script标签中不关注的属性和空格

async function parseScript(content,entry){
    //匹配以内容的形式嵌入到script标签当中的正则返回content
    const SCRIPT_CONTENT_RE=new RegExp("<script"+ATTR_RE+">([\\w\\W]*)</script>","g")
    //匹配以src的形式嵌入到script当中的正则返回url
    const SCRIPT_SRC_RE=new RegExp('<script'+ATTR_RE+'src="(.+)">',"g")
    let scripts=[]
    let scriptsUrls=[]
    let match
    while ((match=SCRIPT_CONTENT_RE.exec(content))) {
        let script=match[1].trim()
        script&&scripts.push(script)
    }
    while ((match=SCRIPT_SRC_RE.exec(content))) {
        let url=match[1].trim()
        url&&scriptsUrls.push(url)
    }
    //将src的js文件请求会内容返回给页面
    let remoteScript =await Promise.all(scriptsUrls.map(url=>{
        let u=(url.startsWith("http:"))||(url.startsWith("https:"))?url:entry+url
        return loadSource(u)
    }))
    scripts=remoteScript.concat(scripts)
    return scripts
}

function parseCss(content,entry){
    //匹配以href属性嵌入到link标签当中的正则返回url
    const CSS_LINK_RE=new RegExp('<link'+ATTR_RE+'href="([^"]*)"'+ATTR_RE+">","g")
    //匹配以内容的形式嵌入到style标签当中的正则表达式
    const STYLE_CONTENT_RE=new RegExp('<style'+ATTR_RE+'>([^<]*)</style>',"g")
    const CSS_RE=new RegExp('(?:'+CSS_LINK_RE.source+')|(?:'+STYLE_CONTENT_RE.source+')',"g")
    let match
    let css=[]
    let styles=[]
    while ((match=CSS_RE.exec(content))) {
        let style
        if(match[1]){
            //link 形式的被匹配到
            style=entry+match[1].trim()
            style&&css.push(style)
        }else if(match[2]){
            //style标签被匹配到
            style=match[2].trim()
            style&&styles.push(style)
        }
    }
    return {css,styles}
}

function parseBody(content){
    //提取到body里面内容的正则
    const BODY_RE=/<body>([\w\W]*)<\/body>/
    //在body里面匹配到script标签的正则
    const SCRIPT_RE=/<script ["'=\w\s]*>[\s\S]*<\/script>/g
    let bodyContent=content.match(BODY_RE)
    console.log(bodyContent)
}