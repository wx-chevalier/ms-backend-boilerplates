// @flow

/**
 * @function Service层,用于对Model层进行组装或者执行一些逻辑操作
 */
export default class UserService {

  /**
   * @function 生成随机的UserToken,注意,所有纯函数建议写为静态成员函数
   */
  static generateUserToken() {

    return '123456789';

  }

}