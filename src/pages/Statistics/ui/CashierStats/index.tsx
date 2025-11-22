import { useState, useMemo } from "react";
import { useCashierStats } from "@/entities/cashier/model/useCashierStats";
import PageTitle from "@/shared/ui/PageTitle";
import Table from "@/shared/ui/Table";
import PeriodSelector from "@/shared/ui/PeriodSelector";
import { getToday, getFirstDayOfMonth } from "@/shared/lib/date/date";
import styles from "./CashierStats.module.scss";

const CashierStats = () => {
  const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
  const [toDate, setToDate] = useState(getToday());
  const [limit, setLimit] = useState<number | undefined>(10);
  const [isOpenRangeCalendar, setIsOpenRangeCalendar] = useState(false);

  // Fetch cashier stats
  const { data, isLoading, isError } = useCashierStats({
    dateFrom: fromDate,
    dateTo: toDate,
    limit,
  });

  const headCols = [
    "#",
    "Kassir",
    "Telefon",
    "Umumiy summa",
    "Naqd",
    "Karta",
    "Sotuvlar soni",
    "Smenalar soni",
  ];

  const bodyCols = useMemo(() => {
    if (!data?.data?.cashiers) return [];

    return data.data.cashiers.map((cashier, index) => ({
      id: cashier.id,
      index: index + 1,
      full_name: cashier.full_name,
      phone: cashier.phone,
      total_sales: `${(parseFloat(cashier.total_sales) || 0).toLocaleString("de-DE")} uzs`,
      cash_sales: `${(parseFloat(cashier.cash_sales) || 0).toLocaleString("de-DE")} uzs`,
      card_sales: `${(parseFloat(cashier.card_sales) || 0).toLocaleString("de-DE")} uzs`,
      sales_count: cashier.sales_count,
      sessions_count: cashier.sessions_count,
    }));
  }, [data]);

  const totalSum = useMemo(() => {
    if (!data?.data?.cashiers) return 0;
    return data.data.cashiers.reduce(
      (acc, cashier) => acc + (parseFloat(cashier.total_sales) || 0),
      0
    );
  }, [data]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <PageTitle>Kassirlar statistikasi</PageTitle>
      </header>

      <div className={styles.filters}>
        <PeriodSelector
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          isOpenRangeCalendar={isOpenRangeCalendar}
          setIsOpenRangeCalendar={setIsOpenRangeCalendar}
        />

        <div className={styles.limitSelector}>
          <label>Ko'rsatish:</label>
          <select
            value={limit || "all"}
            onChange={(e) =>
              setLimit(e.target.value === "all" ? undefined : parseInt(e.target.value))
            }
            className={styles.select}
          >
            <option value="5">Top 5</option>
            <option value="10">Top 10</option>
            <option value="20">Top 20</option>
            <option value="all">Hammasi</option>
          </select>
        </div>
      </div>

      {data?.data?.period && (
        <div className={styles.period}>
          <p>
            Davr: {new Date(data.data.period.from).toLocaleDateString("uz-UZ")} -{" "}
            {new Date(data.data.period.to).toLocaleDateString("uz-UZ")}
          </p>
        </div>
      )}

      {isError && (
        <div className={styles.error}>
          <p>Statistikani yuklashda xatolik yuz berdi</p>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <Table
          headCols={headCols}
          bodyCols={bodyCols}
          headCell={{
            1: {
              className: styles.cell__hash,
            },
          }}
          bodyCell={{
            1: {
              className: styles.row__index,
              align: "center",
            },
            4: {
              className: styles.cell__amount,
            },
            5: {
              className: styles.cell__amount,
            },
            6: {
              className: styles.cell__amount,
            },
          }}
          isLoading={isLoading}
        />
      </div>

      {!isLoading && bodyCols.length === 0 && (
        <div className={styles.empty}>
          <img src="/empty.svg" alt="empty" />
          <p>Tanlangan davrda ma'lumotlar topilmadi</p>
        </div>
      )}

      {bodyCols.length > 0 && (
        <footer className={styles.footer}>
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Kassirlar soni:</span>
              <span className={styles.value}>{data?.data?.total_cashiers || 0}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Umumiy summa:</span>
              <span className={styles.value}>
                {totalSum.toLocaleString("de-DE")} uzs
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default CashierStats;
