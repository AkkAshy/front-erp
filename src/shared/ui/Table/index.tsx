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
  onRowClick?: (row: TableRow) => void;
};

const Table: FC<Table> = ({
  headCols,
  bodyCols = [],
  headCell,
  bodyCell,
  isLoading,
  onRowClick,
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
                <tr
                  key={bodyId}
                  className={styles.row}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {headCols.map((_, colIndex) => {
                    const value = Object.values(bodyRow)[colIndex];
                    const customCell = bodyCell[colIndex + 1];

                    return (
                      <td
                        key={colIndex}
                        className={customCell?.className || styles.default__td}
                        onClick={(e) => {
                          // Если у ячейки есть свой onClick (например, кнопки редактирования/удаления),
                          // используем его и не вызываем onRowClick
                          if (customCell?.onClick) {
                            customCell.onClick(e);
                          } else if (onRowClick) {
                            // Иначе вызываем обработчик клика на строку
                            onRowClick({ id: bodyId, ...bodyRow });
                          }
                        }}
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
