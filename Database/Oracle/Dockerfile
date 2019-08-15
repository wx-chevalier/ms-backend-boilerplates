FROM wnameless/oracle-xe-11g:latest

RUN apt-get update
RUN apt-get install -y locales
RUN locale-gen zh_CN
RUN locale-gen zh_CN.utf8
RUN update-locale LANG=zh_CN.UTF-8 LC_ALL=zh_CN.UTF-8 LANGUAGE=zh_CN.UTF-8

ENV LANG zh_CN.UTF-8
ENV LANGUAGE zh_CN.UTF-8
