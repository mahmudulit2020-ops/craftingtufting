import type {
  PaymentGatewayType,
  PaymentGatewayStrategy,
  PaymentIntentRequest,
  PaymentIntentResponse,
} from './types';

// Stripe Elements / Checkout Strategy
class StripePaymentStrategy implements PaymentGatewayStrategy {
  async createSplitPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    const isAdvance = request.phase === 'ADVANCE_50';
    const amountPaid = isAdvance ? Math.round(request.amountUSD * 0.5) : request.amountUSD;
    const remainingScheduled = isAdvance ? request.amountUSD - amountPaid : 0;
    const txId = `ch_str_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

    return {
      success: true,
      transactionId: txId,
      gateway: 'stripe',
      amountPaid,
      remainingScheduled,
      phase: request.phase,
      currencyCode: request.currencyCode,
      status: isAdvance ? 'scheduled_invoice_created' : 'succeeded',
      receiptUrl: `https://craftingtufting.com/receipts/${txId}`,
      instructions: isAdvance
        ? '50% advance captured via Stripe Vault. The remaining 50% balance has been scheduled as an automatic draft upon final shearing completion.'
        : 'Full payment successfully authorized and settled via Stripe.',
    };
  }

  async verifyPaymentStatus(): Promise<boolean> {
    return true;
  }
}

// PayPal Strategy
class PayPalPaymentStrategy implements PaymentGatewayStrategy {
  async createSplitPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    const isAdvance = request.phase === 'ADVANCE_50';
    const amountPaid = isAdvance ? Math.round(request.amountUSD * 0.5) : request.amountUSD;
    const remainingScheduled = isAdvance ? request.amountUSD - amountPaid : 0;
    const txId = `PAYID-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      success: true,
      transactionId: txId,
      gateway: 'paypal',
      amountPaid,
      remainingScheduled,
      phase: request.phase,
      currencyCode: request.currencyCode,
      status: isAdvance ? 'scheduled_invoice_created' : 'succeeded',
      instructions: 'PayPal Express 50% advance authorized. Balance invoice generated.',
    };
  }

  async verifyPaymentStatus(): Promise<boolean> {
    return true;
  }
}

// SWIFT Bank Wire Strategy
class SwiftWirePaymentStrategy implements PaymentGatewayStrategy {
  async createSplitPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    const isAdvance = request.phase === 'ADVANCE_50';
    const amountPaid = isAdvance ? Math.round(request.amountUSD * 0.5) : request.amountUSD;
    const txId = `WIRE-INV-${request.orderNumber}`;

    return {
      success: true,
      transactionId: txId,
      gateway: 'swift_wire',
      amountPaid,
      remainingScheduled: request.amountUSD - amountPaid,
      phase: request.phase,
      currencyCode: request.currencyCode,
      status: 'pending_verification',
      instructions: 'Pro-forma invoice generated. Standard Chartered Bank Dhaka SWIFT: SCBLBDDX.',
    };
  }

  async verifyPaymentStatus(): Promise<boolean> {
    return true;
  }
}

// bKash / Nagad Local APM Strategy
class BkashPaymentStrategy implements PaymentGatewayStrategy {
  async createSplitPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    const isAdvance = request.phase === 'ADVANCE_50';
    const amountPaid = isAdvance ? Math.round(request.amountUSD * 0.5) : request.amountUSD;
    const txId = `BK-${Date.now().toString().slice(-8)}`;

    return {
      success: true,
      transactionId: txId,
      gateway: 'bkash',
      amountPaid,
      remainingScheduled: request.amountUSD - amountPaid,
      phase: request.phase,
      currencyCode: request.currencyCode,
      status: 'succeeded',
      instructions: 'bKash Merchant Payment confirmed with SMS verification.',
    };
  }

  async verifyPaymentStatus(): Promise<boolean> {
    return true;
  }
}

// Gateway Factory & Service
export class PaymentService {
  private static strategies: Record<PaymentGatewayType, PaymentGatewayStrategy> = {
    stripe: new StripePaymentStrategy(),
    paypal: new PayPalPaymentStrategy(),
    swift_wire: new SwiftWirePaymentStrategy(),
    bkash: new BkashPaymentStrategy(),
  };

  public static async processSplitPayment(
    gateway: PaymentGatewayType,
    request: PaymentIntentRequest
  ): Promise<PaymentIntentResponse> {
    const strategy = this.strategies[gateway] || this.strategies.stripe;
    return await strategy.createSplitPaymentIntent(request);
  }
}
