import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Smartphone,
  Wallet,
  Building2,
  Calculator,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Zap,
  Star,
  Lock,
  RefreshCw,
} from "lucide-react";
import {
  paymentService,
  PaymentMethod,
  PaymentRequest,
  PaymentResponse,
  SavedCard,
  WalletBalance,
} from "@/lib/payment";

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bookingId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onPaymentSuccess: (response: PaymentResponse) => void;
  onPaymentFailure: (error: string) => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  isOpen,
  onClose,
  amount,
  bookingId,
  customerInfo,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [currentStep, setCurrentStep] = useState<
    "methods" | "details" | "processing" | "success" | "failed"
  >("methods");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [walletBalances, setWalletBalances] = useState<WalletBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentResponse, setPaymentResponse] =
    useState<PaymentResponse | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
    saveCard: false,
  });
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [emiTenure, setEmiTenure] = useState(3);

  useEffect(() => {
    if (isOpen) {
      loadPaymentData();
    }
  }, [isOpen, amount]);

  const loadPaymentData = async () => {
    setIsLoading(true);
    try {
      const methods = paymentService.getPaymentMethods(amount);
      const cards = await paymentService.getSavedCards();
      const balances = await paymentService.getWalletBalances();

      setPaymentMethods(methods);
      setSavedCards(cards);
      setWalletBalances(balances);
    } catch (error) {
      console.error("Failed to load payment data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method.type) {
      case "card":
        return <CreditCard className="h-5 w-5" />;
      case "upi":
        return <Smartphone className="h-5 w-5" />;
      case "wallet":
        return <Wallet className="h-5 w-5" />;
      case "netbanking":
        return <Building2 className="h-5 w-5" />;
      case "emi":
        return <Calculator className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getWalletBalance = (walletId: string) => {
    return walletBalances.find((w) => w.walletId === walletId)?.balance || 0;
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    if (method.type === "upi" && method.id !== "upi") {
      // Direct wallet/UPI app payments can proceed directly
      processPayment(method);
    } else {
      setCurrentStep("details");
    }
  };

  const processPayment = async (method: PaymentMethod = selectedMethod!) => {
    setCurrentStep("processing");
    setIsLoading(true);

    try {
      const request: PaymentRequest = {
        amount: paymentService.getTotalAmount(amount, method),
        currency: "INR",
        orderId: `ORDER_${Date.now()}`,
        bookingId,
        paymentMethod: method,
        customerInfo,
        metadata: {
          cardDetails: method.type === "card" ? cardDetails : undefined,
          upiId: method.type === "upi" ? upiId : undefined,
          bankCode: method.type === "netbanking" ? selectedBank : undefined,
          emiTenure: method.type === "emi" ? emiTenure : undefined,
        },
      };

      const response = await paymentService.processPayment(request);
      setPaymentResponse(response);

      if (response.success) {
        setCurrentStep("success");
        onPaymentSuccess(response);
      } else {
        setCurrentStep("failed");
        onPaymentFailure(response.error || "Payment failed");
      }
    } catch (error) {
      setCurrentStep("failed");
      onPaymentFailure("Payment processing error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPayment = () => {
    setCurrentStep("methods");
    setSelectedMethod(null);
    setPaymentResponse(null);
    setCardDetails({
      number: "",
      expiry: "",
      cvv: "",
      name: "",
      saveCard: false,
    });
    setUpiId("");
    setSelectedBank("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStep !== "methods" && currentStep !== "success" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    currentStep === "processing"
                      ? resetPayment()
                      : setCurrentStep("methods")
                  }
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h2 className="text-lg font-semibold">
                  {currentStep === "methods"
                    ? "Choose Payment Method"
                    : currentStep === "details"
                      ? "Payment Details"
                      : currentStep === "processing"
                        ? "Processing Payment"
                        : currentStep === "success"
                          ? "Payment Successful"
                          : "Payment Failed"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-rose-600">
                    ₹{amount.toLocaleString()}
                  </span>
                  {selectedMethod && selectedMethod.processingFee > 0 && (
                    <span className="text-sm text-gray-500">
                      + ₹{selectedMethod.processingFee} fee
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          {/* Payment Methods Selection */}
          {currentStep === "methods" && (
            <div className="space-y-4">
              {/* Recommended */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Recommended
                </h3>
                <div className="grid gap-3">
                  {paymentMethods.slice(0, 3).map((method) => (
                    <Card
                      key={method.id}
                      className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
                      onClick={() => handleMethodSelect(method)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{method.icon}</div>
                            <div>
                              <h4 className="font-medium">{method.name}</h4>
                              <p className="text-sm text-gray-600">
                                {method.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {method.processingFee > 0 && (
                              <div className="text-sm text-gray-500">
                                +₹{method.processingFee}
                              </div>
                            )}
                            <Badge className="bg-green-100 text-green-700">
                              <Zap className="h-3 w-3 mr-1" />
                              Instant
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* All Methods */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  All Payment Methods
                </h3>
                <div className="grid gap-2">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => handleMethodSelect(method)}
                    >
                      <div className="flex items-center gap-3">
                        {getMethodIcon(method)}
                        <div>
                          <span className="font-medium">{method.name}</span>
                          {method.type === "wallet" && (
                            <span className="text-sm text-gray-500 ml-2">
                              ₹{getWalletBalance(method.id)} available
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.processingFee > 0 && (
                          <span className="text-sm text-gray-500">
                            +₹{method.processingFee}
                          </span>
                        )}
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Secure Payments</p>
                    <p className="text-blue-700">
                      256-bit SSL encryption • PCI DSS compliant • Your data is
                      safe
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Details */}
          {currentStep === "details" && selectedMethod && (
            <div className="space-y-6">
              {/* Method Summary */}
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{selectedMethod.icon}</div>
                    <div>
                      <h4 className="font-medium">{selectedMethod.name}</h4>
                      <p className="text-sm text-gray-600">
                        {selectedMethod.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card Details */}
              {selectedMethod.type === "card" && (
                <div className="space-y-4">
                  {/* Saved Cards */}
                  {savedCards.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Saved Cards</h4>
                      <div className="space-y-2">
                        {savedCards.map((card) => (
                          <div
                            key={card.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                            onClick={() => processPayment()}
                          >
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5" />
                              <div>
                                <div className="font-medium">
                                  **** **** **** {card.last4}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {card.brand} • {card.expiryMonth}/
                                  {card.expiryYear}
                                </div>
                              </div>
                            </div>
                            {card.isDefault && (
                              <Badge className="text-xs">Default</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Card Form */}
                  <div>
                    <h4 className="font-medium mb-3">Add New Card</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardDetails.number}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            number: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              expiry: e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              cvv: e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardDetails.name}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={cardDetails.saveCard}
                          onChange={(e) =>
                            setCardDetails({
                              ...cardDetails,
                              saveCard: e.target.checked,
                            })
                          }
                          className="rounded"
                        />
                        <span className="text-sm text-gray-600">
                          Save card for future payments
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Details */}
              {selectedMethod.type === "upi" && selectedMethod.id === "upi" && (
                <div>
                  <h4 className="font-medium mb-3">Enter UPI ID</h4>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              )}

              {/* Net Banking */}
              {selectedMethod.type === "netbanking" && (
                <div>
                  <h4 className="font-medium mb-3">Select Your Bank</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "State Bank of India",
                      "HDFC Bank",
                      "ICICI Bank",
                      "Axis Bank",
                      "Kotak Bank",
                      "Bank of Baroda",
                    ].map((bank) => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 text-left border rounded-lg ${
                          selectedBank === bank
                            ? "border-rose-500 bg-rose-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-medium text-sm">{bank}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* EMI Options */}
              {selectedMethod.type === "emi" && (
                <div>
                  <h4 className="font-medium mb-3">Choose EMI Tenure</h4>
                  <div className="grid gap-2">
                    {[3, 6, 9, 12, 18, 24].map((months) => {
                      const emi = Math.round(amount / months);
                      return (
                        <button
                          key={months}
                          onClick={() => setEmiTenure(months)}
                          className={`p-3 text-left border rounded-lg ${
                            emiTenure === months
                              ? "border-rose-500 bg-rose-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">{months} months</span>
                            <span className="font-semibold">₹{emi}/month</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Total: ₹{emi * months} (incl. interest)
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <Button
                onClick={() => processPayment()}
                className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 h-12"
                disabled={
                  (selectedMethod.type === "card" &&
                    (!cardDetails.number ||
                      !cardDetails.expiry ||
                      !cardDetails.cvv ||
                      !cardDetails.name)) ||
                  (selectedMethod.type === "upi" &&
                    selectedMethod.id === "upi" &&
                    !upiId) ||
                  (selectedMethod.type === "netbanking" && !selectedBank)
                }
              >
                <Lock className="mr-2 h-4 w-4" />
                Pay ₹
                {paymentService
                  .getTotalAmount(amount, selectedMethod)
                  .toLocaleString()}
              </Button>
            </div>
          )}

          {/* Processing */}
          {currentStep === "processing" && (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
              <p className="text-gray-600">
                Please wait while we process your payment...
              </p>
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 justify-center text-blue-700">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Secure payment in progress</span>
                </div>
              </div>
            </div>
          )}

          {/* Success */}
          {currentStep === "success" && paymentResponse && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Your booking has been confirmed
              </p>
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-mono">
                      {paymentResponse.transactionId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-semibold">
                      ₹{amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <Button onClick={onClose} className="w-full">
                Continue
              </Button>
            </div>
          )}

          {/* Failed */}
          {currentStep === "failed" && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Payment Failed</h3>
              <p className="text-gray-600 mb-6">
                {paymentResponse?.error || "Something went wrong"}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={resetPayment}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button onClick={onClose} className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
