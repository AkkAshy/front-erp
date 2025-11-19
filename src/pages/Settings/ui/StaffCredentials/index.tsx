import { useState } from "react";
import { useStaffCredentials } from "@/entities/cashier/model/useStaffCredentials";
import PageTitle from "@/shared/ui/PageTitle";
import styles from "./StaffCredentials.module.scss";

const StaffCredentials = () => {
  const { data, isLoading, isError, error } = useStaffCredentials();
  const [copied, setCopied] = useState<{ username: boolean; password: boolean }>({
    username: false,
    password: false,
  });

  const copyToClipboard = async (text: string, field: "username" | "password") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ ...copied, [field]: true });
      setTimeout(() => {
        setCopied({ ...copied, [field]: false });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <PageTitle>Xodimlar uchun kirish ma'lumotlari</PageTitle>
        <div className={styles.loading}>Yuklanmoqda...</div>
      </div>
    );
  }

  if (isError) {
    const errorMessage = (error as any)?.response?.data?.message || "Xatolik yuz berdi";
    return (
      <div className={styles.container}>
        <PageTitle>Xodimlar uchun kirish ma'lumotlari</PageTitle>
        <div className={styles.error}>
          <p>{errorMessage}</p>
          {(error as any)?.response?.status === 403 && (
            <p className={styles.errorHint}>
              Faqat do'kon egasi kirish ma'lumotlarini ko'rishi mumkin
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className={styles.container}>
        <PageTitle>Xodimlar uchun kirish ma'lumotlari</PageTitle>
        <div className={styles.empty}>Ma'lumotlar topilmadi</div>
      </div>
    );
  }

  const credentials = data.data;

  return (
    <div className={styles.container}>
      <PageTitle>Xodimlar uchun kirish ma'lumotlari</PageTitle>

      <div className={styles.card}>
        <div className={styles.header}>
          <h3>🔐 Umumiy akkaunt</h3>
          <span className={credentials.is_active ? styles.statusActive : styles.statusInactive}>
            {credentials.is_active ? "✅ Faol" : "❌ Faol emas"}
          </span>
        </div>

        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Do'kon:</span>
            <span className={styles.value}>{credentials.store_name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>To'liq nomi:</span>
            <span className={styles.value}>{credentials.full_name}</span>
          </div>
        </div>

        <div className={styles.credentials}>
          <div className={styles.credentialItem}>
            <label className={styles.credentialLabel}>Login:</label>
            <div className={styles.credentialValue}>
              <code>{credentials.username}</code>
              <button
                className={styles.copyBtn}
                onClick={() => copyToClipboard(credentials.username, "username")}
                title="Nusxalash"
              >
                {copied.username ? "✓ Nusxalandi" : "📋 Nusxalash"}
              </button>
            </div>
          </div>

          <div className={styles.credentialItem}>
            <label className={styles.credentialLabel}>Parol:</label>
            <div className={styles.credentialValue}>
              <code>{credentials.password}</code>
              <button
                className={styles.copyBtn}
                onClick={() => copyToClipboard(credentials.password, "password")}
                title="Nusxalash"
              >
                {copied.password ? "✓ Nusxalandi" : "📋 Nusxalash"}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.note}>
          <p className={styles.noteIcon}>ℹ️</p>
          <p className={styles.noteText}>{credentials.note}</p>
        </div>

        <div className={styles.warning}>
          <p className={styles.warningIcon}>⚠️</p>
          <div>
            <p className={styles.warningTitle}>Muhim:</p>
            <p className={styles.warningText}>
              Bu kirish ma'lumotlari barcha kassirlar va xodimlar uchun mo'ljallangan.
              Parolni xodimlarni xabardor qilmasdan o'zgartirmang!
            </p>
          </div>
        </div>

        <div className={styles.instructions}>
          <h4>Kirish tartibi:</h4>
          <ol>
            <li>POS tizimiga kiring (ushbu login va parol bilan)</li>
            <li>Kassirlar ro'yxatidan o'zingizni tanlang</li>
            <li>Smenani oching (agar hali ochilmagan bo'lsa)</li>
            <li>Ishni boshlang</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default StaffCredentials;
