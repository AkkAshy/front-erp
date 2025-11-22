import { useState, type FC } from "react";
import { useCurrentShift } from "@/entities/sales/model/useCurrentShift";
import OpenShiftModal from "../OpenShiftModal";
import CloseShiftModal from "../CloseShiftModal";
import styles from "./ShiftStatus.module.scss";

const ShiftStatus: FC = () => {
  const { data: currentShift, isLoading, refetch } = useCurrentShift();
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

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

  return (
    <>
      <div className={styles.container}>
        <div className={styles.shiftInfo}>
          <div className={styles.header}>
            <div className={styles.status}>
              <span className={styles.statusDot} />
              <span className={styles.statusText}>Smena ochiq</span>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => setIsCloseModalOpen(true)}
            >
              Smenani yopish
            </button>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Boshlang'ich:</span>
              <span className={styles.statValue}>
                {(Number(shift.opening_balance) || 0).toLocaleString("de-DE")} uzs
              </span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Sotuvlar:</span>
              <span className={styles.statValue}>
                {shift.sales_count} ta
              </span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Jami:</span>
              <span className={`${styles.statValue} ${styles.total}`}>
                {(Number(shift.total_sales) || 0).toLocaleString("de-DE")} uzs
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
    </>
  );
};

export default ShiftStatus;
