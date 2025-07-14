export interface PaymentMethod {
  id: string;
  type: "card" | "upi" | "wallet" | "netbanking" | "emi";
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  processingFee?: number;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  bookingId: string;
  paymentMethod: PaymentMethod;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentId?: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  message?: string;
  error?: string;
  redirectUrl?: string;
}

export interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  holderName: string;
  isDefault: boolean;
}

export interface WalletBalance {
  walletId: string;
  balance: number;
  currency: string;
}

class PaymentService {
  private paymentMethods: PaymentMethod[] = [
    // Credit/Debit Cards
    {
      id: "card",
      type: "card",
      name: "Credit/Debit Card",
      icon: "💳",
      description: "Visa, Mastercard, Rupay, Amex",
      enabled: true,
      processingFee: 0,
    },
    // UPI Options
    {
      id: "upi",
      type: "upi",
      name: "UPI",
      icon: "📱",
      description: "Pay using any UPI app",
      enabled: true,
      processingFee: 0,
    },
    {
      id: "gpay",
      type: "upi",
      name: "Google Pay",
      icon: "🟢",
      description: "Quick payment with Google Pay",
      enabled: true,
      processingFee: 0,
    },
    {
      id: "phonepe",
      type: "upi",
      name: "PhonePe",
      icon: "🟣",
      description: "Pay with PhonePe",
      enabled: true,
      processingFee: 0,
    },
    {
      id: "paytm",
      type: "wallet",
      name: "Paytm",
      icon: "🔵",
      description: "Pay with Paytm wallet",
      enabled: true,
      processingFee: 0,
    },
    // Wallets
    {
      id: "amazonpay",
      type: "wallet",
      name: "Amazon Pay",
      icon: "🟡",
      description: "Use Amazon Pay balance",
      enabled: true,
      processingFee: 0,
    },
    {
      id: "mobikwik",
      type: "wallet",
      name: "Mobikwik",
      icon: "🔴",
      description: "Pay with Mobikwik wallet",
      enabled: true,
      processingFee: 0,
    },
    // Net Banking
    {
      id: "netbanking",
      type: "netbanking",
      name: "Net Banking",
      icon: "🏦",
      description: "All major banks supported",
      enabled: true,
      processingFee: 0,
    },
    // EMI
    {
      id: "emi",
      type: "emi",
      name: "EMI",
      icon: "📊",
      description: "Convert to easy EMI",
      enabled: true,
      processingFee: 99,
      minAmount: 3000,
    },
  ];

  getPaymentMethods(amount: number): PaymentMethod[] {
    return this.paymentMethods.filter((method) => {
      if (!method.enabled) return false;
      if (method.minAmount && amount < method.minAmount) return false;
      if (method.maxAmount && amount > method.maxAmount) return false;
      return true;
    });
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate payment processing
    await this.delay(2000);

    // Mock different payment flows based on method
    switch (request.paymentMethod.type) {
      case "card":
        return this.processCardPayment(request);
      case "upi":
        return this.processUPIPayment(request);
      case "wallet":
        return this.processWalletPayment(request);
      case "netbanking":
        return this.processNetBankingPayment(request);
      case "emi":
        return this.processEMIPayment(request);
      default:
        return {
          success: false,
          status: "failed",
          error: "Unsupported payment method",
        };
    }
  }

  private async processCardPayment(
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    // Simulate card payment processing
    const success = Math.random() > 0.1; // 90% success rate

    if (success) {
      return {
        success: true,
        transactionId: `TXN_${Date.now()}`,
        paymentId: `PAY_${Date.now()}`,
        status: "completed",
        message: "Payment completed successfully",
      };
    } else {
      return {
        success: false,
        status: "failed",
        error: "Card payment failed. Please try again.",
      };
    }
  }

