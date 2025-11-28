import { useEffect, type FC } from "react";
import { Modal } from "antd";
import Notification from "../Notification";
import { useOpenShift } from "@/entities/sales/model/useOpenShift";
import { DEFAULT_OPENING_CASH } from "@/entities/sales/api/shiftTypes";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const OpenShiftModal: FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const openShift = useOpenShift();

  useEffect(() => {
    if (isOpen) {
      Modal.confirm({
        title: "Smenani ochish",
        content: `Kassa ${DEFAULT_OPENING_CASH.toLocaleString("ru-RU")} uzs balans bilan ochiladi`,
        okText: "Ochish",
        cancelText: "Bekor qilish",
        centered: true,
        onOk: () => {
          return openShift
            .mutateAsync(undefined)
            .then(() => {
              onClose();
              onSuccess?.();
            })
            .catch((err) => {
              console.error("Error opening shift:", err);
              const errorMsg = err.response?.data?.message ||
                err.response?.data?.non_field_errors?.[0] ||
                "Smena ochishda xatolik";
              Modal.error({
                title: "Xatolik",
                content: errorMsg,
                centered: true,
              });
            });
        },
        onCancel: () => {
          onClose();
        },
      });
    }
  }, [isOpen]);

  return (
    <>
      <Notification
        type="success"
        message="Muvaffaqiyat"
        description={`Smena ${DEFAULT_OPENING_CASH.toLocaleString("ru-RU")} uzs bilan ochildi`}
        onOpen={openShift.isSuccess}
      />
    </>
  );
};

export default OpenShiftModal;
