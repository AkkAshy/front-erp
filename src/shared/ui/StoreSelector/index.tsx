import { useState, useEffect } from "react";
import { useMyStores } from "@/entities/cashier/model/useMyStores";
import { ArrowDownIcon } from "@/shared/ui/icons";
import clsx from "clsx";
import styles from "./StoreSelector.module.scss";

type Props = {
  onStoreChange?: (tenantKey: string, storeName: string) => void;
};

const StoreSelector = ({ onStoreChange }: Props) => {
  const { data: storesData, isLoading } = useMyStores();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStoreKey, setSelectedStoreKey] = useState<string>("");
  const [selectedStoreName, setSelectedStoreName] = useState<string>("");

  // Initialize from localStorage or first store
  useEffect(() => {
    const savedKey = localStorage.getItem("selected_tenant_key");
    const savedName = localStorage.getItem("selected_store_name");

    if (savedKey && savedName) {
      setSelectedStoreKey(savedKey);
      setSelectedStoreName(savedName);
    } else if (storesData?.data.stores && storesData.data.stores.length > 0) {
      // Auto-select first store if nothing saved
      const firstStore = storesData.data.stores[0];
      handleStoreSelect(firstStore.tenant_key, firstStore.name);
    }
  }, [storesData]);

  const handleStoreSelect = (tenantKey: string, storeName: string) => {
    console.log("🏪 Store Selection:", {
      tenantKey,
      storeName,
      previousKey: localStorage.getItem("selected_tenant_key"),
      previousName: localStorage.getItem("selected_store_name")
    });

    setSelectedStoreKey(tenantKey);
    setSelectedStoreName(storeName);
    setIsOpen(false);

    // Save to localStorage
    localStorage.setItem("selected_tenant_key", tenantKey);
    localStorage.setItem("selected_store_name", storeName);

    console.log("✅ Store Saved to localStorage:", {
      saved_tenant_key: localStorage.getItem("selected_tenant_key"),
      saved_store_name: localStorage.getItem("selected_store_name")
    });

    // Notify parent component
    if (onStoreChange) {
      onStoreChange(tenantKey, storeName);
    }

    // Reload page to apply new tenant key
    // Кэш теперь разделен по tenant_key, поэтому очистка не нужна
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className={styles.storeSelector}>
        <div className={styles.selector__button}>
          <span className={styles.storeName}>Yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  const stores = storesData?.data.stores || [];

  if (stores.length === 0) {
    return null;
  }

  // Don't show selector if only one store
  if (stores.length === 1) {
    return (
      <div className={styles.storeSelector}>
        <div className={styles.selector__button}>
          <span className={styles.storeIcon}>🏪</span>
          <span className={styles.storeName}>{stores[0].name}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.storeSelector}>
      <div
        className={clsx(styles.selector__button, isOpen && styles.open)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.storeIcon}>🏪</span>
        <span className={styles.storeName}>
          {selectedStoreName || "Do'kon tanlang"}
        </span>
        <ArrowDownIcon selected={isOpen} />
      </div>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.dropdown}>
            <div className={styles.dropdown__header}>
              <h4>Do'konni tanlang</h4>
              <p>Аналитика ва маълумотлар танланган доъкон учун кўрсатилади</p>
            </div>
            <ul className={styles.storesList}>
              {stores.map((store) => (
                <li
                  key={store.id}
                  className={clsx(
                    styles.storeItem,
                    selectedStoreKey === store.tenant_key && styles.selected
                  )}
                  onClick={() => handleStoreSelect(store.tenant_key, store.name)}
                >
                  <div className={styles.storeItem__info}>
                    <span className={styles.storeItem__name}>{store.name}</span>
                    {store.address && (
                      <span className={styles.storeItem__address}>
                        {store.address}
                      </span>
                    )}
                  </div>
                  {selectedStoreKey === store.tenant_key && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default StoreSelector;
