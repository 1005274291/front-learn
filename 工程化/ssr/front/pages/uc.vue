<template>
  <div>
    <h1>用户中心</h1>
    <div ref="drag" id="drag">
      <input v-if="!file" type="file" name="file" @change="handleFileChange" />
    </div>
    <div>
      <el-progress
        :stroke-width="30"
        :text-inside="true"
        :percentage="uploadProgress"
      ></el-progress>
    </div>
    <div>
      <el-button @click="uploadFile">上传</el-button>
    </div>
    <div>
      <el-progress
        :stroke-width="30"
        :text-inside="true"
        :percentage="hashProgress"
      ></el-progress>
    </div>
    <div>
      <!-- 显示区块上传的进度 尽量让容器显示正方形 -->
      <div
        class="cube-container"
        :style="{ width: cubeWidth + 'px', height: cubeWidth + 'px' }"
      >
        <div class="cube" v-for="chunk in chunks" :key="chunk.name">
          <div
            :class="{
              uploading: chunk.progress > 0 && chunk.progress < 100,
              success: chunk.progress == 100,
              error: chunk.progress < 0,
            }"
            :style="{ height: chunk.progress + '%' }"
          >
            <i
              class="el-icon-loading"
              style="color: #f56c6c"
              v-if="chunk.progress > 0 && chunk.progress < 100"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sparkMd5 from "spark-md5";
