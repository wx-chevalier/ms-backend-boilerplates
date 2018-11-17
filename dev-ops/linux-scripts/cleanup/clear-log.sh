# Clear nginx logs.
# @usage delnginxlogs
function delnginxlogs() {
  echo "--------------- ⏲  Clearing logs... ---------------"

  # Clear logs.
  for i in /var/log/nginx/*; do cat /dev/null > $i; done

  echo "--------------- ⏲  Deleting .gz log files... ---------------"

  # Delete .gz files.
  find /var/log/nginx -type f -regex ".*\.gz$" -delete

  echo "--------------- 💯 DONE: NGINX logs cleared ... ---------------"
}