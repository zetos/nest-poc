import { Test } from '@nestjs/testing';
import { AuthorizerService } from './authorizer.service';

describe('AuthorizerService', () => {
  let authorizerService: AuthorizerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthorizerService],
    }).compile();

    authorizerService = moduleRef.get<AuthorizerService>(AuthorizerService);
  });

  describe('authorize', () => {
    it('should authorize when permission is true', async () => {
      const mockResponse = { permission: true };
      // Lazy but typed mock of the fetch function
      const mockJsonPromise: Promise<Response> = Promise.resolve({
        json: jest.fn().mockResolvedValue(mockResponse),
        status: 200,
        statusText: 'OK',
        ok: true,
      } as unknown as Response);

      jest.spyOn(global, 'fetch').mockImplementation(() => mockJsonPromise);

      // Call the authorize method
      const result = await authorizerService.authorize();

      // Assertions
      expect(result).toBe(true);
    });

    it('should throw BadGatewayException when permission is not true', async () => {
      // Lazy mock of the fetch function
      const mockResponse = { permission: false };
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      // Call the authorize method
      const result = await authorizerService.authorize();

      // Assertions
      expect(result).toBe(false);
    });
  });
});
