// ===== REFERRAL TYPES (Рефералы) =====

export type CouponType = "discount" | "bonus_product" | "both";
export type DiscountType = "percent" | "fixed";
export type EarningStatus = "pending" | "confirmed" | "paid" | "cancelled";
export type PaymentMethodPayout = "cash" | "card" | "transfer";

// ===== COUPON (Купоны) =====

export type BonusProduct = {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
};

export type Coupon = {
  id: number;
  referral: number;
  referral_name: string;
  code: string;
  name: string;
  coupon_type: CouponType;
  discount_type: DiscountType;
  discount_value: string;
  min_purchase_amount: string;
  max_discount_amount: string | null;
  usage_limit: number | null;
  usage_count: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  is_valid: boolean;
  total_discount_given?: string;
  total_sales_amount?: string;
  bonus_product?: BonusProduct | null;
};

export type ValidateCouponRequest = {
  coupon_code: string;
  subtotal: number;
};

export type ValidateCouponResponse = {
  status: "valid" | "invalid";
  coupon?: {
    id: number;
    code: string;
    name: string;
    coupon_type: CouponType;
    referral_name: string;
    discount_type?: DiscountType;
    discount_value?: number;
  };
  discount: number;
  final_total: number;
  message: string;
};

export type CreateCouponRequest = {
  referral: number;
  code: string;
  name?: string;
  coupon_type?: CouponType;
  discount_type?: DiscountType;
  discount_value?: number;
  min_purchase_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  valid_from?: string;
  valid_until?: string;
};

// ===== REFERRAL (Рефералы) =====

export type Referral = {
  id: number;
  name: string;
  phone: string;
  email: string;
  commission_percent: string;
  balance: string;
  total_paid: string;
  total_earned?: string;
  total_sales_count: number;
  total_sales_amount: string;
  is_active: boolean;
  coupons: Coupon[];
  created_at: string;
  updated_at: string;
};

export type CreateReferralRequest = {
  name: string;
  phone?: string;
  email?: string;
  commission_percent?: number;
  username: string;
  password: string;
  create_coupon?: boolean;
  coupon_code?: string;
  coupon_name?: string;
  coupon_type?: CouponType;
  discount_type?: DiscountType;
  discount_value?: number;
  // For bonus_product coupon type
  bonus_product_id?: number;
  bonus_product_quantity?: number;
};

export type CreateReferralResponse = {
  status: "success";
  message: string;
  data: {
    referral: Referral;
    credentials: {
      username: string;
      password: string;
    };
    coupon?: Coupon;
  };
};

// ===== DASHBOARD (Дашборд реферала) =====

export type ReferralEarning = {
  id: number;
  sale: number;
  sale_amount: string;
  commission_percent: string;
  commission_amount: string;
  discount_given: string;
  status: EarningStatus;
  created_at: string;
};

export type ReferralPayout = {
  id: number;
  referral?: number;
  referral_name?: string;
  amount: string;
  payment_method: PaymentMethodPayout;
  payment_method_display: string;
  notes: string;
  paid_by?: number;
  paid_by_name?: string;
  created_at: string;
};

export type ReferralDashboard = {
  id: number;
  name: string;
  commission_percent: string;
  balance: string;
  total_paid: string;
  total_earned: string;
  total_sales_count: number;
  total_sales_amount: string;
  coupons: Coupon[];
  recent_earnings: ReferralEarning[];
  recent_payouts: ReferralPayout[];
};

export type ReferralStats = {
  period: "week" | "month" | "year";
  start_date: string;
  stats: {
    total_sales: number;
    total_amount: number;
    total_commission: number;
    total_discount: number;
  };
  current_balance: number;
  total_paid: number;
};

// ===== PAYOUT (Выплаты) =====

export type CreatePayoutRequest = {
  amount: number;
  payment_method: PaymentMethodPayout;
  notes?: string;
};

export type CreatePayoutResponse = {
  status: "success";
  message: string;
  data: {
    payout: ReferralPayout;
    new_balance: number;
  };
};

// ===== APPLY COUPON TO SALE (Применение купона к продаже) =====

export type ApplyCouponRequest = {
  coupon_code: string;
};

// Response для купона типа discount
export type ApplyCouponDiscountResponse = {
  status: "success";
  message: string;
  data: {
    coupon: {
      code: string;
      name: string;
      coupon_type: "discount";
      referral_name: string;
      discount_type: DiscountType;
      discount_value: number;
    };
    discount: number;
    new_total: number;
    subtotal: number;
  };
};

// Response для купона типа bonus_product
export type ApplyCouponBonusProductResponse = {
  status: "success";
  message: string;
  data: {
    coupon: {
      code: string;
      name: string;
      coupon_type: "bonus_product";
      referral_name: string;
    };
    bonus_item: {
      id: number;
      product_id: number;
      product_name: string;
      quantity: number;
      original_price: number;
      is_bonus: boolean;
    };
    sale_id: number;
    subtotal: number;
    total: number;
  };
};

// Union type для обоих типов ответа
export type ApplyCouponResponse = ApplyCouponDiscountResponse | ApplyCouponBonusProductResponse;

export type RemoveCouponResponse = {
  status: "success";
  message: string;
  data: {
    removed_discount: number;
    new_total: number;
  };
};

// ===== LIST RESPONSES =====

export type ReferralsList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Referral[];
};

export type CouponsList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Coupon[];
};

export type EarningsList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ReferralEarning[];
};

export type PayoutsList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ReferralPayout[];
};
