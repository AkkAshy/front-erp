import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { useQueryClient } from "@tanstack/react-query";

import { CloseIcon, DeleteIcon, MoreIcon } from "@/shared/ui/icons";
import Table from "@/shared/ui/Table";
import PageTitle from "@/shared/ui/PageTitle";
import TablePagination from "@/shared/ui/Pagination";
import Notification from "@/shared/ui/Notification";
import CreateModal from "@/shared/ui/CreateModal";
import ShiftStatus from "@/shared/ui/ShiftStatus";
import { CustomerSearch } from "@/shared/ui/CustomerSearch";
import { CreateCustomerModal } from "@/shared/ui/CreateCustomerModal";
import CashierSelector from "@/shared/ui/CashierSelector";
import StoreSelector from "@/shared/ui/StoreSelector";

import { useBarcodeScanner } from "@/shared/lib/hooks/useBarcodeScanner";
import { useCurrentShift } from "@/entities/sales/model/useCurrentShift";
import {
  useScanItem,
  useCurrentSale,
  useRemoveItemFromSale,
  useCheckout,
} from "@/entities/sales/model/useSimplifiedPOS";
import { usePagination } from "@/shared/lib/hooks/usePagination";
import { useScanBarcode } from "@/entities/product/model/useScanBarcode";
import {
  useApplyCouponToSale,
  useRemoveCouponFromSale,
  useUpdateSaleItem,
} from "@/entities/referral";
import type { Customer } from "@/entities/customer/api/types";
import type { Cashier } from "@/entities/cashier/api/types";

import { notifications } from "@/shared/config/notifications";
import { parseApiError } from "@/shared/lib/utils/formatters";
import styles from "./Home.module.scss";

const headCols = ["#", "Kategoriya", "Tovar nomi", "Artikul (SKU)", "O'lchov birligi", "Soni", "Narx", ""];

