import { type FC } from "react";
import { ArrowDownIcon } from "../icons";
import { useAttributeTypes } from "@/entities/attribute/model/useAttributeTypes";
import clsx from "clsx";

//scss
import styles from "./SelectAttributeType.module.scss";

type Props = {
  attributeTypeId?: number | string;
  setAttributeTypeId: React.Dispatch<React.SetStateAction<number | string>>;
  isAttributeTypeDropdown: boolean;
  setIsAttributeTypeDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  width?: string | number;
  bgColor?: string;
  top?: number;
  label?: string;
  availableIds?: number[]; // Фильтр: показывать только эти ID
};

const SelectAttributeType: FC<Props> = ({
  attributeTypeId,
  setAttributeTypeId,
  isAttributeTypeDropdown,
  setIsAttributeTypeDropdown,
  width = "100%",
  bgColor = "#fff",
  top = 0,
  label = "Атрибут тури",
  availableIds,
}) => {
  const { data: attributeTypesData } = useAttributeTypes();

  // Фильтруем по доступным ID, если они указаны
  const filteredAttributeTypes = availableIds && availableIds.length > 0
    ? attributeTypesData?.results?.filter((item: { id: number }) =>
        availableIds.includes(item.id)
      )
    : attributeTypesData?.results;

  const selectedAttributeType = filteredAttributeTypes?.find(
    (item: { id: number | string }) => item.id === attributeTypeId
  );

  return (
    <div
      className={styles.select__attribute__type}
      style={{
        width,
        backgroundColor: bgColor,
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsAttributeTypeDropdown((prev) => !prev);
      }}
    >
      <div className={styles.toggle__attribute__type}>
        <div className={styles.title__wrapper}>
          <p className={styles.title}>
            {selectedAttributeType ? (
              selectedAttributeType.name
            ) : (
              <span>{label}</span>
            )}
          </p>
        </div>
        <ArrowDownIcon selected={isAttributeTypeDropdown} />
      </div>

      <ul
        className={clsx(
          styles.dropdown,
          isAttributeTypeDropdown && styles.open
        )}
        style={{
          top,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {filteredAttributeTypes &&
        filteredAttributeTypes.length > 0 ? (
          filteredAttributeTypes.map((item: { id: number; name: string }) => (
            <li
              key={item.id}
              className={clsx(
                styles.attribute__type,
                item.id === attributeTypeId && styles.selected
              )}
              onClick={() => {
                setIsAttributeTypeDropdown(false);
                setAttributeTypeId((prev) => (prev === item.id ? "" : item.id));
              }}
            >
              <p>{item.name}</p>
            </li>
          ))
        ) : (
          <li className={styles.no__data}>Ma'lumot topilmadi</li>
        )}
      </ul>
    </div>
  );
};

export default SelectAttributeType;
