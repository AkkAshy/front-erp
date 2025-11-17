import { useState, type FC } from "react";
import CreateModal from "../CreateModal";
import Notification from "../Notification";
import { useCloseShift } from "@/entities/sales/model/useCloseShift";
import type { CashierShift } from "@/entities/sales/api/shiftTypes";
import styles from "./CloseShiftModal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  shift: CashierShift | null;
  onSuccess?: () => void;
};

const CloseShiftModal: FC<Props> = ({ isOpen, onClose, shift, onSuccess }) => {
  const [closingBalance, setClosingBalance] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const closeShift = useCloseShift();

  const handleClose = () => {
    if (!shift) return;

    const balance = parseFloat(closingBalance.replace(/\./g, "").replace(/,/g, "."));

    if (!closingBalance || isNaN(balance) || balance < 0) {
      setError("Kiriting to'g'ri yakuniy balansni");
      return;
    }

    closeShift
      .mutateAsync({
        shiftId: shift.id,
        data: {
          closing_balance: balance,
          notes: notes || undefined,
        },
      })
      .then(() => {
        setClosingBalance("");
        setNotes("");
        setError("");
        onClose();
        onSuccess?.();
      })
      .catch((err) => {
        console.error("Error closing shift:", err);
        setError(err.response?.data?.error || "Smena yopishda xatolik");
      });
  };

  const handleModalClose = () => {
    setClosingBalance("");
    setNotes("");
    setError("");
    onClose();
  };

  if (!shift) return null;

  const expectedBalance = parseFloat(shift.expected_balance);
  const difference = closingBalance
    ? parseFloat(closingBalance.replace(/\./g, "").replace(/,/g, ".")) - expectedBalance
    : 0;

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
                {Number(shift.opening_balance).toLocaleString("de-DE")} uzs
              </span>
            </div>

            <div className={styles.stat__item}>
              <span className={styles.stat__label}>Jami sotuvlar:</span>
              <span className={styles.stat__value}>
                {Number(shift.total_sales).toLocaleString("de-DE")} uzs
              </span>
            </div>

            <div className={styles.stat__item}>
              <span className={styles.stat__label}>Naqd pul:</span>
              <span className={styles.stat__value}>
                {Number(shift.total_cash_sales).toLocaleString("de-DE")} uzs
              </span>
            </div>

            <div className={styles.stat__item}>
              <span className={styles.stat__label}>Karta:</span>
              <span className={styles.stat__value}>
                {Number(shift.total_card_sales).toLocaleString("de-DE")} uzs
              </span>
            </div>

            <div className={styles.stat__item}>
              <span className={styles.stat__label}>O'tkazma:</span>
              <span className={styles.stat__value}>
                {Number(shift.total_transfer_sales).toLocaleString("de-DE")} uzs
              </span>
            </div>

            <div className={styles.stat__item}>
              <span className={styles.stat__label}>Kutilayotgan balans:</span>
              <span className={`${styles.stat__value} ${styles.expected}`}>
                {Number(shift.expected_balance).toLocaleString("de-DE")} uzs
              </span>
            </div>
          </div>

          <div className={styles.input__wrapper}>
            <p className={styles.label}>Faktik balans (kassada qancha pul bor)</p>
            <input
              value={closingBalance}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                const formattedValue = numericValue
                  ? Number(numericValue).toLocaleString("de-DE")
                  : "";
                setClosingBalance(formattedValue);
              }}
              type="text"
              placeholder="0 uzs"
              className={styles.input}
            />
          </div>

          {closingBalance && (
            <div className={styles.difference}>
              <span>Farq:</span>
              <span
                className={difference >= 0 ? styles.positive : styles.negative}
              >
                {difference >= 0 ? "+" : ""}
                {difference.toLocaleString("de-DE")} uzs
              </span>
            </div>
          )}

          <div className={styles.input__wrapper}>
            <p className={styles.label}>Izoh (ixtiyoriy)</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Izoh qoldiring..."
              className={styles.textarea}
              rows={3}
            />
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
