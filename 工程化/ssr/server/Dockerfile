#指定node镜像的版本
FROM node:10-alpine
#移动当前目录下的文件到app目录下
ADD . /app/
#进入到app目录下面，类似cd
WORKDIR /app
#安装依赖
RUN npm config set registry http://r.npm.taobao.org/ && \
    npm config set sass_binary_site http://npm.taobao.org/mirrors/node-sass/ && \
    npm i
#对外暴露的端口
EXPOSE 8080
#程序启动脚本
CMD ["npm","run","start:docker"]