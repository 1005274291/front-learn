/// <reference path="..//vue进阶/vue/myvue/src/App.vue" /> //三斜线指令 指明文件的依赖
//tsc ts1.ts 编译ts

//ts基本数据类型
// 布尔类型
var isBoon: boolean = false
// 数字类型
var num: number = 0
// 字符串类型
var str: string = ""
// 数组类型
var list1: number[] = [1, 2, 3]
var list2: Array<number> = [1, 2, 3]
// 枚举类型
enum Color { Red = 1, Green = 2, Blue = 3 } //设置下表
var colorName: string = Color[1]//按照下标找值
var c: Color = Color.Red//获取Red的下标
// Any类型
var notSure: any = "noSure!"
// void类型
function tell(): void {
    //没有返回值
}

function add(x:string,y?:number,z="123",...arg:number[]):string{
    //在参数中加?表示可选参数 =表示默认参数 ...表示可变参数
    return x+y
}
// 参数意义声明
var my:(name:string,age:number)=>number=function(n:string,a:number):number{
    return//n是name，a是age的意思
}

//类的创建
class Person{
    // 共有属性（默认属性）
    public name:string;
    // 私有属性（只能在类内部访问 不能通过外部和继承访问）
    private _age:number;
    // 静态属性只能通过类名调用
    static level:number;
    constructor(name:string,age:number){
        this.name =name
        this._age=age
    }
    // 保护属性 （只能在类内部和子类中访问）
    protected print(){
        return this.name+":"+this.age+Person.level
    }
    set age(newage:number){
        this._age=newage
    }
    get age():number{
        return this._age
    }
}
// 声明变量是什么类
var p:Person=new Person("jun",18)
// 类得继承
class Student extends Person{
    // 只读属性
    readonly school:string="shiyan"
    constructor(school:string){
        super("jiang",20)
        this.school=school
    }
}

// 接口
interface LabelValue{
    label:string
    //可选参数
    age?:number
}
function printLabel(labelObj:LabelValue){
    console.log(labelObj.label)
}
// function printLabel(labelObj:{label:string}){
//     //同上一样
// }
var myObj={label:"hello",name:"jun"}
printLabel(myObj)

interface SearchFunc{
    // 对函数的约束
    (source:string,subString:string):boolean
}
var mySearch:SearchFunc
mySearch=function(src:string,sub:string){
    return !!src.search(sub)
}
interface StringArray{
    // 对数组进行约束
    [index:number]:string
}
var arr:StringArray=["","123"]
// 类接口
interface ClockInterface{
    current:Date
    setTime(d:Date)
}

class Clock implements ClockInterface{
    current:Date
    setTime(d:Date){
        this.current=d
    }
}
// 接口多继承
interface Square extends ClockInterface,LabelValue{
    sidLength:number
}
var s=<Square>{}
// 混合接口
interface Counter{
    inter:number
    reset():void
    (start:number):string
}
var d:Counter

// 泛型
function Hello<T>(arg:T):T{
    return arg
}
// 在函数调用的时候传入类型
var output=Hello<string>("123")

// 泛型数组
function Hello1<T>(str:T[]):T[]{
    return str
}
var list:Array<string>=Hello1<string>(["1","2"])
// 泛型函数
interface Hello2<T>{
    (arg:T):T
}
function myhello<T>(arg:T):T{
    return arg
}
var mh:Hello2<number>=myhello
alert(mh(100))

// 泛型类
class HelloNumber<T>{
    Ten:T;
    add:(x:T,y:T)=>T;
}
var mynum=new HelloNumber<number>()
mynum.Ten=10

// 模块
module Vali{
    export interface StringV{
        isAcce(s:string):boolean
    }
    export class Letter implements StringV{
        isAcce(s:string){
            return true
        }
    }
}
var a=new Vali.Letter()
a.isAcce("123")

// 命名空间
namespace Shapes{
    export namespace Ply{
        export class Trangle{}
        export class Square{}
    }
}
import polygons =Shapes.Ply
let sq=new polygons.Square()


//tsc --target ES5 --experimentalDecorators  让ts支持装饰器

// 混入
applyMixins(Person,[Clock])
function applyMixins(derivedCtor:any,baseCtors:any[]){
    baseCtors.forEach(baseCtor=>{
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name=>{
            derivedCtor.prototype[name]=baseCtor.prototype[name]
        })
    })
}