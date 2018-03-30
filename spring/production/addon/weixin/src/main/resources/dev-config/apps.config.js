/**
 * Created by apple on 16/6/8.
 */
module.exports = {
    apps: [
        {
            //required
            id: "pay",//编号
            title: "Pay",//HTML文件标题
            entry: {
                name: "pay",//该应用的入口名
                src: "./pay/pay.js",//该应用对应的入口文件
            },//入口文件
            indexPage: "./pay/pay.html",//主页文件

            //optional
            dev: true,//判断是否当前正在调试,默认为false
            compiled: true//判斷當前是否加入编译,默认为true
        }
    ]
};