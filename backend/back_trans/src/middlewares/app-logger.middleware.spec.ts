import { AppLoggerMiddleware } from './app-logger.middleware';

describe('AppLoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new AppLoggerMiddleware()).toBeDefined();
  });
});
