import { useEffect, useState, type FC } from "react";
import { ArrowDownIcon, LinkCircleIcon } from "@/shared/ui/icons";
import { useSendSms } from "@/entities/sms/model/useSendSms";
import { useGetSmsTemplate } from "@/entities/sms/model/useGetSmsTemplate";
import clsx from "clsx";

import { useSendSmsByTemplate } from "@/entities/sms/model/useSendSmsByTemplate";
import Notification from "@/shared/ui/Notification";
import { notifications } from "@/shared/config/notifications";

//scss
import styles from "./SendMessageForm.module.scss";
import Loader from "@/shared/ui/Loader";

type Props = {
  isOpenForm: boolean;
  customers: {
    id: number;
    phone: string;
  }[];
  setIsSmsModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const SendMessageForm: FC<Props> = ({
  isOpenForm,
  setIsSmsModal,
  customers,
}) => {
  const [isOpenTemplate, setIsOpenTemplate] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  const [message, setMessage] = useState("");
  const maxLength = 3000;
  const sendSms = useSendSms();
  const sendSmsByTemplate = useSendSmsByTemplate();
  const getSmsTemplate = useGetSmsTemplate();

  const [templateId, setTemplateId] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessageByTemplate = () => {
    const customer_ids = customers.map((c) => c.id);

    if (!templateId) {
      setError("Shablonni tanlang");
      return; // Добавить return
    }

    if (!customer_ids.length) {
      setError("Mijozni tanlang");
      return; // Добавить return
    }

    sendSmsByTemplate
      .mutateAsync({ id: templateId, customer_ids })
      .then((res) => {
        console.log(res.data);
        clearData();
        setIsSmsModal(false); // Закрыть модалку после успешной отправки
      })
      .catch((error) => {
        console.error("Error sending SMS by template:", error);
        setError("SMS yuborishda xatolik yuz berdi");
      });
  };

  const handleSendCustomMessage = () => {
    const customer_ids = customers.map((c) => c.id);

    if (!message.trim()) {
      setError("Xabaringizni kiriting");
      return;
    }

    if (!customer_ids.length) {
      setError("Mijozni tanlang");
      return; // Добавить return
    }

    sendSms
      .mutateAsync({ customer_ids, text: message })
      .then((res) => {
        console.log(res.data);
        clearData();
        setIsSmsModal(false); // Закрыть модалку
      })
      .catch((error) => {
        console.error("Error sending SMS:", error);
        setError("SMS yuborishda xatolik yuz berdi");
      });
  };

  const handleSend = () => {
    if (templateId) {
      handleSendMessageByTemplate();
    } else {
      handleSendCustomMessage();
    }
  };

  useEffect(() => {
    setPhoneValue(customers[0]?.phone ?? "");
  }, [customers]);

  useEffect(() => {
    if (!isOpenForm) {
      clearData();
    }
  }, [isOpenForm]);

  function clearData() {
    setPhoneValue("");
    setTemplateId(0);
    setMessage("");
    setError(null); 
  }

  return (
    <div
      className={clsx(styles.sms_form, isOpenForm && styles.open)}
      onClick={(e) => {
        setIsOpenTemplate(false);
        e.stopPropagation();
      }}
    >
      <div className={styles.sms_form__inner}>
        <h2 className={styles.sms_form__title}>SMS Yuborish</h2>
        <div className={styles.input__wrapper}>
          {customers.length <= 1 && (
            <>
              <label htmlFor="phone" className={styles.sms_form__label}>
                Telefon raqami <span>*</span>
              </label>
              <input
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)}
                type="tel"
                id="phone"
                placeholder=""
                disabled
              />
            </>
          )}
          <textarea
            disabled={templateId !== 0}
            value={message}
            maxLength={maxLength}
            placeholder="Xabarni kiriting"
            onChange={(e) => {
              setError(null);
              setTemplateId(0);
              setMessage(e.target.value);
            }}
          />

          <span className={styles.char_count}>
            <span
              style={{
                color: message.length === maxLength ? "#FB2C36" : "#475569",
              }}
            >
              {message.length}
            </span>
            /{maxLength}
          </span>
          <p className={styles.validation__error}>{error}</p>
        </div>

        <div className={styles.first_service}>
          <p className={styles.sms_form__label}>
            Servis<span>*</span>
          </p>
          <span className={styles.service__btn}>SMS</span>
          {/* <ul className={styles.service__toggle}>
            <li className={clsx(styles.service__btn, styles.selected)}>SMS</li>
            <li className={styles.service__btn}>TG BOT</li>
          </ul> */}
        </div>

        <div className={styles.second_service}>
          <p className={styles.sms_form__label}>
            Servis
            <span>*</span>
          </p>

          <div
            className={styles.template_service}
            onClick={(e) => {
              setError(null);
              e.stopPropagation();
              setIsOpenTemplate((prev) => !prev);
            }}
          >
            <div className={styles.template__inner}>
              <LinkCircleIcon />
              <p>
                {getSmsTemplate.data?.data?.find(
                  (item) => item.id === templateId
                )?.name ?? "Shablonlar"}
              </p>
            </div>
            <ArrowDownIcon selected={isOpenTemplate} />

            <ul
              className={clsx(
                styles.service__dropdown,
                isOpenTemplate && styles.open
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {Array.isArray(getSmsTemplate.data?.data) && getSmsTemplate.data.data.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    setIsOpenTemplate(false);
                    setTemplateId((prev) => (prev === item.id ? 0 : item.id));
                  }}
                  className={clsx(
                    styles.template__item,
                    templateId === item.id && styles.selected
                  )}
                >
                  {item.name}
                </li>
              ))}
              <li
                className={styles.template__item}
                onClick={() => setIsSmsModal(true)}
              >
                +Yangi Shablon
              </li>
            </ul>
          </div>
        </div>
      </div>
      <button onClick={handleSend} className={styles.submit_btn}>
        {sendSms.isPending ? <Loader color="#fff" size={45} /> : "Yuborish"}
      </button>

      <Notification
        type="success"
        message={"Muvaffaqiyat"}
        description={notifications.sms.sentSuccess}
        onOpen={sendSms.isSuccess || sendSmsByTemplate.isSuccess}
      />
      <Notification
        type="error"
        message={"Xatolik"}
        description={notifications.sms.sentError}
        onOpen={sendSms.isError || sendSmsByTemplate.isError}
      />
    </div>
  );
};

export default SendMessageForm;
