import type { FC } from "react";
import { ConfigProvider, Spin } from "antd";

type Props = {
  size?: number;
  color?: string;
  isLoading?: boolean;
  fullScreen?: boolean;
};

const Loader: FC<Props> = ({
  size = 70,
  color = "#8E51FF",
  isLoading,
  fullScreen = false,
}) => {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: color,
          },
          components: {
            Spin: {
              dotSize: size,
            },
          },
        }}
      >
        <Spin fullscreen={fullScreen} spinning={isLoading} />
      </ConfigProvider>
    </>
  );
};
//, fullScreen && styles.active
export default Loader;
