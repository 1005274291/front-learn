//这是专门用于计算大文件hash值的webworker.js


//webworker计算的优点是不占用主线程不会卡住页面
//缺点是不好利用npm包管理程序，需要配置静态资源
//并且对于实时更新的需求会在引入文件时耽误时间

self.importScripts("spark-md5.min.js")//可以进行增量md5计算

self.onmessage=e=>{
    //接受主线程传递的数据
    const {chunks}=e.data
    const spark =new self.SparkMD5.ArrayBuffer()//创建一个增量计算md5的实例

    let progress=0 //进度条百分比
    let count=0 //已经计算的切片个数

    const loadNext=index=>{
        //计算到哪个切片
        const reader=new FileReader()
        reader.readAsArrayBuffer(chunks[index].file)
        reader.onload=e=>{
            count++ //下次计算下一个切片
            spark.append(reader.result)
            if(count ==chunks.length){
                //切片hash已经完全计算完毕
                self.postMessage({
                    progress:100,
                    hash:spark.end()
                })
            }else{
                //切片还在计算当中
                progress +=100/chunks.length //完成度
                self.postMessage({
                    progress
                })
                loadNext(count)
            }
        }
    }
    loadNext(0)//从第一切片开始计算
}

