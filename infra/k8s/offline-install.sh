# 离线安装 K8S，详细步骤阐述参考 [Kubernetes-CheatSheet](https://parg.co/AT6)

# 列举全部的镜像列表
kubeadm config images list

# 拉取镜像
docker pull k8s.gcr.io/kube-apiserver-amd64:v1.11.3
docker pull k8s.gcr.io/kube-controller-manager-amd64:v1.11.3
docker pull k8s.gcr.io/kube-scheduler-amd64:v1.11.3
docker pull k8s.gcr.io/kube-proxy-amd64:v1.11.3
docker pull k8s.gcr.io/coredns:1.1.3
docker pull k8s.gcr.io/pause:3.1
docker pull k8s.gcr.io/etcd-amd64:3.2.18

# 保存镜像
docker save k8s.gcr.io/kube-apiserver-amd64:v1.11.3 > kube-apiserver-amd64_v1.11.3.tar
docker save k8s.gcr.io/kube-controller-manager-amd64:v1.11.3 > kube-controller-manager-amd64_v1.11.3.tar
docker save k8s.gcr.io/kube-scheduler-amd64:v1.11.3 > kube-scheduler-amd64_v1.11.3.tar
docker save k8s.gcr.io/kube-proxy-amd64:v1.11.3 > kube-proxy-amd64_v1.11.3.tar
docker save k8s.gcr.io/pause:3.1 > pause_3.1.tar
docker save k8s.gcr.io/etcd-amd64:3.2.18 > etcd-amd64_3.2.18.tar
docker save k8s.gcr.io/coredns:1.1.3 > coredns_1.1.3.tar

# 载入镜像
docker load < kube-apiserver-amd64_v1.11.3.tar
docker load < kube-controller-manager-amd64_v1.11.3.tar
docker load < kube-scheduler-amd64_v1.11.3.tar
docker load < kube-proxy-amd64_v1.11.3.tar
docker load < pause_3.1.tar
docker load < etcd-amd64_3.2.18.tar
docker load < coredns_1.1.3.tar

# 复制到目标机器
scp <folder_with_images>/*.tar <user>@<server>:<path>/<to>/<remote>/<folder>

# 确保 Docker 安装并启动
systemctl status docker

systemctl enable docker && systemctl start docker

# 在子节点上设置加入到主节点
kubeadm join --token <token> <master-ip>

# Dashboard 镜像
docker pull k8s.gcr.io/kubernetes-dashboard-amd64:v1.10.0
docker save k8s.gcr.io/kubernetes-dashboard-amd64:v1.10.0 > kubernetes-dashboard-amd64_v1.10.0.tar
docker load < kubernetes-dashboard-amd64_v1.10.0.tar

# Weave 镜像
docker pull docker.io/weaveworks/weave-kube:2.4.0
docker save docker.io/weaveworks/weave-kube:2.4.0 > weave-kube_2.4.0.tar
docker load < weave-kube_2.4.0.tar

docker pull docker.io/weaveworks/weave-npc:2.4.0
docker save docker.io/weaveworks/weave-npc:2.4.0 > weave-npc_2.4.0.tar
docker load < weave-npc_2.4.0.tar