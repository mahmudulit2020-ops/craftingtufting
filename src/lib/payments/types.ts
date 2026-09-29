export type PaymentGatewayType = 'stripe' | 'paypal' | 'swift_wire' | 'bkash';

export type SplitPaymentPhase = 'ADVANCE_50' | 'FINAL_BALANCE_50' | 'FULL_PAYMENT';

export interface PaymentIntentRequest {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amountUSD: number;
  currencyCode: string;
  phase: SplitPaymentPhase;
  gateway: PaymentGatewayType;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  success: boolean;
  transactionId: string;
  gateway: PaymentGatewayType;
  amountPaid: number;
  remainingScheduled: number;
  phase: SplitPaymentPhase;
  currencyCode: string;
  status: 'succeeded' | 'scheduled_invoice_created' | 'pending_verification';
  receiptUrl?: string;
  instructions?: string;
}

export interface PaymentGatewayStrategy {
  createSplitPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResponse>;
  verifyPaymentStatus(transactionId: string): Promise<boolean>;
}
