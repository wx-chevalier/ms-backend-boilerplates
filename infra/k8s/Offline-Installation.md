# 离线安装 K8S

详细步骤阐述参考 [Kubernetes-CheatSheet](https://parg.co/AT6)。

## 拉取镜像

```sh
docker pull gcr.io/google_containers/kube-apiserver-amd64:v1.5.0
docker pull gcr.io/google_containers/kube-controller-manager-amd64:v1.5.0
docker pull gcr.io/google_containers/kube-proxy-amd64:v1.5.0
docker pull gcr.io/google_containers/kube-scheduler-amd64:v1.5.0
docker pull weaveworks/weave-npc:1.8.2
docker pull weaveworks/weave-kube:1.8.2
docker pull gcr.io/google_containers/kubernetes-dashboard-amd64:v1.5.0
docker pull gcr.io/google-containers/kube-addon-manager:v6.1
docker pull gcr.io/google_containers/etcd-amd64:3.0.14-kubeadm
docker pull gcr.io/google_containers/kubedns-amd64:1.9
docker pull gcr.io/google_containers/dnsmasq-metrics-amd64:1.0
docker pull gcr.io/google_containers/kubedns-amd64:1.8
docker pull gcr.io/google_containers/kube-dnsmasq-amd64:1.4
docker pull gcr.io/google_containers/kube-discovery-amd64:1.0
docker pull quay.io/coreos/flannel-git:v0.6.1-28-g5dde68d-amd64
docker pull gcr.io/google_containers/exechealthz-amd64:1.2
docker pull gcr.io/google_containers/pause-amd64:3.0
```

## 导出保存为 tarball

```
docker save gcr.io/google_containers/kube-apiserver-amd64:v1.5.0 > kube-apiserver-amd64_v1.5.0.tar
docker save gcr.io/google_containers/kube-controller-manager-amd64:v1.5.0 > kube-controller-manager-amd64_v1.5.0.tar
docker save gcr.io/google_containers/kube-proxy-amd64:v1.5.0 > kube-proxy-amd64_v1.5.0.tar
docker save gcr.io/google_containers/kube-scheduler-amd64:v1.5.0 > kube-scheduler-amd64_v1.5.0.tar
docker save weaveworks/weave-npc:1.8.2 > weave-npc_1.8.2.tar
docker save weaveworks/weave-kube:1.8.2 > weave-kube_1.8.2.tar
docker save gcr.io/google_containers/kubernetes-dashboard-amd64:v1.5.0 > kubernetes-dashboard-amd64_v1.5.0.tar
docker save gcr.io/google-containers/kube-addon-manager:v6.1 > kube-addon-manager_v6.1.tar
docker save gcr.io/google_containers/etcd-amd64:3.0.14-kubeadm > etcd-amd64_3.0.14-kubeadm.tar
docker save gcr.io/google_containers/kubedns-amd64:1.9 > kubedns-amd64_1.9.tar
docker save gcr.io/google_containers/dnsmasq-metrics-amd64:1.0 > dnsmasq-metrics-amd64_1.0.tar
docker save gcr.io/google_containers/kubedns-amd64:1.8 > kubedns-amd64_1.8.tar
docker save gcr.io/google_containers/kube-dnsmasq-amd64:1.4 > kube-dnsmasq-amd64_1.4.tar
docker save gcr.io/google_containers/kube-discovery-amd64:1.0 > kube-discovery-amd64_1.0.tar
docker save quay.io/coreos/flannel-git:v0.6.1-28-g5dde68d-amd64 > flannel-git_v0.6.1-28-g5dde68d-amd64.tar
docker save gcr.io/google_containers/exechealthz-amd64:1.2 > exechealthz-amd64_1.2.tar
docker save gcr.io/google_containers/pause-amd64:3.0 > pause-amd64_3.0.tar
```

## 复制到目标机器

```
scp <folder_with_images>/*.tar <user>@<server>:<path>/<to>/<remote>/<folder>
```

## 确保 Docker 安装并启动

```sh
systemctl status docker

systemctl enable docker && systemctl start docker
```

## 加载 Docker 镜像

```
docker load < kube-apiserver-amd64_v1.5.0.tar
docker load < kube-controller-manager-amd64_v1.5.0.tar
docker load < kube-proxy-amd64_v1.5.0.tar
docker load < kube-scheduler-amd64_v1.5.0.tar
docker load < weave-npc_1.8.2.tar
docker load < weave-kube_1.8.2.tar
docker load < kubernetes-dashboard-amd64_v1.5.0.tar
docker load < kube-addon-manager_v6.1.tar
docker load < etcd-amd64_3.0.14-kubeadm.tar
docker load < kubedns-amd64_1.9.tar
docker load < dnsmasq-metrics-amd64_1.0.tar
docker load < kubedns-amd64_1.8.tar
docker load < kube-dnsmasq-amd64_1.4.tar
docker load < kube-discovery-amd64_1.0.tar
docker load < flannel-git_v0.6.1-28-g5dde68d-amd64.tar
docker load < exechealthz-amd64_1.2.tar
docker load < pause-amd64_3.0.tar
```

## For Centos7, enable sysctl configuration

### edit `/etc/sysctl.conf`

```
vi /etc/sysctl.conf
```

### modify

`net.ipv4.ip_forward = 0` to `net.ipv4.ip_forward = 1`

## Append

```
net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
```

### Reload properties

```
sysctl -p
```

## Download kubernetes rpms

```
wget https://packages.cloud.google.com/yum/pool/93af9d0fbd67365fa5bf3f85e3d36060138a62ab77e133e35f6cadc1fdc15299-kubectl-1.5.1-0.x86_64.rpm
wget https://packages.cloud.google.com/yum/pool/8a299eb1db946b2bdf01c5d5c58ef959e7a9d9a0dd706e570028ebb14d48c42e-kubelet-1.5.1-0.x86_64.rpm
wget https://packages.cloud.google.com/yum/pool/567600102f687e0f27bd1fd3d8211ec1cb12e71742221526bb4e14a412f4fdb5-kubernetes-cni-0.3.0.1-0.07a8a2.x86_64.rpm
wget https://packages.cloud.google.com/yum/pool/5612db97409141d7fd839e734d9ad3864dcc16a630b2a91c312589a0a0d960d0-kubeadm-1.6.0-0.alpha.0.2074.a092d8e0f95f52.x86_64.rpm
```

## Copy kubernetes rpms to the remote server

```
scp <folder_with_rpms>/*.rpm <user>@<server>:<path>/<to>/<remote>/<folder>
```

## Install kubernetes tools

```
yum install -y *.rpm
systemctl enable kubelet && systemctl start kubelet
```

# On master

## Kubeadm installation

Follow instruction from https://kubernetes.io/docs/getting-started-guides/kubeadm/ (Starting from (2/4) Initializing your master)

### initalization

```
kubeadm init

...
[kubeadm] WARNING: kubeadm is in alpha, please do not use it for production clusters.
[preflight] Running pre-flight checks
[init] Using Kubernetes version: v1.5.1
[tokens] Generated token: "064158.548b9ddb1d3fad3e"
[certificates] Generated Certificate Authority key and certificate.
[certificates] Generated API Server key and certificate
[certificates] Generated Service Account signing keys
[certificates] Created keys and certificates in "/etc/kubernetes/pki"
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/kubelet.conf"
[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/admin.conf"
[apiclient] Created API client, waiting for the control plane to become ready
[apiclient] All control plane components are healthy after 61.317580 seconds
[apiclient] Waiting for at least one node to register and become ready
[apiclient] First node is ready after 6.556101 seconds
[apiclient] Creating a test deployment
[apiclient] Test deployment succeeded
[token-discovery] Created the kube-discovery deployment, waiting for it to become ready
[token-discovery] kube-discovery is ready after 6.020980 seconds
[addons] Created essential addon: kube-proxy
[addons] Created essential addon: kube-dns

Your Kubernetes master has initialized successfully!

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
    http://kubernetes.io/docs/admin/addons/

You can now join any number of machines by running the following on each node:

kubeadm join --token=<token> <master-ip>
# Copy the previous line
...
```

### Network configuration

#### Download weave plugin configuration (with internet)

```
wget https://git.io/weave-kube
mv weave-kube weave-kube.yml
```

#### Copy weave plugin configuration

```
scp <folder_with_weave_yml>/weave-kube.yml <user>@<server>:<path>/<to>/<remote>/<folder>
```

#### Apply plugin

```
kubectl apply -f <folder_with_weave_yml>/weave-kube.yml
```

#### Fix kube-proxy problem

```
kubectl -n kube-system get ds -l "component=kube-proxy" -o json | jq ".items[0].spec.template.spec.containers[0].command |= .+ [\"--proxy-mode=userspace\"]" | kubectl apply -f - && kubectl -n kube-system delete pods -l "component=kube-proxy"
```

# On Node

kubeadm join --token <token> <master-ip>

# Trick and tips

```
wget https://storage.googleapis.com/kubernetes-release/release/v1.4.6/kubernetes-client-linux-amd64.tar.gz
```
