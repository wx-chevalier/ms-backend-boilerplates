#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <string.h>

#define SERV_PORT 8031
#define BUFSIZE 1024

int main(void)
{
    int lfd, cfd;
    struct sockaddr_in serv_addr, clin_addr;
    socklen_t clin_len;
    char recvbuf[BUFSIZE];
    int len;

    lfd = socket(AF_INET, SOCK_STREAM, 0);

    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = htonl(INADDR_ANY);
    serv_addr.sin_port = htons(SERV_PORT);

    bind(lfd, (struct sockaddr *)&serv_addr, sizeof(serv_addr));

    listen(lfd, 128);

    while (1)
    {
        clin_len = sizeof(clin_addr);
        cfd = accept(lfd, (struct sockaddr *)&clin_addr, &clin_len);
        while (len = read(cfd, recvbuf, BUFSIZE))
        {
            write(STDOUT_FILENO, recvbuf, len); //把客户端输入的内容输出在终端
            // 只有当客户端输入 stop 就停止当前客户端的连接
            if (strncasecmp(recvbuf, "stop", 4) == 0)
            {
                close(cfd);
                break;
            }
        }
    }
    close(lfd);
    return 0;
}