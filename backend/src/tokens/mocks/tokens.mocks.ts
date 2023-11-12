import { TokensResponse } from '../dtos/tokensResponse';
import { JwtTokenDecoded } from '../types/JwtPayload.type';

export const accessTokenMock = 'test_access_token';
export const refreshTokenMock = 'test_access_token';
export const tokensResponseMock: TokensResponse = {
  accessToken: accessTokenMock,
  refreshToken: refreshTokenMock,
} as TokensResponse;

export const jwtPayloadMock: JwtTokenDecoded = {
  iat: 1689448480,
  exp: 1690053280,
  sub: 1,
};
