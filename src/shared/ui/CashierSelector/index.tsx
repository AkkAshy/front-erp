import { useState, useEffect, type FC } from "react";
import { useCashiers } from "@/entities/cashier/model/useCashiers";
import type { Cashier } from "@/entities/cashier/api/types";
import styles from "./CashierSelector.module.scss";

type Props = {
  onSelect: (cashier: Cashier) => void;
  selectedCashierId?: number | null;
};

const CashierSelector: FC<Props> = ({ onSelect, selectedCashierId }) => {
  const { data: cashiersData, isLoading, isError } = useCashiers();
  const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null);

  // Синхронизация с родительским компонентом через selectedCashierId
  useEffect(() => {
    if (selectedCashierId === null) {
      // Если selectedCashierId явно null, сбрасываем выбор
      setSelectedCashier(null);
    } else if (selectedCashierId && cashiersData?.data) {
      // Если передан конкретный ID, находим и устанавливаем кассира
      const cashier = cashiersData.data.find((c) => c.id === selectedCashierId);
      if (cashier) {
        setSelectedCashier(cashier);
      }
    }
  }, [selectedCashierId, cashiersData]);

  const handleSelect = (cashier: Cashier) => {
    setSelectedCashier(cashier);
    onSelect(cashier);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Yuklanmoqda...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Kassirlarni yuklashda xatolik</div>
      </div>
    );
  }

  if (!cashiersData?.data || cashiersData.data.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>Kassirlar topilmadi</div>
      </div>
    );
  }

  const handleClear = () => {
    setSelectedCashier(null);
    onSelect(null as any); // Clear parent state
  };

  if (selectedCashier) {
    return (
      <div className={styles.selectedContainer}>
        <div className={styles.selectedLabel}>Kassir:</div>
        <div className={styles.selectedCashier}>
          {selectedCashier.photo ? (
            <img
              src={selectedCashier.photo}
              alt={selectedCashier.full_name}
              className={styles.photo}
            />
          ) : (
            <div className={styles.photoPlaceholder}>
              {selectedCashier.full_name.charAt(0)}
            </div>
          )}
          <div className={styles.info}>
            <div className={styles.name}>{selectedCashier.full_name}</div>
            <div className={styles.phone}>{selectedCashier.phone}</div>
          </div>
          <button
            className={styles.clearButton}
            onClick={handleClear}
            title="O'chirish"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Kassirni tanlang:</div>
      <div className={styles.cashierList}>
        {cashiersData.data.map((cashier) => (
          <div
            key={cashier.id}
            className={styles.cashierCard}
            onClick={() => handleSelect(cashier)}
          >
            {cashier.photo ? (
              <img
                src={cashier.photo}
                alt={cashier.full_name}
                className={styles.photo}
              />
            ) : (
              <div className={styles.photoPlaceholder}>
                {cashier.full_name.charAt(0)}
              </div>
            )}
            <div className={styles.cashierInfo}>
              <div className={styles.cashierName}>{cashier.full_name}</div>
              <div className={styles.cashierPhone}>{cashier.phone}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CashierSelector;
