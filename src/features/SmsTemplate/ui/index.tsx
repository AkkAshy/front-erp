import { useState, type FC } from "react";
import CreateModal from "@/shared/ui/CreateModal";
import TextArea from "@/shared/ui/TextArea";
import { useCreateSmsTemplate } from "@/entities/sms/model/useCreateSmsTemplate";

//scss
import styles from "./CreateSmsTemplateModal.module.scss";
import Notification from "@/shared/ui/Notification";

type Props = {
  isSmsModal: boolean;
  setIsSmsModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateSmsTemplateModal: FC<Props> = ({ isSmsModal, setIsSmsModal }) => {
  const [message, setMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  const createSmsTemplate = useCreateSmsTemplate();

  const handleCreateTemplate = () => {
    createSmsTemplate
      .mutateAsync({ name: inputValue, content: message })
      .then((res) => {
        if (res.status === 201) setIsSmsModal(false);
        console.log(res);
      });
  };

  return (
    <>
      <CreateModal
        isOpen={isSmsModal}
        onClose={(e) => {
          e.stopPropagation();
          setIsSmsModal(false);
        }}
        headTitle="Yangi SMS shablon yaratish"
        btnTitle="Yaratish"
        width={768}
        height={561}
        mt={24}
        btnOnClick={handleCreateTemplate}
      >
        <div className={styles.input__wrapper}>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            type="text"
            placeholder="Shablon nomi"
          />
        </div>
        <TextArea message={message} setMessage={setMessage} height={244} />
      </CreateModal>

      <Notification
        type="success"
        message="Muvaffaqiyat"
        description={"Shablon yaratildi!"}
        onOpen={createSmsTemplate.isSuccess}
      />

      <Notification
        type="error"
        message="Xatolik"
        description={"Shablon yaratishda xatolik!"}
        onOpen={createSmsTemplate.isError}
      />
    </>
  );
};

export default CreateSmsTemplateModal;
