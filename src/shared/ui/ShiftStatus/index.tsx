import { useState, type FC } from "react";
import { useCurrentShift } from "@/entities/sales/model/useCurrentShift";
import { MINIMUM_CASH_IN_REGISTER, DEFAULT_OPENING_CASH } from "@/entities/sales/api/shiftTypes";
import OpenShiftModal from "../OpenShiftModal";
import CloseShiftModal from "../CloseShiftModal";
import WithdrawModal from "../WithdrawModal";
import styles from "./ShiftStatus.module.scss";

const ShiftStatus: FC = () => {
  const { data: currentShift, isLoading, refetch } = useCurrentShift();
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const shift = currentShift;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Yuklanmoqda...</div>
      </div>
    );
  }

  if (!shift) {
    return (
      <>
        <div className={styles.container}>
          <div className={styles.noShift}>
            <p className={styles.noShift__text}>Smena ochilmagan</p>
            <button
              className={styles.openButton}
              onClick={() => setIsOpenModalOpen(true)}
            >
              Smenani ochish
            </button>
          </div>
        </div>

        <OpenShiftModal
          isOpen={isOpenModalOpen}
          onClose={() => setIsOpenModalOpen(false)}
          onSuccess={() => refetch()}
        />
      </>
    );
  }

  const expectedCash = Number(shift.expected_cash) || 0;
  const maxWithdraw = Math.max(0, expectedCash - MINIMUM_CASH_IN_REGISTER);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.shiftInfo}>
          <div className={styles.header}>
            <div className={styles.status}>
              <span className={styles.statusDot} />
              <span className={styles.statusText}>Smena ochiq</span>
            </div>
            <div className={styles.headerButtons}>
              <button
                className={styles.withdrawButton}
                onClick={() => setIsWithdrawModalOpen(true)}
                disabled={maxWithdraw <= 0}
                title={maxWithdraw <= 0 ? "Pul yetarli emas" : `Maksimum: ${maxWithdraw.toLocaleString("ru-RU")} uzs`}
              >
                Pul olish
              </button>
              <button
                className={styles.closeButton}
                onClick={() => setIsCloseModalOpen(true)}
              >
                Smenani yopish
              </button>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Boshlang'ich:</span>
              <span className={styles.statValue}>
                {(Number(shift.opening_cash) || DEFAULT_OPENING_CASH).toLocaleString("ru-RU")} uzs
              </span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Sotuvlar:</span>
              <span className={styles.statValue}>
                {shift.sales_count} ta
              </span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Naqd sotuvlar:</span>
              <span className={styles.statValue}>
                {(Number(shift.cash_sales) || 0).toLocaleString("ru-RU")} uzs
              </span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Kassada:</span>
              <span className={`${styles.statValue} ${styles.total}`}>
                {expectedCash.toLocaleString("ru-RU")} uzs
              </span>
            </div>
          </div>
        </div>
      </div>

      <CloseShiftModal
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        shift={shift}
        onSuccess={() => refetch()}
      />

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        shift={shift}
        maxWithdraw={maxWithdraw}
        onSuccess={() => refetch()}
      />
    </>
  );
};

export default ShiftStatus;
