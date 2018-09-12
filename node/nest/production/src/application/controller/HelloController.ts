// HelloController.ts
import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HelloController {
  @Get()
  hello() {
    return 'Nest.js Boilerplate @ 王下邀月熊';
  }
}
