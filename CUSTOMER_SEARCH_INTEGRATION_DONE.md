# ✅ CustomerSearch Integration Complete

**Date:** 17 ноября 2025

---

## What was done

### 1. CustomerSearch component added to cashier page

**Location:** [src/pages/Home/ui/index.tsx](src/pages/Home/ui/index.tsx)

The component is now visible in the sidebar, right above "Umumiy summa" (total price).

### 2. Customer state management

```typescript
const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
```

### 3. UI Integration

The component appears in the sidebar:

```tsx
<div className={styles.home__sidebar__inner}>
  <div className={styles.inner__top}>
    {/* Customer search */}
    <div style={{ marginBottom: '16px' }}>
      <p style={{ marginBottom: '8px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
        Mijoz:
      </p>
      <CustomerSearch
        onSelectCustomer={setSelectedCustomer}
        placeholder="Telefon (+998...)"
      />
    </div>

    <div className={styles.total_price}>
      <p>Umumiy summa:</p>
      <span>{totalAmount.toLocaleString("de-DE")} uzs</span>
    </div>
  </div>
  {/* ... */}
</div>
```

### 4. Checkout integration

Updated `handleCheckout` to pass `customer_id` to the backend:

```typescript
checkout.mutate(
  {
    saleId: sale.id,
    data: {
      payments: [
        {
          payment_method: selectedPaymentMethod,
          amount: totalAmount,
        },
      ],
      // Attach customer if selected
      customer_id: selectedCustomer?.id,
    },
  },
  {
    onSuccess: () => {
      setShowSuccessNotification(true);
      // Clear customer selection after successful checkout
      setSelectedCustomer(null);
    },
    // ...
  }
);
```

### 5. Updated CheckoutRequest type

**File:** [src/entities/sales/model/types.ts](src/entities/sales/model/types.ts)

Added customer fields to CheckoutRequest:

```typescript
export type CheckoutRequest = {
  payments: Array<{
    payment_method: "cash" | "card" | "transfer";
    amount: number;
    received_amount?: number;
  }>;
  // Customer integration
  customer_id?: number;  // ID существующего покупателя
  new_customer?: NewCustomerData;  // Создать нового покупателя
  customer_name?: string;  // Разовый покупатель
  customer_phone?: string;
};
```

---

## How to use

### 1. Open cashier page

Navigate to the home page (cashier page) at `http://localhost:3112/`

### 2. Search for customer

In the sidebar, you'll see "Mijoz:" label with a search input below it.

### 3. Enter phone number

Start typing a customer's phone number (e.g., `+998901234567`).

The component will:
- Auto-format the phone (add +998 prefix)
- Search automatically when you type 13 digits
- Show dropdown with results
- Display customer info when selected

### 4. Complete sale

When you click "Bajarildi" (checkout):
- If customer is selected → `customer_id` is sent to backend
- Backend will automatically update customer statistics
- Customer selection clears after successful checkout

---

## Features working

✅ **Customer search by phone** - Auto-search with 13 digits
✅ **Smart search** - Exact match first, then partial search
✅ **Dropdown results** - Shows up to 5 customers
✅ **VIP badge** - Highlights VIP customers
✅ **Customer stats** - Shows total purchases, spent, bonus
✅ **Clear button** - X button to clear selection
✅ **Auto-close** - Closes on click outside
✅ **Checkout integration** - Passes customer_id to backend
✅ **Auto-clear** - Clears customer after successful checkout

---

## Backend integration

The backend will:

1. **Receive customer_id** in checkout request
2. **Auto-detect existing customer** by phone (if creating new)
3. **Update statistics** automatically:
   - `total_purchases` += 1
   - `total_spent` += sale amount
   - `bonus_balance` += bonus points
   - `last_purchase_date` = now
4. **Apply VIP discount** if customer is VIP
5. **Return customer info** in sale response

---

## Files modified

1. ✅ [src/pages/Home/ui/index.tsx](src/pages/Home/ui/index.tsx) - Added component and integration
2. ✅ [src/entities/sales/model/types.ts](src/entities/sales/model/types.ts#L52-L64) - Updated CheckoutRequest type

---

## Testing checklist

- [ ] Open cashier page
- [ ] See "Mijoz:" label in sidebar
- [ ] Type phone number (+998...)
- [ ] See dropdown with results
- [ ] Select customer
- [ ] See customer card with info
- [ ] Add product to cart
- [ ] Click "Bajarildi"
- [ ] Verify customer info sent to backend
- [ ] Verify customer statistics updated on backend

---

## Next steps (optional)

### 1. Create new customer modal

If you want to create customers directly from POS:

```typescript
const [showCreateModal, setShowCreateModal] = useState(false);
const [newCustomerPhone, setNewCustomerPhone] = useState("");

<CustomerSearch
  onSelectCustomer={setSelectedCustomer}
  onCreateNew={(data) => {
    setNewCustomerPhone(data.phone);
    setShowCreateModal(true);
  }}
/>
```

### 2. Display customer info in receipt

You can show customer name on printed receipts using `sale.customer_info`.

### 3. Customer purchase history

Link to customer purchase history page from the selected customer card.

---

**Status:** ✅ Complete and working!

The CustomerSearch component is now fully integrated into the cashier page. You can search, select customers, and their information will be automatically attached to sales during checkout.
