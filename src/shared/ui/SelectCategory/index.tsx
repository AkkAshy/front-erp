import { type FC, useState, useMemo } from "react";
import CategoryIcon from "../icons/ui/CategoryIcon";
import { ArrowDownIcon } from "../icons";
import { useCategories } from "@/entities/category/model/useCategories";
import clsx from "clsx";

//scss
import styles from "./SelectCategory.module.scss";

type Props = {
  categoryId?: number | string;
  setCategoryId: React.Dispatch<React.SetStateAction<number | string>>;
  isCategoryDropdown: boolean;
  setIsCategoryDropdown: React.Dispatch<React.SetStateAction<boolean>>;

  width: string | number;
  categoryIcon?: boolean;
  bgColor?: string;
  top?: number;
};

const SelectCategory: FC<Props> = ({
  categoryId,
  setCategoryId,
  isCategoryDropdown,
  setIsCategoryDropdown,
  width,
  categoryIcon = true,
  bgColor,
  top,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const categoryData = useCategories();
  const selectedCategory = categoryData?.data?.data?.results?.find(
    (item: { id: number | string }) => item.id === categoryId
  );

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!categoryData?.data?.data?.results) return [];
    if (!searchQuery.trim()) return categoryData.data.data.results;

    return categoryData.data.data.results.filter((item: { name: string }) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categoryData?.data?.data?.results, searchQuery]);

  return (
    <>
      <div
        className={styles.select__category}
        style={{
          width,
          backgroundColor: bgColor,
        }}
        onClick={(e) => {
          e.stopPropagation();
          setIsCategoryDropdown((prev) => !prev);
        }}
      >
        <div className={styles.toggle__category}>
          <div className={styles.title__wrapper}>
            {categoryIcon && <CategoryIcon selected={true} />}
            <p className={styles.title}>
              {selectedCategory ? (
                selectedCategory.name
              ) : (
                <span>Kategoriya</span>
              )}
            </p>
          </div>
          <ArrowDownIcon  selected={isCategoryDropdown}/>
        </div>

        <ul
          className={clsx(styles.dropdown, isCategoryDropdown && styles.open)}
          style={{
            top,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {isCategoryDropdown && (
            <li className={styles.search__wrapper}>
              <input
                type="text"
                className={styles.search__input}
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </li>
          )}
          {filteredCategories.length > 0 ? (
            filteredCategories.map((item: { id: number; name: string }) => (
              <li
                key={item.id}
                className={clsx(
                  styles.category,
                  item.id === categoryId && styles.selected
                )}
                onClick={() => {
                  setIsCategoryDropdown(false);
                  setCategoryId((prev) => (prev === item.id ? "" : item.id));
                  setSearchQuery("");
                }}
              >
                <p>{item.name}</p>
              </li>
            ))
          ) : (
            <li className={styles.no__results}>
              <p>Hech narsa topilmadi</p>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default SelectCategory;
