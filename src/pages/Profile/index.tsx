import { useEffect, useState } from "react";
import PageTitle from "@/shared/ui/PageTitle";
import { formatUzPhone, normalizePhone } from "@/shared/lib/utils";
import { useProfileInfo } from "@/entities/cashier/model/useProfileInfo";
import { useUpdateProfile } from "@/entities/cashier/model/useUpdateProfile";
import { format, useMask } from "@react-input/mask";
import SelectGender from "@/shared/ui/SelectGender";
import Loader from "@/shared/ui/Loader";

//scss
import styles from "./Profile.module.scss";
import Notification from "@/shared/ui/Notification";

type Gender = "Erkak" | "Ayol" | null;

const maskOptions = {
  mask: "+998 (__) ___-__-__",
  replacement: { _: /\d/ },
  showMask: true,
};

const Profile = () => {
  const [isSelected, setIsSelected] = useState(false);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [gender, setGender] = useState<Gender | string>(null);

  const profile = useProfileInfo();
  const updateProfile = useUpdateProfile();

  const inputRef = useMask(maskOptions);

  useEffect(() => {
    if (profile.data) {
      // Используем структуру из нового API: data.user
      const userData = profile.data?.data?.user;
      const employeeData = profile.data?.data?.employee;

      setName(userData?.first_name || "");
      setSurname(userData?.last_name || "");

      const phoneNumber = employeeData?.phone;
      if (phoneNumber) {
        setPhone(format(phoneNumber.replace(/^\+998/, ""), maskOptions));
      } else {
        setPhone("");
      }

      // В новом API нет поля sex, оставляем пустым или используем default
      setGender("");
    }
  }, [profile.data]);

  const handleUpdateProfile = () => {
    if (!name.trim()) {
      setError("Ismni kiriting");
      return;
    }
    if (!surname.trim()) {
      setError("Familiyani kiriting");
      return;
    }

    if (phone.replace(/\D/g, "").length < 12) {
      setError("Telefon raqamini to‘g‘ri kiriting");
      return;
    }
    const normalizedPhone = normalizePhone(phone);

    updateProfile
      .mutateAsync({
        first_name: name,
        last_name: surname,
        employee: { phone: normalizedPhone, sex: gender ?? "" },
      })
      .then((res) => {
        console.log(res);
      });
    setError(null);
  };


  return (
    <div className={styles.profile} onClick={() => setIsSelected(false)}>
      <PageTitle>Profil</PageTitle>
      <div className={styles.profile__inner}>
        <div className={styles.profile__top}>
          <span className={styles.profile__img}>
            {gender === "Ayol" ? (
              <img src="/female.png" alt="" />
            ) : (
              <img src="/male.png" alt="" />
            )}
          </span>

          <div className={styles.profile__info}>
            <p className={styles.profile__name}>
              {profile.data?.data?.user?.full_name ||
               `${profile.data?.data?.user?.first_name || ''} ${profile.data?.data?.user?.last_name || ''}`}
            </p>
            <span className={styles.profile__phone}>
              {formatUzPhone(profile.data?.data?.employee?.phone)}
            </span>
            {profile.data?.data?.employee?.role_display && (
              <span className={styles.profile__role}>
                {profile.data?.data?.employee?.role_display}
              </span>
            )}
          </div>
        </div>

        <div className={styles.input__wrapper}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Ismingiz*"
          />
          <input
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            type="text"
            placeholder="Familiyangiz*"
          />
          <input
            ref={inputRef}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            type="tel"
            placeholder="+998 (__) ___-__-__"
          />

          <SelectGender
            gender={gender}
            isSelected={isSelected}
            setGender={setGender}
            setIsSelected={setIsSelected}
          />
        </div>
        <p className={styles.validation__error}>{error}</p>
        <button onClick={handleUpdateProfile} className={styles.profile__btn}>
          {updateProfile.isPending ? (
            <Loader color="#fff" size={35} />
          ) : (
            "Saqlash"
          )}
        </button>
      </div>

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description={"Muvaffaqiyatli saqlandi."}
        onOpen={updateProfile.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description={"Xatolik yuz berdi."}
        onOpen={updateProfile.isError}
      />
    </div>
  );
};

export default Profile;
