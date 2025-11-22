import { useState } from "react";
import { DeleteIcon, EditIcon, MoreIcon } from "@/shared/ui/icons";
import { usePagination } from "@/shared/lib/hooks/usePagination";
import DashedButton from "@/shared/ui/DashedButton";
import CreateModal from "@/shared/ui/CreateModal";
import Table from "@/shared/ui/Table";
import Notification from "@/shared/ui/Notification";
import TablePagination from "@/shared/ui/Pagination";

import { useUpdateSizeInfo } from "@/entities/product/model/useUpdateSize";
import { useAddSizeInfo } from "@/entities/product/model/useAddSize";
import { useFilteredSizes } from "@/entities/product/model/useFilteredSizes";
import { useDeleteSize } from "@/entities/product/model/useDeleteSize";
import DeleteConfirmModal from "@/features/DeleteConfirmModal/ui";

//scss
import styles from "./Sizes.module.scss";

const Sizes = () => {
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isValidation, setIsValidation] = useState(false);

  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const [sizeValue, setSizeValue] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | string>("");

  const addSize = useAddSizeInfo();
  const updateSize = useUpdateSizeInfo();
  const deleteSize = useDeleteSize();

  const { page, setPage, limit, offset } = usePagination(1, 7);

  const filteredSizes = useFilteredSizes({
    offset,
    limit,
  });

  function handleDelete() {
    deleteSize.mutateAsync(deleteId).then((res) => {
      if (res.status === 204) {
        console.log(res);
        setDeleteId("");
        setIsDeleteModal(false);
      }
    });
  }

  return (
    <div className={styles.sizes__wrapper}>
      <h3>Birlik o’lchov sozlamalari</h3>

      <DashedButton
        onClick={() => {
          setSizeValue("");
          setIsOpenCreate(true);
        }}
      >
        + Yangi razmer yaratish
      </DashedButton>

      <CreateModal
        isOpen={isOpenCreate}
        onClose={() => setIsOpenCreate(false)}
        headTitle="Yangi razmer yaratish"
        btnTitle="Yaratish"
        width={552}
        height={341}
        btnOnClick={() => {
          addSize
            .mutateAsync({
              size: sizeValue,
            })
            .then((res) => {
              if (res.status === 201) {
                setIsOpenCreate(false);
                setSizeValue("");
              }
            })
            .catch((err) => {
              if (err.response.data.non_field_errors[0]) {
                setIsValidation(true);
              }
            });
        }}
      >
        <input
          value={sizeValue}
          onChange={(e) => setSizeValue(e.target.value)}
          type="text"
          placeholder="Razmer nomi"
        />
        {isValidation && (
          <p className={styles.validation__error}>
            Bunday razmer allaqachon mavjud
          </p>
        )}
      </CreateModal>

      <Table
        headCols={["#", "O’lchov nomi", "", ""]}
        bodyCols={filteredSizes.data?.data.results.map((item, index) => {
          return {
            id: item.id,
            index: index + 1 + offset,
            size: item.size ?? "-",
            content_1: (
              <div
                onClick={() => {
                  setIsOpenEdit(true);
                  setSizeValue(item.size);
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
          2: {
            className: styles.sizes__title,
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
            className: styles.sizes,
          },
          3: {
            className: styles.edit__btn,
          },
          4: {
            className: styles.hide__btn,
          },
        }}
        isLoading={filteredSizes.isLoading}
      />

      {filteredSizes.data?.data?.results.length === 0 && (
        <div className={styles.empty}>
          <img src="/empty.svg" alt="empty" />
        </div>
      )}

      <CreateModal
        isOpen={isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
        headTitle="Razmerni tahrirlash"
        btnTitle="Saqlash"
        width={552}
        height={341}
        btnOnClick={() => {
          updateSize
            .mutateAsync({
              id: editId!,
              size: sizeValue,
            })
            .then((res) => {
              if (res.status === 200) {
                setIsOpenEdit(false);
                setSizeValue("");
                setIsValidation(false);
              }
            })
            .catch((err) => {
              if (err.response.data.non_field_errors[0]) {
                setIsValidation(true);
              }
            });
        }}
        onClick={() => {
          setIsValidation(false);
        }}
      >
        <input
          value={sizeValue}
          onChange={(e) => setSizeValue(e.target.value)}
          type="text"
          // placeholder="XS"
        />

        {isValidation && (
          <p className={styles.validation__error}>
            Bunday razmer allaqachon mavjud
          </p>
        )}
      </CreateModal>

      <TablePagination
        current={page}
        total={filteredSizes.data?.data.count || 0}
        pageSize={limit}
        onChange={(p) => setPage(p)}
        bottom={20}
      />

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Yangi o‘lcham yaratildi."
        onOpen={addSize.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description={"O‘lcham yaratishda xatolik."}
        onOpen={addSize.isError}
      />

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Mavjud kiyim o‘lchami tahrir qilindi."
        onOpen={updateSize.isSuccess}
      />
      
      <Notification
        type="error"
        message="Xatolik"
        description={"O‘lchamni tahrir qilishda xatolik."}
        onOpen={updateSize.isError}
      />

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="O‘lcham o‘chirildi."
        onOpen={deleteSize.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description={"o‘chirishda xatolik yuz berdi."}
        onOpen={deleteSize.isError}
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

export default Sizes;
