import { type FC, useState, useEffect } from "react";
import CreateModal from "@/shared/ui/CreateModal";
import { CardIcon, CashIcon } from "@/shared/ui/icons/payment";
import { TransferIcon } from "@/shared/ui/icons/status";
import styles from "./HybridPaymentModal.module.scss";

type HybridPaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onConfirm: (payments: PaymentPart[]) => void;
};

export type PaymentPart = {
  method: "cash" | "card" | "transfer";
  amount: number;
};

const HybridPaymentModal: FC<HybridPaymentModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  onConfirm,
}) => {
  const [cashAmount, setCashAmount] = useState<string>("0");
  const [cardAmount, setCardAmount] = useState<string>("0");
  const [transferAmount, setTransferAmount] = useState<string>("0");

  const [selectedMethod, setSelectedMethod] = useState<"cash" | "card" | "transfer" | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCashAmount("0");
      setCardAmount("0");
      setTransferAmount("0");
      setSelectedMethod(null);
    }
  }, [isOpen]);

  const parseAmount = (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const getTotalEntered = (): number => {
    return parseAmount(cashAmount) + parseAmount(cardAmount) + parseAmount(transferAmount);
  };

  const getRemainder = (): number => {
    return totalAmount - getTotalEntered();
  };

  const handleAmountChange = (method: "cash" | "card" | "transfer", value: string) => {
    // Allow only numbers and decimal point
    if (value !== "" && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const numValue = parseAmount(value);
    const otherAmounts =
      method === "cash"
        ? parseAmount(cardAmount) + parseAmount(transferAmount)
        : method === "card"
        ? parseAmount(cashAmount) + parseAmount(transferAmount)
        : parseAmount(cashAmount) + parseAmount(cardAmount);

    // Don't allow total to exceed totalAmount
    if (numValue + otherAmounts > totalAmount) {
      return;
    }

    if (method === "cash") setCashAmount(value);
    if (method === "card") setCardAmount(value);
    if (method === "transfer") setTransferAmount(value);
  };

  const handleQuickAdd = (method: "cash" | "card" | "transfer") => {
    setSelectedMethod(method);
    const remainder = getRemainder();
    if (remainder > 0) {
      if (method === "cash") setCashAmount((parseAmount(cashAmount) + remainder).toString());
      if (method === "card") setCardAmount((parseAmount(cardAmount) + remainder).toString());
      if (method === "transfer") setTransferAmount((parseAmount(transferAmount) + remainder).toString());
    }
  };

  const handleConfirm = () => {
    const payments: PaymentPart[] = [];

    if (parseAmount(cashAmount) > 0) {
      payments.push({ method: "cash", amount: parseAmount(cashAmount) });
    }
    if (parseAmount(cardAmount) > 0) {
      payments.push({ method: "card", amount: parseAmount(cardAmount) });
    }
    if (parseAmount(transferAmount) > 0) {
      payments.push({ method: "transfer", amount: parseAmount(transferAmount) });
    }

    if (payments.length < 2) {
      alert("Gibrid to'lov uchun kamida 2 ta usulni tanlang");
      return;
    }

    const total = getTotalEntered();
    if (Math.abs(total - totalAmount) > 0.01) {
      alert("To'lov summasi umumiy summaga teng bo'lishi kerak");
      return;
    }

    onConfirm(payments);
    onClose();
  };

  const isValid = () => {
    const total = getTotalEntered();
    const paymentCount = [cashAmount, cardAmount, transferAmount].filter(
      (amt) => parseAmount(amt) > 0
    ).length;
    return Math.abs(total - totalAmount) < 0.01 && paymentCount >= 2;
  };

  return (
    <CreateModal
      isOpen={isOpen}
      onClose={onClose}
      headTitle="Gibrid to'lov"
      width={500}
      height="auto"
    >
      <div className={styles.container}>
        <div className={styles.totalInfo}>
          <div className={styles.infoRow}>
            <span>Umumiy summa:</span>
            <strong>{totalAmount.toLocaleString()} so'm</strong>
          </div>
          <div className={styles.infoRow}>
            <span>Kiritilgan:</span>
            <strong>{getTotalEntered().toLocaleString()} so'm</strong>
          </div>
          <div className={styles.infoRow}>
            <span>Qoldiq:</span>
            <strong className={getRemainder() < 0 ? styles.error : ""}>
              {getRemainder().toLocaleString()} so'm
            </strong>
          </div>
        </div>

        <div className={styles.paymentMethods}>
          <div className={styles.methodItem}>
            <div className={styles.methodHeader} onClick={() => handleQuickAdd("cash")}>
              <CashIcon selected={selectedMethod === "cash"} />
              <span>Naqd pul</span>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={cashAmount}
              onChange={(e) => handleAmountChange("cash", e.target.value)}
              placeholder="0"
              className={styles.input}
            />
          </div>

          <div className={styles.methodItem}>
            <div className={styles.methodHeader} onClick={() => handleQuickAdd("card")}>
              <CardIcon selected={selectedMethod === "card"} />
              <span>Terminal</span>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={cardAmount}
              onChange={(e) => handleAmountChange("card", e.target.value)}
              placeholder="0"
              className={styles.input}
            />
          </div>

          <div className={styles.methodItem}>
            <div className={styles.methodHeader} onClick={() => handleQuickAdd("transfer")}>
              <TransferIcon selected={selectedMethod === "transfer"} />
              <span>O'tkazma</span>
            </div>
            <input
              type="text"
              inputMode="decimal"
              value={transferAmount}
              onChange={(e) => handleAmountChange("transfer", e.target.value)}
              placeholder="0"
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.btnCancel}>
            Bekor qilish
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid()}
            className={styles.btnConfirm}
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    </CreateModal>
  );
};

export default HybridPaymentModal;
