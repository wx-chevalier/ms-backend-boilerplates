#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <fcntl.h>
#include <sys/select.h>
#include <sys/time.h>
#include <string.h>

#define SERV_PORT 8031
#define BUFSIZE 1024
#define FD_SET_SIZE 128

int main(void)
{
    int lfd, cfd, maxfd, scokfd, retval;
    struct sockaddr_in serv_addr, clin_addr;

    socklen_t clin_len; // 地址信息结构体大小

    char recvbuf[BUFSIZE];
    int len;

    fd_set read_set, read_set_init;

    int client[FD_SET_SIZE];
    int i;
    int maxi = -1;

    if ((lfd = socket(AF_INET, SOCK_STREAM, 0)) == -1)
    {
        perror("套接字描述符创建失败");
        exit(1);
    }

    int opt = 1;
    setsockopt(lfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = htonl(INADDR_ANY);
    serv_addr.sin_port = htons(SERV_PORT);

    if (bind(lfd, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) == -1)
    {
        perror("绑定失败");
        exit(1);
    }

    if (listen(lfd, FD_SET_SIZE) == -1)
    {
        perror("监听失败");
        exit(1);
    }

    maxfd = lfd;

    for (i = 0; i < FD_SET_SIZE; ++i)
    {
        client[i] = -1;
    }

    FD_ZERO(&read_set_init);
    FD_SET(lfd, &read_set_init);

    while (1)
    {
        // 每次循环开始时，都初始化 read_set
        read_set = read_set_init;

        // 因为上一步 read_set 已经重置，所以需要已连接上的客户端 fd (由上次循环后产生)重新添加进 read_set
        for (i = 0; i < FD_SET_SIZE; ++i)
        {
            if (client[i] > 0)
            {
                FD_SET(client[i], &read_set);
            }
        }

        printf("select 等待\n");
        // 这里会阻塞，直到 read_set 中某一个 fd 有数据可读才返回，注意 read_set 中除了客户端 fd 还有服务端监听的 fd
        retval = select(maxfd + 1, &read_set, NULL, NULL, NULL);
        if (retval == -1)
        {
            perror("select 错误\n");
        }
        else if (retval == 0)
        {
            printf("超时\n");
            continue;
        }
        printf("select 返回\n");

        //------------------------------------------------------------------------------------------------
        // 用 FD_ISSET 来判断 lfd (服务端监听的fd)是否可读。只有当新的客户端连接时，lfd 才可读
        if (FD_ISSET(lfd, &read_set))
        {
            clin_len = sizeof(clin_addr);
            if ((cfd = accept(lfd, (struct sockaddr *)&clin_addr, &clin_len)) == -1)
            {
                perror("接收错误\n");
                continue;
            }

            for (i = 0; i < FD_SET_SIZE; ++i)
            {
                if (client[i] < 0)
                {
                    // 把客户端 fd 放入 client 数组
                    client[i] = cfd;
                    printf("接收client[%d]一个请求来自于: %s:%d\n", i, inet_ntoa(clin_addr.sin_addr), ntohs(clin_addr.sin_port));
                    break;
                }
            }

            // 最大的描述符值也要重新计算
            maxfd = (cfd > maxfd) ? cfd : maxfd;
            // maxi 用于下面遍历所有有效客户端 fd 使用，以免遍历整个 client 数组
            maxi = (i >= maxi) ? ++i : maxi;
        }
        //------------------------------------------------------------------------------------------------

        for (i = 0; i < maxi; ++i)
        {
            if (client[i] < 0)
            {
                continue;
            }

            // 如果客户端 fd 中有数据可读，则进行读取
            if (FD_ISSET(client[i], &read_set))
            {
                // 注意：这里没有使用 while 循环读取，如果使用 while 循环读取，则有阻塞在一个客户端了。
                // 可能你会想到如果一次读取不完怎么办？
                // 读取不完时，在循环到 select 时 由于未读完的 fd 还有数据可读，那么立即返回，然后到这里继续读取，原来的 while 循环读取直接提到最外层的 while(1) + select 来判断是否有数据继续可读
                len = read(client[i], recvbuf, BUFSIZE);
                if (len > 0)
                {
                    write(STDOUT_FILENO, recvbuf, len);
                }
                else if (len == 0)
                {
                    // 如果在客户端 ctrl+z
                    close(client[i]);
                    printf("clinet[%d] 连接关闭\n", i);
                    FD_CLR(client[i], &read_set);
                    client[i] = -1;
                    break;
                }
            }
        }
    }

    close(lfd);

    return 0;
}