const CHUNK_SIZE = parseInt(0.05 * 1024 * 1024); //一1mb为单位进行文件切片
export default {
  async mounted() {
    const ret = await this.$http.get("/user/info"); //获取用户信息并发送token
    console.log(ret);
    this.bindEvents(); //绑定一些事件
  },
  data() {
    return {
      file: null,
      hashProgress: 0,
      chunks: [],
      hash: "",
    };
  },
  computed: {
    cubeWidth() {
      return Math.ceil(Math.sqrt(this.chunks.length)) * 32; //总区块的宽高
    },
    uploadProgress() {
      if (!this.chunks.length) {
        return 0;
      }
      const loaded = this.chunks
        .map((item) => item.chunk.size * item.progress)
        .reduce((acc, cur) => acc + cur, 0);
      return (this.file && parseInt((loaded / this.file.size).toFixed(2))) || 0;
    },
  },
  methods: {
    handleFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      this.file = file;
    },
    async isImage(file) {
      //通过文件的二进制流来判断文件的具体类型是否是我们需要的图片格式
      return (
        (await this.isGif(file)) ||
        (await this.isPng(file)) ||
        (await this.isJpg(file))
      );
    },
    async blobToString(blob) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function () {
          // console.log(reader.result)
          const ret = reader.result
            .split("") //将二进制字符分割
            .map((v) => v.charCodeAt()) //转换成10进制的ascii码
            .map((v) => v.toString(16).toUpperCase()) //根据ascii码转换成16进制并大写
            .map((v) => v.padStart(2, "0")) //每个16进制字符串如果不够两位数用0补全
            .join(" "); //将结果拼接成字符串
          resolve(ret);
        };
        reader.readAsBinaryString(blob); //读取文件并将每个字符的二进制数据保存在result中
      });
    },
    async isGif(file) {
      //判断是不是gif图片
      //根据前面6个16进制是不是 '47 49 46 38 39 61' '47 49 46 38 37 61'
      const ret = await this.blobToString(file.slice(0, 6));
      const isGif = ret == "47 49 46 38 39 61" || ret == "47 49 46 38 37 61";
      return isGif;
    },
    async isPng(file) {
      //判断是不是png图片
      const ret = await this.blobToString(file.slice(0, 8));
      const ispng = ret == "89 50 4E 47 0D 0A 1A 0A";
      return ispng;
    },
    async isJpg(file) {
      //判断是不是jpg
      const len = file.size;
      const start = await this.blobToString(file.slice(0, 2));
      const tail = await this.blobToString(file.slice(-2, len));
      const isjpg = start == "FF D8" && tail == "FF D9";
      return isjpg;
    },
    createFileChunk(file, size = CHUNK_SIZE) {
      const chunks = [];
      let cur = 0;
      while (cur < file.size) {
        chunks.push({
          index: cur,
          file: file.slice(cur, cur + size),
        });
        cur += size;
      }
      return chunks;
    },
    async calculateHashWorke(chunks) {
      //启用webworker进行hash计算并调整进度条位置
      return new Promise((resolve) => {
        this.worker = new Worker("/hash.js");
        this.worker.postMessage({ chunks });
        this.worker.onmessage = (e) => {
          const { progress, hash } = e.data;
          this.hashProgress = Number(progress.toFixed(2));
          if (hash) {
            resolve(hash);
          }
        };
      });
    },
    async calculateHashIdle(chunks) {
      //用浏览器空闲时间来计算hash值
      return new Promise((resolve) => {
        const spark = new sparkMd5.ArrayBuffer();
        let count = 0;

        const appendToSpark = async (file) => {
          //对当前的切片进行计算hash
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (e) => {
              spark.append(reader.result);
              resolve();
            };
          });
        };
        const workLoop = async (deadline) => {
          //在空闲时间执行的函数
          while (count < chunks.length && deadline.timeRemaining() > 1) {
            //任务存在并且浏览器有这个空闲时间
            await appendToSpark(chunks[count].file);
            count++;
            if (count < chunks.length) {
              //还有切片需要计算
              this.hashProgress = Number(
                ((100 * count) / chunks.length).toFixed(2)
              );
            } else {
              //已经计算完全部切片
              this.hashProgress = 100;
              resolve(spark.end());
            }
          }
          window.requestIdleCallback(workLoop); //如果没有空闲时间了下次空闲计算
        };
        window.requestIdleCallback(workLoop);
      });
    },
    async calculateHashSample(file) {
      //参照布隆过滤器 以损失一小部分的精度为代价提高很大的效率
      //抽样hash不一样文件一定不一样，抽样hash一样文件有很小的程度是不一样的
      return new Promise((resolve) => {
        const spark = new sparkMd5.ArrayBuffer();
        const reader = new FileReader();

        const size = file.size;
        const offset = 0.01 * 1024 * 1024; //抽样算法取第一个区块和最后一个区块的全部，中间区块的前中后各两个字节
        let chunks = [file.slice(0, offset)];
        let cur = offset;
        while (cur < size) {
          if (cur + offset >= size) {
            //最后一个区块了
            chunks.push(file.slice(cur, cur + offset));
          } else {
            //中间的区块
            const mid = cur + offset / 2;
            const end = cur + offset;
            chunks.push(file.slice(cur, cur + 2));
            chunks.push(file.slice(mid, mid + 2));
            chunks.push(file.slice(end - 2, end));
          }
          cur += offset;
        }
        reader.readAsArrayBuffer(new Blob(chunks));
        reader.onload = (e) => {
          spark.append(reader.result);
          this.hashProgress = 100;
          resolve(spark.end());
        };
      });
    },
    async uploadFile() {
      if (!this.file) {
        return;
      }
      if (!(await this.isImage(this.file))) {
        //不是图片格式
        this.$alert("图片格式不对");
        return;
      }
      const chunks = this.createFileChunk(this.file); //进行文件切片
      const hash = await this.calculateHashWorke(chunks); //以webworker的形式计算hash
      // const hash2 =await this.calculateHashIdle(chunks)//以浏览器的空闲时间计算hash
      // const hash3 =await this.calculateHashSample(this.file)
      this.hash = hash;
      // 寻问后端文件是否上传过，如果没有是否有切片存在
      const {
        data: { uploaded, uploadedList },
      } = await this.$http.post("/checkfile", {
        hash: this.hash,
        ext: this.file.name.split(".").pop(),
      });

      if (uploaded) {
        //文件已经存在 秒传
        return this.$message.success("秒传成功");
      }
      console.log("文件hash值是", hash);
      this.chunks = chunks.map((chunk, index) => {
        //切片的名字是 hash+index
        const name = hash + "-" + index;
        return {
          hash,
          name,
          index,
          chunk: chunk.file,
          progress: uploadedList.indexOf(name) > -1 ? 100 : 0,
        };
      });

      await this.uploadChunks(uploadedList);
      // this.file=null
      // const form = new FormData();
      // form.append("name", "file");
      // form.append("file", this.file);
      // const ret = await this.$http.post("/uploadfile", form, {
      //   //对上传事件进行监听控制
      //   onUploadProgress: (progress) => {
      //     this.uploadProgress = Number(
      //       ((progress.loaded / progress.total) * 100).toFixed(2)
      //     );
      //   },
      // });
      // this.file=null
      // console.log(ret);
    },
    async uploadChunks(uploadedList) {
      const requests = this.chunks
        .filter((chunk) => uploadedList.indexOf(chunk.name) === -1) //不出现在uploadedList列表中的切片才上传
        .map((chunk) => {
          //包装成form并转成promise

          const form = new FormData();
          form.append("chunk", chunk.chunk);
          form.append("hash", chunk.hash);
          form.append("name", chunk.name);
          return { form, index: chunk.index, error: 0 }; //由于一部分区块可能已经被过滤掉了导致乱序，所以不能用map的index来代表区块的index
        });
      //这是全部切片tcp连接同时建立
      // .map(({form,index}) => {
      //   return this.$http.post("/uploadfile", form, {
      //     onUploadProgress: (progress) => {
      //       //每个区块的进度条
      //       this.chunks[index].progress = Number(
      //         ((progress.loaded / progress.total) * 100).toFixed(2)
      //       );
      //       // this.$set(
      //       //   this.chunks,
      //       //   index,
      //       //   Object.assign(this.chunks[index],{progress:Number(((progress.loaded / progress.total) * 100).toFixed(2))})
      //       // );
      //     },
      //   });
      // });
      // await Promise.all(requests);//所有的切片已经上传完成
      await this.sendRequest(requests); //控制并发数
      await this.mergeRequest();
    },
    async sendRequest(chunks, limit = 3) {
      //最多同时建立limit个请求，有请求完成之后再建立其他请求
      return new Promise((resolve, reject) => {
        const len = chunks.length;
        let count = 0;
        let isStop=false
        const start = async () => {
          if(isStop){
            return
          }
          const task = chunks.shift();
          if (task) {
            const { form, index } = task;//获取这个任务的数据和下标
            try {
              await this.$http.post("/uploadfile", form, {
                onUploadProgress: (progress) => {
                  //每个区块的进度条
                  this.chunks[index].progress = Number(
                    ((progress.loaded / progress.total) * 100).toFixed(2)
                  );
                },
              });
              if (count == len - 1) {
                //这是最后一个任务
                resolve();
              } else {
                //启动下一个任务
                count++;
                start();
              }
            } catch (e) {
              //这个任务出错了进度条要变红并进行重传，如果超过三次就停止全部任务
              this.chunks[index]=-1
              if(task.error<3){
                //重传次数小于3
                task.error++
                chunks.unshift(task)
                start()
              }else{
                //重传超过三次
                isStop=true
                reject()
              }
            }
          }
        };
        while (limit > 0) {
          start(); //启动一个任务
          limit -= 1;
        }
      });
    },
    async mergeRequest() {
      this.$http.post("/mergefile", {
        ext: this.file.name.split(".").pop(),
        size: CHUNK_SIZE,
        hash: this.hash,
      });
    },
    bindEvents() {
      const drag = this.$refs.drag;
      drag.addEventListener("dragover", (e) => {
        //文件被拖进选框
        drag.style.borderColor = "red";
        e.preventDefault();
      });
      drag.addEventListener("dragleave", (e) => {
        //文件被移除选框
        drag.style.borderColor = "#eee";
        e.preventDefault();
      });
      drag.addEventListener("drop", (e) => {
        //文件拖入选框后放下
        const fileList = e.dataTransfer.files;
        drag.style.borderColor = "#eee";
        this.file = fileList[0];
        e.preventDefault();
      });
    },
  },
  watch: {
    file: function (newvalue, oldvalue) {
      // console.log("这是新值", newvalue);
      const imageURl = this.file && window.URL.createObjectURL(this.file);
      // console.log(imageURl);
      drag.style.backgroundImage = imageURl && `url(${imageURl})`;
    },
  },
};
</script>

<style>
#drag {
  height: 500px;
  line-height: 500px;
  border: 2px dashed #eee;
  text-align: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.cube-container .cube {
  width: 28px;
  height: 28px;
  line-height: 24px;
  border: 2px black solid;
  background-color: #eee;
  float: left;
}
.cube-container .cube .success {
  background-color: green;
  text-align: center;
}
.cube-container .cube .uploading {
  background-color: blue;
}
.cube-container .cube .error {
  background-color: red;
}
</style>