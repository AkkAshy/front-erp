import { useState } from "react";
import Table from "@/shared/ui/Table";
import CreateModal from "@/shared/ui/CreateModal";
import DashedButton from "@/shared/ui/DashedButton";
import { DeleteIcon, EditIcon, MoreIcon } from "@/shared/ui/icons";
import Notification from "@/shared/ui/Notification";
import TablePagination from "@/shared/ui/Pagination";
import DeleteConfirmModal from "@/features/DeleteConfirmModal/ui";

// hooks
import { useCreateCategory } from "@/entities/category/model/useCreateCategory";
import { useUpdateCategory } from "@/entities/category/model/useUpdateCategory";
import { useFilteredCategories } from "@/entities/category/model/useFilteredCategories";
import { usePagination } from "@/shared/lib/hooks/usePagination";
import { useDeleteCategory } from "@/entities/category/model/useDeleteCategory";
import { useAttributeTypes } from "@/entities/attribute/model/useAttributeTypes";

//scss
import styles from "./Category.module.scss";


const Category = () => {
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isValidation, setIsValidation] = useState(false);

  const [categoryValue, setCategoryValue] = useState("");
  const [selectedAttributeTypes, setSelectedAttributeTypes] = useState<number[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | string>("");

  const addCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const attributeTypes = useAttributeTypes({ limit: 100 });

  const { page, setPage, offset, limit } = usePagination(1, 7);

  const filteredCategories = useFilteredCategories({
    offset,
    limit,
  });

  function handleDelete() {
    deleteCategory.mutateAsync(deleteId).then((res) => {
      console.log(res);

      if (res.status === 204) {
        setDeleteId("");
        setIsDeleteModal(false);
      }
    });
  }

  return (
    <div className={styles.category}>
      <h3>Kategoriya sozlamalari</h3>
      <DashedButton
        onClick={() => {
          setIsOpenCategory(true);
          setCategoryValue("");
          setSelectedAttributeTypes([]);
        }}
      >
        + Yangi kategoriya yaratish
      </DashedButton>

      <CreateModal
        isOpen={isOpenCategory}
        onClose={() => setIsOpenCategory(false)}
        headTitle="Yangi kategoriya yaratish"
        width={552}
        height={500}
        btnTitle="Yaratish"
        btnOnClick={() => {
          addCategory
            .mutateAsync({
              name: categoryValue,
              parent: null, // Пока создаем только корневые категории
            })
            .then((res) => {
              if (res.status === 201) {
                setIsOpenCategory(false);
                setCategoryValue("");
                setSelectedAttributeTypes([]);
              }
            })
            .catch((err) => {
              // Безопасная проверка наличия ошибки
              if (err?.response?.data?.name?.[0] || err?.response?.data?.slug?.[0]) {
                setIsValidation(true);
              }
            });
        }}
      >
        <input
          value={categoryValue}
          onChange={(e) => setCategoryValue(e.target.value)}
          type="text"
          placeholder="Kategoriya nomi"
        />

        {isValidation && (
          <p className={styles.validation__error}>
            Bunday kategoriya allaqachon mavjud
          </p>
        )}
      </CreateModal>

      <Table
        headCols={["#", "Kategoriya nomi", "", ""]}
        bodyCols={filteredCategories.data?.data.results.map((item, index) => {
          return {
            id: item.id,
            index: index + 1 + offset,
            size: item.name ?? "-",
            content_1: (
              <div
                onClick={() => {
                  setIsOpenEdit(true);
                  setCategoryValue(item.name);
                  setEditId(item.id);
                }}
              >
                <EditIcon />
              </div>
            ),
            content_2: (
              <div
                onClick={() => {
                  setIsDeleteModal(true);
                  setDeleteId(item.id);
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
          4: {
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
            className: styles.edit__btn,
          },
          4: {
            className: styles.hide__btn,
          },
        }}
        isLoading={filteredCategories.isLoading}
      />

      {filteredCategories.data?.data?.results.length === 0 && (
        <div className={styles.empty}>
          <img src="/empty.svg" alt="empty" />
        </div>
      )}

      <CreateModal
        isOpen={isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
        headTitle="Kategoriyani tahrirlash"
        btnTitle="Saqlash"
        width={552}
        height={500}
        btnOnClick={() => {
          updateCategory
            .mutateAsync({
              id: editId!,
              name: categoryValue,
              parent: null,
            })
            .then((res) => {
              console.log(res);

              if (res.status === 200) {
                setIsOpenEdit(false);
                setCategoryValue("");
                setSelectedAttributeTypes([]);
                setIsValidation(false);
              }
            })
            .catch((err) => {
              // Безопасная проверка наличия ошибки
              if (err?.response?.data?.non_field_errors?.[0] ||
                  err?.response?.data?.name?.[0] ||
                  err?.response?.data?.slug?.[0]) {
                setIsValidation(true);
              }
            });
        }}
        onClick={() => {
          setIsValidation(false);
        }}
      >
        <input
          value={categoryValue}
          onChange={(e) => setCategoryValue(e.target.value)}
          type="text"
          placeholder="Kategoriya nomi"
        />

        {isValidation && (
          <p className={styles.validation__error}>
            Bunday kategoriya allaqachon mavjud
          </p>
        )}
      </CreateModal>

      <TablePagination
        current={page}
        total={filteredCategories.data?.data.count || 0}
        pageSize={limit}
        onChange={(p) => setPage(p)}
      />

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Yangi kategoriya yaratildi."
        onOpen={addCategory.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description="Kategoriya yaratishda xatolik."
        onOpen={addCategory.isError}
      />

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Kategoriya tahrir qilindi."
        onOpen={updateCategory.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description="Kategoriya tahrirlashda xatolik."
        onOpen={updateCategory.isError}
      />

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Kategoriya o‘chirildi."
        onOpen={deleteCategory.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description="Kategoriya o‘chirishda xatolik."
        onOpen={deleteCategory.isError}
      />

      {isDeleteModal && (
        <DeleteConfirmModal
          onClick={handleDelete}
          setIsDeleteModal={setIsDeleteModal}
        />
      )}
    </div>
  );
};

export default Category;
