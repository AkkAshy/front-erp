import { useState, type FC } from "react";
import CreateModal from "../CreateModal";
import SelectCategory from "../SelectCategory";
import SelectUnit from "../SelectUnit";
import { useCreateProduct } from "@/entities/product/model/useCreateProduct";
import { useAttributes } from "@/entities/product/model/useAttributes";
import { productApi } from "@/entities/product/api/productApi";
import Notification from "../Notification";
import styles from "./CreateProduct.module.scss";

type Props = {
  isOpenCreate: boolean;
  setIsOpenCreate: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateProduct: FC<Props> = ({ isOpenCreate, setIsOpenCreate }) => {
  // Основная информация
  const [productName, setProductName] = useState("");
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

  // Динамические атрибуты (варианты товара)
  type Variant = {
    id: string;
    attributes: { [attributeId: number]: number }; // attribute_id: value_id
    quantity: string;
    priceOverride: string; // Переопределенная цена продажи варианта (опционально, отличается от родителя)
    selectedAttributeId: number | null; // ID выбранного атрибута для добавления
  };
  const [variants, setVariants] = useState<Variant[]>([]);

  // UI
  const [isCategoryDropdown, setIsCategoryDropdown] = useState(false);
  const [isUnitDropdown, setIsUnitDropdown] = useState(false);
  const [error, setError] = useState("");

  const createProduct = useCreateProduct();
  const attributes = useAttributes();

  // Блокировка изменения значений при прокрутке колесиком мыши
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  function clearData() {
    setProductName("");
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
    setVariants([]);
    setError("");
  }

  // Функции для работы с вариантами

  // Вычисляем оставшееся количество
  function getRemainingQuantity(): number {
    const totalQuantity = Number(quantity) || 0;
    const usedQuantity = variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
    return Math.max(0, totalQuantity - usedQuantity);
  }

  function addVariant() {
    const remainingQty = getRemainingQuantity();

    const newVariant: Variant = {
      id: Date.now().toString(),
      attributes: {},
      quantity: remainingQty > 0 ? String(remainingQty) : "", // Автоматически заполняем оставшееся количество
      priceOverride: "", // Пустое по умолчанию (будет использоваться цена родителя)
      selectedAttributeId: null,
    };
    setVariants([...variants, newVariant]);
  }

  function updateVariantSelectedAttribute(variantId: string, attributeId: number | null) {
    setVariants(
      variants.map((v) =>
        v.id === variantId ? { ...v, selectedAttributeId: attributeId } : v
      )
    );
  }

  function removeVariant(variantId: string) {
    setVariants(variants.filter((v) => v.id !== variantId));
  }

  function updateVariantField(
    variantId: string,
    field: "quantity" | "priceOverride",
    value: string
  ) {
    // Валидация для количества
    if (field === "quantity") {
      const newQuantity = Number(value) || 0;
      const totalQuantity = Number(quantity) || 0;

      // Считаем сколько уже использовано (без текущего варианта)
      const usedByOthers = variants
        .filter(v => v.id !== variantId)
        .reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);

      const available = totalQuantity - usedByOthers;

      // Если пытается ввести больше доступного - ограничиваем
      if (newQuantity > available) {
        setError(`Maksimum mavjud: ${available}. Umumiy miqdor: ${totalQuantity}`);
        // Устанавливаем максимально доступное значение
        value = String(available);

        // Очищаем ошибку через 3 секунды
        setTimeout(() => setError(""), 3000);
      } else {
        // Очищаем ошибку если значение корректное
        if (error.includes("Maksimum mavjud")) {
          setError("");
        }
      }
    }

    setVariants(
      variants.map((v) => (v.id === variantId ? { ...v, [field]: value } : v))
    );
  }

  function removeVariantAttribute(variantId: string, attributeId: number) {
    setVariants(
      variants.map((v) => {
        if (v.id === variantId) {
          const newAttributes = { ...v.attributes };
          delete newAttributes[attributeId];
          return { ...v, attributes: newAttributes };
        }
        return v;
      })
    );
  }

  async function handleCreate() {
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

    // Если есть варианты - проверяем их
    if (variants.length > 0) {
      // Проверяем что у всех вариантов заполнено количество
      const hasVariantWithoutQuantity = variants.some(v => !v.quantity);

      if (hasVariantWithoutQuantity) {
        setError("Barcha variantlar uchun miqdorni kiriting");
        return;
      }

      // Проверяем что сумма количеств вариантов не превышает общее количество
      const totalQuantity = Number(quantity) || 0;
      const usedQuantity = variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);

      if (usedQuantity > totalQuantity) {
        setError(`Variantlar miqdori jami miqdordan oshib ketdi: ${usedQuantity} > ${totalQuantity}`);
        return;
      }

      if (usedQuantity < totalQuantity) {
        setError(`Barcha miqdor tarqatilmagan: ${usedQuantity} / ${totalQuantity}. Qolgan: ${totalQuantity - usedQuantity}`);
        return;
      }

      // Проверяем основные цены (они используются для всех вариантов)
      if (!costPrice || costPrice === "0") {
        setError("Kelish narxini kiriting");
        return;
      }

      if (!salePrice || salePrice === "0") {
        setError("Sotish narxini kiriting");
        return;
      }

      // Проверка каждого варианта
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];

        if (Object.keys(variant.attributes).length === 0) {
          setError(`Variant #${i + 1}: Atributlarni tanlang`);
          return;
        }

        // Варианты используют цены из основной формы
        const costPriceNum = +costPrice.replace(/\./g, "");
        const salePriceNum = +salePrice.replace(/\./g, "");

        if (salePriceNum <= costPriceNum) {
          setError(`Variant #${i + 1}: Sotish narxi kelish narxidan yuqori bo'lishi kerak`);
          return;
        }
      }
    } else {
      // Если нет вариантов - проверяем основные поля
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
    }

    try {
      console.log("=== НАЧАЛО СОЗДАНИЯ ТОВАРА ===");

      // Шаг 1: Создаем основной товар
      const productData: any = {
        name: productName,
        category: categoryId,
        unit: unitId,
      };

      // Опциональные поля
      if (weight) productData.weight = Number(weight);
      if (volume) productData.volume = Number(volume);

      // Добавляем цены и количество (обязательные поля для API)
      const costPriceNum = +(costPrice || "0").replace(/\./g, "");
      const salePriceNum = +(salePrice || "0").replace(/\./g, "");

      productData.cost_price = costPriceNum;
      productData.sale_price = salePriceNum;

      // Если есть варианты - основной товар не имеет количества (оно только у вариантов)
      if (variants.length > 0) {
        productData.initial_quantity = 0;
      } else {
        productData.initial_quantity = Number(quantity) || 0;
      }

      productData.min_quantity = Number(minQuantity) || 0;
      productData.track_inventory = trackInventory;

      if (wholesalePrice) productData.wholesale_price = +wholesalePrice.replace(/\./g, "");
      if (expiryDate) productData.expiry_date = expiryDate;

      console.log("📦 Шаг 1: Данные основного товара:", JSON.stringify(productData, null, 2));
      if (variants.length > 0) {
        console.log("ℹ️ У товара есть варианты, поэтому initial_quantity = 0. Количество будет у вариантов.");
      }

      const productResponse = await createProduct.mutateAsync(productData);

      console.log("✅ Товар создан! Response:", JSON.stringify(productResponse.data, null, 2));

      if (productResponse.status !== 201) {
        throw new Error("Mahsulot yaratilmadi");
      }

      const createdProductId = productResponse.data.id;

      // Шаг 2: Если есть варианты - создаем каждый вариант
      if (variants.length > 0) {
        console.log(`\n📋 Шаг 2: Создание ${variants.length} вариант(ов)`);

        for (let variantIndex = 0; variantIndex < variants.length; variantIndex++) {
          const variant = variants[variantIndex];
          console.log(`\n🔹 Вариант #${variantIndex + 1}`);

          // Варианты всегда используют цены из основной формы
          const variantQuantity = variant.quantity || quantity;

          const costPriceNum = +costPrice.replace(/\./g, "");
          const salePriceNum = +salePrice.replace(/\./g, "");

          // Создаем вариант
          const variantData: any = {
            product: createdProductId,
            attributes: Object.entries(variant.attributes).map(([attributeId, valueId]) => ({
              attribute: Number(attributeId),
              value: valueId,
            })),
          };

          // Добавляем price_override только если он указан
          if (variant.priceOverride && variant.priceOverride !== "0") {
            const priceOverrideNum = +variant.priceOverride.replace(/\./g, "");
            variantData.price_override = priceOverrideNum;
            console.log(`   💰 Цена продажи варианта: ${priceOverrideNum} uzs`);
          } else {
            console.log(`   💰 Вариант использует цену родительского товара: ${salePriceNum} uzs`);
          }

          console.log("   📤 Данные варианта:", JSON.stringify(variantData, null, 2));
          const variantResponse = await productApi.createVariant(variantData);
          console.log("   ✅ Вариант создан:", JSON.stringify(variantResponse.data, null, 2));

          if (variantResponse.status !== 200 && variantResponse.status !== 201) {
            throw new Error("Variant yaratilmadi");
          }

          const createdVariant = variantResponse.data;

          // Создаем партию для варианта
          // purchase_price (себестоимость) - берем из основной формы
          // selling_price - если есть price_override варианта, иначе из основной формы
          const finalSellingPrice = variant.priceOverride && variant.priceOverride !== "0"
            ? +variant.priceOverride.replace(/\./g, "")
            : salePriceNum;

          const batchData = {
            product: createdProductId,
            variant: createdVariant.id,
            batch_number: `BATCH-${Date.now()}`,
            quantity: Number(variantQuantity),
            purchase_price: costPriceNum,  // Всегда из основной формы
            selling_price: finalSellingPrice,  // price_override варианта или из основной формы
          };

          console.log("   📦 Данные партии:", JSON.stringify(batchData, null, 2));
          const batchResponse = await productApi.addBatch(batchData);
          console.log("   ✅ Партия создана:", JSON.stringify(batchResponse.data, null, 2));
        }

        console.log("\n✅ Все варианты и партии успешно созданы!");
      }

      // Успех!
      setIsOpenCreate(false);
      clearData();
    } catch (err: any) {
      console.error("Error creating product:", err);
      setError(err.response?.data?.detail || err.message || "Mahsulot yaratilmadi");
    }
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
        btnHeight={48}
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
        </div>

        {/* Количество */}
        <div className={styles.input__wrapper}>
          <p className={styles.label__input}>Boshlang'ich miqdor *</p>
          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            placeholder="Miqdorni kiriting"
            onWheel={handleWheel}
          />
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

        {/* Динамические атрибуты (варианты) */}
        <div style={{ marginTop: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Variantlar (Atributlar)</h3>
              {variants.length > 0 && Number(quantity) > 0 && (
                <div style={{
                  padding: '6px 12px',
                  background: '#dcfce7',
                  color: '#16a34a',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500
                }}>
                  {getRemainingQuantity() === 0
                    ? '✓ Barcha miqdor tarqatilgan'
                    : `✓ Qolgan: ${getRemainingQuantity()} / ${quantity}`
                  }
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={addVariant}
              disabled={!quantity || Number(quantity) === 0}
              style={{
                padding: '8px 16px',
                background: (!quantity || Number(quantity) === 0) ? '#cbd5e1' : '#8E51FF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: (!quantity || Number(quantity) === 0) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}
              title={(!quantity || Number(quantity) === 0) ? 'Avval umumiy miqdorni kiriting' : ''}
            >
              + Variant qo'shish
            </button>
          </div>

          {variants.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: '#999', background: '#f8fafc', borderRadius: '8px' }}>
              Hozircha variantlar yo'q. "Variant qo'shish" tugmasini bosing.
            </div>
          )}

          {variants.map((variant, index) => (
            <div
              key={variant.id}
              style={{
                marginBottom: '16px',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Variant #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeVariant(variant.id)}
                  style={{
                    padding: '6px 12px',
                    background: '#ff4d4f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  O'chirish
                </button>
              </div>

              {/* Атрибуты */}
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Atribut qo'shish:</p>
                {attributes.isLoading ? (
                  <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                    Atributlar yuklanmoqda...
                  </div>
                ) : !Array.isArray(attributes.data?.results) || attributes.data?.results?.length === 0 ? (
                  <div style={{ padding: '12px', background: '#fff7e6', borderRadius: '8px', color: '#ff9800', fontSize: '13px' }}>
                    ⚠️ Atributlar topilmadi. Avval Sozlamalar → Atributlar bo'limidan atributlar yarating.
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                    {/* Выбор атрибута */}
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>
                        Atributni tanlang:
                      </label>
                      <select
                        value={variant.selectedAttributeId || ''}
                        onChange={(e) => {
                          const attrId = e.target.value ? Number(e.target.value) : null;
                          updateVariantSelectedAttribute(variant.id, attrId);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Atributni tanlang...</option>
                        {attributes.data?.results
                          ?.filter((attr) => !variant.attributes[attr.id]) // Скрываем уже добавленные атрибуты
                          ?.map((attr) => (
                            <option key={attr.id} value={attr.id}>
                              {attr.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Выбор значения атрибута */}
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' }}>
                        Qiymatni tanlang:
                      </label>
                      <select
                        disabled={!variant.selectedAttributeId}
                        value=""
                        onChange={(e) => {
                          const valueId = Number(e.target.value);
                          if (valueId && variant.selectedAttributeId) {
                            // Объединяем обновление атрибута и сброс selectedAttributeId в одно действие
                            setVariants(
                              variants.map((v) =>
                                v.id === variant.id
                                  ? {
                                      ...v,
                                      attributes: { ...v.attributes, [variant.selectedAttributeId!]: valueId },
                                      selectedAttributeId: null, // Сбрасываем после добавления
                                    }
                                  : v
                              )
                            );
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          background: !variant.selectedAttributeId ? '#f5f5f5' : 'white',
                          cursor: !variant.selectedAttributeId ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <option value="">Qiymatni tanlang...</option>
                        {variant.selectedAttributeId &&
                          attributes.data?.results
                            ?.find((attr) => attr.id === variant.selectedAttributeId)
                            ?.values?.map((val) => (
                              <option key={val.id} value={val.id}>
                                {val.value}
                              </option>
                            ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Количество и переопределенная цена */}
              <div className={styles.price__wrapper}>
                <div className={styles.input__wrapper}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <p className={styles.label__input} style={{ margin: 0 }}>Miqdor *</p>
                    {Number(quantity) > 0 && getRemainingQuantity() === 0 && (
                      <span style={{
                        fontSize: '12px',
                        color: '#16a34a',
                        fontWeight: 500
                      }}>
                        ✓ Barcha miqdor tarqatilgan
                      </span>
                    )}
                    {Number(quantity) > 0 && getRemainingQuantity() > 0 && (
                      <span style={{
                        fontSize: '12px',
                        color: '#16a34a',
                        fontWeight: 500
                      }}>
                        ✓ Qoldi: {getRemainingQuantity()}
                      </span>
                    )}
                  </div>
                  <input
                    value={variant.quantity}
                    onChange={(e) => updateVariantField(variant.id, "quantity", e.target.value)}
                    type="number"
                    placeholder="0"
                    min="0"
                    max={(() => {
                      const usedByOthers = variants
                        .filter(v => v.id !== variant.id)
                        .reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
                      return Number(quantity) - usedByOthers;
                    })()}
                    onWheel={handleWheel}
                    style={{
                      borderColor: (() => {
                        const variantQty = Number(variant.quantity) || 0;
                        const usedByOthers = variants
                          .filter(v => v.id !== variant.id)
                          .reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
                        const available = Number(quantity) - usedByOthers;

                        if (variantQty > available) return '#ef4444'; // Red - exceeds available
                        if (variantQty > 0 && variantQty <= available) return '#16a34a'; // Green - valid quantity
                        return undefined; // Default - empty or 0
                      })()
                    }}
                  />
                </div>
                <div className={styles.input__wrapper}>
                  <p className={styles.label__input}>Alohida sotish narxi (ixtiyoriy)</p>
                  <input
                    value={variant.priceOverride}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      const formattedValue = numericValue
                        ? Number(numericValue).toLocaleString("de-DE")
                        : "";
                      updateVariantField(variant.id, "priceOverride", formattedValue);
                    }}
                    type="text"
                    placeholder="Bo'sh = asosiy mahsulot narxi"
                    style={{
                      borderColor: variant.priceOverride ? '#8E51FF' : '#e2e8f0',
                      background: variant.priceOverride ? '#f0f0ff' : 'white'
                    }}
                  />
                </div>
              </div>

              {/* Отображение выбранных атрибутов */}
              <div style={{ marginTop: '12px', padding: '12px', background: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#666', margin: '0 0 8px 0' }}>Tanlangan atributlar:</p>
                {Object.entries(variant.attributes).length === 0 ? (
                  <div style={{ fontSize: '13px', color: '#999', fontStyle: 'italic' }}>
                    Hozircha atributlar tanlanmagan
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {Object.entries(variant.attributes).map(([attrId, valueId]) => {
                      const attr = Array.isArray(attributes.data?.results)
                        ? attributes.data?.results?.find((a) => a.id === Number(attrId))
                        : null;
                      const value = attr?.values?.find((v) => v.id === valueId);
                      return (
                        <div
                          key={attrId}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 10px',
                            background: '#f0f0ff',
                            borderRadius: '6px',
                            fontSize: '13px',
                            color: '#8E51FF',
                            fontWeight: 500
                          }}
                        >
                          <span>
                            {attr?.name}: {value?.value || valueId}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeVariantAttribute(variant.id, Number(attrId))}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ff4d4f',
                              cursor: 'pointer',
                              padding: '0 4px',
                              fontSize: '16px',
                              lineHeight: 1,
                              fontWeight: 'bold'
                            }}
                            title="O'chirish"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
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
