import { type FC } from "react";
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
  // const [isCategoryModal, setIsCategoryModal] = useState(false);
  const categoryData = useCategories();
  const selectedCategory = categoryData?.data?.data.results.find(
    (item) => item.id === categoryId
  );

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
          {categoryData &&
            categoryData.data?.data.results.map((item) => (
              <li
                key={item.id}
                className={clsx(
                  styles.category,
                  item.id === categoryId && styles.selected
                )}
                onClick={() => {
                  setIsCategoryDropdown(false);
                  setCategoryId((prev) => (prev === item.id ? "" : item.id));
                }}
              >
                <p>{item.name}</p>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default SelectCategory;
