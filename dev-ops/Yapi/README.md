# 使用DockerCompose构建部署Yapi

## OverView

YApi 是一个可本地部署的、打通前后端及QA的、可视化的接口管理平台 https://hellosean1025.github.io/yapi

## 准备一个自己的 Mongo

因为这些数据都是要落地的，建议单独准备一个DB。

## 自己构建镜像

自己构建的镜像可以保证镜像的安全，或者可以魔改一下代码再构建镜像。

- 下载 Yapi

    ```
    ./download.sh 1.8.1
    ```

- 构建镜像

    ```
    docker-compose build
    ```

- Push 镜像

    ```
    docker tag skycitygalaxy/yapi:latest skycitygalaxy/yapi:v7
    docker push skycitygalaxy/yapi:v7
    ```

## 直接使用镜像，本地部署

如果不想自己构建镜像的话，可以使用我打包好的镜像：skycitygalaxy/yapi:v7

- 拉取镜像

    ```
    docker pull skycitygalaxy/yapi:v7
    ```

- 启动服务

    ```
    docker run -d -p 3001:3000 --name yapi skycitygalaxy/yapi:v7
    ```

- 修改配置

    进入容器，修改配置为自己的配置。

    ```
    docker exec -ti yapi bash
    cd /api/
    vim config.json
    ```

- 重启服务

    ```
    docker restart yapi
    ```

- 访问 http://127.0.0.1:3001/

    ![](http://cdn.heroxu.com/2019080815652468118063.png)

## 使用 Rancher 部署

- 配置环境变量

    ![](http://cdn.heroxu.com/20190808156524572847385.png)

- 部署完成

    ![](http://cdn.heroxu.com/20190808156524588021590.png)

    ![](http://cdn.heroxu.com/20190808156524581769215.png)
