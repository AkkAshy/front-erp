import { type FC } from "react";
import Table from "@/shared/ui/Table";
import { ConfigProvider, Switch } from "antd";
import StoreSelector from "@/shared/ui/StoreSelector";

import { setPaymentMethods } from "@/entities/appSettings/model/appSettingsSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/providers/StoreProvider/config/store";

//scss
import styles from "./Payment.module.scss";

type SwitcherProps = {
  handleToggle: (id: number, checked: boolean) => void;
  item: { id: number; status: boolean };
};

const Switcher: FC<SwitcherProps> = ({ handleToggle, item }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Switch: {
            colorPrimary: "#8E51FF",
            colorPrimaryHover: "#8E51FF",
            trackHeight: 24,
            trackMinWidth: 44,
            handleSize: 20,
            motionDurationMid: "0.3s",
          },
        },
      }}
    >
      <Switch
        className={styles.switch_btn}
        checked={item.status}
        onChange={(checked) => handleToggle(item.id, checked)}
      />
    </ConfigProvider>
  );
};

const Payment = () => {
  const paymentMethods = useSelector(
    (state: RootState) => state.appSettings.paymentMethods
  );
  const dispatch = useDispatch();

  const handleToggle = (id: number, checked: boolean) => {
    const enabledCount = paymentMethods.filter((m) => m.status).length;
    if (!checked && enabledCount === 1) {
      return;
    }
    dispatch(
      setPaymentMethods(
        paymentMethods.map((row) =>
          row.id === id ? { ...row, status: checked } : row
        )
      )
    );
  };

  return (
    <div className={styles.payment}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <h3>To'lov turi sozlamalari</h3>
        <StoreSelector />
      </div>
      <Table
        headCols={["#", "To’lov turi", "Holati"]}
        bodyCols={paymentMethods.map((item, index) => ({
          id: item.id,
          key: `${index + 1}.`,
          method: item.label,
          content_1: <Switcher handleToggle={handleToggle} item={item} />,
        }))}
        headCell={{
          1: {
            className: styles.cell__hash,
          },
          2: {
            className: styles.method__title,
          },
          3: {
            className: styles.status__title,
          },
        }}
        bodyCell={{
          1: {
            className: styles.row__index,
          },
          2: {
            className: styles.payment__method,
          },
        }}
      />
    </div>
  );
};

export default Payment;
