import { SetCorsHeaderMiddleware } from './set-cors-header.middleware';

describe('SetCorsHeaderMiddleware', () => {
  it('should be defined', () => {
    expect(new SetCorsHeaderMiddleware()).toBeDefined();
  });
});
