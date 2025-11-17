import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRegister } from "../api/useRegister";
import Loader from "@/shared/ui/Loader";
import { HideIcon } from "@/shared/ui/icons";

//scss
import styles from "./RegisterForm.module.scss";
import { useMask } from "@react-input/mask";
import { normalizePhone } from "@/shared/lib/utils";

const maskOptions = {
  mask: "+998 (__) ___-__-__",
  replacement: { _: /\d/ },
  showMask: true,
};

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const register = useRegister();

  // Личные данные
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");  // ⭐ Добавлено
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");  // ⭐ Добавлено
  const [phone, setPhone] = useState("");

  // Данные магазина
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeCity, setStoreCity] = useState("");  // ⭐ Добавлено
  const [storeRegion, setStoreRegion] = useState("");  // ⭐ Добавлено
  const [storePhone, setStorePhone] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storeLegalName, setStoreLegalName] = useState("");  // ⭐ Добавлено
  const [storeTaxId, setStoreTaxId] = useState("");  // ⭐ Добавлено
  const [storeDescription, setStoreDescription] = useState("");

  const phoneRef = useMask(maskOptions);
  const storePhoneRef = useMask(maskOptions);

  const handleSubmit = () => {
    const normalizedPhone = normalizePhone(phone);
    const normalizedStorePhone = normalizePhone(storePhone);

    // Валидация обязательных полей
    if (
      !username ||
      !password ||
      !passwordConfirm ||
      !firstName ||
      !phone ||
      !storeName ||
      !storeAddress ||
      !storePhone
    ) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }

    // Валидация пароля
    if (password.length < 8) {
      alert("Parol kamida 8 ta belgidan iborat bo'lishi kerak");
      return;
    }

    // ⭐ Проверка совпадения паролей
    if (password !== passwordConfirm) {
      alert("Parollar mos emas");
      return;
    }

    register.mutate(
      {
        username,
        password,
        password_confirm: passwordConfirm,  // ⭐ Добавлено
        email,
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,  // ⭐ Добавлено
        owner_phone: normalizedPhone,
        store_name: storeName,
        store_address: storeAddress,
        store_city: storeCity,  // ⭐ Добавлено
        store_region: storeRegion,  // ⭐ Добавлено
        store_phone: normalizedStorePhone,
        store_email: storeEmail,
        store_legal_name: storeLegalName,  // ⭐ Добавлено
        store_tax_id: storeTaxId,  // ⭐ Добавлено
        store_description: storeDescription,
      },
      {
        onSuccess: () => {
          // ⭐ tenant_key уже сохранён в sessionApi.register()
          // Токены уже сохранены, используем navigate для SPA редиректа
          const from = location.state?.from || "/";
          navigate(from, { replace: true });
        },
        onError: (error: any) => {
          console.error("Registration error:", error);
          // Показываем ошибки валидации с бэкенда
          if (error.response?.data) {
            const errors = error.response.data;
            const errorMessages = Object.entries(errors)
              .map(([key, value]) => `${key}: ${value}`)
              .join("\n");
            alert(`Ro'yxatdan o'tishda xatolik:\n${errorMessages}`);
          } else {
            alert("Ro'yxatdan o'tishda xatolik yuz berdi");
          }
        },
      }
    );
  };

  return (
    <div className={styles.reg}>
      <div className={styles.reg__inner}>
        <h3>Ro'yxatdan o'tish</h3>

        <div className={styles.sections__wrapper}>
          {/* СЕКЦИЯ 1: Shaxsiy ma'lumotlar */}
          <div className={styles.section}>
            <h4>Shaxsiy ma'lumotlar</h4>

            <div className={styles.input__wrapper}>
              <label htmlFor="firstName">Ism *</label>
              <input
                type="text"
                id="firstName"
                placeholder="Ismingiz"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="lastName">Familiya</label>
              <input
                type="text"
                id="lastName"
                placeholder="Familiyangiz"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* ⭐ Добавлено: Отчество */}
            <div className={styles.input__wrapper}>
              <label htmlFor="middleName">Otasining ismi</label>
              <input
                type="text"
                id="middleName"
                placeholder="Otangizning ismi"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="username">Login *</label>
              <input
                type="text"
                id="username"
                placeholder="Foydalanuvchi nomi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="email@misol.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="pass">Parol *</label>

              <div className={styles.password}>
                <input
                  id="pass"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Kamida 8 ta belgi"
                  required
                />
                <span
                  className={styles.password__icon}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <HideIcon selected={showPassword} />
                </span>
              </div>
            </div>

            {/* ⭐ Добавлено: Подтверждение пароля */}
            <div className={styles.input__wrapper}>
              <label htmlFor="passConfirm">Parolni tasdiqlang *</label>

              <div className={styles.password}>
                <input
                  id="passConfirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Parolni qaytaring"
                  required
                />
                <span
                  className={styles.password__icon}
                  onClick={() => setShowPasswordConfirm((prev) => !prev)}
                >
                  <HideIcon selected={showPasswordConfirm} />
                </span>
              </div>
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="phone">Telefon raqam *</label>
              <input
                ref={phoneRef}
                type="tel"
                id="phone"
                placeholder="+998 (__) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* СЕКЦИЯ 2: Do'kon ma'lumotlari */}
          <div className={styles.section}>
            <h4>Do'kon ma'lumotlari</h4>

            <div className={styles.input__wrapper}>
              <label htmlFor="storeName">Do'kon nomi *</label>
              <input
                type="text"
                id="storeName"
                placeholder="Do'koningiz nomi"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="storeAddress">Do'kon manzili *</label>
              <input
                type="text"
                id="storeAddress"
                placeholder="Ko'cha, tuman, shahar"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                required
              />
            </div>

            {/* ⭐ Добавлено: Город и регион */}
            <div className={styles.input__wrapper}>
              <label htmlFor="storeCity">Shahar</label>
              <input
                type="text"
                id="storeCity"
                placeholder="Toshkent"
                value={storeCity}
                onChange={(e) => setStoreCity(e.target.value)}
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="storeRegion">Viloyat</label>
              <input
                type="text"
                id="storeRegion"
                placeholder="Toshkent viloyati"
                value={storeRegion}
                onChange={(e) => setStoreRegion(e.target.value)}
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="storePhone">Do'kon telefoni *</label>
              <input
                ref={storePhoneRef}
                type="tel"
                id="storePhone"
                placeholder="+998 (__) ___-__-__"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                required
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="storeEmail">Do'kon email</label>
              <input
                type="email"
                id="storeEmail"
                placeholder="dokon@misol.com"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
              />
            </div>

            {/* ⭐ Добавлено: Юридические данные (скрыто в details) */}
            <details>
              <summary style={{ cursor: "pointer", marginBottom: "10px" }}>
                📋 Yuridik ma'lumotlar (ixtiyoriy)
              </summary>

              <div className={styles.input__wrapper}>
                <label htmlFor="storeLegalName">Yuridik nomi</label>
                <input
                  type="text"
                  id="storeLegalName"
                  placeholder="MChJ Do'kon Osiyo"
                  value={storeLegalName}
                  onChange={(e) => setStoreLegalName(e.target.value)}
                />
              </div>

              <div className={styles.input__wrapper}>
                <label htmlFor="storeTaxId">STIR</label>
                <input
                  type="text"
                  id="storeTaxId"
                  placeholder="123456789"
                  value={storeTaxId}
                  onChange={(e) => setStoreTaxId(e.target.value)}
                />
              </div>
            </details>

            <div className={styles.input__wrapper}>
              <label htmlFor="storeDescription">Do'kon tavsifi</label>
              <textarea
                id="storeDescription"
                placeholder="Do'kon haqida qisqacha..."
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <p className={styles.required__note}>* Majburiy maydonlar</p>

        <button onClick={handleSubmit} className={styles.btn__submit} disabled={register.isPending}>
          {register.isPending ? (
            <Loader color="#fff" size={25} />
          ) : (
            "Ro'yxatdan o'tish"
          )}
        </button>

        <div className={styles.login__link}>
          <p>
            Hisobingiz bormi? <Link to="/auth">Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
