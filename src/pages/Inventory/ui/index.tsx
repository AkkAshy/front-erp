import { useCallback, useEffect, useState } from "react";

import { DeleteIcon, EditIcon, MoreIcon, ScanIcon } from "@/shared/ui/icons";
import Table from "@/shared/ui/Table";
import Search from "@/shared/ui/Search";
import PageTitle from "@/shared/ui/PageTitle";
import CreateModal from "@/shared/ui/CreateModal";
import DashedButton from "@/shared/ui/DashedButton";
import SelectCategory from "@/shared/ui/SelectCategory";
import SelectSeller from "@/shared/ui/SelectSeller";
import CreateProduct from "@/shared/ui/CreateProduct";
import UpdateProduct from "@/shared/ui/UpdateProduct";
import TablePagination from "@/shared/ui/Pagination";

import DeleteConfirmModal from "@/features/DeleteConfirmModal/ui";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { useFilteredProducts } from "@/entities/product/model/useFilteredProducts";
import { useDeleteProduct } from "@/entities/product/model/useDeleteProduct";
import { usePagination } from "@/shared/lib/hooks/usePagination";
import { useBarcodeScanner } from "@/shared/lib/hooks/useBarcodeScanner";
import { useScanBarcode } from "@/entities/product/model/useScanBarcode";
import { useAvailableSizes } from "@/entities/product/model/useAvailableSizes";

//scss
import styles from "./Inventory.module.scss";
import Notification from "@/shared/ui/Notification";
import { useLowStockProducts } from "@/entities/product/model/useLowStockProducts";

const headCols = [
  "#",
  "Tovar nomi",
  "Artikul (SKU)",
  "Kategoriya",
  "O'lchov birligi",
  "Tovar soni",
  "Narx",
  "Marja",
  "",
  "",
];

