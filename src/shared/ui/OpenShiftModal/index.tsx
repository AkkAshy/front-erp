import { useState, type FC } from "react";
import CreateModal from "../CreateModal";
import Notification from "../Notification";
import { useOpenShift } from "@/entities/sales/model/useOpenShift";
import styles from "./OpenShiftModal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const OpenShiftModal: FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [openingBalance, setOpeningBalance] = useState("0");
  const [error, setError] = useState("");
  const openShift = useOpenShift();

  const handleOpen = () => {
    const balance = parseFloat(openingBalance.replace(/\./g, "").replace(/,/g, "."));

    if (isNaN(balance) || balance < 0) {
      setError("Kiriting to'g'ri boshlang'ich balansni");
      return;
    }

    openShift
      .mutateAsync({ opening_balance: balance })
      .then(() => {
        setOpeningBalance("0");
        setError("");
        onClose();
        onSuccess?.();
      })
      .catch((err) => {
        console.error("Error opening shift:", err);
        setError(err.response?.data?.non_field_errors?.[0] || "Smena ochishda xatolik");
      });
  };

  const handleClose = () => {
    setOpeningBalance("0");
    setError("");
    onClose();
  };

  return (
    <>
      <CreateModal
        isOpen={isOpen}
        onClose={handleClose}
        headTitle="Smenani ochish"
        btnTitle="Ochish"
        btnClose={true}
        width={500}
        height={300}
        btnWidth="100%"
        btnHeight={56}
        btnOnClick={handleOpen}
      >
        <div className={styles.container}>
          <div className={styles.input__wrapper}>
            <p className={styles.label}>Boshlang'ich balans</p>
            <input
              value={openingBalance}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                const formattedValue = numericValue
                  ? Number(numericValue).toLocaleString("de-DE")
                  : "";
                setOpeningBalance(formattedValue);
              }}
              type="text"
              placeholder="0 uzs"
              className={styles.input}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>
      </CreateModal>

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Smena ochildi"
        onOpen={openShift.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description={error || "Smena ochilmadi"}
        onOpen={openShift.isError}
      />
    </>
  );
};

export default OpenShiftModal;
