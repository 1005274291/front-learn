echo Deploy Projecy
# 获取最新代码
git pull
#强制重新编译容器
docker-compose down
# docker-compose up -d --force-recreate
docker-compose up -d --build