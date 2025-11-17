import { useState, type FC } from "react";
import CreateModal from "../CreateModal";
import SelectCategory from "../SelectCategory";
import SelectUnit from "../SelectUnit";
import { useCreateProduct } from "@/entities/product/model/useCreateProduct";
import Notification from "../Notification";
import styles from "./CreateProduct.module.scss";

type Props = {
  isOpenCreate: boolean;
  setIsOpenCreate: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateProduct: FC<Props> = ({ isOpenCreate, setIsOpenCreate }) => {
  // Основная информация
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | string>("");
  const [unitId, setUnitId] = useState<number | string>("");

  // Цены
  const [costPrice, setCostPrice] = useState("");  // Себестоимость
  const [salePrice, setSalePrice] = useState("");  // Цена продажи
  const [wholesalePrice, setWholesalePrice] = useState("");  // Оптовая цена

  // Количество
  const [quantity, setQuantity] = useState("");

  // Настройки учёта
  const [minQuantity, setMinQuantity] = useState("0");
  const [trackInventory, setTrackInventory] = useState(true);

  // Партия
  const [expiryDate, setExpiryDate] = useState("");  // Срок годности

  // Дополнительно
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");

  // UI
  const [isCategoryDropdown, setIsCategoryDropdown] = useState(false);
  const [isUnitDropdown, setIsUnitDropdown] = useState(false);
  const [error, setError] = useState("");

  const createProduct = useCreateProduct();

  function clearData() {
    setProductName("");
    setDescription("");
    setCategoryId("");
    setUnitId("");
    setCostPrice("");
    setSalePrice("");
    setWholesalePrice("");
    setQuantity("");
    setMinQuantity("0");
    setTrackInventory(true);
    setExpiryDate("");
    setWeight("");
    setVolume("");
    setError("");
  }

  function handleCreate() {
    // Валидация
    if (!productName?.trim()) {
      setError("Mahsulot nomini kiriting");
      return;
    }

    if (!categoryId) {
      setError("Kategoriyani tanlang");
      return;
    }

    if (!unitId) {
      setError("O'lchov birligini tanlang");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Miqdorni kiriting");
      return;
    }

    if (!costPrice || costPrice === "0") {
      setError("Kelish narxini kiriting");
      return;
    }

    if (!salePrice || salePrice === "0") {
      setError("Sotish narxini kiriting");
      return;
    }

    const costPriceNum = +costPrice.replace(/\./g, "");
    const salePriceNum = +salePrice.replace(/\./g, "");

    if (salePriceNum <= costPriceNum) {
      setError("Sotish narxi kelish narxidan yuqori bo'lishi kerak");
      return;
    }

    // Подготовка данных для отправки
    // ВАЖНО: SKU и barcode НЕ отправляем - они генерируются автоматически на бэкенде
    const productData: any = {
      name: productName,
      category: categoryId,
      unit: unitId,
      cost_price: costPriceNum,
      sale_price: salePriceNum,
      initial_quantity: Number(quantity),
      min_quantity: Number(minQuantity) || 0,
      track_inventory: trackInventory,
    };

    // Опциональные поля
    if (description) productData.description = description;
    if (wholesalePrice) productData.wholesale_price = +wholesalePrice.replace(/\./g, "");
    if (expiryDate) productData.expiry_date = expiryDate;
    if (weight) productData.weight = Number(weight);
    if (volume) productData.volume = Number(volume);

    createProduct
      .mutateAsync(productData)
      .then((res) => {
        if (res.status === 201) {
          setIsOpenCreate(false);
          clearData();
        }
      })
      .catch((err) => {
        console.error("Error creating product:", err);
        setError(err.response?.data?.detail || "Mahsulot yaratilmadi");
      });
  }

  return (
    <>
      <CreateModal
        isOpen={isOpenCreate}
        onClose={() => {
          setIsOpenCreate(false);
          setIsCategoryDropdown(false);
          setIsUnitDropdown(false);
        }}
        headTitle="Yangi tovar yaratish"
        btnTitle="Yaratish"
        btnClose={true}
        width={964}
        height={850}
        overflowY="scroll"
        btnWidth={"100%"}
        btnHeight={64}
        onClick={() => {
          setIsCategoryDropdown(false);
          setIsUnitDropdown(false);
        }}
        btnOnClick={handleCreate}
      >
        {/* Основная информация */}
        <div className={styles.input__wrapper}>
          <p className={styles.label__input}>Tovar nomi *</p>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            type="text"
            placeholder="Tovar nomini kiriting"
          />
        </div>

        <div className={styles.input__wrapper}>
          <p className={styles.label__input}>Tavsif</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tovar haqida qisqacha ma'lumot"
            rows={3}
            style={{ resize: 'vertical', padding: '12px', fontFamily: 'inherit' }}
          />
        </div>

        <div className={styles.info__note} style={{
          padding: '12px',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '14px',
          color: '#0369a1'
        }}>
          ℹ️ SKU (Artikul) va Shtrix-kod avtomatik generatsiya qilinadi
        </div>

        {/* Категория и единица измерения */}
        <div className={styles.sizes__wrapper}>
          <div className={styles.category__wrapper}>
            <p className={styles.label__input}>Tovar kategoriyasi *</p>
            <SelectCategory
              width={"100%"}
              bgColor={"#fff"}
              top={0}
              categoryIcon={false}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              isCategoryDropdown={isCategoryDropdown}
              setIsCategoryDropdown={setIsCategoryDropdown}
            />
          </div>

          <div className={styles.category__wrapper}>
            <p className={styles.label__input}>O'lchov birligi *</p>
            <SelectUnit
              width={"100%"}
              bgColor={"#fff"}
              top={0}
              unitId={unitId}
              setUnitId={setUnitId}
              isUnitDropdown={isUnitDropdown}
              setIsUnitDropdown={setIsUnitDropdown}
            />
          </div>
        </div>

        {/* Цены */}
        <div className={styles.price__wrapper}>
          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Kelish narxi (Tannarx) *</p>
            <input
              value={costPrice}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                const formattedValue = numericValue
                  ? Number(numericValue).toLocaleString("de-DE")
                  : "";
                setCostPrice(formattedValue);
              }}
              type="text"
              placeholder="0 uzs"
            />
          </div>

          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Sotish narxi *</p>
            <input
              value={salePrice}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                const formattedValue = numericValue
                  ? Number(numericValue).toLocaleString("de-DE")
                  : "";
                setSalePrice(formattedValue);
              }}
              type="text"
              placeholder="0 uzs"
            />
          </div>

          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Ulgurji narxi</p>
            <input
              value={wholesalePrice}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                const formattedValue = numericValue
                  ? Number(numericValue).toLocaleString("de-DE")
                  : "";
                setWholesalePrice(formattedValue);
              }}
              type="text"
              placeholder="0 uzs (ixtiyoriy)"
            />
          </div>
        </div>

        {/* Количество и минимальный остаток */}
        <div className={styles.sizes__wrapper}>
          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Boshlang'ich miqdor *</p>
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              placeholder="Miqdorni kiriting"
            />
          </div>

          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Minimal qoldiq</p>
            <input
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              type="number"
              placeholder="0"
            />
          </div>
        </div>

        {/* Срок годности */}
        <div className={styles.input__wrapper}>
          <p className={styles.label__input}>Yaroqlilik muddati</p>
          <input
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            type="date"
          />
        </div>

        {/* Вес и объём */}
        <div className={styles.sizes__wrapper}>
          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Og'irligi (kg)</p>
            <input
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              type="number"
              step="0.001"
              placeholder="0.000"
            />
          </div>

          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Hajmi (litr)</p>
            <input
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              type="number"
              step="0.001"
              placeholder="0.000"
            />
          </div>
        </div>

        {/* Учёт остатков */}
        <div className={styles.switch__wrapper}>
          <label className={styles.switch__label}>
            <input
              type="checkbox"
              checked={trackInventory}
              onChange={(e) => setTrackInventory(e.target.checked)}
              className={styles.switch__input}
            />
            <span className={styles.switch__slider}></span>
            <span className={styles.switch__text}>Qoldiqni kuzatish</span>
          </label>
        </div>

        {error && <p className={styles.validation__error}>{error}</p>}
      </CreateModal>

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Yangi mahsulot yaratildi."
        onOpen={createProduct.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description={error || "Mahsulot yaratilmadi."}
        onOpen={createProduct.isError}
      />
    </>
  );
};

export default CreateProduct;
