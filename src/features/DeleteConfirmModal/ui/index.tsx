import { CloseIcon } from "@/shared/ui/icons";
import styles from "./DeleteConfirmModal.module.scss";
import type { FC } from "react";

type Props = {
  setIsDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
};

const DeleteConfirmModal: FC<Props> = ({ setIsDeleteModal, onClick }) => {
  function hideModal() {
    setIsDeleteModal(false);
  }

  return (
    <div className={styles.modal} onClick={hideModal}>
      <div className={styles.modal__inner} onClick={(e) => e.stopPropagation()}>
        <h1>Sizning mutlaqo ishonchingiz komilmi?</h1>
        <span className={styles.close_btn} onClick={hideModal}>
          <CloseIcon />
        </span>
        <p className={styles.modal__desc}>
          Bu harakatni bekor qilib bo'lmaydi. Bu sizning hisobingizni butunlay
          o'chirib tashlaydi va ma'lumotlaringizni serverlarimizdan olib
          tashlaydi.
        </p>
        <div className={styles.modal__btns}>
          <span className={styles.btn_not} onClick={hideModal}>
            Yo’q
          </span>
          <span className={styles.btn_yes} onClick={onClick}>
            Ha
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
