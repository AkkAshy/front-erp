import type { HTMLInputTypeAttribute } from "react";
import { SearchIcon } from "../icons/actions";
import styles from "./Search.module.scss";

type SearchType = {
  placeholder: string;
  style?: React.CSSProperties;
  value?: string;
  type?: HTMLInputTypeAttribute;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const Search = ({
  placeholder,
  style,
  type = "text",
  value,
  onChange,
}: SearchType) => {
  return (
    <>
      <div className={styles.search__wrapper} style={style}>
        <SearchIcon />
        <input
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
        />
      </div>
    </>
  );
};

export default Search;
