import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as requestIp from 'request-ip';

export const RequestIpAddress = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    //const request = <requestIp.Request>ctx.switchToHttp().getRequest();
    const request = ctx.switchToHttp().getRequest();

    if (request.clientIp) {
      return request.clientIp;
    };

    return requestIp.getClientIp(request);
  }
);
