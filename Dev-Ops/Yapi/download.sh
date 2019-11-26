function usage(){
 echo "usage:  sh build.sh  <version>"
 echo "默认版本： 1.7.1"
 echo "yapi的版本：  https://github.com/YMFE/yapi/releases"
 echo "我们将从这里下载：  http://registry.npm.taobao.org/yapi-vendor/download/yapi-vendor-\$1.tgz"
}



version=1.7.1

if [ -n "$1" ]; then
 version=$1
fi

usage


echo -e "\033[32m download new package (version $version) \033[0m"

wget -O yapi.tgz http://registry.npm.taobao.org/yapi-vendor/download/yapi-vendor-$version.tgz
