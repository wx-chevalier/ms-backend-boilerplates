/**
 * Description 用户相关控制器
 */
import UserModel from "../model/UserModel";
import UserService from "../service/UserService";
import { apiDescription, apiRequestMapping } from "swagger-decorator";
import User from "../../shared/entity/User";
import UserControllerDoc from "./doc/UserControllerDoc";

/**
 * Description 用户信息相关的控制器
 */
export default class UserController extends UserControllerDoc {
  @apiRequestMapping("get", "/users")
  @apiDescription("get all users list")
  static async getUsers(ctx, next): [User] {
    ctx.body = [new User()];
  }

  @apiRequestMapping("get", "/user/:id")
  @apiDescription("get user object by id, only access self or friends")
  static async getUserByID(ctx, next): User {
    const user_id: string = ctx.params.id;

    //获取用户信息
    let userModel = new UserModel(this);

    //抓取用户信息
    let user_info = await userModel.getUserInfoByID(user_id);

    //设置返回数据
    ctx.body = {
      user_id,
      user_info,
      user_token: UserService.generateUserToken()
    };

    //等待以后是否有响应体
    await next();
  }

  @apiRequestMapping("post", "/user")
  @apiDescription("create new user")
  static async postUser(): number {}
}
