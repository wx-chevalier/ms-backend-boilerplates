```sh
## 1. 创建 Docker registry 所需 PV & PVC
kubectl apply -f pv.yaml

## 2. 创建 Docker 验证信息
docker run --entrypoint htpasswd registry:2 -Bbn ufc 632437FC-716B-4C7C-9829-1D74F71431A1 > ./htpasswd

## 3. 启动 Docker Registry
helm install --namespace ufc --name docker-registry -f docker-registry/values.yaml stable/docker-registry

## 4. 可以使用 values.yaml 更新 Docker registry
helm upgrade --namespace ufc -f docker-registry/values.yaml docker-registry stable/docker-registry
```


创建 Image Pulling Secret 供后续使用：

```sh
# docker login ...
# 注意 OSX 上默认存储到 store 中了，需要额外配置

kubectl create secret generic regcred \
    --namespace=ufc \
    --from-file=.dockerconfigjson=/root/.docker/config.json \
    --type=kubernetes.io/dockerconfigjson
```
