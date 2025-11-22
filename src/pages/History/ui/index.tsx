import { useState } from "react";
import Table from "@/shared/ui/Table";
import Search from "@/shared/ui/Search";
import PageTitle from "@/shared/ui/PageTitle";
import StoreSelector from "@/shared/ui/StoreSelector";
import SelectSeller from "@/shared/ui/SelectSeller";
import PeriodSelector from "@/shared/ui/PeriodSelector";
import { useFilteredTransactions } from "@/entities/sales/model/useFilteredTransactions";
import { format, parseISO } from "date-fns";

//scss
import styles from "./History.module.scss";
import TablePagination from "@/shared/ui/Pagination";
import { usePagination } from "@/shared/lib/hooks/usePagination";

const headCols = [
  "#",
  "Savdo sanasi",
  "Savdo ID",
  "Savdo statusi",
  "Sotuvchi",
  "Mah. soni",
  "To’lov turi",
  "Jami savdo",
];

const History = () => {
  const [isOpenRangeCalendar, setIsOpenRangeCalendar] = useState(false);
  const [isOpenSellers, setIsOpenSellers] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState<string>("");
  const [userId, setUserId] = useState<number | string>("");

  const { page, setPage, limit, offset } = usePagination(1, 7);

  const filteredTransactions = useFilteredTransactions({
    transaction_id: search,
    cashier: userId,
    date_from: fromDate,
    date_to: toDate,
    offset,
    limit,
  });

  return (
    <div
      className={styles.history}
      onClick={() => {
        setIsOpenSellers(false);
        setIsOpenRangeCalendar(false);
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <PageTitle>Tarix</PageTitle>
        <StoreSelector />
      </div>
      <header className={styles.history__header}>
        <Search
          type="number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Savdo ID bo'yicha qidirish"
        />

        <SelectSeller
          isOpenSellers={isOpenSellers}
          setIsOpenSellers={setIsOpenSellers}
          userId={userId}
          setUserId={setUserId}
        />

        <PeriodSelector
          isOpenRangeCalendar={isOpenRangeCalendar}
          setIsOpenRangeCalendar={setIsOpenRangeCalendar}
          setFromDate={setFromDate}
          fromDate={fromDate}
          setToDate={setToDate}
          toDate={toDate}
        />
      </header>

      <Table
        headCols={headCols}
        bodyCols={filteredTransactions.data?.data?.results.map(
          (item, index) => {
            return {
              id: item.id,
              index: index + 1 + offset,
              date: format(parseISO(item.created_at), "dd.MM.yyyy-HH:mm"),
              transactions_id: item.receipt_number || item.id,
              status:
                item.status === "completed" ? (
                  <span className={styles.status__сompleted}>Yakunlangan</span>
                ) : item.status === "pending" ? (
                  <span className={styles.status__pending}>Kutilmoqda</span>
                ) : item.status === "cancelled" ? (
                  <span className={styles.status__сancelled}>
                    Bekor qilingan
                  </span>
                ) : (
                  <span className={styles.status__сancelled}>
                    {item.status_display || "Noma'lum"}
                  </span>
                ),
              cashier: item.cashier_name || "Не указан",
              items_count: item.total_quantity ? (parseFloat(item.total_quantity) || 0).toFixed(0) : 0,
              payment_method: "Не указан", // TODO: Нужно добавить информацию о платеже из другого источника
              total_amount:
                (Number(item.total_amount) || 0).toLocaleString(
                  "de-DE"
                ) + " uzs",
            };
          }
        )}
        headCell={{
          1: {
            className: styles.cell__hash,
          },
          6: {
            align: "center",
          },
        }}
        bodyCell={{
          1: {
            className: styles.row__index,
          },

          6: {
            align: "center",
          },
          8: {
            className: styles.total__price,
          },
        }}
        isLoading={filteredTransactions.isLoading}
      />

      {filteredTransactions.data?.data?.results.length === 0 && (
        <div className={styles.empty}>
          <img src="/empty.svg" alt="empty" />
        </div>
      )}

      <TablePagination
        current={page}
        total={filteredTransactions.data?.data?.count || 0}
        pageSize={limit}
        onChange={(p) => setPage(p)}
        
      />
    </div>
  );
};

export default History;
