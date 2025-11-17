import { useState, useMemo, useEffect, useRef, type FC } from "react";
import SelectSizes from "@/shared/ui/SelectSizes";
import CreateModal from "../CreateModal";
import SelectCategory from "../SelectCategory";
import SelectUnit from "../SelectUnit";
import SelectAttributeType from "@/shared/ui/SelectAttributeType";
import SelectAttributes from "@/shared/ui/SelectAttributes";
import type { SizeItem } from "@/entities/product/api/types";
import type { AttributeValue } from "@/entities/attribute/api/types";
import { useCreateProduct } from "@/entities/product/model/useCreateProduct";
import { useCategories } from "@/entities/category/model/useCategories";

//scss
import styles from "./CreateProduct.module.scss";
import Notification from "../Notification";

type AttributeValueWithSelection = AttributeValue & {
  selected?: boolean;
};

type Props = {
  isOpenCreate: boolean;
  setIsOpenCreate: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateProduct: FC<Props> = ({ isOpenCreate, setIsOpenCreate }) => {
  const [isOpenSizes, setIsOpenSizes] = useState(false);
  const [isCategoryDropdown, setIsCategoryDropdown] = useState(false);
  const [isUnitDropdown, setIsUnitDropdown] = useState(false);
  const [isAttributeTypeDropdown, setIsAttributeTypeDropdown] = useState(false);
  const [isOpenAttributes, setIsOpenAttributes] = useState(false);
  const [categoryId, setCategoryId] = useState<number | string>("");
  const [unitId, setUnitId] = useState<number | string>("");
  const [attributeTypeId, setAttributeTypeId] = useState<number | string>("");

  const [productName, setProductName] = useState("");
  const [isClothing, setIsClothing] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<SizeItem[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<AttributeValueWithSelection[]>([]);
  const [quantity, setQuantity] = useState("");

  const [purchasePrice, setPurchasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [newError, setNewError] = useState("");
  const createProduct = useCreateProduct();
  const { data: categoriesData } = useCategories();

  // Ref для отслеживания предыдущей категории
  const prevCategoryIdRef = useRef<number | string>("");

  // Фильтруем типы атрибутов по выбранной категории
  const availableAttributeTypeIds = useMemo(() => {
    if (!categoryId || !categoriesData?.data?.results) return [];
    const selectedCategory = categoriesData.data.results.find(
      (cat) => cat.id === categoryId
    );
    // Используем attribute_types_detail для получения ID
    return selectedCategory?.attribute_types_detail?.map(attr => attr.id) || [];
  }, [categoryId, categoriesData]);

  // Сброс атрибутов только при реальном изменении категории
  useEffect(() => {
    if (categoryId && categoryId !== prevCategoryIdRef.current) {
      setAttributeTypeId("");
      setSelectedAttributes([]);
      prevCategoryIdRef.current = categoryId;
    }
  }, [categoryId]);

  function clearData() {
    setProductName("");
    setIsClothing(false);
    setSelectedSizes([]);
    setSelectedAttributes([]);
    setQuantity("");
    setPurchasePrice("");
    setSalePrice("");
    setCategoryId("");
    setUnitId("");
    setAttributeTypeId("");
    prevCategoryIdRef.current = ""; // Сбрасываем ref
  }

  function handleCreate() {
    if (!productName?.trim()) {
      setNewError("Mahsulot nomini kiriting");
      return;
    }

    if (!categoryId) {
      setNewError("Kategoriyani tanlang");
      return;
    }

    if (!unitId) {
      setNewError("O'lchov birligini tanlang");
      return;
    }

    if (isClothing) {
      if (selectedSizes.length === 0) {
        setNewError("Kamida bitta razmer tanlang");
        return;
      }

      selectedSizes.forEach((item) => {
        if (!item.quantity || Number(item.quantity) <= 0) {
          setNewError("Miqdor kiriting");
          return;
        }
      });
    } else {
      if (!quantity || Number(quantity) <= 0) {
        setNewError("Miqdorni kiriting");
        return;
      }
    }

    if (!purchasePrice || purchasePrice === "0") {
      setNewError("Sof summasini kiriting");
      return;
    }

    if (!salePrice || salePrice === "0") {
      setNewError("Tovar summasini kiriting");
      return;
    }

    const purchasePriceNum = +purchasePrice.replace(/\./g, "");
    const salePriceNum = +salePrice.replace(/\./g, "");

    if (purchasePriceNum && salePriceNum && salePriceNum <= purchasePriceNum) {
      setNewError("Sotish narxi xarid narxidan yuqori bo'lishi kerak");
      return;
    }
    createProduct
      .mutateAsync({
        name: productName,
        category: categoryId,
        sale_price: +salePrice.replace(/\./g, ""),
        unit: unitId,
        attribute_value_ids: selectedAttributes.length > 0
          ? selectedAttributes.map((attr) => attr.id)
          : undefined,
        batch_info: isClothing
          ? selectedSizes.map((item) => ({
              size_id: item.id,
              quantity: +item.quantity,
              purchase_price: +purchasePrice.replace(/\./g, ""),
              supplier: null,
            }))
          : [{
              size_id: null,
              quantity: +quantity,
              purchase_price: +purchasePrice.replace(/\./g, ""),
              supplier: null,
            }],
      })
      .then((res) => {
        if (res.status === 201) {
          setIsOpenCreate(false);
          clearData();
        }
      })
      .catch((err) => console.log("error", err));
  }


  return (
    <>
      <CreateModal
        isOpen={isOpenCreate}
        onClose={() => {
          setIsOpenCreate(false);
          setIsOpenSizes(false);
          setIsCategoryDropdown(false);
          setIsUnitDropdown(false);
          setIsAttributeTypeDropdown(false);
          setIsOpenAttributes(false);
        }}
        headTitle="Yangi tovar yaratish"
        btnTitle="Yaratish"
        btnClose={true}
        width={964}
        height={850}
        overflowY="scroll"
        btnWidth={"100%"}
        btnHeight={64}
        btnPosition={selectedSizes?.length < 2 && selectedAttributes?.length === 0 ? "absolute" : "static"}
        onClick={() => {
          setIsOpenSizes(false);
          setIsCategoryDropdown(false);
          setIsUnitDropdown(false);
          setIsAttributeTypeDropdown(false);
          setIsOpenAttributes(false);
        }}
        btnOnClick={handleCreate}
      >
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          type="text"
          placeholder="Tovar nomi"
        />

        <div className={styles.switch__wrapper}>
          <label className={styles.switch__label}>
            <input
              type="checkbox"
              checked={isClothing}
              onChange={(e) => {
                setIsClothing(e.target.checked);
                if (!e.target.checked) {
                  setSelectedSizes([]);
                } else {
                  setQuantity("");
                }
              }}
              className={styles.switch__input}
            />
            <span className={styles.switch__slider}></span>
            <span className={styles.switch__text}>Bu kiyim</span>
          </label>
        </div>

        {isClothing ? (
          <>
            <p className={styles.label__input}>Razmerlar</p>
            <SelectSizes
              selectedSizes={selectedSizes}
              setSelectedSizes={setSelectedSizes}
              isOpenSizes={isOpenSizes}
              setIsOpenSizes={setIsOpenSizes}
              setIsCategoryDropdown={setIsCategoryDropdown}
            />

            <div className={styles.sizes__wrapper}>
              {selectedSizes.map((item, index) => (
                <div className={styles.input__wrapper} key={index}>
                  <p className={styles.label__input}>"{item.size}" Tovar soni</p>
                  <input
                    value={item.quantity ?? ""}
                    onChange={(e) =>
                      setSelectedSizes((prev) =>
                        prev.map((item, i) =>
                          i === index ? { ...item, quantity: e.target.value } : item
                        )
                      )
                    }
                    type="number"
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Miqdor</p>
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              placeholder="Miqdorni kiriting"
            />
          </div>
        )}

        <div className={styles.sizes__wrapper}>

          <div className={styles.category__wrapper}>
            <p className={styles.label__input}>Tovar kategoriyasi</p>
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
            <p className={styles.label__input}>O'lchov birligi</p>
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

        {/* Атрибуты */}
        {categoryId && (
          <div className={styles.sizes__wrapper}>
            {availableAttributeTypeIds.length > 0 ? (
              <>
                <div className={styles.category__wrapper}>
                  <p className={styles.label__input}>Атрибут тури (масалан, Ранг)</p>
                  <SelectAttributeType
                    width={"100%"}
                    bgColor={"#fff"}
                    top={0}
                    attributeTypeId={attributeTypeId}
                    setAttributeTypeId={setAttributeTypeId}
                    isAttributeTypeDropdown={isAttributeTypeDropdown}
                    setIsAttributeTypeDropdown={setIsAttributeTypeDropdown}
                    label="Атрибут турини танланг"
                    availableIds={availableAttributeTypeIds}
                  />
                </div>

                {attributeTypeId && (
                  <div className={styles.category__wrapper}>
                    <p className={styles.label__input}>Атрибут қийматлари</p>
                    <SelectAttributes
                      isOpenAttributes={isOpenAttributes}
                      setIsOpenAttributes={setIsOpenAttributes}
                      setIsCategoryDropdown={setIsCategoryDropdown}
                      selectedAttributes={selectedAttributes}
                      setSelectedAttributes={setSelectedAttributes}
                      attributeTypeId={Number(attributeTypeId)}
                      label="Қийматларни танланг"
                    />
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "8px" }}>
                Bu kategoriya учун атрибутлар созланмаган. Settings → Category да созланг.
              </p>
            )}
          </div>
        )}

        <div className={styles.price__wrapper}>
          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Tovar sof summasi</p>
            <input
              value={purchasePrice}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                const formattedValue = numericValue
                  ? Number(numericValue).toLocaleString("de-DE")
                  : "";
                setPurchasePrice(formattedValue);
              }}
              type="text"
              placeholder="uzs"
            />
          </div>

          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Tovar summasi</p>
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
              placeholder="uzs"
            />
          </div>
        </div>
        <p className={styles.validation__error}>{newError}</p>
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
        description={"Mahsulot yaratilmadi."}
        onOpen={createProduct.isError}
      />
    </>
  );
};

export default CreateProduct;
