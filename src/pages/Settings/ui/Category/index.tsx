import { useState, useEffect } from "react";
import Table from "@/shared/ui/Table";
import CreateModal from "@/shared/ui/CreateModal";
import DashedButton from "@/shared/ui/DashedButton";
import { DeleteIcon, EditIcon, MoreIcon } from "@/shared/ui/icons";
import Notification from "@/shared/ui/Notification";
import TablePagination from "@/shared/ui/Pagination";
import DeleteConfirmModal from "@/features/DeleteConfirmModal/ui";
import StoreSelector from "@/shared/ui/StoreSelector";

// hooks
import { useCreateCategory } from "@/entities/category/model/useCreateCategory";
import { useUpdateCategory } from "@/entities/category/model/useUpdateCategory";
import { useFilteredCategories } from "@/entities/category/model/useFilteredCategories";
import { usePagination } from "@/shared/lib/hooks/usePagination";
import { useDeleteCategory } from "@/entities/category/model/useDeleteCategory";
import { useAttributeTypes } from "@/entities/attribute/model/useAttributeTypes";
import { useCategoryAttributes } from "@/entities/category/model/useCategoryAttributes";
import { useBulkCreateCategoryAttributes } from "@/entities/category/model/useBulkCreateCategoryAttributes";
import { useDeleteCategoryAttribute } from "@/entities/category/model/useDeleteCategoryAttribute";

//scss
import styles from "./Category.module.scss";


const Category = () => {
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isValidation, setIsValidation] = useState(false);

  const [categoryValue, setCategoryValue] = useState("");
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<number[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | string>("");

  const addCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const bulkCreateAttributes = useBulkCreateCategoryAttributes();
  const deleteCategoryAttribute = useDeleteCategoryAttribute();

  const attributeTypes = useAttributeTypes({ limit: 100 });
  const categoryAttributes = useCategoryAttributes(editId);

  const { page, setPage, offset, limit } = usePagination(1, 7);

  const filteredCategories = useFilteredCategories({
    offset,
    limit,
  });

  // Load existing attributes when editing category
  useEffect(() => {
    if (editId && categoryAttributes.data?.data) {
      const existingAttributeIds = categoryAttributes.data.data.map(
        (ca) => ca.attribute.id
      );
      setSelectedAttributeIds(existingAttributeIds);
    }
  }, [editId, categoryAttributes.data]);

  const handleAttributeToggle = (attributeId: number) => {
    setSelectedAttributeIds((prev) =>
      prev.includes(attributeId)
        ? prev.filter((id) => id !== attributeId)
        : [...prev, attributeId]
    );
  };

  const handleSaveAttributes = async (categoryId: number) => {
    // Get existing attributes
    const existingAttributes = categoryAttributes.data?.data || [];
    const existingAttributeIds = existingAttributes.map((ca) => ca.attribute.id);

    // Find attributes to add
    const attributesToAdd = selectedAttributeIds.filter(
      (id) => !existingAttributeIds.includes(id)
    );

    // Find attributes to remove
    const attributesToRemove = existingAttributes.filter(
      (ca) => !selectedAttributeIds.includes(ca.attribute.id)
    );

    // Remove unselected attributes
    for (const attr of attributesToRemove) {
      await deleteCategoryAttribute.mutateAsync(attr.id);
    }

    // Add new attributes
    if (attributesToAdd.length > 0) {
      await bulkCreateAttributes.mutateAsync({
        category: categoryId,
        attributes: attributesToAdd.map((attrId, index) => ({
          attribute: attrId,
          is_required: false,
          is_variant: false,
          order: index,
        })),
      });
    }
  };

  function handleDelete() {
    const id = typeof deleteId === 'string' ? parseInt(deleteId) : deleteId;
    deleteCategory.mutateAsync(id).then((res) => {
      console.log(res);

      if (res.status === 204) {
        setDeleteId("");
        setIsDeleteModal(false);
      }
    });
  }

  return (
    <div className={styles.category}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <h3>Kategoriya sozlamalari</h3>
        <StoreSelector />
      </div>
      <DashedButton
        onClick={() => {
          setIsOpenCategory(true);
          setCategoryValue("");
          setSelectedAttributeIds([]);
        }}
      >
        + Yangi kategoriya yaratish
      </DashedButton>

      <CreateModal
        isOpen={isOpenCategory}
        onClose={() => setIsOpenCategory(false)}
        headTitle="Yangi kategoriya yaratish"
        width={552}
        height={700}
        btnTitle="Yaratish"
        btnOnClick={() => {
          addCategory
            .mutateAsync({
              name: categoryValue,
              parent: null,
            })
            .then(async (res) => {
              if (res.status === 201) {
                const newCategoryId = res.data.id;

                // Add attributes if any selected
                if (selectedAttributeIds.length > 0) {
                  await bulkCreateAttributes.mutateAsync({
                    category: newCategoryId,
                    attributes: selectedAttributeIds.map((attrId, index) => ({
                      attribute: attrId,
                      is_required: false,
                      is_variant: false,
                      order: index,
                    })),
                  });
                }

                setIsOpenCategory(false);
                setCategoryValue("");
                setSelectedAttributeIds([]);
              }
            })
            .catch((err) => {
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

        <div className={styles.attributesSection}>
          <label>Atributlar</label>
          <div className={styles.attributesList}>
            {attributeTypes.data?.data?.results?.map((attr: any) => (
              <label key={attr.id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedAttributeIds.includes(attr.id)}
                  onChange={() => handleAttributeToggle(attr.id)}
                />
                <span>{attr.name}</span>
              </label>
            ))}
          </div>
        </div>
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
        onClose={() => {
          setIsOpenEdit(false);
          setEditId(null);
        }}
        headTitle="Kategoriyani tahrirlash"
        btnTitle="Saqlash"
        width={552}
        height={700}
        btnOnClick={async () => {
          try {
            const res = await updateCategory.mutateAsync({
              id: editId!,
              name: categoryValue,
            });

            if (res.status === 200) {
              // Save attributes
              await handleSaveAttributes(editId!);

              setIsOpenEdit(false);
              setCategoryValue("");
              setSelectedAttributeIds([]);
              setIsValidation(false);
              setEditId(null);
            }
          } catch (err: any) {
            if (err?.response?.data?.non_field_errors?.[0] ||
                err?.response?.data?.name?.[0] ||
                err?.response?.data?.slug?.[0]) {
              setIsValidation(true);
            }
          }
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

        <div className={styles.attributesSection}>
          <label>Atributlar</label>
          <div className={styles.attributesList}>
            {categoryAttributes.isLoading ? (
              <div>Yuklanmoqda...</div>
            ) : (
              attributeTypes.data?.data?.results?.map((attr: any) => (
                <label key={attr.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedAttributeIds.includes(attr.id)}
                    onChange={() => handleAttributeToggle(attr.id)}
                  />
                  <span>{attr.name}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </CreateModal>

      <TablePagination
        current={page}
        total={filteredCategories.data?.data.count || 0}
        pageSize={limit}
        onChange={(p) => setPage(p)}
        bottom={20}
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
        description="Kategoriya o'chirildi."
        onOpen={deleteCategory.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description="Kategoriya o'chirishda xatolik."
        onOpen={deleteCategory.isError}
      />

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Atributlar saqlandi."
        onOpen={bulkCreateAttributes.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description="Atributlarni saqlashda xatolik."
        onOpen={bulkCreateAttributes.isError}
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
