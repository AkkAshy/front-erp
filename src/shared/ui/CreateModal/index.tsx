import React, { type FC } from "react";
import { CloseIcon } from "../icons";
import styles from "./CreateModal.module.scss";

type ModalProps = {
  isOpen?: boolean;
  onClose?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  headTitle?: string;
  btnTitle?: string;
  btnClose?: boolean;
  height?: number | string;
  width?: number | string;
  mt?: number | string;
  btnWidth?: number | string;
  btnHeight?: number | string;
  contentHeight?: number | string;
  top?: number | string;
  overflowY?: React.CSSProperties["overflowY"];
  btnPosition?: React.CSSProperties["position"];
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  btnOnClick?: React.MouseEventHandler<HTMLSpanElement>;
};

const CreateModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  headTitle,
  btnTitle,
  btnClose = true,
  height,
  width,
  mt,
  btnWidth,
  btnHeight,
  contentHeight,
  top,
  onClick,
  btnOnClick,
  overflowY,
  btnPosition,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.backdrop__inner} style={{ height, width, top }}>
        {btnClose && (
          <span className={styles.close_btn} onClick={onClose}>
            <CloseIcon />
          </span>
        )}

        <div
          className={styles.modal}
          onClick={(e) => {
            onClick?.(e);
            e.stopPropagation();
          }}
        >
          {headTitle && <h1>{headTitle}</h1>}

          <div
            style={{ marginTop: mt, height: contentHeight, overflowY }}
            className={styles.modal__inner}
          >
            {children}
          </div>

          {btnTitle && (
            <div
              style={{ height: btnHeight, position: btnPosition }}
              className={styles.modal__btns}
            >
              <span
                onClick={btnOnClick}
                style={{ width: btnWidth }}
                className={styles.btn_bottom}
              >
                {btnTitle}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
