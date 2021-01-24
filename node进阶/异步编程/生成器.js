function* func(){
    console.log("one")
    yield "a"
    console.log("two")
    yield "b"
    console.log("three")
    yield "c"//如果是return 则done为ture 如果是yield 则done为false

}

// const f=func()
// console.log('next:',f.next())
// console.log('next:',f.next())
// console.log('next:',f.next())
// console.log('next:',f.next())

for(const [key,value] of func()){
    //采用迭代器去执行
    console.log(`${key}:${value}`)
}