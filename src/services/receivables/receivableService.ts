import { MoniteAuthService } from '../auth/moniteAuth';
import type { CreatePaymentLinkRequest } from '@monite/sdk-api';
import { CurrencyEnum } from '@monite/sdk-api';

export class ReceivableService {
  static async getReceivables() {
    console.log('Fetching receivables from Monite');
    const sdk = await MoniteAuthService.initializeSDK();
    const response = await sdk.receivables.list();
    return response.data || [];
  }

  static async createInvoice(data: CreatePaymentLinkRequest) {
    console.log('Creating invoice with data:', data);
    const sdk = await MoniteAuthService.initializeSDK();
    return sdk.receivables.create(data);
  }
}