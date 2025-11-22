import { ConfigProvider, Pagination } from "antd";
import type { FC } from "react";

type Props = {
  current: number;
  total: number;
  pageSize: number;
  bottom?: number;
  onChange: (page: number) => void;
};

const TablePagination: FC<Props> = ({
  current,
  total,
  pageSize,
  onChange,
  bottom = 0,
}) => {
  const style: React.CSSProperties = {
    height: "44px",
    width: "100%",
    marginTop: "auto",
    paddingTop: "20px",
    paddingBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  };
  return (
    <div style={style}>
      <ConfigProvider
        theme={{
          components: {
            Pagination: {
              itemSize: 45, // Размер кнопок (по умолчанию 32)
            },
          },
        }}
      >
        <Pagination
          current={current}
          total={total}
          pageSize={pageSize}
          onChange={onChange}
          showSizeChanger={false}
        />
      </ConfigProvider>
    </div>
  );
};

export default TablePagination;
