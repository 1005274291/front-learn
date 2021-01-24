const {promisify} =require("util")


module.exports.clone=async function(repo,desc){
    //repo 是要下载哪些东西（github） desc是要将下载的东西放到哪去(文件夹)
    const download =promisify(require("download-git-repo"))//下载工程的库
    const ora=require("ora") //进度条的库
    const process=ora(`下载${repo}项目中..`)//创建一个带进度条的项目
    process.start()//进度条开始
    await download(repo,desc)//下载项目
    process.succeed()//进度条结束
}