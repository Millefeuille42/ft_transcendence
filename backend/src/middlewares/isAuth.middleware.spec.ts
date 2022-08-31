import { IsAuthMiddleware } from './isAuth.middleware';

describe('FirstMiddleware', () => {
  it('should be defined', () => {
    expect(new IsAuthMiddleware()).toBeDefined();
  });
});
