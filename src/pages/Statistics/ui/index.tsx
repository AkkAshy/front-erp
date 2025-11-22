import { useEffect, useMemo, useRef, useState } from "react";
import SalesChart from "@/shared/ui/Charts/SalesChart";
import PaymentChart from "@/shared/ui/Charts/PaymentChart";
import PeriodSelector from "@/shared/ui/PeriodSelector";
import StoreSelector from "@/shared/ui/StoreSelector";
import DownloadIcon from "@/shared/ui/icons/ui/DownloadIcon";
import PageTitle from "@/shared/ui/PageTitle";
import { ArrowDownIcon, ArrowRightIcon, ClockIcon } from "@/shared/ui/icons";
import { getTenantKey } from "@/shared/api/auth/tokenService";

import { useSalesSummary } from "@/entities/analytics/model/useSalesSummary";
import { useTopProducts } from "@/entities/analytics/model/useTopProducts";
import { useTopCustomers } from "@/entities/analytics/model/useTopCustomers";
import { useTransactionsByDay } from "@/entities/analytics/model/useTransactionsByDay";
import { useCashierStats } from "@/entities/cashier/model/useCashierStats";
import { getToday, getYesterday } from "@/shared/lib/date/date";
import { mapPaymentSummary } from "@/shared/lib/utils/mapPaymentSummary";
import { buildSummaryItems } from "@/shared/lib/utils/buildSummaryItems";
import { percentOfTotal } from "@/shared/lib/math/percent";
import HorizontalDnd from "@/shared/ui/DnD/HorizontalDnd";

import clsx from "clsx";

//scss
import styles from "./Statistics.module.scss";
import { downloadPDF } from "@/shared/lib/utils/downloadToPdf";
import { useNavigate } from "react-router-dom";
import { getDateRange } from "@/shared/lib/date/getDateRange";

const dropdownItems = [
  {
    key: "15d",
    title: "15 kun",
    selected: false,
  },
  {
    key: "1m",
    title: "1 oy",
    selected: false,
  },
  {
    key: "3m",
    title: "3 oy",
    selected: false,
  },
  {
    key: "6m",
    title: "6 oy",
    selected: false,
  },
  {
    key: "1y",
    title: "1 yil",
    selected: false,
  },
];

