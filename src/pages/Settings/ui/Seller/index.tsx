import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/entities/cashier/model/useFilteredUsers";
import { useEmployees } from "@/entities/cashier/model/useEmployees";
import { useEmployee } from "@/entities/cashier/model/useEmployee";
import { useCreateUser } from "@/entities/cashier/model/useCreateUser";
import { useCreateEmployee } from "@/entities/cashier/model/useCreateEmployee";
import { useUpdateUser } from "@/entities/cashier/model/useUpdateUser";
import { useUpdateEmployee } from "@/entities/cashier/model/useUpdateEmployee";
import { useUpdateEmployeeData } from "@/entities/cashier/model/useUpdateEmployeeData";
import { useChangePassword } from "@/entities/cashier/model/useChangePassword";
import { useToggleActiveUser } from "@/entities/cashier/model/useActiveUser";
import DeleteConfirmModal from "@/features/DeleteConfirmModal/ui";

import { EditIcon, HideIcon, MoreIcon } from "@/shared/ui/icons";
import Table from "@/shared/ui/Table";
import CreateModal from "@/shared/ui/CreateModal";
import SelectGender from "@/shared/ui/SelectGender";
import DashedButton from "@/shared/ui/DashedButton";
import StoreSelector from "@/shared/ui/StoreSelector";

import { Checkbox, ConfigProvider } from "antd";

//scss
import styles from "./Seller.module.scss";
import SelectRole from "@/shared/ui/SelectRole";
import { isEmail, isStrongPassword, normalizePhone } from "@/shared/lib/utils";
import { format, useMask } from "@react-input/mask";
import Notification from "@/shared/ui/Notification";

type Gender = "Erkak" | "Ayol" | null;

const maskOptions = {
  mask: "+998 (__) ___-__-__",
  replacement: { _: /\d/ },
  showMask: true,
};

// Маппинг для конвертации gender между фронтендом и бэкендом
const genderToBackend = (frontendGender: string): string => {
  if (frontendGender === "Erkak") return "male";
  if (frontendGender === "Ayol") return "female";
  return frontendGender;
};

const genderFromBackend = (backendGender: string): Gender | string => {
  if (backendGender === "male") return "Erkak";
  if (backendGender === "female") return "Ayol";
  return backendGender;
};
type RoleItem = {
  label: string;
  role: string;
};
// @ts-expect-error - будет использоваться позже
const mapRole: RoleItem[] = [
  {
    label: "sohib",
    role: "owner",
  },
  {
    label: "menedjer",
    role: "manager",
  },
  {
    label: "kassir",
    role: "cashier",
  },
  {
    label: "omborchi",
    role: "stockkeeper",
  },
];

