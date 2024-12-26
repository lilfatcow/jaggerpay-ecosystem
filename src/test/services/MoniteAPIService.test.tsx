import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MoniteAPIService } from '@/services/api/MoniteAPIService';
import { MoniteClient } from '@/services/monite/MoniteClient';
import type { MoniteSDK } from '@monite/sdk-api';

vi.mock('@/services/monite/MoniteClient', () => ({
  MoniteClient: {
    getInstance: vi.fn()
  }
}));

describe('MoniteAPIService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize successfully', async () => {
    const mockSDK = {
      entityId: 'test-entity',
      headers: {},
      environment: 'sandbox',
      fetchToken: vi.fn(),
      baseUrl: 'https://api.sandbox.monite.com/v1',
      api: {
        payable: {},
        receivable: {}
      }
    } as unknown as MoniteSDK;

    vi.mocked(MoniteClient.getInstance).mockResolvedValue(mockSDK);

    const service = MoniteAPIService.getInstance();
    await service.initialize();

    expect(service.getSDK()).toBeDefined();
  });

  it('should handle API calls correctly', async () => {
    const mockSDK = {
      api: {
        payable: {
          getList: vi.fn().mockResolvedValue({ data: [] })
        },
        receivable: {}
      }
    } as unknown as MoniteSDK;

    vi.mocked(MoniteClient.getInstance).mockResolvedValue(mockSDK);

    const service = MoniteAPIService.getInstance();
    await service.initialize();

    const result = await service.callAPI('payable', 'getList');
    expect(result).toBeDefined();
  });

  it('should handle API errors', async () => {
    const mockSDK = {
      api: {
        payable: {
          getList: vi.fn().mockRejectedValue(new Error('API Error'))
        },
        receivable: {}
      }
    } as unknown as MoniteSDK;

    vi.mocked(MoniteClient.getInstance).mockResolvedValue(mockSDK);

    const service = MoniteAPIService.getInstance();
    await service.initialize();

    await expect(service.callAPI('payable', 'getList')).rejects.toThrow();
  });
});