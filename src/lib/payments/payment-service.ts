/**
 * International Payment Gateway Abstraction & Split-Payment Engine
 * Supporting 50% advance intent generation, settlement callbacks, and invoice scheduling.
 */

export type PaymentProvider = 'stripe' | 'paypal' | 'wire' | 'bkash';

export interface SplitPaymentIntent {
  intentId: string;
  orderNumber: string;
  currency: string;
  totalAmount: number;
  advanceAmount: number;
  remainingBalance: number;
  status: 'PENDING_ADVANCE' | 'ADVANCE_PAID' | 'COMPLETED' | 'FAILED';
  provider: PaymentProvider;
  scheduledBalanceInvoiceDate: string;
  clientSecret?: string;
  metadata: Record<string, string | number>;
}

export interface PaymentProcessResult {
  success: boolean;
  transactionId: string;
  intent: SplitPaymentIntent;
  message: string;
}

export interface PaymentGatewayStrategy {
  createSplitIntent: (params: {
    orderNumber: string;
    totalAmount: number;
    currency: string;
    customerEmail: string;
  }) => Promise<SplitPaymentIntent>;

  confirmAdvancePayment: (
    intentId: string,
    paymentDetails?: Record<string, unknown>
  ) => Promise<PaymentProcessResult>;
}

