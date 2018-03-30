// @flow

import { entityProperty } from "swagger-decorator";
/**
 * Description 用户实体类
 */
export default class User {
  // 编号
  @entityProperty({
    type: "integer",
    description: "user id, auto-generated",
    required: false
  })
  id: string = 0;

  // 姓名
  @entityProperty({
    type: "string",
    description: "user name, 3~12 characters",
    required: true
  })
  name: string = "name";

  // 朋友列表
  friends: [number] = [1];

  // 属性
  properties: {
    address: string
  } = {
    address: "address"
  };
}
