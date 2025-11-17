import { useEffect, useState, type FC } from "react";
import { ArrowDownIcon, CheckboxIcon } from "../icons";
import Search from "../Search";
import { useAttributeValues } from "@/entities/attribute/model/useAttributeValues";
import type { AttributeValue } from "@/entities/attribute/api/types";
import clsx from "clsx";

//scss
import styles from "./SelectAttributes.module.scss";

type AttributeValueWithSelection = AttributeValue & {
  selected?: boolean;
};

type Props = {
  isOpenAttributes: boolean;
  setIsOpenAttributes: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCategoryDropdown?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAttributes: React.Dispatch<
    React.SetStateAction<AttributeValueWithSelection[]>
  >;
  selectedAttributes: AttributeValueWithSelection[];
  attributeTypeId?: number;
  label?: string;
};

const SelectAttributes: FC<Props> = ({
  isOpenAttributes,
  setIsOpenAttributes,
  setIsCategoryDropdown,
  setSelectedAttributes,
  selectedAttributes,
  attributeTypeId,
  label = "Атрибуты",
}) => {
  const [search, setSearch] = useState("");
  const { data: attributeValuesData } = useAttributeValues({
    attribute: attributeTypeId,
  });
  const [attributesData, setAttributesData] = useState<
    AttributeValueWithSelection[]
  >([]);

  const isSelectAll =
    attributesData.length > 0 && attributesData.every((item) => item.selected);

  useEffect(() => {
    if (attributeValuesData?.data?.results) {
      setAttributesData(
        attributeValuesData.data.results.map((attr: AttributeValue) => ({
          ...attr,
          selected:
            selectedAttributes.findIndex((s) => s.id === attr.id) !== -1,
        }))
      );
    }
  }, [attributeValuesData?.data?.results]);

  useEffect(() => {
    setSelectedAttributes(attributesData.filter((item) => item.selected));
  }, [attributesData]);

  const toggleSelectAll = () => {
    const newValue = !isSelectAll;
    setAttributesData((prev) =>
      prev.map((item) => ({ ...item, selected: newValue }))
    );
  };

  const toggleAttribute = (id: number) => {
    setAttributesData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Фильтрация по поиску
  const filteredData = attributesData.filter((item) =>
    item.value.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={styles.attributes__wrapper}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpenAttributes((prev) => !prev);
        if (setIsCategoryDropdown) {
          setIsCategoryDropdown(false);
        }
      }}
    >
      <div className={styles.select__attribute}>
        <p className={styles.title}>
          {selectedAttributes.length > 0
            ? selectedAttributes.map((item) => item.value).join(", ")
            : label}
        </p>
        <span className={styles.arrow__down}>
          <ArrowDownIcon selected={isOpenAttributes} />
        </span>
      </div>

      <div
        className={clsx(styles.dropdown, isOpenAttributes && styles.open)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.search__wrapper}>
          <Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none" }}
            placeholder={`${label} qidirish`}
          />
          <span className={styles.checkbox__btn} onClick={toggleSelectAll}>
            <CheckboxIcon selected={isSelectAll} />
          </span>
        </div>
        <span className={styles.line} />
        <ul className={styles.list__attributes}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <li
                key={item.id}
                className={clsx(
                  styles.attribute,
                  item.selected && styles.selected
                )}
                onClick={() => toggleAttribute(item.id)}
              >
                <p className={styles.tile}>{item.value}</p>
                <span className={styles.checkbox}>
                  <CheckboxIcon selected={item.selected} />
                </span>
              </li>
            ))
          ) : (
            <li className={styles.no__data}>Ma'lumot topilmadi</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SelectAttributes;
