import { useEffect, useState, type FC } from "react";
import CreateModal from "../CreateModal";
import SelectCategory from "../SelectCategory";
import SelectUnit from "../SelectUnit";
import type { SizeItem } from "@/entities/product/api/types";
import { useUpdateProduct } from "@/entities/product/model/useUpdateProduct";
import { useProducts } from "@/entities/product/model/useProducts";

//scss
import styles from "./UpdateProduct.module.scss";
import Notification from "../Notification";
import { useUpdateBatch } from "@/entities/product/model/useUpdateBatch";
import { notifications } from "@/shared/config/notifications";

type Props = {
  updateId: number;
  isOpenUpdate: boolean;
  setIsOpenUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateProduct: FC<Props> = ({
  isOpenUpdate,
  setIsOpenUpdate,
  updateId,
}) => {
  const [isCategoryDropdown, setIsCategoryDropdown] = useState(false);
  const [isUnitDropdown, setIsUnitDropdown] = useState(false);

  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState<number | string>("");
  const [unitId, setUnitId] = useState<number | string>("");
  const [selectedSizes, setSelectedSizes] = useState<SizeItem[]>([]);
  const [quantity, setQuantity] = useState("");

  const [purchasePrice, setPurchasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");

  const updateProduct = useUpdateProduct();
  const updateBatch = useUpdateBatch();
  const productsData = useProducts();

  useEffect(() => {
    const product = productsData?.data?.data.results?.find(
      (item) => item.id === updateId
    );

    if (product) {
      setProductName(product.name);
      setCategoryId(product.category);
      setUnitId(product.unit.id);

      if (product.size) {
        // This is a clothing item with size
        setSelectedSizes([
          {
            id: product.id,
            size: product.size.size,
            quantity: product.batches[0]?.quantity ?? 0,
          },
        ]);
        setQuantity("");
      } else {
        // This is a non-clothing item
        setSelectedSizes([]);
        setQuantity(String(product.batches[0]?.quantity ?? ""));
      }

      setPurchasePrice(
        product.batches[0]?.purchase_price
          ? (+product.batches[0].purchase_price).toLocaleString("de-DE")
          : "0"
      );
      setSalePrice((+product.sale_price).toLocaleString("de-DE"));
    }
  }, [productsData.data?.data.results, updateId]);

  return (
    <>
      <CreateModal
        isOpen={isOpenUpdate}
        onClose={() => {
          setIsOpenUpdate(false);
          setIsCategoryDropdown(false);
          setIsUnitDropdown(false);
        }}
        headTitle="Tovarni tahrirlash"
        btnTitle="Saqlash"
        btnClose={true}
        width={964}
        // height={693}
        height={"850px"}
        // overflowY={isCategoryDropdown || isOpenSizes ? "hidden" : "scroll"}
        overflowY="scroll"
        btnWidth={"100%"}
        btnHeight={64}
        btnPosition={selectedSizes?.length < 2 ? "absolute" : "static"}
        onClick={() => {
          setIsCategoryDropdown(false);
          setIsUnitDropdown(false);
        }}
        btnOnClick={() => {
          // Update batch only if we have batches data
          const product = productsData?.data?.data.results?.find(
            (item) => item.id === updateId
          );

          if (product?.batches?.[0]) {
            updateBatch.mutateAsync({
              id: product.batches[0].id,
              quantity: selectedSizes.length > 0
                ? +selectedSizes[0].quantity
                : +quantity,
              purchase_price: +purchasePrice.replace(/\./g, ""),
              supplier: product.batches[0].supplier || "",
            });
          }

          updateProduct
            .mutateAsync({
              id: updateId,
              name: productName,
              category: categoryId,
              sale_price: +salePrice.replace(/\./g, ""),
              unit: unitId,
            })
            .then((res) => {
              if (res.status === 200) {
                setIsOpenUpdate(false);
              }
              console.log("res", res);
            })
            .catch((err) => console.log("error", err));
        }}
      >
        <input
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          type="text"
          placeholder="Tovar nomi"
        />

        {selectedSizes.length > 0 ? (
          // Clothing item with size
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
        ) : (
          // Non-clothing item with simple quantity
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
      </CreateModal>

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description={notifications.product.updateSuccess}
        onOpen={updateProduct.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description={"Mahsulot yangilanmadi"}
        onOpen={updateProduct.isError}
      />
    </>
  );
};

export default UpdateProduct;
