import { App } from "antd";
import { type FC, useEffect } from "react";

//scss
import "./Notification.scss";

type Props = {
  message: string;
  description: string;
  onOpen: boolean;
  type: "success" | "error" | "warning" | "info" | "open";
  placement?:
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "top"
    | "bottom";
};

const Notification: FC<Props> = ({
  message,
  description,
  onOpen,
  type = "open",
  placement,
}) => {
  const { notification } = App.useApp();
  useEffect(() => {
    if (onOpen) {
      notification[type]({
        message,
        description,
        duration: 7,
        className: "notification",
        placement,
      });
    }
  }, [onOpen, message, description, type, placement, notification]);

  return null;
};

export default Notification;
