# cert-manager

```sh
# 集群公用 Issuer: letsencrypt-cluster
kubectl apply -f cluster-issuer.yaml

## namespace ufc
# 测试用 Issuer: letsencrypt-staging
kubectl apply -f staging-issuer.yaml
# 生产用 Issuer: letsencrypt-prod
kubectl apply -f prod-issuer.yaml

```

# 参考

1. https://docs.cert-manager.io/en/latest/getting-started/install/kubernetes.html
