import { useEffect, useState, type FC } from "react";
import { ArrowDownIcon, CheckboxIcon } from "../icons";
import Search from "../Search";
import { useFilteredSizes } from "@/entities/product/model/useFilteredSizes";
import type { SizeItem } from "@/entities/product/api/types";
import clsx from "clsx";
//scss
import styles from "./SelectSizes.module.scss";

type Props = {
  isOpenSizes: boolean;
  setIsOpenSizes: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCategoryDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSizes: React.Dispatch<React.SetStateAction<SizeItem[]>>;
  selectedSizes: SizeItem[];
};

const SelectSizes: FC<Props> = ({
  isOpenSizes,
  setIsOpenSizes,
  setIsCategoryDropdown,
  setSelectedSizes,
  selectedSizes,
}) => {
  const [search, setSearch] = useState("");
  const filteredSizes = useFilteredSizes({ search });
  const [sizesData, setSizesData] = useState<SizeItem[]>([]);

  const isSelectAll =
    sizesData.length > 0 && sizesData.every((item) => item.selected);

  useEffect(() => {
    if (filteredSizes.data?.data.results) {
      setSizesData(filteredSizes.data?.data.results);
    }
  }, [filteredSizes.data?.data.results]);

  useEffect(() => {
    setSelectedSizes(sizesData.filter((item) => item.selected));
  }, [sizesData]);

  const toggleSelectAll = () => {
    const newValue = !isSelectAll;
    setSizesData((prev) =>
      prev.map((item) => ({ ...item, selected: newValue }))
    );
  };

  const toggleSize = (id: number) => {
    setSizesData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  return (
    <div
      className={styles.sizes__wrapper}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpenSizes((prev) => !prev);
        setIsCategoryDropdown(false);
      }}
    >
      <div className={styles.select__size}>
        <p className={styles.title}>
          {selectedSizes?.map((item) => item.size).join(", ")}
        </p>
        <span className={styles.arrow__down}>
          <ArrowDownIcon  selected={isOpenSizes}/>
        </span>
      </div>

      <div
        className={clsx(styles.dropdown, isOpenSizes && styles.open)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.search__wrapper}>
          <Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "none" }}
            placeholder="Razmer qidirish"
          />
          <span className={styles.checkbox__btn} onClick={toggleSelectAll}>
            <CheckboxIcon selected={isSelectAll} />
          </span>
        </div>
        <span className={styles.line} />
        <ul className={styles.list__sizes}>
          {sizesData?.map((item) => (
            <li
              key={item.id}
              className={clsx(styles.size, item.selected && styles.selected)}
              onClick={() => toggleSize(item.id)}
            >
              <p className={styles.tile}>{item.size}</p>
              <span className={styles.checkbox}>
                <CheckboxIcon selected={item.selected} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectSizes;