const Seller = () => {
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [createWithAccount, setCreateWithAccount] = useState(false);

  // Используем useEmployees для получения всех сотрудников (и с User, и без)
  const employees = useEmployees({ is_active: isActive });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender | string>("");
  const [role, setRole] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const inputRef = useMask(maskOptions);

  const [deleteId, setDeleteId] = useState(0);
  const [updateId, setUpdateId] = useState<string | number>("");

  // Хранение оригинальных значений для сравнения
  const [originalData, setOriginalData] = useState({
    name: "",
    phone: "",
    email: "",
    login: "",
    password: "",
    gender: "",
  });

  const queryClient = useQueryClient();
  const toggleActive = useToggleActiveUser();
  const [isToggling, setIsToggling] = useState(false);
  const createUser = useCreateUser();
  const createEmployee = useCreateEmployee();
  const updateUser = useUpdateUser();
  const updateEmployee = useUpdateEmployee();
  const updateEmployeeData = useUpdateEmployeeData();
  const changePassword = useChangePassword();

  // Загружаем данные Employee (работает для всех сотрудников)
  const currentEmployee = useEmployee(isOpenUpdate ? Number(updateId) : 0);

  // Загружаем User данные только если у Employee есть связанный User
  const currentUser = useUser({
    id: isOpenUpdate && currentEmployee.data?.user ? currentEmployee.data.user : "",
  });

  function clearData() {
    setName("");
    setPhone("");
    setLogin("");
    setPassword("");
    setGender(null);
    setEmail("");
    setError(null);
    setRole(null);
    setCreateWithAccount(false);
  }

  function handleCreate() {
    if (!name.trim()) {
      setError("Ismni kiriting");
      return;
    }
    if (phone.replace(/\D/g, "").length < 12) {
      setError("Telefon raqamini to'g'ri kiriting");
      return;
    }

    // Валидация для создания с User аккаунтом
    // Для ролей кроме cashier - поля обязательны
    const requiresAccount = createWithAccount || (role && role !== "cashier");

    if (requiresAccount) {
      if (!isEmail(email)) {
        setError("Emailni to'g'ri kiriting");
        return;
      }

      if (!login.trim()) {
        setError("Loginni kiriting");
        return;
      }

      if (!isStrongPassword(password)) {
        setError(
          "Parol katta harf, raqam va kamida 6 ta belgidan iborat bo'lishi kerak"
        );
        return;
      }
    }

    if (!gender) {
      setError("Jinsni tanlang");
      return;
    }
    if (!role) {
      setError("Role tanlang");
      return;
    }
    setError(null);
    const normalizedPhone = normalizePhone(phone);

    // Разделяем имя на first_name и last_name
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    // Для всех ролей кроме cashier создаём User с аккаунтом
    const shouldCreateUser = requiresAccount;

    if (shouldCreateUser) {
      // Создаём User с аккаунтом
      createUser
        .mutateAsync({
          username: login,
          password: password,
          first_name: name,
          phone: normalizedPhone,
          sex: genderToBackend(gender),
          email,
          role: role || "cashier",
        })
        .then((res) => {
          if (res.status === 201) {
            setIsOpenCreate(false);
            clearData();
          }
        });
    } else {
      // Создаём простого Employee без аккаунта (только для cashier без чекбокса)
      createEmployee
        .mutateAsync({
          first_name: firstName,
          last_name: lastName,
          phone: normalizedPhone,
          role: (role as "cashier" | "stockkeeper" | "manager") || "cashier",
          sex: genderToBackend(gender) === "male" ? "M" : genderToBackend(gender) === "female" ? "F" : undefined,
        })
        .then((res) => {
          if (res.status === 201) {
            setIsOpenCreate(false);
            clearData();
          }
        });
    }
  }

  function handleUpdate() {
    if (!name.trim()) {
      setError("Ismni kiriting");
      return;
    }
    if (phone.replace(/\D/g, "").length < 12) {
      setError("Telefon raqamini to'g'ri kiriting");
      return;
    }

    const hasUser = currentEmployee.data?.user;

    // Валидация для Employee с User аккаунтом
    if (hasUser) {
      if (!isEmail(email)) {
        setError("Emailni to'g'ri kiriting");
        return;
      }

      if (!login.trim()) {
        setError("Loginni kiriting");
        return;
      }

      // Проверяем пароль только если он введён
      if (password && !isStrongPassword(password)) {
        setError(
          "Parol katta harf, raqam va kamida 6 ta belgidan iborat bo'lishi kerak"
        );
        return;
      }
    }

    if (!gender) {
      setError("Jinsni tanlang");
      return;
    }

    setError(null);
    const normalizedPhone = normalizePhone(phone);

    if (hasUser) {
      // Обновляем Employee с User аккаунтом (используем старую логику)
      const profileChanges: any = {};
      if (name !== originalData.name) profileChanges.first_name = name;
      if (email !== originalData.email) profileChanges.email = email;
      if (login !== originalData.login) profileChanges.username = login;

      const phoneChanged = normalizedPhone !== normalizePhone(originalData.phone);
      const genderChanged = gender !== originalData.gender;
      const passwordChanged = password && password.trim();

      const hasChanges = Object.keys(profileChanges).length > 0 || phoneChanged || genderChanged || passwordChanged;

      if (!hasChanges) {
        setIsOpenUpdate(false);
        clearData();
        return;
      }

      let updateChain = Promise.resolve({ status: 200 } as any);

      if (Object.keys(profileChanges).length > 0) {
        updateChain = updateChain.then(() =>
          updateUser.mutateAsync({
            id: currentEmployee.data?.user!,
            ...profileChanges,
          })
        );
      }

      if (passwordChanged) {
        updateChain = updateChain.then((res) => {
          if (res.status === 200) {
            return changePassword.mutateAsync({
              id: currentEmployee.data?.user!,
              new_password: password,
            });
          }
          throw new Error("Failed to update user");
        });
      }

      if (phoneChanged || genderChanged) {
        const employeeChanges: any = {};
        if (phoneChanged) employeeChanges.phone = normalizedPhone;
        if (genderChanged) employeeChanges.sex = genderToBackend(gender);

        updateChain = updateChain.then((res) => {
          if (res.status === 200) {
            return updateEmployee.mutateAsync({
              id: currentEmployee.data?.user!,
              ...employeeChanges,
            });
          }
          throw new Error("Failed to change password");
        });
      }

      updateChain
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          queryClient.invalidateQueries({ queryKey: ["employees"] });
          setIsOpenUpdate(false);
          clearData();
        })
        .catch((error) => {
          console.error("Update error:", error);
          setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
        });
    } else {
      // Обновляем Employee без User (используем updateEmployeeData)
      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      const employeeChanges: any = {};
      if (firstName !== currentEmployee.data?.first_name) employeeChanges.first_name = firstName;
      if (lastName !== currentEmployee.data?.last_name) employeeChanges.last_name = lastName;
      if (normalizedPhone !== currentEmployee.data?.phone) employeeChanges.phone = normalizedPhone;

      // Конвертируем gender в backend формат
      const backendSex = genderToBackend(gender) === "male" ? "M" : genderToBackend(gender) === "female" ? "F" : undefined;
      if (backendSex && backendSex !== currentEmployee.data?.sex) {
        employeeChanges.sex = backendSex;
      }

      if (Object.keys(employeeChanges).length === 0) {
        setIsOpenUpdate(false);
        clearData();
        return;
      }

      updateEmployeeData
        .mutateAsync({
          id: Number(updateId),
          data: employeeChanges,
        })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["employees"] });
          queryClient.invalidateQueries({ queryKey: ["cashiers"] });
          setIsOpenUpdate(false);
          clearData();
        })
        .catch((error) => {
          console.error("Update error:", error);
          setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
        });
    }
  }

  function handleDelete(id: number) {
    setIsToggling(true);
    toggleActive
      .mutateAsync({ id, is_active: !isActive })
      .then(() => {
        setIsDeleteModal(false);
        setDeleteId(0);
      })
      .finally(() => {
        setIsToggling(false); // Сбрасываем флаг
      });
  }

  useEffect(() => {
    if (!isOpenUpdate || !currentEmployee.data) return;

    const employee = currentEmployee.data;
    const hasUser = !!employee.user;

    if (hasUser && currentUser.data?.employee_info) {
      // У Employee есть связанный User - используем данные User
      const data = currentUser.data;
      const firstName = data.first_name ?? "";
      const phoneNumber = data.employee_info?.phone || "";
      const formattedPhone = phoneNumber ? format(phoneNumber.replace(/^\+998/, ""), maskOptions) : "";
      const emailValue = data.email ?? "";
      const usernameValue = data.username ?? "";

      const backendGender = data.employee_info?.sex ?? "";
      const frontendGender = genderFromBackend(backendGender);

      setName(firstName);
      setPhone(formattedPhone);
      setEmail(emailValue);
      setLogin(usernameValue);
      setPassword("");
      setGender(frontendGender);

      setOriginalData({
        name: firstName,
        phone: formattedPhone,
        email: emailValue,
        login: usernameValue,
        password: "",
        gender: frontendGender || "",
      });
    } else {
      // Employee без User - используем данные напрямую из Employee
      const fullName = employee.full_name || `${employee.first_name || ""} ${employee.last_name || ""}`.trim();
      const phoneNumber = employee.phone || "";
      const formattedPhone = phoneNumber ? format(phoneNumber.replace(/^\+998/, ""), maskOptions) : "";

      // Конвертируем sex из "M"/"F" в "Erkak"/"Ayol"
      let frontendGender: Gender | string = "";
      if (employee.sex === "M") frontendGender = "Erkak";
      else if (employee.sex === "F") frontendGender = "Ayol";

      setName(fullName);
      setPhone(formattedPhone);
      setEmail(""); // Employee без User не имеет email
      setLogin(""); // Employee без User не имеет login
      setPassword("");
      setGender(frontendGender);

      setOriginalData({
        name: fullName,
        phone: formattedPhone,
        email: "",
        login: "",
        password: "",
        gender: frontendGender || "",
      });
    }
  }, [currentEmployee.data, currentUser.data, updateId, isOpenUpdate]);

  return (
    <div className={styles.seller}>
      <div className={styles.header}>
        <h3>Ishchilar sozlamalari</h3>

        <span className={styles.checkbox}>
          <span className={styles.text}>
            {isActive ? "Faol ishchilar" : "Faol emas ishchilar"}
          </span>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#8E51FF", // Зеленый вместо синего
              },
            }}
          >
            <Checkbox
              style={{ transform: "scale(1.8)", borderColor: "red" }}
              className={styles.checkbox__input}
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </ConfigProvider>
        </span>
      </div>

      {/* ⭐ Выбор магазина для добавления работников */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
          Ishchi qo'shmoqchi bo'lgan do'konni tanlang:
        </p>
        <StoreSelector />
      </div>

      <DashedButton onClick={() => setIsOpenCreate(true)}>
        + Yangi ishchilar qoshish
      </DashedButton>
      <Table
        headCols={[
          "#",
          "Ishchi ismi",
          "Telefon raqami",
          "Role",
          "Login",
          "Parol",
          "",
          "",
        ]}
        bodyCols={employees.data?.results.map((item, index) => ({
          id: item.id,
          key: `${index + 1}.`,
          first_name: item.full_name || `${item.first_name || ""} ${item.last_name || ""}`.trim() || "-",
          phone: item.phone || "-",
          role: item.role_display || item.role || "-",
          login: item.user ? "User ID: " + item.user : "-",
          password: "-",
          content_1: (
            <div
              onClick={() => {
                console.log("Opening edit modal for user:", item.id);
                setUpdateId(item.id);
                setIsOpenUpdate(true);
                // Принудительно инвалидируем кэш для конкретного пользователя
                queryClient.invalidateQueries({
                  queryKey: ["user", item.id]
                });
              }}
            >
              <EditIcon />
            </div>
          ),

          content_2: (
            <div
              onClick={() => {
                setDeleteId(item.id);
                setIsDeleteModal(true);
              }}
            >
              {/* {item.is_active_in_store ? (
                <DeleteIcon />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="5" x="2" y="3" rx="1" />
                  <path d="M4 8v11a2 2 0 0 0 2 2h2" />
                  <path d="M20 8v11a2 2 0 0 1-2 2h-2" />
                  <path d="m9 15 3-3 3 3" />
                  <path d="M12 12v9" />
                </svg>
              )} */}
              <HideIcon
                width={32}
                height={32}
                stroke="#8E51FF"
                selected={!item.is_active}
              />
            </div>
          ),
        }))}
        headCell={{
          1: {
            className: styles.cell__hash,
          },
          8: {
            className: styles.thead__more,
            content: <MoreIcon />,
          },
        }}
        bodyCell={{
          1: {
            className: styles.row__index,
          },
          7: {
            className: styles.edit__btn,
          },
          8: {
            className: styles.delete__btn,
          },
        }}
        isLoading={employees.isLoading}
      />
      {(employees.data?.results.length === 0 || !employees.data) && (
        <div className={styles.empty}>
          <img src="/empty.svg" alt="empty" />
        </div>
      )}
      <CreateModal
        isOpen={isOpenCreate || isOpenUpdate}
        onClose={() => {
          setIsOpenCreate(false);
          setIsOpenUpdate(false);
          setIsSelected(false);
          clearData();
        }}
        headTitle={isOpenUpdate ? "Ishchi tahrirlash" : "Yangi ishchi qoshish"}
        btnTitle={isOpenUpdate ? "O’zgartirish" : "Yaratish"}
        width={964}
        height={693}
        overflowY="hidden"
        btnWidth={"100%"}
        btnHeight={64}
        onClick={(e) => {
          setIsSelected(false);
          setIsRoleOpen(false);
          e.stopPropagation();
        }}
        btnOnClick={() => {
          if (isOpenUpdate) {
            handleUpdate();
          } else {
            handleCreate();
          }
        }}
      >
        {!isOpenUpdate && role === "cashier" && (
          <div className={styles.checkbox} style={{ marginBottom: '16px' }}>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#8E51FF",
                },
              }}
            >
              <Checkbox
                checked={createWithAccount}
                onChange={(e) => setCreateWithAccount(e.target.checked)}
              />
            </ConfigProvider>
            <span className={styles.text} style={{ fontSize: '16px' }}>
              Login va parol bilan akkaunt yaratish
            </span>
          </div>
        )}

        {!isOpenUpdate && role && role !== "cashier" && (
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
            <span style={{ fontSize: '14px', color: '#0369a1' }}>
              ℹ️ Bu rol uchun login va parol majburiy
            </span>
          </div>
        )}

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Ishchi ismi"
        />
        <div className={styles.form__wrapper}>
          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Telefon raqami</p>

            <input
              ref={inputRef}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              type="tel"
              placeholder="+998 (__) ___-__-__"
            />
          </div>
          {((createWithAccount && role === "cashier") || (role && role !== "cashier")) && !isOpenUpdate && (
            <div className={styles.input__wrapper}>
              <p className={styles.label__input}>Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="example@gmail.com"
              />
            </div>
          )}
          {isOpenUpdate && (
            <div className={styles.input__wrapper}>
              <p className={styles.label__input}>Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="example@gmail.com"
              />
            </div>
          )}
        </div>

        {(((createWithAccount && role === "cashier") || (role && role !== "cashier")) || isOpenUpdate) && (
          <div className={styles.form__wrapper}>
            <div className={styles.input__wrapper}>
              <p className={styles.label__input}>Login</p>
              <input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                type="text"
                placeholder="username"
                autoComplete="off"
              />
            </div>

            <div className={styles.input__wrapper}>
              <p className={styles.label__input}>
                Parol {isOpenUpdate && <span style={{ opacity: 0.6, fontSize: '12px' }}>(bo'sh qoldiring o'zgartirmaslik uchun)</span>}
              </p>
              <div className={styles.password}>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder={isOpenUpdate ? "Yangi parol (ixtiyoriy)" : "password"}
                  autoComplete="new-password"
                />
                <span
                  className={styles.password__icon}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <HideIcon selected={showPassword} />
                </span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.form__wrapper}>
          <div className={styles.input__wrapper}>
            <p className={styles.label__input}>Ishchi jinsi</p>

            <SelectGender
              gender={gender}
              isSelected={isSelected}
              setGender={setGender}
              setIsSelected={setIsSelected}
            />
          </div>
          {!isOpenUpdate && (
            <div className={styles.input__wrapper}>
              <p className={styles.label__input}>Ishchi roli</p>
              <SelectRole
                role={role}
                setRole={setRole}
                setIsRoleOpen={setIsRoleOpen}
                isRoleOpen={isRoleOpen}
              />
            </div>
          )}
        </div>
        <p className={styles.validation__error}>{error}</p>
      </CreateModal>

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Ishchi qo'shildi!"
        onOpen={createUser.isSuccess || createEmployee.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description="Ishchi qo'shilmadi!"
        onOpen={createUser.isError || createEmployee.isError}
      />

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description="Ishchi ma'lumotlari yangilandi!"
        onOpen={updateUser.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description="Ma'lumotlar yangilanmadi!"
        onOpen={updateUser.isError}
      />

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description={
          isActive
            ? "Ishchi faoliyati to'xtatildi!"
            : "Ishchi faoliyati qayta tiklandi!"
        }
        onOpen={toggleActive.isSuccess && isToggling}
      />

      <Notification
        type="error"
        message="Xatolik"
        description={
          isActive
            ? "Ishchi faoliyatini to'xtatib bo'lmadi!"
            : "Ishchi faoliyatini tiklab bo'lmadi!"
        }
        onOpen={toggleActive.isError && isToggling}
      />

      {isDeleteModal && (
        <DeleteConfirmModal
          onClick={() => handleDelete(deleteId)}
          setIsDeleteModal={setIsDeleteModal}
        />
      )}
    </div>
  );
};

export default Seller;
