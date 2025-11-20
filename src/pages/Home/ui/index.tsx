import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";

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
import type { Customer } from "@/entities/customer/api/types";
import type { Cashier } from "@/entities/cashier/api/types";

import { notifications } from "@/shared/config/notifications";
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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null);
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [newCustomerPhone, setNewCustomerPhone] = useState("+998");

  const { page, setPage, limit, offset } = usePagination(1, 7);

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

  // Scan barcode to find product
  console.log('🔄 Component render - scannedCode:', scannedCode);
  const scanBarcode = useScanBarcode(scannedCode, !!scannedCode);

  // Get current sale data
  // ИСПРАВЛЕНО: CurrentSaleResponse.data содержит Sale напрямую (не обернутый в { sale: ... })
  const sale = currentSale.data?.data;  // data содержит Sale | null
  const items = sale?.items || [];
  const totalAmount = parseFloat(sale?.total_amount || "0");
  const totalProductCount = items.reduce((acc: number, item: { quantity: string }) => acc + parseFloat(item.quantity), 0);

  // Debug: Log current sale data
  useEffect(() => {
    console.log('📊 Current sale data:', {
      hasData: !!currentSale.data,
      sale: sale,
      itemsCount: items.length,
      totalAmount,
      rawData: currentSale.data
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
    // ИСПРАВЛЕНО: Backend возвращает товар напрямую в data, а не в data.product
    const product = scanBarcode.data?.data;

    console.log('🔎 Barcode scan effect triggered:', {
      hasProduct: !!product,
      product: product,
      sessionId,
      scannedCode,
      isError: scanBarcode.isError,
      isLoading: scanBarcode.isLoading
    });

    if (product && sessionId && scannedCode) {
      console.log('🛒 Product found, adding to sale:', {
        sessionId,
        productId: product.id,
        productName: product.name,
        barcode: scannedCode
      });

      // Очищаем код СРАЗУ чтобы не было повторных вызовов
      setScannedCode("");
      setBarcodeInput("");

      // Используем scan_item endpoint который автоматически создает/обновляет продажу
      scanItem.mutate(
        {
          session: sessionId,
          product: product.id,
          quantity: 1,
          batch: null,
        },
        {
          onSuccess: (data) => {
            console.log('✅ Scan item SUCCESS:', data);
          },
          onError: (error: any) => {
            console.error('❌ Scan item ERROR:', error);
            console.error('❌ Error response:', error?.response?.data);
            setErrorMessage(error?.response?.data?.message || "Xatolik yuz berdi");
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
            setErrorMessage(error?.response?.data?.message || "Xatolik yuz berdi");
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
  };

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

    checkout.mutate(
      {
        saleId: sale.id,
        data: {
          payments: [
            {
              payment_method: selectedPaymentMethod,  // payment_method, не method!
              amount: totalAmount,
            },
          ],
          // Attach customer if selected
          customer_id: selectedCustomer?.id,
          // Attach cashier if selected
          cashier_id: selectedCashier?.id,
        },
      },
      {
        onSuccess: () => {
          setShowSuccessNotification(true);
          // Clear customer selection after successful checkout
          setSelectedCustomer(null);
        },
        onError: (error: any) => {
          setErrorMessage(error?.response?.data?.message || "Xatolik yuz berdi");
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
          bodyCols={items.slice(offset, offset + limit).map((item: { id: number; product_name: string; quantity: string; unit_price: string }, index: number) => ({
            id: item.id,
            index: index + 1 + offset,
            category_name: "-", // Category name not included in sale item
            name: item.product_name,
            sku: "-", // SKU not included in sale item
            unit: "-", // Unit not included in sale item
            quantity: `${parseFloat(item.quantity).toFixed(0)}x`,
            sale_price: (+item.unit_price).toLocaleString("de-DE") + " uzs",
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
          bottom={100}
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
                selectedCashierId={selectedCashier?.id}
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
              />
            </div>

            <div className={styles.total_price}>
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
    </div>
  );
};

export default Home;
