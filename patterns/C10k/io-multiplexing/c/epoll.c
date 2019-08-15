#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <fcntl.h>
#include <sys/epoll.h>
#include <sys/time.h>
#include <string.h>

#define SERV_PORT 8031
#define MAX_EVENT_NUMBER 1024
#define BUFFER_SIZE 10

/* 将文件描述符 fd 上的 EPOLLIN 注册到 epollfd 指示的 epoll 内核事件表中 */
void addfd(int epollfd, int fd)
{
    struct epoll_event event;
    event.data.fd = fd;
    event.events = EPOLLIN | EPOLLET;
    epoll_ctl(epollfd, EPOLL_CTL_ADD, fd, &event);
    int old_option = fcntl(fd, F_GETFL);
    int new_option = old_option | O_NONBLOCK;
    fcntl(fd, F_SETFL, new_option);
}

void et(struct epoll_event *events, int number, int epollfd, int listenfd)
{
    char buf[BUFFER_SIZE];
    for (int i = 0; i < number; ++i)
    {
        int sockfd = events[i].data.fd;
        if (sockfd == listenfd)
        {
            struct sockaddr_in client_address;
            socklen_t length = sizeof(client_address);
            int connfd = accept(listenfd, (struct sockaddr *)&client_address, &length);
            printf("接收一个请求来自于: %s:%d\n", inet_ntoa(client_address.sin_addr), ntohs(client_address.sin_port));

            addfd(epollfd, connfd);
        }
        else if (events[i].events & EPOLLIN)
        {
            /* 这段代码不会被重复触发，所以我们循环读取数据，以确保把 socket 缓存中的所有数据读取*/
            while (1)
            {
                memset(buf, '\0', BUFFER_SIZE);
                int ret = recv(sockfd, buf, BUFFER_SIZE - 1, 0);
                if (ret < 0)
                {
                    /* 对非阻塞 IO ，下面的条件成立表示数据已经全部读取完毕。此后 epoll 就能再次触发 sockfd 上的 EPOLLIN 事件，以驱动下一次读操作 */
                    if ((errno == EAGAIN) || (errno == EWOULDBLOCK))
                    {
                        printf("read later\n");
                        break;
                    }
                    close(sockfd);
                    break;
                }
                else if (ret == 0)
                {
                    printf("断开一个连接\n");
                    close(sockfd);
                }
                else
                {
                    printf("get %d bytes of content: %s\n", ret, buf);
                }
            }
        }
    }
}

int main(void)
{
    int lfd, epollfd, ret;
    struct sockaddr_in serv_addr;

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

    if (listen(lfd, 5) == -1)
    {
        perror("监听失败");
        exit(1);
    }

    struct epoll_event events[MAX_EVENT_NUMBER];
    if ((epollfd = epoll_create(5)) == -1)
    {
        perror("创建失败");
        exit(1);
    }

    // 把服务器端 lfd 添加到 epollfd 指定的 epoll 内核事件表中，添加一个 lfd 可读的事件
    addfd(epollfd, lfd);
    while (1)
    {
        // 阻塞等待新客户端的连接或者客户端的数据写入，返回需要处理的事件数目
        if ((ret = epoll_wait(epollfd, events, MAX_EVENT_NUMBER, -1)) < 0)
        {
            perror("epoll_wait失败");
            exit(1);
        }

        et(events, ret, epollfd, lfd);
    }

    close(lfd);
    return 0;
}