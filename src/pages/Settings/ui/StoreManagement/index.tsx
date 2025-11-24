import { useState } from "react";
import { useCreateStore } from "@/entities/cashier/model/useCreateStore";
import { useMyStores } from "@/entities/cashier/model/useMyStores";
import type { CreateStoreResponse, StoreWithCredentials } from "@/entities/cashier/api/types";
import CreateModal from "@/shared/ui/CreateModal";
import Notification from "@/shared/ui/Notification";
import StoreSelector from "@/shared/ui/StoreSelector";
import styles from "./StoreManagement.module.scss";

const StoreManagement = () => {
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdStore, setCreatedStore] = useState<CreateStoreResponse["data"] | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreWithCredentials | null>(null);
  const [showStoreCredentials, setShowStoreCredentials] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const createStore = useCreateStore();
  const myStores = useMyStores();

  function clearData() {
    setName("");
    setSlug("");
    setAddress("");
    setCity("");
    setPhone("");
    setEmail("");
    setDescription("");
    setError(null);
  }

  function handleCreate() {
    if (!name.trim()) {
      setError("Do'kon nomini kiriting");
      return;
    }

    setError(null);

    const data: any = {
      name: name.trim(),
    };

    // Добавляем опциональные поля только если они заполнены
    if (slug.trim()) data.slug = slug.trim();
    if (address.trim()) data.address = address.trim();
    if (city.trim()) data.city = city.trim();
    if (phone.trim()) data.phone = phone.trim();
    if (email.trim()) data.email = email.trim();
    if (description.trim()) data.description = description.trim();

    createStore
      .mutateAsync(data)
      .then((res) => {
        if (res.status === 201 && res.data?.data) {
          setCreatedStore(res.data.data);
          setShowCredentials(true);
          setIsOpenCreate(false);
          clearData();
          // Refetch stores list
          myStores.refetch();
        }
      })
      .catch((err) => {
        if (err.response?.data?.detail) {
          setError(err.response.data.detail);
        } else {
          setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
        }
      });
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={styles.storeManagement}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h3>Do'konlar boshqaruvi</h3>
          <StoreSelector />
        </div>
        <button
          className={styles.createBtn}
          onClick={() => setIsOpenCreate(true)}
        >
          + Yangi do'kon yaratish
        </button>
      </div>

      <div className={styles.info}>
        <p>
          Bu yerda siz yangi do'konlar yaratishingiz mumkin. Har bir do'kon
          o'zining alohida ma'lumotlar bazasi va xodimlariga ega bo'ladi.
        </p>
      </div>

      {/* Список магазинов */}
      <div className={styles.storesList}>
        <h4>Mening do'konlarim ({myStores.data?.data?.count || 0})</h4>

        {myStores.isLoading && (
          <div className={styles.loading}>Yuklanmoqda...</div>
        )}

        {myStores.isError && (
          <div className={styles.error}>
            Xatolik yuz berdi. Ma'lumotlarni yuklashda muammo.
          </div>
        )}

        {myStores.data?.data?.stores && myStores.data.data.stores.length === 0 && (
          <div className={styles.emptyState}>
            <img src="/empty.svg" alt="Bo'sh" />
            <p>Hali do'konlar yo'q</p>
            <small>Yangi do'kon yaratish uchun yuqoridagi tugmani bosing</small>
          </div>
        )}

        {myStores.data?.data?.stores && myStores.data.data.stores.length > 0 && (
          <div className={styles.storesGrid}>
            {myStores.data.data.stores.map((store) => (
              <div key={store.id} className={styles.storeCard}>
                <div className={styles.storeCard__header}>
                  <h5>{store.name}</h5>
                  <span className={`${styles.status} ${store.is_active ? styles.active : styles.inactive}`}>
                    {store.is_active ? "Faol" : "Nofaol"}
                  </span>
                </div>

                <div className={styles.storeCard__info}>
                  {store.address && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Manzil:</span>
                      <span className={styles.value}>{store.address}</span>
                    </div>
                  )}
                  {store.city && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Shahar:</span>
                      <span className={styles.value}>{store.city}</span>
                    </div>
                  )}
                  {store.phone && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Telefon:</span>
                      <span className={styles.value}>{store.phone}</span>
                    </div>
                  )}
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Tenant Key:</span>
                    <div className={styles.tenantKey}>
                      <code>{store.tenant_key}</code>
                      <button
                        className={styles.copySmallBtn}
                        onClick={() => copyToClipboard(store.tenant_key)}
                        title="Nusxalash"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.storeCard__footer}>
                  <button
                    className={styles.viewCredentialsBtn}
                    onClick={() => {
                      setSelectedStore(store);
                      setShowStoreCredentials(true);
                    }}
                  >
                    Kirish ma'lumotlarini ko'rish
                  </button>
                </div>

                {store.staff_credentials_missing && (
                  <div className={styles.warningBadge}>
                    ⚠️ Staff credentials topilmadi
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateModal
        isOpen={isOpenCreate}
        onClose={() => {
          setIsOpenCreate(false);
          clearData();
        }}
        headTitle="Yangi do'kon yaratish"
        btnTitle="Yaratish"
        btnOnClick={handleCreate}
      >
        <div className={styles.form}>
          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>
              Do'kon nomi <span className={styles.required}>*</span>
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Masalan: Супермаркет Азия"
            />
          </div>

          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Slug (ixtiyoriy)</p>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              type="text"
              placeholder="supermarket_asia"
            />
            <small className={styles.hint}>
              Bo'sh qoldirilsa avtomatik yaratiladi
            </small>
          </div>

          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Manzil (ixtiyoriy)</p>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder="г. Ташкент, ул. Амира Темура, 10"
            />
          </div>

          <div className={styles.form__row}>
            <div className={styles.input__wrapper}>
              <p className={styles.label__input}>Shahar (ixtiyoriy)</p>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                type="text"
                placeholder="Toshkent"
              />
            </div>

            <div className={styles.input__wrapper}>
              <p className={styles.label__input}>Telefon (ixtiyoriy)</p>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="+998901234567"
              />
            </div>
          </div>

          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Email (ixtiyoriy)</p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="info@example.uz"
            />
          </div>

          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Tavsif (ixtiyoriy)</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Do'kon haqida qisqacha ma'lumot..."
              rows={3}
            />
          </div>

          {error && <p className={styles.validation__error}>{error}</p>}
        </div>
      </CreateModal>

      {/* Modal для отображения созданных credentials */}
      <CreateModal
        isOpen={showCredentials}
        onClose={() => {
          setShowCredentials(false);
          setCreatedStore(null);
        }}
        headTitle="Do'kon muvaffaqiyatli yaratildi!"
        btnTitle="Yopish"
        btnOnClick={() => {
          setShowCredentials(false);
          setCreatedStore(null);
        }}
      >
        {createdStore && (
          <div className={styles.credentials}>
            <div className={styles.success__icon}>✓</div>
            <h4>Do'kon ma'lumotlari:</h4>

            <div className={styles.info__block}>
              <p className={styles.info__label}>Nomi:</p>
              <p className={styles.info__value}>{createdStore.store.name}</p>
            </div>

            <div className={styles.info__block}>
              <p className={styles.info__label}>Tenant Key:</p>
              <div className={styles.copy__wrapper}>
                <code className={styles.code}>{createdStore.store.tenant_key}</code>
                <button
                  className={styles.copy__btn}
                  onClick={() => copyToClipboard(createdStore.store.tenant_key)}
                >
                  Nusxalash
                </button>
              </div>
              <small className={styles.warning}>
                ⚠️ Bu kalitni saqlang! U barcha API so'rovlar uchun kerak bo'ladi.
              </small>
            </div>

            <h4 className={styles.staff__title}>Xodimlar uchun kirish ma'lumotlari:</h4>

            <div className={styles.info__block}>
              <p className={styles.info__label}>Login:</p>
              <div className={styles.copy__wrapper}>
                <code className={styles.code}>{createdStore.staff_credentials.username}</code>
                <button
                  className={styles.copy__btn}
                  onClick={() => copyToClipboard(createdStore.staff_credentials.username)}
                >
                  Nusxalash
                </button>
              </div>
            </div>

            <div className={styles.info__block}>
              <p className={styles.info__label}>Parol:</p>
              <div className={styles.copy__wrapper}>
                <code className={styles.code}>{createdStore.staff_credentials.password}</code>
                <button
                  className={styles.copy__btn}
                  onClick={() => copyToClipboard(createdStore.staff_credentials.password)}
                >
                  Nusxalash
                </button>
              </div>
            </div>

            <div className={styles.note}>
              <p>{createdStore.staff_credentials.note}</p>
            </div>
          </div>
        )}
      </CreateModal>

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Do'kon muvaffaqiyatli yaratildi!"
        onOpen={createStore.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description="Do'kon yaratilmadi. Qaytadan urinib ko'ring."
        onOpen={createStore.isError}
      />

      {/* Modal для просмотра credentials существующего магазина */}
      <CreateModal
        isOpen={showStoreCredentials}
        onClose={() => {
          setShowStoreCredentials(false);
          setSelectedStore(null);
        }}
        headTitle="Do'kon kirish ma'lumotlari"
      >
        {selectedStore && (
          <div className={styles.credentials}>
            <h4>Do'kon ma'lumotlari:</h4>

            <div className={styles.info__block}>
              <p className={styles.info__label}>Nomi:</p>
              <p className={styles.info__value}>{selectedStore.name}</p>
            </div>

            {selectedStore.address && (
              <div className={styles.info__block}>
                <p className={styles.info__label}>Manzil:</p>
                <p className={styles.info__value}>{selectedStore.address}</p>
              </div>
            )}

            <div className={styles.info__block}>
              <p className={styles.info__label}>Tenant Key:</p>
              <div className={styles.copy__wrapper}>
                <code className={styles.code}>{selectedStore.tenant_key}</code>
                <button
                  className={styles.copy__btn}
                  onClick={() => copyToClipboard(selectedStore.tenant_key)}
                >
                  Nusxalash
                </button>
              </div>
              <small className={styles.warning}>
                ⚠️ Bu kalitni saqlang! U barcha API so'rovlar uchun kerak bo'ladi.
              </small>
            </div>

            {selectedStore.staff_credentials ? (
              <>
                <h4 className={styles.staff__title}>Xodimlar uchun kirish ma'lumotlari:</h4>

                <div className={styles.info__block}>
                  <p className={styles.info__label}>Login:</p>
                  <div className={styles.copy__wrapper}>
                    <code className={styles.code}>{selectedStore.staff_credentials?.username}</code>
                    <button
                      className={styles.copy__btn}
                      onClick={() => selectedStore.staff_credentials && copyToClipboard(selectedStore.staff_credentials.username)}
                    >
                      Nusxalash
                    </button>
                  </div>
                </div>

                <div className={styles.info__block}>
                  <p className={styles.info__label}>Parol:</p>
                  <div className={styles.copy__wrapper}>
                    <code className={styles.code}>{selectedStore.staff_credentials?.password}</code>
                    <button
                      className={styles.copy__btn}
                      onClick={() => selectedStore.staff_credentials && copyToClipboard(selectedStore.staff_credentials.password)}
                    >
                      Nusxalash
                    </button>
                  </div>
                </div>

                <div className={styles.note}>
                  <p>{selectedStore.staff_credentials?.note}</p>
                </div>
              </>
            ) : (
              <div className={styles.warningBlock}>
                <h4>⚠️ Staff credentials topilmadi</h4>
                {selectedStore.staff_credentials_note && (
                  <p className={styles.noteText}>{selectedStore.staff_credentials_note}</p>
                )}
                <p className={styles.noteText}>
                  Tizim administratori bilan bog'laning.
                </p>
              </div>
            )}
          </div>
        )}
      </CreateModal>
    </div>
  );
};

export default StoreManagement;