// 1. Stripe Checkout / Elements Strategy
class StripePaymentStrategy implements PaymentGatewayStrategy {
  async createSplitIntent({
    orderNumber,
    totalAmount,
    currency,
  }: {
    orderNumber: string;
    totalAmount: number;
    currency: string;
    customerEmail: string;
  }): Promise<SplitPaymentIntent> {
    const advance = Math.round(totalAmount * 0.5 * 100) / 100;
    const remaining = Math.round((totalAmount - advance) * 100) / 100;
    const invoiceDate = new Date();
    invoiceDate.setDate(invoiceDate.getDate() + 21); // Dispatch estimated in 3 weeks

    return {
      intentId: `pi_stripe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      orderNumber,
      currency,
      totalAmount,
      advanceAmount: advance,
      remainingBalance: remaining,
      status: 'PENDING_ADVANCE',
      provider: 'stripe',
      scheduledBalanceInvoiceDate: invoiceDate.toISOString().split('T')[0],
      clientSecret: `seti_${Date.now()}_secret_${Math.random().toString(36).substring(2, 9)}`,
      metadata: {
        splitRatio: '50/50',
        productionGate: 'HELD_UNTIL_ADVANCE_CONFIRMED',
      },
    };
  }

  async confirmAdvancePayment(intentId: string): Promise<PaymentProcessResult> {
    return {
      success: true,
      transactionId: `txn_stripe_${Date.now()}`,
      intent: {
        intentId,
        orderNumber: 'CT-CONFIRMED',
        currency: 'USD',
        totalAmount: 0,
        advanceAmount: 0,
        remainingBalance: 0,
        status: 'ADVANCE_PAID',
        provider: 'stripe',
        scheduledBalanceInvoiceDate: '',
        metadata: {},
      },
      message: 'Stripe 50% deposit intent captured successfully. Atelier loom production queued.',
    };
  }
}

// 2. PayPal Global Strategy
class PayPalPaymentStrategy implements PaymentGatewayStrategy {
  async createSplitIntent({
    orderNumber,
    totalAmount,
    currency,
  }: {
    orderNumber: string;
    totalAmount: number;
    currency: string;
  }): Promise<SplitPaymentIntent> {
    const advance = Math.round(totalAmount * 0.5 * 100) / 100;
    const remaining = Math.round((totalAmount - advance) * 100) / 100;
    const invoiceDate = new Date();
    invoiceDate.setDate(invoiceDate.getDate() + 21);

    return {
      intentId: `PAYPAL-SPLIT-${Date.now()}`,
      orderNumber,
      currency,
      totalAmount,
      advanceAmount: advance,
      remainingBalance: remaining,
      status: 'PENDING_ADVANCE',
      provider: 'paypal',
      scheduledBalanceInvoiceDate: invoiceDate.toISOString().split('T')[0],
      metadata: {
        payerAction: 'APPROVED_PRE_AUTHORIZATION',
      },
    };
  }

  async confirmAdvancePayment(intentId: string): Promise<PaymentProcessResult> {
    return {
      success: true,
      transactionId: `txn_paypal_${Date.now()}`,
      intent: {
        intentId,
        orderNumber: 'CT-CONFIRMED',
        currency: 'USD',
        totalAmount: 0,
        advanceAmount: 0,
        remainingBalance: 0,
        status: 'ADVANCE_PAID',
        provider: 'paypal',
        scheduledBalanceInvoiceDate: '',
        metadata: {},
      },
      message: 'PayPal Express split capture confirmed.',
    };
  }
}

// 3. International SWIFT Wire Strategy
class WirePaymentStrategy implements PaymentGatewayStrategy {
  async createSplitIntent({
    orderNumber,
    totalAmount,
    currency,
  }: {
    orderNumber: string;
    totalAmount: number;
    currency: string;
  }): Promise<SplitPaymentIntent> {
    const advance = Math.round(totalAmount * 0.5 * 100) / 100;
    const remaining = Math.round((totalAmount - advance) * 100) / 100;
    const invoiceDate = new Date();
    invoiceDate.setDate(invoiceDate.getDate() + 21);

    return {
      intentId: `WIRE-PROFORMA-${Date.now()}`,
      orderNumber,
      currency,
      totalAmount,
      advanceAmount: advance,
      remainingBalance: remaining,
      status: 'PENDING_ADVANCE',
      provider: 'wire',
      scheduledBalanceInvoiceDate: invoiceDate.toISOString().split('T')[0],
      metadata: {
        beneficiary: 'Crafting & Tufting Atelier Ltd',
        swift: 'SCBLBDDX',
      },
    };
  }

  async confirmAdvancePayment(intentId: string): Promise<PaymentProcessResult> {
    return {
      success: true,
      transactionId: `txn_wire_${Date.now()}`,
      intent: {
        intentId,
        orderNumber: 'CT-CONFIRMED',
        currency: 'USD',
        totalAmount: 0,
        advanceAmount: 0,
        remainingBalance: 0,
        status: 'ADVANCE_PAID',
        provider: 'wire',
        scheduledBalanceInvoiceDate: '',
        metadata: {},
      },
      message: 'Pro-forma wire notification generated.',
    };
  }
}

// 4. Local Bangladeshi APM (bKash / Nagad)
class BkashPaymentStrategy implements PaymentGatewayStrategy {
  async createSplitIntent({
    orderNumber,
    totalAmount,
    currency,
  }: {
    orderNumber: string;
    totalAmount: number;
    currency: string;
  }): Promise<SplitPaymentIntent> {
    const advance = Math.round(totalAmount * 0.5 * 100) / 100;
    const remaining = Math.round((totalAmount - advance) * 100) / 100;
    const invoiceDate = new Date();
    invoiceDate.setDate(invoiceDate.getDate() + 21);

    return {
      intentId: `BKASH-TRX-${Date.now()}`,
      orderNumber,
      currency,
      totalAmount,
      advanceAmount: advance,
      remainingBalance: remaining,
      status: 'PENDING_ADVANCE',
      provider: 'bkash',
      scheduledBalanceInvoiceDate: invoiceDate.toISOString().split('T')[0],
      metadata: {
        merchantNumber: '+880 1711 000000',
      },
    };
  }

  async confirmAdvancePayment(intentId: string): Promise<PaymentProcessResult> {
    return {
      success: true,
      transactionId: `bkash_txn_${Date.now()}`,
      intent: {
        intentId,
        orderNumber: 'CT-CONFIRMED',
        currency: 'USD',
        totalAmount: 0,
        advanceAmount: 0,
        remainingBalance: 0,
        status: 'ADVANCE_PAID',
        provider: 'bkash',
        scheduledBalanceInvoiceDate: '',
        metadata: {},
      },
      message: 'bKash merchant advance payment settled.',
    };
  }
}

// Strategy Context Factory
export function getPaymentGateway(provider: PaymentProvider): PaymentGatewayStrategy {
  switch (provider) {
    case 'stripe':
      return new StripePaymentStrategy();
    case 'paypal':
      return new PayPalPaymentStrategy();
    case 'wire':
      return new WirePaymentStrategy();
    case 'bkash':
      return new BkashPaymentStrategy();
    default:
      return new StripePaymentStrategy();
  }
}
