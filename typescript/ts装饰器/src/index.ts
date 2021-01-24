//类装饰器
function anotationClass(target){
    console.log("类装饰器")
    // console.log("target",target)//类装饰器的target指向类本身
    target.age=20
}
//方法装饰器

function anotationMethods(target,property,descriptor){
    //target 是类的prototype，是实例属性的集合
    //property 是属性名
    //descriptor 是属性值的描述
    //获取原类值
    console.log("方法装饰器")
    var old =descriptor.value
    descriptor.value=function(preschool){
        var name=preschool+"===="
        old(name)
    }
    return descriptor
}
//参数装饰器
function anotationArgs(target,property,index){
    let descriptor =Object.getOwnPropertyDescriptor(target,property)
    console.log(index)
}

//属性装饰器
function anotationAttr(target,property){
    let descriptor =Object.getOwnPropertyDescriptor(target,property)

    Object.defineProperty(target,property,{
        ...descriptor,
        value:`${descriptor.value}小区`
    })
    console.log("属性装饰器")
}


@anotationClass
class Example{
    public name:string
    public static age
    constructor(){
        this.name="军宝宝"
    }
    @anotationAttr
    static addr="运建"
    @anotationMethods
    addSchool(@anotationArgs school){
        console.log(school,'学校')
    }
    add(a,@anotationArgs b){
        return a+b
    }
}

let example=new Example()

// console.log(Example.age,Example.addr)
// example.addSchool("实验中学")


//多个装饰器的执行顺序是 从上到下进入，从下到上执行完
//同一个类的装饰器，执行顺序是，参数》函数》属性》类装饰器



//装饰器的实现

const anotation=(target,property,decorate)=>{
    //把用户定义的修改已回调函数的形式拿到，然后重新修改一遍
    const des=decorate(
        target.prototype,
        property,
        Object.getOwnPropertyDescriptor(target.prototype,property)
    )

    Object.defineProperty(target,property,des)
}
// anotation(Example,"addSchool",anotationMethods) //调用