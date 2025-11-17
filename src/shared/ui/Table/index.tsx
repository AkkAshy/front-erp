import type { FC } from "react";
import styles from "./Table.module.scss";
import { Skeleton } from "antd";

type CellType = {
  [col: number]: {
    className?: string;
    onClick?: React.MouseEventHandler;
    content?: React.ReactNode;
    align?: "start" | "center" | "end";
  };
};

type TableRow = Record<string, any> & { id: string | number };

type Table = {
  headCols: string[];
  bodyCols?: TableRow[];
  headCell: CellType;
  bodyCell: CellType;
  isLoading?: boolean;
};

const Table: FC<Table> = ({
  headCols,
  bodyCols = [],
  headCell,
  bodyCell,
  isLoading,
}) => {
  // if (!bodyCols?.length) return;

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr className={styles.row}>
            {headCols.map((item, index) => {
              const customCell = headCell[index + 1];
              return (
                <th
                  key={index}
                  className={customCell?.className || styles.default__th}
                  onClick={customCell?.onClick}
                  style={{ textAlign: customCell?.align }}
                >
                  {customCell?.content ?? item}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {isLoading
            ? // Показываем Skeleton когда загружается
              Array(7)
                .fill(null)
                .map((_, rowIndex) => (
                  <tr key={`skeleton-${rowIndex}`} className={styles.row}>
                    {headCols.map((_, colIndex) => {
                      const customCell = bodyCell[colIndex + 1];

                      return (
                        <td
                          key={colIndex}
                          className={
                            customCell?.className || styles.default__td
                          }
                        >
                          <div
                            style={{
                              padding: "0 5px",
                            }}
                          >
                            <Skeleton.Button
                              active
                              block // это свойство делает кнопку на всю ширину
                              size="small"
                              style={{ height: "44px" }}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))
            : bodyCols.map(({ id: bodyId, ...bodyRow }) => (
                <tr key={bodyId} className={styles.row}>
                  {headCols.map((_, colIndex) => {
                    const value = Object.values(bodyRow)[colIndex];
                    const customCell = bodyCell[colIndex + 1];

                    return (
                      <td
                        key={colIndex}
                        className={customCell?.className || styles.default__td}
                        onClick={customCell?.onClick}
                        style={{ textAlign: customCell?.align }}
                      >
                        {customCell?.content ?? value}
                      </td>
                    );
                  })}
                </tr>
              ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
