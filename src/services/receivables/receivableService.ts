import type { MoniteSDK, CreatePaymentLinkRequest } from '@monite/sdk-api';
import { MoniteAPIService } from '../api/MoniteAPIService';
import { MoniteMonitoringService } from '../monitoring/moniteMonitoring';
import type { MoniteReceivable } from '@/types/payments';
import { ReceivableTransformer } from '../api/transformers/ReceivableTransformer';

export class ReceivableService {
  static async getReceivables(): Promise<MoniteReceivable[]> {
    console.log('Fetching receivables from Monite');
    const api = await MoniteAPIService.getInstance();
    const sdk = api.getSDK() as MoniteSDK;
    
    try {
      const response = await sdk.api.receivables.getAll();
      await MoniteMonitoringService.logApiCall('receivables.getAll', true);
      return response.data.map(receivable => ReceivableTransformer.fromMonite(receivable));
    } catch (error) {
      await MoniteMonitoringService.logApiCall('receivables.getAll', false, { error });
      throw error;
    }
  }

  static async createInvoice(data: CreatePaymentLinkRequest): Promise<MoniteReceivable> {
    const api = await MoniteAPIService.getInstance();
    const sdk = api.getSDK() as MoniteSDK;
    
    try {
      const payload = ReceivableTransformer.toMonite(data);
      const response = await sdk.api.receivables.create(payload);
      await MoniteMonitoringService.logApiCall('receivables.create', true);
      return ReceivableTransformer.fromMonite(response);
    } catch (error) {
      await MoniteMonitoringService.logApiCall('receivables.create', false, { error });
      throw error;
    }
  }
}