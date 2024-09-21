import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GqlHeader = createParamDecorator(
  (headerName: string, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx).getContext();
    const headers = gqlContext.req.headers;
    return headers[headerName.toLowerCase()];
  },
);
