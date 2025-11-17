import { useState } from "react";
import { useCreateCustomer } from "@/entities/customer/model";
import type { Customer } from "@/entities/customer/api/types";
import CreateModal from "@/shared/ui/CreateModal";
import Notification from "@/shared/ui/Notification";
import styles from "./CreateCustomerModal.module.scss";

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customer: Customer) => void;
  initialPhone?: string;
}

export const CreateCustomerModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialPhone = "+998",
}: CreateCustomerModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState("");
  const [customerType, setCustomerType] = useState<"individual" | "organization">("individual");
  const [organizationName, setOrganizationName] = useState("");
  const [inn, setInn] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isVip, setIsVip] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const createCustomer = useCreateCustomer();

  const handlePhoneChange = (value: string) => {
    // Ensure phone always starts with +998
    if (!value.startsWith("+998")) {
      value = "+998";
    }

    // Remove non-digits except +
    value = value.replace(/[^\d+]/g, "");

    // Limit length to +998XXXXXXXXX (13 characters)
    if (value.length > 13) {
      value = value.slice(0, 13);
    }

    setPhone(value);
  };

  const handleSubmit = () => {
    // Validation
    if (!firstName.trim()) {
      setErrorMessage("Iltimos, mijoz ismini kiriting");
      setShowError(true);
      return;
    }

    if (phone.length !== 13) {
      setErrorMessage("Telefon raqam noto'g'ri formatda (+998XXXXXXXXX)");
      setShowError(true);
      return;
    }

    if (customerType === "organization" && !organizationName.trim()) {
      setErrorMessage("Iltimos, tashkilot nomini kiriting");
      setShowError(true);
      return;
    }

    // Create customer
    createCustomer.mutate(
      {
        first_name: firstName.trim(),
        last_name: lastName.trim() || undefined,
        phone: phone,
        email: email.trim() || undefined,
        customer_type: customerType,
        organization_name: customerType === "organization" ? organizationName.trim() : undefined,
        inn: inn.trim() || undefined,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
        is_vip: isVip,
      },
      {
        onSuccess: (response) => {
          // Reset form
          setFirstName("");
          setLastName("");
          setPhone("+998");
          setEmail("");
          setCustomerType("individual");
          setOrganizationName("");
          setInn("");
          setAddress("");
          setNotes("");
          setIsVip(false);

          // Call success callback
          onSuccess(response.data);
          onClose();
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message ||
                         error?.response?.data?.phone?.[0] ||
                         "Xatolik yuz berdi";
          setErrorMessage(message);
          setShowError(true);
        },
      }
    );
  };

  const handleClose = () => {
    if (!createCustomer.isPending) {
      onClose();
    }
  };

  return (
    <>
      <CreateModal
        headTitle="Yangi mijoz qo'shish"
        onClose={handleClose}
        isOpen={isOpen}
        width={600}
        height={customerType === "organization" ? 750 : 620}
        btnTitle={createCustomer.isPending ? "Yuklanmoqda..." : "Saqlash"}
        btnOnClick={handleSubmit}
        btnDisabled={createCustomer.isPending}
      >
        <div className={styles.form}>
          {/* Customer Type */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Mijoz turi:</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="customerType"
                  value="individual"
                  checked={customerType === "individual"}
                  onChange={() => setCustomerType("individual")}
                  disabled={createCustomer.isPending}
                />
                <span>Jismoniy shaxs</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="customerType"
                  value="organization"
                  checked={customerType === "organization"}
                  onChange={() => setCustomerType("organization")}
                  disabled={createCustomer.isPending}
                />
                <span>Yuridik shaxs</span>
              </label>
            </div>
          </div>

          {/* First Name */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Ism: <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ismni kiriting"
              className={styles.input}
              disabled={createCustomer.isPending}
            />
          </div>

          {/* Last Name */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Familiya:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Familiyani kiriting"
              className={styles.input}
              disabled={createCustomer.isPending}
            />
          </div>

          {/* Phone */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Telefon: <span className={styles.required}>*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+998XXXXXXXXX"
              className={styles.input}
              disabled={createCustomer.isPending}
            />
          </div>

          {/* Email */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className={styles.input}
              disabled={createCustomer.isPending}
            />
          </div>

          {/* Organization fields (if organization) */}
          {customerType === "organization" && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Tashkilot nomi: <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Tashkilot nomini kiriting"
                  className={styles.input}
                  disabled={createCustomer.isPending}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>INN:</label>
                <input
                  type="text"
                  value={inn}
                  onChange={(e) => setInn(e.target.value)}
                  placeholder="INN raqamini kiriting"
                  className={styles.input}
                  disabled={createCustomer.isPending}
                />
              </div>
            </>
          )}

          {/* Address */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Manzil:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Manzilni kiriting"
              className={styles.input}
              disabled={createCustomer.isPending}
            />
          </div>

          {/* Notes */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Izoh:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Qo'shimcha ma'lumot"
              className={styles.textarea}
              rows={3}
              disabled={createCustomer.isPending}
            />
          </div>

          {/* VIP checkbox */}
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isVip}
                onChange={(e) => setIsVip(e.target.checked)}
                disabled={createCustomer.isPending}
              />
              <span>VIP mijoz</span>
            </label>
          </div>
        </div>
      </CreateModal>

      {/* Error notification */}
      <Notification
        placement="top"
        type="error"
        message="Xatolik"
        description={errorMessage}
        onOpen={showError}
      />
    </>
  );
};
