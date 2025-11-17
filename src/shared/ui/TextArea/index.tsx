import { type FC } from "react";
import styles from "./TextArea.module.scss";

type Props = {
  height?: number | string;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};

const TextArea: FC<Props> = ({ height, message, setMessage }) => {
  
  const maxLength = 3000;
  return (
    <>
      <textarea
        maxLength={maxLength}
        placeholder="Xabarni kiriting"
        onChange={(e) => setMessage(e.target.value)}
        style={{ height }}
        className={styles.textarea}
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
    </>
  );
};

export default TextArea;
