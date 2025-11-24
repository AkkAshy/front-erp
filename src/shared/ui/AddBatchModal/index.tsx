import { type FC, useState } from "react";
import CreateModal from "../CreateModal";
import { useWarehouseAddBatch } from "@/entities/product/model/useWarehouseAddBatch";
import type { VariantScanData, ProductScanData } from "@/entities/product/model/useScanBarcode";
import styles from "./AddBatchModal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  scanType: "variant" | "product" | null;
  scanData: VariantScanData | ProductScanData | null;
  onSuccess?: () => void;
};

const AddBatchModal: FC<Props> = ({ isOpen, onClose, scanType, scanData, onSuccess }) => {
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [supplier, setSupplier] = useState("");
  const [manufacturingDate, setManufacturingDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState("");

  const addBatch = useWarehouseAddBatch();

  const getProductName = () => {
    if (!scanData) return "";
    if (scanType === "variant") {
      return (scanData as VariantScanData).display_name;
    }
    return (scanData as ProductScanData).name;
  };

  const getCurrentQuantity = () => {
    if (!scanData) return 0;
    return scanData.current_quantity || 0;
  };

  const handleSubmit = async () => {
    setError("");

    // Валидация
    if (!quantity || Number(quantity) <= 0) {
      setError("Miqdorni kiriting");
      return;
    }

    if (!purchasePrice || Number(purchasePrice) <= 0) {
      setError("Kelish narxini kiriting");
      return;
    }

    if (!scanData || !scanType) {
      setError("Mahsulot ma'lumotlari topilmadi");
      return;
    }

    try {
      await addBatch.mutateAsync({
        type: scanType,
        id: scanData.id,
        quantity: Number(quantity),
        purchase_price: Number(purchasePrice),
        supplier: supplier ? Number(supplier) : undefined,
        manufacturing_date: manufacturingDate || undefined,
        expiry_date: expiryDate || undefined,
      });

      // Успех - очищаем форму и закрываем модал
      setQuantity("");
      setPurchasePrice("");
      setSupplier("");
      setManufacturingDate("");
      setExpiryDate("");
      setError("");

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err: any) {
      console.error("Ошибка добавления партии:", err);
      setError(err.response?.data?.message || "Partiya qo'shishda xatolik yuz berdi");
    }
  };

  const handleClose = () => {
    setQuantity("");
    setPurchasePrice("");
    setSupplier("");
    setManufacturingDate("");
    setExpiryDate("");
    setError("");
    onClose();
  };

  return (
    <CreateModal
      isOpen={isOpen}
      onClose={handleClose}
      width={600}
      headTitle="Partiya qo'shish"
      btnTitle="Qo'shish"
      btnOnClick={handleSubmit}
      btnDisabled={addBatch.isPending}
    >
      <div className={styles.container}>
        {scanData && (
          <div className={styles.productInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Mahsulot:</span>
              <span className={styles.value}>{getProductName()}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>SKU:</span>
              <span className={styles.value}>{scanData.sku}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Shtrix-kod:</span>
              <span className={styles.value}>{scanData.barcode}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Joriy miqdor:</span>
              <span className={styles.value}>{getCurrentQuantity()} dona</span>
            </div>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Miqdor *</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                disabled={addBatch.isPending}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Kelish narxi *</label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="0"
                disabled={addBatch.isPending}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Yetkazib beruvchi ID (ixtiyoriy)</label>
            <input
              type="number"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Yetkazib beruvchi ID"
              disabled={addBatch.isPending}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Ishlab chiqarilgan sana (ixtiyoriy)</label>
              <input
                type="date"
                value={manufacturingDate}
                onChange={(e) => setManufacturingDate(e.target.value)}
                disabled={addBatch.isPending}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Amal qilish muddati (ixtiyoriy)</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                disabled={addBatch.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </CreateModal>
  );
};

export default AddBatchModal;
