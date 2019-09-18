```sh
## 1. 创建 Gitlab 所需 PV & PVC
kubectl apply -f pv.yaml

## 2. 启动 Docker Registry
helm install --namespace ufc --name gitlab -f values.yaml gitlab-ce

## 3. 可以使用 values.yaml 更新 Docker registry
helm upgrade --namespace ufc -f values.yaml gitlab gitlab-ce
```
