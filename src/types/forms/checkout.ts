export interface CardFormData {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface CheckoutFormData {
  email: string;
  name: string;
}

export interface PlanDetails {
  id: string;
  name: string;
  price: number;
  billing_cycle: "monthly" | "yearly";
  features: string[];
  popular?: boolean;
}
