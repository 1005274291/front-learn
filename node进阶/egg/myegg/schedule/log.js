module.exports = {
  interval: "*/3 * * * * *",
  handler() {
    console.log("定时任务 嘿嘿 三秒执⾏⼀次" + new Date());
  },
};
//定时任务以crontab格式来启动定时，按规定时间执行函数