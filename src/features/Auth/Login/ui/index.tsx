import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLogin } from "../api/useLogin";
import Notification from "@/shared/ui/Notification";
import Loader from "@/shared/ui/Loader";
import { HideIcon } from "@/shared/ui/icons";

//scss
import styles from "./LoginForm.module.scss";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();

  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault();

    if (!username || !password) {
      return;
    }

    login.mutate(
      { username, password },
      {
        onSuccess: () => {
          // Токены уже сохранены в sessionApi.login()
          // Делаем полную перезагрузку страницы для обновления всех компонентов
          const from = location.state?.from || "/";
          window.location.href = from;
        },
      }
    );
  };

  return (
    <div className={styles.auth}>
      <div className={styles.auth__inner}>
        <div className={styles.logo}>
          <img src="/logo.svg" alt="logo" />
          <p>iMaster</p>
        </div>

        <h3>Tizimga kirish</h3>

        <form onSubmit={handleSubmit} className={styles.sections__wrapper}>
          <div className={styles.section}>
            <div className={styles.input__wrapper}>
              <label htmlFor="username">Login</label>
              <input
                type="text"
                id="username"
                placeholder="Foydalanuvchi nomi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className={styles.input__wrapper}>
              <label htmlFor="password">Parol</label>

              <div className={styles.password}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  
                  placeholder="Parolingizni kiriting"
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

          <button type="submit" className={styles.btn__submit}>
            {login.isPending ? <Loader color="#fff" size={25} /> : "Kirish"}
          </button>
        </form>

        <div className={styles.login__link}>
          <p>
            Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
          </p>
        </div>
      </div>

      <Notification
        message="Muvaffaqiyat"
        description="Siz muvaffaqiyatli tizimga kirdingiz."
        onOpen={login.isSuccess}
        type="success"
      />

      <Notification
        message="Xatolik"
        description="Login yoki parol noto'g'ri"
        onOpen={login.isError}
        type="error"
      />
    </div>
  );
};

export default LoginForm;
