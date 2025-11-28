import { useState, type FC } from "react";
import CreateModal from "../CreateModal";
import Notification from "../Notification";
import { useCloseShift } from "@/entities/sales/model/useCloseShift";
import { formatNumber } from "@/shared/lib/utils/formatters";
import type { CashierShift } from "@/entities/sales/api/shiftTypes";
import { DEFAULT_OPENING_CASH } from "@/entities/sales/api/shiftTypes";
import styles from "./CloseShiftModal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  shift: CashierShift | null;
  onSuccess?: () => void;
};

const CloseShiftModal: FC<Props> = ({ isOpen, onClose, shift, onSuccess }) => {
  const [shortage, setShortage] = useState("");
  const [error, setError] = useState("");
  const closeShift = useCloseShift();

  const handleClose = () => {
    if (!shift) return;

    // Убираем все пробелы и неразрывные пробелы, затем парсим
    const shortageAmount = shortage
      ? parseFloat(shortage.replace(/\s/g, "").replace(/\u00A0/g, ""))
      : 0;

    if (shortage && (isNaN(shortageAmount) || shortageAmount < 0)) {
      setError("To'g'ri summa kiriting");
      return;
    }

    closeShift
      .mutateAsync({
        shiftId: shift.id,
        data: {
          shortage: shortageAmount,
        },
      })
      .then(() => {
        setShortage("");
        setError("");
        onClose();
        onSuccess?.();
      })
      .catch((err) => {
        console.error("Error closing shift:", err);
        setError(err.response?.data?.message || err.response?.data?.error || "Smena yopishda xatolik");
      });
  };

  const handleModalClose = () => {
    setShortage("");
    setError("");
    onClose();
  };

  if (!shift) return null;

  const expectedCash = parseFloat(shift.expected_cash) || 0;
  const shortageAmount = shortage
    ? parseFloat(shortage.replace(/\s/g, "").replace(/\u00A0/g, "")) || 0
    : 0;
  const actualCash = expectedCash - shortageAmount;

  return (
    <>
      <CreateModal
        isOpen={isOpen}
        onClose={handleModalClose}
        headTitle="Smenani yopish"
        btnTitle="Yopish"
        btnClose={true}
        width={600}
        height={550}
        btnWidth="100%"
        btnHeight={56}
        btnOnClick={handleClose}
      >
        <div className={styles.container}>
          <div className={styles.stats}>
            <div className={styles.stat__item}>
              <span className={styles.stat__label}>Boshlang'ich balans:</span>
              <span className={styles.stat__value}>
                {formatNumber(Number(shift.opening_cash) || DEFAULT_OPENING_CASH)} uzs
              </span>
            </div>

            <div className={styles.stat__item}>
              <span className={styles.stat__label}>Jami sotuvlar:</span>
              <span className={styles.stat__value}>
                {formatNumber(shift.total_sales)} uzs
              </span>
            </div>

            <div className={styles.stat__item}>
              <span className={styles.stat__label}>Naqd pul:</span>
              <span className={styles.stat__value}>
                {formatNumber(shift.cash_sales)} uzs
              </span>
            </div>

            <div className={styles.stat__item}>
              <span className={styles.stat__label}>Karta:</span>
              <span className={styles.stat__value}>
                {formatNumber(shift.card_sales)} uzs
              </span>
            </div>

            <div className={styles.stat__item}>
              <span className={styles.stat__label}>Kassada bo'lishi kerak:</span>
              <span className={`${styles.stat__value} ${styles.expected}`}>
                {formatNumber(shift.expected_cash)} uzs
              </span>
            </div>
          </div>

          <div className={styles.input__wrapper}>
            <p className={styles.label}>Kamomad (qancha pul yetmayapti)</p>
            <input
              value={shortage}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                const formattedValue = numericValue
                  ? Number(numericValue).toLocaleString("ru-RU")
                  : "";
                setShortage(formattedValue);
              }}
              type="text"
              placeholder="0 uzs (hammasi to'g'ri bo'lsa)"
              className={styles.input}
            />
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <span>Kutilayotgan summa:</span>
              <span>{formatNumber(expectedCash)} uzs</span>
            </div>
            {shortageAmount > 0 && (
              <div className={styles.summaryItem}>
                <span>Kamomad:</span>
                <span className={styles.negative}>-{formatNumber(shortageAmount)} uzs</span>
              </div>
            )}
            <div className={`${styles.summaryItem} ${styles.total}`}>
              <span>Faktik summa:</span>
              <span className={shortageAmount > 0 ? styles.negative : ""}>
                {formatNumber(actualCash)} uzs
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span>Keyingi smena uchun:</span>
              <span>{formatNumber(DEFAULT_OPENING_CASH)} uzs</span>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>
      </CreateModal>

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Smena yopildi"
        onOpen={closeShift.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description={error || "Smena yopilmadi"}
        onOpen={closeShift.isError}
      />
    </>
  );
};

export default CloseShiftModal;