const Home = () => {
  const [barcodeInput, setBarcodeInput] = useState<string>("");  // Для input поля
  const [scannedCode, setScannedCode] = useState<string>("");     // Для API запроса
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"cash" | "card" | "transfer">("cash");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Reset notification states after showing (so they can be triggered again)
  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => setShowSuccessNotification(false), 100);
      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);

  useEffect(() => {
    if (showErrorNotification) {
      const timer = setTimeout(() => setShowErrorNotification(false), 100);
      return () => clearTimeout(timer);
    }
  }, [showErrorNotification]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null);
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [newCustomerPhone, setNewCustomerPhone] = useState("+998");

  // Coupon state
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    referral_name: string;
    coupon_type: "discount" | "bonus_product";
    discount?: string;
    bonus_product_name?: string;
  } | null>(null);

  // Edit price modal state
  const [editingItem, setEditingItem] = useState<{
    id: number;
    product_name: string;
    unit_price: string;
    quantity: string;
  } | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editQuantity, setEditQuantity] = useState<string>("");

  const { page, setPage, limit, offset } = usePagination(1, 7);

  // Query client for invalidation
  const queryClient = useQueryClient();

  // Get current shift
  const currentShift = useCurrentShift();
  const sessionId = currentShift.data?.id || null;

  // Debug: Log session info
  useEffect(() => {
    console.log('🔍 Current shift data:', currentShift.data);
    console.log('🔍 Session ID:', sessionId);
    console.log('🔍 Shift status:', currentShift.data?.status);
  }, [currentShift.data, sessionId]);

  // Simplified POS hooks
  const scanItem = useScanItem();
  const currentSale = useCurrentSale(sessionId);
  const removeItem = useRemoveItemFromSale();
  const checkout = useCheckout();

  // Coupon hooks
  const applyCoupon = useApplyCouponToSale();
  const removeCoupon = useRemoveCouponFromSale();

  // Update item hook
  const updateItem = useUpdateSaleItem();

  // Scan barcode to find product
  console.log('🔄 Component render - scannedCode:', scannedCode);
  const scanBarcode = useScanBarcode(scannedCode, !!scannedCode);

  // Get current sale data
  // currentSale.data is CurrentSaleResponse which has { status, data: Sale | null }
  const sale = currentSale.data?.data;  // Extract Sale from CurrentSaleResponse
  const items = Array.isArray(sale?.items) ? sale.items : [];
  const totalAmount = parseFloat(sale?.total_amount || "0") || 0;
  const totalProductCount = items.reduce((acc: number, item: { quantity: string }) => acc + (parseFloat(item.quantity) || 0), 0);

  // Debug: Log current sale data
  useEffect(() => {
    console.log('📊 Current sale data:', {
      hasData: !!currentSale.data,
      rawResponse: currentSale.data,
      sale: sale,
      itemsType: typeof sale?.items,
      itemsIsArray: Array.isArray(sale?.items),
      itemsCount: items.length,
      totalAmount
    });
  }, [currentSale.data, sale, items.length, totalAmount]);

  // Handle barcode scan - двухшаговый процесс
  const handleScan = useCallback(
    (code: string) => {
      console.log('🔍 Barcode scanned:', code);

      if (!sessionId) {
        console.log('❌ No session - shift not open');
        setErrorMessage("Iltimos, avval smenani oching!");
        setShowErrorNotification(true);
        return;
      }

      console.log('✅ Session exists, setting scanned code:', code);
      setScannedCode(code);
    },
    [sessionId]
  );

  // Когда товар найден по barcode, добавляем его в продажу
  useEffect(() => {
    // Новый warehouse scan API возвращает status: "found" | "not_found"
    const scanResult = scanBarcode.data;
    const product = scanResult?.status === "found" ? scanResult.data : null;

    console.log('🔎 Barcode scan effect triggered:', {
      hasProduct: !!product,
      scanStatus: scanResult?.status,
      scanType: scanResult?.type,
      product: product,
      sessionId,
      scannedCode,
      isError: scanBarcode.isError,
      isLoading: scanBarcode.isLoading
    });

    if (product && sessionId && scannedCode && scanResult?.status === "found") {
      // Получаем имя в зависимости от типа (variant или product)
      const productName = scanResult.type === "variant"
        ? (product as any).display_name
        : (product as any).name;

      console.log('🛒 Product found, adding to sale:', {
        sessionId,
        productId: product.id,
        productName,
        barcode: scannedCode
      });

      // Проверяем что кассир выбран
      if (!selectedCashier?.id) {
        console.log('❌ No cashier selected');
        setErrorMessage("Iltimos, kassirni tanlang!");
        setShowErrorNotification(true);
        setScannedCode("");
        setBarcodeInput("");
        return;
      }

      // Очищаем код СРАЗУ чтобы не было повторных вызовов
      setScannedCode("");
      setBarcodeInput("");

      // Используем scan_item endpoint который автоматически создает/обновляет продажу
      const scanData = {
        session: sessionId,
        product: product.id,
        quantity: 1,
        batch: null,
        cashier: selectedCashier.id,  // Передаем ID выбранного кассира (теперь 100% не undefined)
      };
      console.log('📦 Scanning item with cashier:', scanData);

      scanItem.mutate(
        scanData,
        {
          onSuccess: (data) => {
            console.log('✅ Scan item SUCCESS:', data);
          },
          onError: (error: any) => {
            console.error('❌ Scan item ERROR:', error);
            console.error('❌ Error response:', error?.response?.data);
            setErrorMessage(parseApiError(error));
            setShowErrorNotification(true);
          },
        }
      );
    } else if (scanBarcode.isError && scannedCode) {
      console.log('❌ Product not found for barcode:', scannedCode);
      setErrorMessage("Mahsulot topilmadi");
      setShowErrorNotification(true);
      setScannedCode("");
      setBarcodeInput("");
    }
  }, [scanBarcode.data, scanBarcode.isError, sessionId, scanItem, scannedCode]);

  useBarcodeScanner({ onScan: handleScan, enabled: true });

  // Handle create new customer
  const handleCreateNewCustomer = (data: { first_name: string; phone: string }) => {
    setNewCustomerPhone(data.phone);
    setShowCreateCustomerModal(true);
  };

  // Handle customer created successfully
  const handleCustomerCreated = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCreateCustomerModal(false);
  };

  // Handle delete product - используем item.id
  const handleDeleteProduct = useCallback(
    (itemId: number) => {
      if (!sale?.id) return;

      removeItem.mutate(
        { saleId: sale.id, itemId },  // Передаем itemId
        {
          onError: (error: any) => {
            setErrorMessage(parseApiError(error));
            setShowErrorNotification(true);
          },
        }
      );
    },
    [sale?.id, removeItem]
  );

  // Handle clear all products
  const handleClearAll = () => {
    if (!sale?.id || items.length === 0) return;

    // Remove all items one by one using item.id
    items.forEach((item: { id: number }) => {
      removeItem.mutate({
        saleId: sale.id,
        itemId: item.id,  // ID позиции в продаже
      });
    });

    // Also clear coupon
    setAppliedCoupon(null);
    setCouponCode("");
  };

  // Handle apply coupon
  const handleApplyCoupon = useCallback(() => {
    if (!sale?.id || !couponCode.trim()) {
      setErrorMessage("Kupon kodini kiriting!");
      setShowErrorNotification(true);
      return;
    }

    applyCoupon.mutate(
      { saleId: sale.id, couponCode: couponCode.trim() },
      {
        onSuccess: (data: any) => {
          const couponType = data.data.coupon.coupon_type || "discount";

          if (couponType === "bonus_product") {
            // Купон с бонусным товаром
            setAppliedCoupon({
              code: data.data.coupon.code,
              referral_name: data.data.coupon.referral_name,
              coupon_type: "bonus_product",
              bonus_product_name: data.data.bonus_item?.product_name,
            });
          } else {
            // Обычный купон со скидкой
            setAppliedCoupon({
              code: data.data.coupon.code,
              referral_name: data.data.coupon.referral_name,
              coupon_type: "discount",
              discount: String(data.data.discount || 0),
            });
          }
          setCouponCode("");
        },
        onError: (error: any) => {
          setErrorMessage(parseApiError(error));
          setShowErrorNotification(true);
        },
      }
    );
  }, [sale?.id, couponCode, applyCoupon]);

  // Handle remove coupon
  const handleRemoveCoupon = useCallback(() => {
    if (!sale?.id) return;

    removeCoupon.mutate(sale.id, {
      onSuccess: () => {
        setAppliedCoupon(null);
      },
      onError: (error: any) => {
        setErrorMessage(parseApiError(error));
        setShowErrorNotification(true);
      },
    });
  }, [sale?.id, removeCoupon]);

  // Handle edit item (open modal)
  const handleEditItem = useCallback((item: {
    id: number;
    product_name: string;
    unit_price: string;
    quantity: string;
  }) => {
    setEditingItem(item);
    setEditPrice(item.unit_price);
    setEditQuantity(item.quantity);
  }, []);

  // Handle save edited item
  const handleSaveEditedItem = useCallback(() => {
    if (!sale?.id || !editingItem) return;

    const newPrice = parseFloat(editPrice);
    const newQuantity = parseFloat(editQuantity);

    if (isNaN(newPrice) || newPrice < 0) {
      setErrorMessage("Narx noto'g'ri kiritildi");
      setShowErrorNotification(true);
      return;
    }

    if (isNaN(newQuantity) || newQuantity <= 0) {
      setErrorMessage("Miqdor noto'g'ri kiritildi");
      setShowErrorNotification(true);
      return;
    }

    updateItem.mutate(
      {
        saleId: sale.id,
        itemId: editingItem.id,
        unit_price: newPrice,
        quantity: newQuantity,
      },
      {
        onSuccess: () => {
          setEditingItem(null);
        },
        onError: (error: any) => {
          setErrorMessage(parseApiError(error));
          setShowErrorNotification(true);
        },
      }
    );
  }, [sale?.id, editingItem, editPrice, editQuantity, updateItem]);

  // Handle checkout - используем payment_method
  const handleCheckout = () => {
    if (!sale?.id) {
      setIsAlertOpen(true);
      return;
    }

    if (items.length === 0) {
      setIsAlertOpen(true);
      return;
    }

    // Проверяем что кассир выбран
    if (!selectedCashier?.id) {
      setErrorMessage("Iltimos, kassirni tanlang!");
      setShowErrorNotification(true);
      return;
    }

    // Формируем payment объект
    // ВАЖНО: Согласно API документации, amount и received_amount должны быть строками
    const payment: {
      payment_method: "cash" | "card" | "transfer";
      amount: string;
      received_amount?: string;
    } = {
      payment_method: selectedPaymentMethod,
      amount: totalAmount.toFixed(2),  // Конвертируем в строку с 2 знаками
    };

    // Для наличных добавляем received_amount (точная сумма)
    if (selectedPaymentMethod === "cash") {
      payment.received_amount = totalAmount.toFixed(2);  // Точная сумма, без сдачи
    }

    const checkoutData = {
      payments: [payment],
      // Attach customer if selected
      customer_id: selectedCustomer?.id,
      // Attach cashier - ОБЯЗАТЕЛЬНО (уже проверили выше)
      cashier_id: selectedCashier.id,  // Не используем ?. так как проверили выше
    };

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🛒 CHECKOUT REQUEST');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💰 Payment method:', selectedPaymentMethod);
    console.log('💵 Total amount:', totalAmount);
    console.log('💵 Received amount:', payment.received_amount);
    console.log('👤 Cashier ID:', selectedCashier.id);
    console.log('👤 Cashier name:', selectedCashier.full_name);
    console.log('📋 Sale ID:', sale.id);
    console.log('📦 Checkout data:', JSON.stringify(checkoutData, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    checkout.mutate(
      {
        saleId: sale.id,
        data: checkoutData,
      },
      {
        onSuccess: () => {
          setShowSuccessNotification(true);
          // Clear customer selection after successful checkout
          setSelectedCustomer(null);
          // Сбрасываем кассира после каждой продажи
          setSelectedCashier(null);
          // Clear coupon after successful checkout
          setAppliedCoupon(null);
          setCouponCode("");
          // Refetch current shift to update session data (sales count, total, etc.)
          queryClient.invalidateQueries({ queryKey: ["currentShift"] });
        },
        onError: (error: any) => {
          setErrorMessage(parseApiError(error));
          setShowErrorNotification(true);
        },
      }
    );
  };

  return (
    <div className={styles.home}>
      <div className={styles.home__content}>
        <header className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <PageTitle>Kassa</PageTitle>
            <StoreSelector />
          </div>
          <div className={styles.header__btns}>
            {/* Barcode scanner input */}
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => {
                const code = e.target.value;
                console.log('📝 Barcode input changed:', code, 'length:', code.length);
                setBarcodeInput(code);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && barcodeInput) {
                  console.log('⏎ Enter pressed, scanning barcode:', barcodeInput);
                  e.preventDefault();
                  handleScan(barcodeInput);
                  setBarcodeInput("");
                }
              }}
              placeholder="Shtrix-kod skanerlang..."
              style={{
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                width: '200px',
                marginRight: '12px'
              }}
              autoFocus
            />
            <span onClick={handleClearAll}>
              <CloseIcon />
            </span>
          </div>
        </header>

        <ShiftStatus />

        <Table
          headCols={headCols}
          bodyCols={items.slice(offset, offset + limit).map((item: {
            id: number;
            product_name: string;
            product_sku?: string;
            variant_sku?: string;
            quantity: string;
            unit_price: string
          }, index: number) => ({
            id: item.id,
            index: index + 1 + offset,
            category_name: "-", // Category name not included in sale item
            name: item.product_name,
            sku: item.variant_sku || item.product_sku || "-", // Показываем variant_sku если есть, иначе product_sku, иначе "-"
            unit: "-", // Unit not included in sale item
            quantity: `${(parseFloat(item.quantity) || 0).toFixed(0)}x`,
            sale_price: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{((+item.unit_price) || 0).toLocaleString("de-DE")} uzs</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditItem(item);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#8e51ff',
                    opacity: 0.7,
                  }}
                  title="Narxni o'zgartirish"
                >
                  ✏️
                </button>
              </div>
            ),
            content_2: (
              <div onClick={() => handleDeleteProduct(item.id)}>
                <DeleteIcon />
              </div>
            ),
          }))}
          headCell={{
            1: {
              className: styles.cell__hash,
            },
            8: {
              className: styles.thead__more,
              content: <MoreIcon />,
            },
          }}
          bodyCell={{
            1: {
              className: styles.row__index,
              align: "center",
            },
            6: {
              className: styles.product__count,
            },
            7: {
              className: styles.product__price,
            },
            8: {
              className: styles.delete__btn,
              align: "center",
            },
          }}
          isLoading={currentSale.isLoading}
        />

        {items.length === 0 && (
          <div className={styles.empty}>
            <img src="/empty.svg" alt="empty" />
          </div>
        )}

        <TablePagination
          current={page}
          total={items.length || 0}
          pageSize={limit}
          onChange={(p) => setPage(p)}
          
        />

        <footer className={styles.footer}>
          <p className={styles.footer__title}>Mahsulotlar soni:</p>
          <span className={styles.product__count}>{totalProductCount.toFixed(0)}</span>
        </footer>
      </div>

      <div className={styles.home__sidebar}>
        <div className={styles.home__sidebar__inner}>
          <div className={styles.inner__top}>
            {/* Cashier selector */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ marginBottom: '8px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                Kassir:
              </p>
              <CashierSelector
                onSelect={setSelectedCashier}
                selectedCashierId={selectedCashier?.id ?? null}
              />
            </div>

            {/* Customer search */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ marginBottom: '8px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                Mijoz:
              </p>
              <CustomerSearch
                onSelectCustomer={setSelectedCustomer}
                onCreateNew={handleCreateNewCustomer}
                placeholder="Telefon (+998...)"
                selectedCustomer={selectedCustomer}
              />
            </div>

            {/* Coupon input */}
            <div style={{ marginBottom: '16px' }}>
              <p style={{ marginBottom: '8px', fontSize: '14px', color: '#64748b', fontWeight: '500' }}>
                Kupon:
              </p>
              {appliedCoupon ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: appliedCoupon.coupon_type === 'bonus_product' ? '#fef3c7' : '#f0fdf4',
                  border: `1px solid ${appliedCoupon.coupon_type === 'bonus_product' ? '#fcd34d' : '#86efac'}`,
                  borderRadius: '12px',
                }}>
                  <div>
                    <p style={{ fontWeight: '600', color: appliedCoupon.coupon_type === 'bonus_product' ? '#92400e' : '#166534', fontSize: '14px' }}>
                      {appliedCoupon.code}
                    </p>
                    <p style={{ fontSize: '12px', color: appliedCoupon.coupon_type === 'bonus_product' ? '#a16207' : '#15803d' }}>
                      {appliedCoupon.referral_name} • {appliedCoupon.coupon_type === 'bonus_product'
                        ? `Bonus: ${appliedCoupon.bonus_product_name || 'Bonus mahsulot'}`
                        : `Chegirma: ${(parseFloat(appliedCoupon.discount || '0') || 0).toLocaleString("de-DE")} uzs`
                      }
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    disabled={removeCoupon.isPending}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#dc2626',
                      fontSize: '18px',
                      padding: '4px',
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && couponCode.trim()) {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                    placeholder="Kupon kodi..."
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      backgroundColor: '#fff',
                    }}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || applyCoupon.isPending || !sale?.id}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: applyCoupon.isPending ? '#94a3b8' : '#8e51ff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: applyCoupon.isPending || !couponCode.trim() ? 'not-allowed' : 'pointer',
                      opacity: !couponCode.trim() || !sale?.id ? 0.5 : 1,
                    }}
                  >
                    {applyCoupon.isPending ? '...' : 'Qo\'llash'}
                  </button>
                </div>
              )}
            </div>

            <div className={styles.total_price}>
              {appliedCoupon && appliedCoupon.coupon_type === 'discount' && appliedCoupon.discount && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ color: '#22c55e', fontSize: '14px' }}>Chegirma:</p>
                  <span style={{ color: '#22c55e', fontSize: '16px', fontWeight: '500' }}>
                    -{(parseFloat(appliedCoupon.discount) || 0).toLocaleString("de-DE")} uzs
                  </span>
                </div>
              )}
              {appliedCoupon && appliedCoupon.coupon_type === 'bonus_product' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ color: '#f59e0b', fontSize: '14px' }}>Bonus:</p>
                  <span style={{ color: '#f59e0b', fontSize: '14px', fontWeight: '500' }}>
                    {appliedCoupon.bonus_product_name || 'Bonus mahsulot'}
                  </span>
                </div>
              )}
              <p>Umumiy summa:</p>
              <span>{totalAmount.toLocaleString("de-DE")} uzs</span>
            </div>
          </div>

          <div className={styles.ticket}>
            <span className={styles.corner_cut}>
              <svg width="100%" height="2">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>
            </span>
          </div>

          <ul className={styles.inner__bottom}>
            <li
              className={clsx(styles.item, selectedPaymentMethod === "cash" && styles.checked)}
              onClick={() => setSelectedPaymentMethod("cash")}
            >
              <p>Naqd</p>
            </li>
            <li
              className={clsx(styles.item, selectedPaymentMethod === "card" && styles.checked)}
              onClick={() => setSelectedPaymentMethod("card")}
            >
              <p>Karta</p>
            </li>
            <li
              className={clsx(styles.item, selectedPaymentMethod === "transfer" && styles.checked)}
              onClick={() => setSelectedPaymentMethod("transfer")}
            >
              <p>O'tkazma</p>
            </li>
          </ul>
        </div>
        <span onClick={handleCheckout} className={styles.home__sidebar__btn}>
          {checkout.isPending ? "Yuklanmoqda..." : "Bajarildi"}
        </span>
      </div>

      <CreateModal
        headTitle="Diqqat!"
        onClose={() => setIsAlertOpen(false)}
        isOpen={isAlertOpen}
        width={768}
        height={274}
        btnTitle="Xo'p"
        btnOnClick={() => setIsAlertOpen(false)}
      >
        <p className={styles.alert__title}>
          Avval kassaga mahsulot qo'shing, shundan so'ng bu amalni bajarishingiz mumkin.
        </p>
      </CreateModal>

      <Notification
        placement="top"
        type="success"
        message="Muvaffaqiyat"
        description={notifications.sale.createSuccess}
        onOpen={showSuccessNotification}
      />

      <Notification
        placement="top"
        type="error"
        message="Xatolik"
        description={errorMessage || notifications.sale.createError}
        onOpen={showErrorNotification}
      />

      <Notification
        placement="top"
        type="success"
        message="Muvaffaqiyat"
        description="Mahsulot qo'shildi"
        onOpen={scanItem.isSuccess}
      />

      {/* Create customer modal */}
      <CreateCustomerModal
        isOpen={showCreateCustomerModal}
        onClose={() => setShowCreateCustomerModal(false)}
        onSuccess={handleCustomerCreated}
        initialPhone={newCustomerPhone}
      />

      {/* Edit item modal */}
      <CreateModal
        headTitle="Narx va miqdorni o'zgartirish"
        onClose={() => setEditingItem(null)}
        isOpen={!!editingItem}
        width={480}
        height={380}
        btnTitle={updateItem.isPending ? "Saqlanmoqda..." : "Saqlash"}
        btnOnClick={handleSaveEditedItem}
      >
        <div style={{ padding: '16px 0' }}>
          <p style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '500', color: '#0f1c3d' }}>
            {editingItem?.product_name}
          </p>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>
              Narx (uzs):
            </label>
            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
              }}
              min="0"
              step="100"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#64748b' }}>
              Miqdor:
            </label>
            <input
              type="number"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
              }}
              min="1"
              step="1"
            />
          </div>

          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Jami:</span>
            <span style={{ color: '#0f1c3d', fontSize: '18px', fontWeight: '600' }}>
              {((parseFloat(editPrice) || 0) * (parseFloat(editQuantity) || 0)).toLocaleString("de-DE")} uzs
            </span>
          </div>
        </div>
      </CreateModal>
    </div>
  );
};

export default Home;
