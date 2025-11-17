import { useState, type FC } from "react";
import CreateModal from "@/shared/ui/CreateModal";
import { useMask } from "@react-input/mask";

//scss
import styles from "./AddCustomerModal.module.scss";
import { useCustomers } from "@/entities/customer/model/useCustomers";
import { normalizePhone } from "@/shared/lib/utils";

type Customer = {
  full_name: string;
  phone: string;
};

type Props = {
  isAddModal: boolean;
  setIsAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomerData: React.Dispatch<React.SetStateAction<Customer>>;
};

const AddCustomerModal: FC<Props> = ({
  setIsAddModal,
  isAddModal,
  setCustomerData,
}) => {
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null); 

  const customers = useCustomers();
  const inputRef = useMask({
    mask: "+998 (__) ___-__-__",
    replacement: { _: /\d/ },
    showMask: true, // сразу показываем шаблон
  });

  const handleAddCustomer = () => {
    const normalizedPhone = normalizePhone(phone);
    if (!fullname.trim()) {
      setError("Ismni kiriting");
      return;
    }
    
    if (phone.replace(/\D/g, "").length < 12) {
      setError("Telefon raqamini to‘g‘ri kiriting");
      return;
    }

    if (customers.data?.data.results.find((c) => c.phone === normalizedPhone)) {
      setError("Bunday mijoz allaqachon mavjud");
      return;
    }

    setError(null);
    setCustomerData({ full_name: fullname, phone: normalizedPhone });
    setIsAddModal(false);
  };

  return (
    <CreateModal
      isOpen={isAddModal}
      onClose={() => setIsAddModal(false)}
      headTitle="Yangi mijoz qoshish"
      btnTitle="Yaratish"
      btnOnClick={handleAddCustomer}
    >
      <input
        value={fullname}
        onChange={(e) => {
          setError(null);
          setFullname(e.target.value);
        }}
        className={styles.input__fullname}
        type="text"
        placeholder="Familiya ismi"
      />
      <input
        ref={inputRef}
        value={phone}
        onChange={(e) => {
          setError(null);
          setPhone(e.target.value);
        }}
        type="tel"
        placeholder="+998 (__) ___-__-__"
      />
      <p className={styles.validation__error}>{error}</p>
    </CreateModal>
  );
};

export default AddCustomerModal;