const Inventory = () => {
  const [isOpenScaner, setIsOpenScaner] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isCategoryDropdown, setIsCategoryDropdown] = useState(false);
  const [isOpenSellers, setIsOpenSellers] = useState(false);
  const [isOpenProductInfo, setIsOpenProductInfo] = useState(false);

  const [scannedCode, setScannedCode] = useState<string>("");
  const scanBarcode = useScanBarcode(scannedCode);
  const availableSizes = useAvailableSizes({
    name: scanBarcode.data?.data?.name?.split(" ")[0] || "",
  });

  const [userId, setUserId] = useState<number | string>("");
  const [categoryId, setCategoryId] = useState<number | string>("");
  const [updateId, setUpdateId] = useState<number>(0);
  const [deleteId, setDeleteId] = useState<number>(0);

  const [search, setSearch] = useState("");

  const { page, setPage, limit, offset } = usePagination(1, 7);

  const filteredProducts = useFilteredProducts({
    search,
    created_by: userId,
    category: categoryId,
    offset,
    limit,
  });

  const deleteProduct = useDeleteProduct();
  const lowStock = useLowStockProducts(10);

  const handleScan = useCallback((code: string) => {
    setScannedCode(code);
  }, []);

  useBarcodeScanner({ onScan: handleScan, enabled: isOpenScaner });

  useEffect(() => {
    if ((availableSizes.data?.data?.by_size?.length ?? 0) >= 1) {
      setIsOpenProductInfo(true);
      setIsOpenScaner(false);
    }
  }, [availableSizes.data?.data?.by_size?.length]);

  console.log(lowStock.data?.data);

  return (
    <div
      className={styles.inventory}
      onClick={() => {
        setIsCategoryDropdown(false);
        setIsOpenSellers(false);
      }}
    >
      <PageTitle>Ombor</PageTitle>
      <div className={styles.action__btns}>
        <DashedButton onClick={() => setIsOpenCreate(true)}>
          + Yangi tovar yaratish
        </DashedButton>
        <DashedButton
          gap={12}
          onClick={() => {
            setScannedCode("");
            setIsOpenScaner(true);
          }}
        >
          <ScanIcon width={48} height={48} /> Skanerlash
        </DashedButton>
      </div>
      <div className={styles.filter__wrapper}>
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ism bo'yicha kiyim qidirish"
        />
        <SelectCategory
          isCategoryDropdown={isCategoryDropdown}
          setIsCategoryDropdown={setIsCategoryDropdown}
          width={360}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
        />
        <SelectSeller
          setIsOpenSellers={setIsOpenSellers}
          isOpenSellers={isOpenSellers}
          userId={userId}
          setUserId={setUserId}
        />
      </div>

      <CreateProduct
        isOpenCreate={isOpenCreate}
        setIsOpenCreate={setIsOpenCreate}
      />

      <UpdateProduct
        updateId={updateId}
        isOpenUpdate={isOpenUpdate}
        setIsOpenUpdate={setIsOpenUpdate}
      />

      <CreateModal
        isOpen={isOpenScaner}
        onClose={() => {
          setScannedCode("");
          setIsOpenScaner(false);
        }}
        width={560}
        height={560}
        mt={0}
        children={
          <DotLottieReact
            src="https://lottie.host/5e8ea07a-ec31-45c6-a88a-293ad0abef38/mYJy3cYs87.lottie"
            loop
            autoplay
            width={"100%"}
            height={"100%"}
          />
        }
      />

      <Table
        headCols={headCols}
        bodyCols={filteredProducts.data?.data?.results.map((item, index) => {
          // В реальном API количество в корне объекта, не в inventory
          const quantity = item.quantity || item.inventory?.quantity || item.current_stock || "0";
          // Маржа тоже в корне объекта
          const margin = item.margin || item.pricing?.margin || "0";

          return {
            id: item.id,
            index: index + 1 + offset,
            name: item.name,
            sku: item.sku || "-",
            category_name: item.category_name,
            unit: item.unit_name || item.unit_short || item.unit_info?.short_name || "-",
            current_stock:
              Number(quantity) <= 1 ? (
                <p style={{ color: "red" }}>{parseFloat(String(quantity)).toFixed(0)}</p>
              ) : (
                parseFloat(String(quantity)).toFixed(0)
              ),
            sale_price: (+item.sale_price).toLocaleString("de-DE") + " uzs",
            margin: margin ? `${(+margin).toFixed(1)}%` : "-",
            content_1: (
              <div
                onClick={() => {
                  setUpdateId(item.id);
                  setIsOpenUpdate(true);
                }}
              >
                <EditIcon />
              </div>
            ),
            content_2: (
              <div
                onClick={() => {
                  setDeleteId(item.id);
                  setIsDeleteModal(true);
                }}
              >
                <DeleteIcon />
              </div>
            ),
          };
        })}
        headCell={{
          1: {
            className: styles.cell__hash,
          },
          10: {
            className: styles.thead__more,
            content: <MoreIcon />,
          },
        }}
        bodyCell={{
          1: {
            className: styles.row__index,
          },
          2: {
            className: styles.product__title,
          },
          3: {
            className: styles.sku__column,
          },
          6: {
            className: styles.product__count,
            align: "center",
          },
          7: {
            className: styles.product__price,
          },
          8: {
            className: styles.margin__column,
          },
          9: {
            className: styles.edit__btn,
          },
          10: {
            className: styles.delete__btn,
          },
        }}
        isLoading={filteredProducts.isLoading}
      />

      {filteredProducts.data?.data?.results.length === 0 && (
        <div className={styles.empty}>
          <img src="/empty.svg" alt="empty" />
        </div>
      )}

      <CreateModal
        isOpen={isOpenProductInfo}
        onClose={() => {
          setScannedCode("");
          setIsOpenProductInfo(false);
        }}
        width={964}
        height={634}
        headTitle={scanBarcode.data?.data?.name || ""}
        overflowY="scroll"
      >
        <ul className={styles.sizes__list}>
          {(availableSizes.data?.data?.by_size ?? []).map((item) => (
            <li key={item.size__size} className={styles.item}>
              <p className={styles.size__title}>
                “{item.size__size}” Tovar soni
              </p>
              <span className={styles.size__count}>{item.total_stock} pts</span>
            </li>
          ))}
        </ul>
      </CreateModal>

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Mahsulot o'chirildi!"
        onOpen={deleteProduct.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description={"Mahsulot o'chirishda xatolik yuz berdi"}
        onOpen={deleteProduct.isError}
      />

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Mahsulot topildi!"
        onOpen={scanBarcode.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description={"Mahsulot topishda xatolik yuz berdi"}
        onOpen={scanBarcode.isError}
      />

      {/* <Notification
        type="warning"
        message={"Eslatma"}
        description={`${lowStock.data?.data?.products[0].name} oz miqdorda qoldi`}
        onOpen={lowStock.isSuccess}
      /> */}

      {isDeleteModal && (
        <DeleteConfirmModal
          onClick={() => {
            deleteProduct.mutateAsync(deleteId).then((res) => {
              console.log(res);
            });
            setIsDeleteModal(false);
          }}
          setIsDeleteModal={setIsDeleteModal}
        />
      )}

      <TablePagination
        current={page}
        total={filteredProducts.data?.data?.count || 0}
        pageSize={limit}
        onChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default Inventory;
