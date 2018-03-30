import { Body, Controller, Post, Req } from '@nestjs/common';
import { successResponse } from '../../../application/common/message/ResponseMessage';

@Controller('github')
export class GithubSyncController {
  @Post()
  sync(@Req() request, @Body() body) {
    // 获取到请求数据
    console.log(request.params);

    return 'Nest.js Boilerplate @ 王下邀月熊';
  }

  @Post('aw/:fileName')
  awSync(@Req() request, @Body() body) {
    // 获取到请求数据
    console.log(request.params);

    return successResponse;
  }
}