const Statistics = () => {
  const [selectedRange, setSelectedRange] = useState("");
  const [isToggleRange, setIsToggleRange] = useState(false);
  const [isOpenRangeCalendar, setIsOpenRangeCalendar] = useState(false);
  const [fromDate, setFromDate] = useState(getToday());
  const [toDate, setToDate] = useState(getToday());
  const ref = useRef(null);

  const navigate = useNavigate();

  const topProducts = useTopProducts({
    limit: 5,
    order_by: "revenue",
  });

  const topProductsTotal = useMemo(
    () =>
      topProducts.data?.top_products.reduce(
        (acc, curr) => acc + curr.total_quantity,
        0
      ) ?? 0,
    [topProducts.data]
  );

  // useTopCustomers получает топ клиентов из customer-analytics и сортирует по monetary
  const topCustomers = useTopCustomers(5);

  // Top cashiers stats
  const topCashiers = useCashierStats({
    dateFrom: fromDate || getToday(),
    dateTo: toDate || getToday(),
    limit: 5,
  });

  const transactionsByDay = useTransactionsByDay({
    date_from: fromDate || getToday(),
    date_to: toDate || getToday(),
  });

  const paymentSummary = useSalesSummary({
    start_date: fromDate || getToday(),
    end_date: toDate || getToday(),
  });

  const getTodaySummary = useSalesSummary({
    start_date: getToday(),
    end_date: getToday(),
  });

  const getYesterdaySummary = useSalesSummary({
    start_date: getYesterday(),
    end_date: getYesterday(),
  });

  const today = {
    amount: getTodaySummary.data?.total_amount ?? 0,
    transactions: getTodaySummary.data?.total_transactions ?? 0,
    items: getTodaySummary.data?.total_items_sold ?? 0,
  };

  const yesterday = {
    amount: getYesterdaySummary.data?.total_amount ?? 0,
    transactions: getYesterdaySummary.data?.total_transactions ?? 0,
    items: getYesterdaySummary.data?.total_items_sold ?? 0,
  };

  const summaryItems = buildSummaryItems(today, yesterday, {
    total_amount: paymentSummary.data?.total_amount ?? 0,
    total_transactions: paymentSummary.data?.total_transactions ?? 0,
    total_items_sold: paymentSummary.data?.total_items_sold ?? 0,
  });

  const paymentItems = mapPaymentSummary(
    paymentSummary.data?.payment_summary ?? [],
    paymentSummary.data?.total_amount ?? 0
  );

  const pieChartData = paymentItems.map((item) => ({
    name: item.method,
    value: item.price || 1,
  }));

  useEffect(() => {
    if (selectedRange) {
      try {
        const { startDate, endDate } = getDateRange(selectedRange);
        setFromDate(startDate);
        setToDate(endDate);
      } catch (error) {
        console.error("Invalid period:", error);
      }
    }
  }, [selectedRange]);

  const storeSelected = !!getTenantKey();

  return (
    <div
      ref={ref}
      className={styles.statistics}
      onClick={() => {
        setIsOpenRangeCalendar(false);
        setIsToggleRange(false);
      }}
    >
      <header className={styles.header}>
        <div className={styles.header__top}>
          <div className={styles.header__left}>
            <PageTitle>Hisobotlar</PageTitle>
            <StoreSelector />
          </div>

          <span
            className={styles.download__btn}
            onClick={() => {
              if (ref.current) {
                downloadPDF(ref.current, "statistics.pdf");
              }
            }}
          >
            <DownloadIcon />
          </span>
        </div>
        {storeSelected && <HorizontalDnd summaryItems={summaryItems} />}

        {/* <ul className={styles.summary__list}>
          {summaryItems.map((item, index) => (
            <li key={index} className={styles.summary__item}>
              <p className={styles.title}>{item.title}</p>
              <span
                className={clsx(
                  styles.change,
                  item.change.includes("+") && styles.grow
                )}
              >
                {item.change}
              </span>
              <span className={styles.value}>{item.value}</span>
            </li>
          ))}
        </ul> */}
      </header>

      {!storeSelected && (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: '#f9f9f9',
          borderRadius: '12px',
          margin: '20px 0'
        }}>
          <h3 style={{ color: '#666', marginBottom: '10px' }}>
            🏪 Do'kon tanlanmagan
          </h3>
          <p style={{ color: '#999', fontSize: '14px' }}>
            Analitika ko'rish uchun yuqoridan do'kon tanlang
          </p>
        </div>
      )}

      {storeSelected && (<>
      <div className={styles.statistics__inner}>
        <div className={styles.statistics__filter}>
          <h1>Savdo</h1>
          <div className={styles.filter__inner}>
            <div
              className={styles.statistics__range}
              onClick={(e) => {
                e.stopPropagation();
                setIsToggleRange((prev) => !prev);
                setIsOpenRangeCalendar(false);
              }}
            >
              <div className={styles.range__left}>
                <ClockIcon className={styles.range__clock} />
                <p className={styles.range__title}>
                  {dropdownItems[
                    dropdownItems.findIndex(
                      (item) => item.key === selectedRange
                    )
                  ]?.title || <span>Kun oralig’i</span>}
                </p>
              </div>
              <ArrowDownIcon selected={isToggleRange} />
              <ul
                className={clsx(
                  styles.range__dropdown,
                  isToggleRange && styles.open
                )}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {dropdownItems.map((item) => (
                  <li
                    key={item.key}
                    onClick={() => {
                      setIsToggleRange(false);
                      setSelectedRange(
                        item.key === selectedRange ? "" : item.key
                      );
                    }}
                    className={clsx(
                      styles.range__item,
                      selectedRange === item.key && styles.selected
                    )}
                  >
                    <p>{item.title}</p>
                  </li>
                ))}
              </ul>
            </div>
            <PeriodSelector
              isOpenRangeCalendar={isOpenRangeCalendar}
              setIsOpenRangeCalendar={setIsOpenRangeCalendar}
              setIsToggleRange={setIsToggleRange}
              setFromDate={setFromDate}
              fromDate={fromDate}
              setToDate={setToDate}
              toDate={toDate}
            />
            <div className={styles.current_period}>
              <span className={styles.circle} />
              <p className={styles.period__title}>Joriy davr</p>
            </div>
          </div>
        </div>
        <div className={styles.statistics__graph}>
          <SalesChart
            chartData={transactionsByDay.data}
            period={selectedRange}
          />
        </div>
      </div>

      <div className={styles.dashboard__top}>
        <div className={styles.dashboard__card}>
          <header className={styles.dashboard__header}>
            <div className={styles.title}>
              <h1>Top mahsulotlar</h1>
              <p className={styles.top5}>Top 5</p>
            </div>
            <p
              className={styles.top__link}
              onClick={() => navigate("/inventory")}
            >
              Mahsulotlar
              <span>
                <ArrowRightIcon />
              </span>
            </p>
          </header>
          {(topProducts.data?.top_products.length ?? 0) < 1 ? (
            <div className={styles.loader}>
              <img src="/stats-loading.svg" alt="" />
            </div>
          ) : (
            <ul className={styles.dashboard__list}>
              {topProducts.data?.top_products.map((item, index) => (
                <li key={index} className={styles.item}>
                  <div className={styles.list__title}>
                    <span className={styles.item__index}>{index + 1}.</span>
                    <p className={styles.name}>{item.product__name}</p>
                  </div>
                  <div className={styles.count_wrapper}>
                    <span className={styles.count}>
                      {(item.total_quantity ?? 0).toLocaleString("de-DE")} marta
                    </span>
                    <span className={styles.percent}>
                      {percentOfTotal(item.total_quantity ?? 0, topProductsTotal)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.dashboard__card}>
          <header className={styles.dashboard__header}>
            <div className={styles.title}>
              <h1>Top mijozlar</h1>
              <p className={styles.top5}>Top 5</p>
            </div>
            <p
              className={styles.top__link}
              onClick={() => navigate("/customers")}
            >
              Mijozlar
              <span>
                <ArrowRightIcon />
              </span>
            </p>
          </header>
          {(topCustomers.data?.top_customers.length ?? 0) < 1 ? (
            <div className={styles.loader}>
              <img src="/stats-loading.svg" alt="" />
            </div>
          ) : (
            <ul className={styles.dashboard__list}>
              {topCustomers.data?.top_customers.map((item, index) => (
                <li key={index} className={styles.item}>
                  <div className={styles.list__title}>
                    <span className={styles.item__index}>{index + 1}.</span>
                    <p className={styles.name}>{item.customer__full_name}</p>
                  </div>
                  <span className={styles.item__price}>
                    {(item.total_purchases ?? 0).toLocaleString("de-DE")} uzs
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.dashboard__card}>
          <header className={styles.dashboard__header}>
            <div className={styles.title}>
              <h1>Top kassirlar</h1>
              <p className={styles.top5}>Top 5</p>
            </div>
            <p
              className={styles.top__link}
              onClick={() => navigate("/cashier-stats")}
            >
              Kassirlar
              <span>
                <ArrowRightIcon />
              </span>
            </p>
          </header>
          {(topCashiers.data?.data?.cashiers.length ?? 0) < 1 ? (
            <div className={styles.loader}>
              <img src="/stats-loading.svg" alt="" />
            </div>
          ) : (
            <ul className={styles.dashboard__list}>
              {topCashiers.data?.data?.cashiers.map((cashier, index) => (
                <li key={cashier.id} className={styles.item}>
                  <div className={styles.list__title}>
                    <span className={styles.item__index}>{index + 1}.</span>
                    <p className={styles.name}>{cashier.full_name}</p>
                  </div>
                  <span className={styles.item__price}>
                    {(parseFloat(cashier.total_sales) || 0).toLocaleString("de-DE")} uzs
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.payment__statistics}>
        <h1>To'lov turlari</h1>
        <div className={styles.payment__inner}>
          <div className={styles.pie__chart}>
            <PaymentChart pieChartData={pieChartData} />
          </div>
          <ul className={styles.list__methods}>
            {paymentItems.map((item, index) => (
              <li key={index} className={styles.item}>
                <div className={styles.left}>
                  <span className={styles.icon_dot}></span>
                  <p className={styles.title}>{item.method}</p>
                </div>
                <span className={styles.price}>
                  {(item.price ?? 0).toLocaleString("de-DE")} uzs
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </>)}
    </div>
  );
};

export default Statistics;