  private async processUPIPayment(
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    // For UPI, we typically redirect to the UPI app
    const success = Math.random() > 0.05; // 95% success rate

    if (success) {
      return {
        success: true,
        transactionId: `UPI_${Date.now()}`,
        paymentId: `PAY_${Date.now()}`,
        status: "completed",
        message: "UPI payment completed successfully",
      };
    } else {
      return {
        success: false,
        status: "failed",
        error: "UPI payment failed or cancelled",
      };
    }
  }

  private async processWalletPayment(
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    // Check wallet balance (mock)
    const hasBalance = Math.random() > 0.2; // 80% have sufficient balance

    if (hasBalance) {
      return {
        success: true,
        transactionId: `WAL_${Date.now()}`,
        paymentId: `PAY_${Date.now()}`,
        status: "completed",
        message: "Wallet payment completed successfully",
      };
    } else {
      return {
        success: false,
        status: "failed",
        error: "Insufficient wallet balance",
      };
    }
  }

  private async processNetBankingPayment(
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    // Net banking usually involves redirect to bank portal
    return {
      success: true,
      transactionId: `NET_${Date.now()}`,
      status: "pending",
      redirectUrl: `https://bank.example.com/payment?ref=${request.orderId}`,
      message: "Redirecting to your bank...",
    };
  }

  private async processEMIPayment(
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    const success = Math.random() > 0.15; // 85% success rate

    if (success) {
      return {
        success: true,
        transactionId: `EMI_${Date.now()}`,
        paymentId: `PAY_${Date.now()}`,
        status: "completed",
        message: "EMI payment set up successfully",
      };
    } else {
      return {
        success: false,
        status: "failed",
        error: "EMI approval failed",
      };
    }
  }

  async getSavedCards(): Promise<SavedCard[]> {
    // Mock saved cards
    return [
      {
        id: "card_1",
        last4: "4242",
        brand: "Visa",
        expiryMonth: 12,
        expiryYear: 2025,
        holderName: "John Doe",
        isDefault: true,
      },
      {
        id: "card_2",
        last4: "1234",
        brand: "Mastercard",
        expiryMonth: 6,
        expiryYear: 2026,
        holderName: "John Doe",
        isDefault: false,
      },
    ];
  }

  async getWalletBalances(): Promise<WalletBalance[]> {
    // Mock wallet balances
    return [
      { walletId: "paytm", balance: 1250.5, currency: "INR" },
      { walletId: "amazonpay", balance: 850.0, currency: "INR" },
      { walletId: "mobikwik", balance: 0, currency: "INR" },
    ];
  }

  calculateProcessingFee(amount: number, paymentMethod: PaymentMethod): number {
    return paymentMethod.processingFee || 0;
  }

  getTotalAmount(amount: number, paymentMethod: PaymentMethod): number {
    return amount + this.calculateProcessingFee(amount, paymentMethod);
  }

  async verifyPayment(
    transactionId: string,
    paymentId: string,
  ): Promise<PaymentResponse> {
    // Mock payment verification
    await this.delay(1000);

    return {
      success: true,
      transactionId,
      paymentId,
      status: "completed",
      message: "Payment verified successfully",
    };
  }

  async refundPayment(
    transactionId: string,
    amount?: number,
  ): Promise<PaymentResponse> {
    // Mock refund processing
    await this.delay(2000);

    const success = Math.random() > 0.1; // 90% success rate

    if (success) {
      return {
        success: true,
        transactionId: `REF_${Date.now()}`,
        status: "completed",
        message: "Refund processed successfully",
      };
    } else {
      return {
        success: false,
        status: "failed",
        error: "Refund processing failed",
      };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Initialize payment gateway SDKs (mock implementations)
  async initializeRazorpay(): Promise<void> {
    console.log("Razorpay SDK initialized");
  }

  async initializePaytm(): Promise<void> {
    console.log("Paytm SDK initialized");
  }

  async initializeStripe(): Promise<void> {
    console.log("Stripe SDK initialized");
  }
}

export const paymentService = new PaymentService();
export default paymentService;
