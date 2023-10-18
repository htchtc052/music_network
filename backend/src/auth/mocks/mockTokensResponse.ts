import { TokensResponse } from '../responses/tokens.response';

export const mockTokensResponse = (): TokensResponse => {
  return {
    tokens: {
      accessToken: '698ff117-7381-4387-9649-2cb0c50be032',
      refreshToken: '698ff117-7381-4387-9649-2cb0c50be032',
    },
  };
};
