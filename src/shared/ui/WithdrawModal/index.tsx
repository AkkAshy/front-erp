import { useState, type FC } from "react";
import CreateModal from "../CreateModal";
import Notification from "../Notification";
import { useOwnerWithdraw } from "@/entities/sales/model/useOwnerWithdraw";
import { formatNumber } from "@/shared/lib/utils/formatters";
import type { CashierShift } from "@/entities/sales/api/shiftTypes";
import { MINIMUM_CASH_IN_REGISTER } from "@/entities/sales/api/shiftTypes";
import styles from "./WithdrawModal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  shift: CashierShift | null;
  maxWithdraw: number;
  onSuccess?: () => void;
};

const WithdrawModal: FC<Props> = ({ isOpen, onClose, shift, maxWithdraw, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const withdraw = useOwnerWithdraw();

  const handleWithdraw = () => {
    if (!shift) return;

    const withdrawAmount = parseFloat(amount.replace(/\s/g, "").replace(/\u00A0/g, ""));

    if (!amount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError("To'g'ri summa kiriting");
      return;
    }

    if (withdrawAmount > maxWithdraw) {
      setError(`Maksimum ${formatNumber(maxWithdraw)} uzs olish mumkin`);
      return;
    }

    withdraw
      .mutateAsync({
        session: shift.id,
        amount: withdrawAmount,
        description: description || undefined,
      })
      .then(() => {
        setAmount("");
        setDescription("");
        setError("");
        onClose();
        onSuccess?.();
      })
      .catch((err) => {
        console.error("Error withdrawing:", err);
        const errorData = err.response?.data;
        if (errorData?.code === "exceeds_limit") {
          setError(`Maksimum ${formatNumber(errorData.data?.max_withdraw || maxWithdraw)} uzs olish mumkin`);
        } else if (errorData?.code === "insufficient_cash") {
          setError("Kassada yetarli pul yo'q");
        } else {
          setError(errorData?.message || "Pul olishda xatolik");
        }
      });
  };

  const handleModalClose = () => {
    setAmount("");
    setDescription("");
    setError("");
    onClose();
  };

  if (!shift) return null;

  const currentBalance = parseFloat(shift.expected_cash) || 0;
  const withdrawAmount = amount
    ? parseFloat(amount.replace(/\s/g, "").replace(/\u00A0/g, "")) || 0
    : 0;
  const remainingBalance = currentBalance - withdrawAmount;

  return (
    <>
      <CreateModal
        isOpen={isOpen}
        onClose={handleModalClose}
        headTitle="Pul olish"
        btnTitle="Olish"
        btnClose={true}
        width={500}
        height={480}
        btnWidth="100%"
        btnHeight={56}
        btnOnClick={handleWithdraw}
      >
        <div className={styles.container}>
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <span>Hozirgi balans:</span>
              <span className={styles.balance}>{formatNumber(currentBalance)} uzs</span>
            </div>
            <div className={styles.infoItem}>
              <span>Maksimum olish mumkin:</span>
              <span className={styles.maxAmount}>{formatNumber(maxWithdraw)} uzs</span>
            </div>
            <div className={styles.infoItem}>
              <span>Minimal qoldiq:</span>
              <span>{formatNumber(MINIMUM_CASH_IN_REGISTER)} uzs</span>
            </div>
          </div>

          <div className={styles.input__wrapper}>
            <p className={styles.label}>Summa</p>
            <input
              value={amount}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                const formattedValue = numericValue
                  ? Number(numericValue).toLocaleString("ru-RU")
                  : "";
                setAmount(formattedValue);
              }}
              type="text"
              placeholder="0 uzs"
              className={styles.input}
            />
          </div>

          {withdrawAmount > 0 && (
            <div className={styles.preview}>
              <span>Olingandan keyin qoldiq:</span>
              <span className={remainingBalance < MINIMUM_CASH_IN_REGISTER ? styles.error : ""}>
                {formatNumber(remainingBalance)} uzs
              </span>
            </div>
          )}

          <div className={styles.input__wrapper}>
            <p className={styles.label}>Izoh (ixtiyoriy)</p>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              placeholder="Masalan: Inkassatsiya"
              className={styles.input}
            />
          </div>

          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      </CreateModal>

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description={`${formatNumber(withdrawAmount)} uzs olindi`}
        onOpen={withdraw.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description={error || "Pul olinmadi"}
        onOpen={withdraw.isError}
      />
    </>
  );
};

export default WithdrawModal;
