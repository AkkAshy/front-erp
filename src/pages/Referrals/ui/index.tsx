import { useState } from "react";
import { useReferrals, useCreateReferral, useCreatePayout } from "@/entities/referral";
import { useFilteredProducts } from "@/entities/product/model/useFilteredProducts";
import type { CreateReferralRequest, Referral, PaymentMethodPayout, CouponType } from "@/entities/referral";
import type { ProductItem } from "@/entities/product/api/types";

import PageTitle from "@/shared/ui/PageTitle";
import Table from "@/shared/ui/Table";
import TablePagination from "@/shared/ui/Pagination";
import CreateModal from "@/shared/ui/CreateModal";
import Notification from "@/shared/ui/Notification";
import { usePagination } from "@/shared/lib/hooks/usePagination";
import { parseApiError } from "@/shared/lib/utils/formatters";

import styles from "./Referrals.module.scss";

const headCols = ["#", "Ism", "Telefon", "Komissiya %", "Balans", "Jami to'langan", "Sotuvlar", "Holatи", ""];

const Referrals = () => {
  const { page, setPage, limit, offset } = usePagination(1, 10);

  // State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Create referral form state
  const [createForm, setCreateForm] = useState<CreateReferralRequest>({
    name: "",
    phone: "",
    email: "",
    commission_percent: 5,
    username: "",
    password: "",
    create_coupon: true,
    coupon_code: "",
    coupon_name: "",
    coupon_type: "discount",
    discount_type: "percent",
    discount_value: 10,
  });

  // Bonus product state
  const [selectedBonusProduct, setSelectedBonusProduct] = useState<ProductItem | null>(null);
  const [bonusProductQuantity, setBonusProductQuantity] = useState<number>(1);
  const [productSearchQuery, setProductSearchQuery] = useState<string>("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Payout form state
  const [payoutAmount, setPayoutAmount] = useState<string>("");
  const [payoutMethod, setPayoutMethod] = useState<PaymentMethodPayout>("cash");
  const [payoutNotes, setPayoutNotes] = useState<string>("");

  // API hooks
  const referrals = useReferrals({ offset, limit });
  const createReferral = useCreateReferral();
  const createPayout = useCreatePayout();

  // Products for bonus product selection
  const products = useFilteredProducts({
    search: productSearchQuery,
    limit: 10,
  });
  const productsList = products.data?.results || [];

  // Handlers
  const handleCreateReferral = () => {
    if (!createForm.name.trim() || !createForm.username.trim() || !createForm.password.trim()) {
      setErrorMessage("Ism, login va parolni kiriting!");
      setShowErrorNotification(true);
      return;
    }

    // Validate bonus product selection
    if (createForm.create_coupon && createForm.coupon_type === "bonus_product" && !selectedBonusProduct) {
      setErrorMessage("Bonus mahsulotni tanlang!");
      setShowErrorNotification(true);
      return;
    }

    // Build request with bonus product info if applicable
    const requestData: CreateReferralRequest = {
      ...createForm,
      ...(createForm.coupon_type === "bonus_product" && selectedBonusProduct
        ? {
            bonus_product_id: selectedBonusProduct.id,
            bonus_product_quantity: bonusProductQuantity,
          }
        : {}),
    };

    createReferral.mutate(requestData, {
      onSuccess: (data) => {
        setIsCreateModalOpen(false);
        const bonusInfo = selectedBonusProduct ? ` Bonus mahsulot: ${selectedBonusProduct.name}` : "";
        setSuccessMessage(`Referal "${data.data.referral.name}" yaratildi! Login: ${data.data.credentials.username}${bonusInfo}`);
        setShowSuccessNotification(true);
        resetForm();
      },
      onError: (error: any) => {
        setErrorMessage(parseApiError(error));
        setShowErrorNotification(true);
      },
    });
  };

  const resetForm = () => {
    setCreateForm({
      name: "",
      phone: "",
      email: "",
      commission_percent: 5,
      username: "",
      password: "",
      create_coupon: true,
      coupon_code: "",
      coupon_name: "",
      coupon_type: "discount",
      discount_type: "percent",
      discount_value: 10,
    });
    setSelectedBonusProduct(null);
    setBonusProductQuantity(1);
    setProductSearchQuery("");
  };

  const handleOpenPayoutModal = (referral: Referral) => {
    setSelectedReferral(referral);
    setPayoutAmount("");
    setPayoutMethod("cash");
    setPayoutNotes("");
    setIsPayoutModalOpen(true);
  };

  const handleCreatePayout = () => {
    if (!selectedReferral) return;

    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage("To'g'ri summa kiriting!");
      setShowErrorNotification(true);
      return;
    }

    if (amount > parseFloat(selectedReferral.balance)) {
      setErrorMessage(`Summa balansdan oshmasligi kerak (${parseFloat(selectedReferral.balance).toLocaleString("de-DE")} uzs)`);
      setShowErrorNotification(true);
      return;
    }

    createPayout.mutate(
      {
        referralId: selectedReferral.id,
        data: {
          amount,
          payment_method: payoutMethod,
          notes: payoutNotes || undefined,
        },
      },
      {
        onSuccess: (data) => {
          setIsPayoutModalOpen(false);
          setSuccessMessage(`To'landi: ${amount.toLocaleString("de-DE")} uzs. Yangi balans: ${data.data.new_balance.toLocaleString("de-DE")} uzs`);
          setShowSuccessNotification(true);
          setSelectedReferral(null);
        },
        onError: (error: any) => {
          setErrorMessage(error?.response?.data?.error || error?.response?.data?.message || "Xatolik yuz berdi");
          setShowErrorNotification(true);
        },
      }
    );
  };

  const referralsList = referrals.data?.results || [];
  const totalCount = referrals.data?.count || 0;

  return (
    <div className={styles.referrals}>
      <header className={styles.header}>
        <PageTitle>Referallar</PageTitle>
        <button
          className={styles.addButton}
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Referal qo'shish
        </button>
      </header>

      <Table
        headCols={headCols}
        bodyCols={referralsList.map((referral, index) => ({
          id: referral.id,
          index: index + 1 + offset,
          name: referral.name,
          phone: referral.phone || "-",
          commission: `${parseFloat(referral.commission_percent)}%`,
          balance: (
            <span style={{ color: parseFloat(referral.balance) > 0 ? "#22c55e" : "#64748b", fontWeight: 500 }}>
              {parseFloat(referral.balance).toLocaleString("de-DE")} uzs
            </span>
          ),
          total_paid: `${parseFloat(referral.total_paid).toLocaleString("de-DE")} uzs`,
          sales: `${referral.total_sales_count} ta / ${parseFloat(referral.total_sales_amount).toLocaleString("de-DE")} uzs`,
          status: (
            <span
              style={{
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 500,
                backgroundColor: referral.is_active ? "#dcfce7" : "#fee2e2",
                color: referral.is_active ? "#166534" : "#991b1b",
              }}
            >
              {referral.is_active ? "Faol" : "Nofaol"}
            </span>
          ),
          actions: (
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => handleOpenPayoutModal(referral)}
                disabled={parseFloat(referral.balance) <= 0}
                style={{
                  padding: "6px 12px",
                  backgroundColor: parseFloat(referral.balance) > 0 ? "#8e51ff" : "#e2e8f0",
                  color: parseFloat(referral.balance) > 0 ? "#fff" : "#94a3b8",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: parseFloat(referral.balance) > 0 ? "pointer" : "not-allowed",
                }}
              >
                To'lash
              </button>
            </div>
          ),
        }))}
        headCell={{
          1: { className: styles.cell__hash },
          9: { className: styles.cell__actions },
        }}
        bodyCell={{
          1: { className: styles.row__index, align: "center" },
          9: { align: "center" },
        }}
        isLoading={referrals.isLoading}
      />

      {referralsList.length === 0 && !referrals.isLoading && (
        <div className={styles.empty}>
          <p>Hali referallar yo'q</p>
          <button onClick={() => setIsCreateModalOpen(true)}>
            Birinchi referalni qo'shing
          </button>
        </div>
      )}

      <TablePagination
        current={page}
        total={totalCount}
        pageSize={limit}
        onChange={(p) => setPage(p)}
      />

      {/* Create Referral Modal */}
      <CreateModal
        headTitle="Yangi referal qo'shish"
        onClose={() => setIsCreateModalOpen(false)}
        isOpen={isCreateModalOpen}
        width={560}
        height={createForm.coupon_type === "bonus_product" ? 780 : 680}
        btnTitle={createReferral.isPending ? "Yaratilmoqda..." : "Yaratish"}
        btnOnClick={handleCreateReferral}
      >
        <div className={styles.formWrapper}>
          <div className={styles.formSection}>
            <h4>Asosiy ma'lumotlar</h4>
            <div className={styles.formRow}>
              <label>Ism *</label>
              <input
                type="text"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="Referal ismi"
              />
            </div>
            <div className={styles.formRow}>
              <label>Telefon</label>
              <input
                type="text"
                value={createForm.phone}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                placeholder="+998901234567"
              />
            </div>
            <div className={styles.formRow}>
              <label>Email</label>
              <input
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className={styles.formRow}>
              <label>Komissiya %</label>
              <input
                type="number"
                value={createForm.commission_percent}
                onChange={(e) => setCreateForm({ ...createForm, commission_percent: parseFloat(e.target.value) || 0 })}
                min="0"
                max="100"
                step="0.5"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h4>Kirish ma'lumotlari</h4>
            <div className={styles.formRow}>
              <label>Login *</label>
              <input
                type="text"
                value={createForm.username}
                onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                placeholder="referal_login"
              />
            </div>
            <div className={styles.formRow}>
              <label>Parol *</label>
              <input
                type="text"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                placeholder="Parol (kamida 6 ta belgi)"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h4>
              <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={createForm.create_coupon}
                  onChange={(e) => setCreateForm({ ...createForm, create_coupon: e.target.checked })}
                />
                Kupon yaratish
              </label>
            </h4>
            {createForm.create_coupon && (
              <>
                <div className={styles.formRow}>
                  <label>Kupon kodi</label>
                  <input
                    type="text"
                    value={createForm.coupon_code}
                    onChange={(e) => setCreateForm({ ...createForm, coupon_code: e.target.value.toUpperCase() })}
                    placeholder="IVAN10 (avtomatik generatsiya)"
                  />
                </div>
                <div className={styles.formRow}>
                  <label>Kupon turi</label>
                  <select
                    value={createForm.coupon_type}
                    onChange={(e) => {
                      const newType = e.target.value as CouponType;
                      setCreateForm({ ...createForm, coupon_type: newType });
                      // Clear bonus product when switching away from bonus_product
                      if (newType !== "bonus_product") {
                        setSelectedBonusProduct(null);
                        setProductSearchQuery("");
                      }
                    }}
                  >
                    <option value="discount">Chegirma</option>
                    <option value="bonus_product">Bonus mahsulot</option>
                  </select>
                </div>

                {/* Discount options - only for discount type */}
                {createForm.coupon_type === "discount" && (
                  <>
                    <div className={styles.formRow}>
                      <label>Chegirma turi</label>
                      <select
                        value={createForm.discount_type}
                        onChange={(e) => setCreateForm({ ...createForm, discount_type: e.target.value as any })}
                      >
                        <option value="percent">Foiz (%)</option>
                        <option value="fixed">Belgilangan (uzs)</option>
                      </select>
                    </div>
                    <div className={styles.formRow}>
                      <label>Chegirma miqdori</label>
                      <input
                        type="number"
                        value={createForm.discount_value}
                        onChange={(e) => setCreateForm({ ...createForm, discount_value: parseFloat(e.target.value) || 0 })}
                        min="0"
                        step={createForm.discount_type === "percent" ? "1" : "1000"}
                      />
                    </div>
                  </>
                )}

                {/* Bonus product selector - only for bonus_product type */}
                {createForm.coupon_type === "bonus_product" && (
                  <>
                    <div className={styles.formRow}>
                      <label>Bonus mahsulot *</label>
                      {selectedBonusProduct ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px",
                            backgroundColor: "#fef3c7",
                            border: "1px solid #fcd34d",
                            borderRadius: "8px",
                          }}
                        >
                          <div>
                            <p style={{ fontWeight: 500, color: "#92400e" }}>{selectedBonusProduct.name}</p>
                            <p style={{ fontSize: "12px", color: "#a16207" }}>
                              SKU: {selectedBonusProduct.sku} • {parseFloat(selectedBonusProduct.sale_price || "0").toLocaleString("de-DE")} uzs
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedBonusProduct(null)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#dc2626",
                              fontSize: "16px",
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div style={{ position: "relative" }}>
                          <input
                            type="text"
                            value={productSearchQuery}
                            onChange={(e) => {
                              setProductSearchQuery(e.target.value);
                              setShowProductDropdown(true);
                            }}
                            onFocus={() => setShowProductDropdown(true)}
                            placeholder="Mahsulot nomini kiriting..."
                          />
                          {showProductDropdown && productSearchQuery && (
                            <div
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                right: 0,
                                backgroundColor: "#fff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                maxHeight: "200px",
                                overflowY: "auto",
                                zIndex: 10,
                              }}
                            >
                              {products.isLoading ? (
                                <p style={{ padding: "12px", color: "#64748b" }}>Qidirilmoqda...</p>
                              ) : productsList.length > 0 ? (
                                productsList.map((product: ProductItem) => (
                                  <div
                                    key={product.id}
                                    onClick={() => {
                                      setSelectedBonusProduct(product);
                                      setProductSearchQuery("");
                                      setShowProductDropdown(false);
                                    }}
                                    style={{
                                      padding: "10px 12px",
                                      cursor: "pointer",
                                      borderBottom: "1px solid #f1f5f9",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                                  >
                                    <p style={{ fontWeight: 500, fontSize: "14px" }}>{product.name}</p>
                                    <p style={{ fontSize: "12px", color: "#64748b" }}>
                                      SKU: {product.sku} • {parseFloat(product.sale_price || "0").toLocaleString("de-DE")} uzs
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p style={{ padding: "12px", color: "#64748b" }}>Mahsulot topilmadi</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className={styles.formRow}>
                      <label>Soni</label>
                      <input
                        type="number"
                        value={bonusProductQuantity}
                        onChange={(e) => setBonusProductQuantity(parseInt(e.target.value) || 1)}
                        min="1"
                        step="1"
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </CreateModal>

      {/* Payout Modal */}
      <CreateModal
        headTitle={`To'lov: ${selectedReferral?.name || ""}`}
        onClose={() => setIsPayoutModalOpen(false)}
        isOpen={isPayoutModalOpen}
        width={480}
        height={420}
        btnTitle={createPayout.isPending ? "To'lanmoqda..." : "To'lash"}
        btnOnClick={handleCreatePayout}
      >
        <div className={styles.formWrapper}>
          {selectedReferral && (
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f0fdf4",
                borderRadius: "12px",
                marginBottom: "16px",
              }}
            >
              <p style={{ color: "#166534", fontSize: "14px" }}>
                Mavjud balans: <strong>{parseFloat(selectedReferral.balance).toLocaleString("de-DE")} uzs</strong>
              </p>
            </div>
          )}

          <div className={styles.formRow}>
            <label>Summa (uzs) *</label>
            <input
              type="number"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              placeholder="100000"
              min="1"
              step="1000"
            />
          </div>

          <div className={styles.formRow}>
            <label>To'lov usuli</label>
            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value as PaymentMethodPayout)}
            >
              <option value="cash">Naqd</option>
              <option value="card">Karta</option>
              <option value="transfer">O'tkazma</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <label>Izoh</label>
            <input
              type="text"
              value={payoutNotes}
              onChange={(e) => setPayoutNotes(e.target.value)}
              placeholder="Oylik to'lov..."
            />
          </div>
        </div>
      </CreateModal>

      <Notification
        placement="top"
        type="success"
        message="Muvaffaqiyat"
        description={successMessage}
        onOpen={showSuccessNotification}
      />

      <Notification
        placement="top"
        type="error"
        message="Xatolik"
        description={errorMessage}
        onOpen={showErrorNotification}
      />
    </div>
  );
};

export default Referrals;
