import { useCallback, useEffect, useState } from "react";
import {
  CalendarIcon,
  MessageIcon,
  MoreIcon,
  CheckboxIcon,
} from "@/shared/ui/icons";
import Search from "@/shared/ui/Search";
import Table from "@/shared/ui/Table";
import PageTitle from "@/shared/ui/PageTitle";
import StoreSelector from "@/shared/ui/StoreSelector";
import { useFilteredCustomers } from "@/entities/customer/model/useFilteredCustomers";
import type { Customer } from "@/entities/customer/api/types";

import { CreateSmsTemplateModal } from "@/features/SmsTemplate";
import { SendMessageForm } from "@/features/SendMessageForm";
import Calendar from "@/features/Сalendar";

import { format, parseISO } from "date-fns";
import clsx from "clsx";

//scss
import styles from "./Customers.module.scss";
import TablePagination from "@/shared/ui/Pagination";
import { usePagination } from "@/shared/lib/hooks/usePagination";

const headCols = [
  "",
  "#",
  "Toliq ismi",
  "Telefon raqami",
  "Oxirgi savdo",
  "Tovar soni",
  "Jami savdo",
  "",
];

// Local type for UI state with selection
type CustomerWithSelection = Customer & { selected?: boolean };

const Customers = () => {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isSmsModal, setIsSmsModal] = useState(false);
  const [isOpenCalendar, setIsOpenCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  const { page, setPage, limit, offset } = usePagination(1, 7);

  const [search, setSearch] = useState("");
  const filteredCustomers = useFilteredCustomers({
    q: search,
    date_from: currentDate,
    date_to: currentDate,
    offset,
    limit,
  });

  const [customersData, setCustomersData] = useState<CustomerWithSelection[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<
    {
      id: number;
      phone: string;
    }[]
  >([]);

  const isSelectAll =
    customersData.length > 0 && customersData.every((c) => c.selected);

  const toggleSelectAll = useCallback(() => {
    setSelectedCustomers(customersData.filter((c) => c.selected));
    setCustomersData((prev) =>
      prev.map((c) => ({ ...c, selected: !isSelectAll }))
    );
  }, [customersData, isSelectAll]); // Зависит от этих значений

  const toggleSelectOne = useCallback((id: number) => {
    setCustomersData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  }, []);

  useEffect(() => {
    if (filteredCustomers.data?.data?.results) {
      setCustomersData(filteredCustomers.data?.data?.results);
    }
  }, [filteredCustomers.data?.data?.results]);


  return (
    <div
      className={styles.customers}
      onClick={() => {
        setIsOpenForm(false);
        setIsOpenCalendar(false);
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <PageTitle>Mijozlar</PageTitle>
        <StoreSelector />
      </div>
      <header className={styles.customers__header}>
        <Search
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ism bo'yicha mijoz qidirish"
        />

        <div
          className={styles.customers__calendar}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpenCalendar((prev) => !prev);
          }}
        >
          <CalendarIcon />
          <p className={styles.title}>Oxirgi savdo sanasi</p>
          <div
            className={clsx(
              styles.dropdown__calendar,
              isOpenCalendar && styles.open
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar setCurrentDate={setCurrentDate} />
          </div>
        </div>
      </header>

      <Table
        headCols={headCols}
        bodyCols={customersData?.map((item, index) => {
          return {
            id: item.id,
            content_1: (
              <div
                onClick={() => {
                  setSelectedCustomers((prev) =>
                    prev.some((p) => p.id === item.id)
                      ? prev.filter((p) => p.id !== item.id)
                      : [...prev, { id: item.id, phone: item.phone }]
                  );

                  toggleSelectOne(item.id);
                }}
              >
                <CheckboxIcon selected={item.selected} />
              </div>
            ),
            index: index + 1 + offset,
            full_name: `${item.first_name} ${item.last_name || ''}`.trim(),
            phone: item.phone,
            last_purchase_date: item.last_purchase_date
              ? format(parseISO(item.last_purchase_date), "dd.MM.yyyy")
              : "-",
            count: item.total_purchases || 0,
            debt:
              (Number(item.total_spent) || 0).toLocaleString("de-DE") + " uzs",
            content_2: (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpenForm(true);
                  // setSelectedCustomers([{ id: item.id, phone: item.phone }]);
                }}
              >
                <MessageIcon />
              </div>
            ),
          };
        })}
        headCell={{
          1: {
            className: styles.checkbox_btn,
            content: <CheckboxIcon selected={isSelectAll} stroke={"#0F1C3D"} />,
            onClick: () => toggleSelectAll(),
          },
          2: {
            className: styles.cell__hash,
          },
          8: {
            className: styles.thead__more,
            content: <MoreIcon />,
          },
        }}
        bodyCell={{
          1: {
            className: styles.checkbox_btn,
            // onClick: () => setIsSelectAll((prev) => !prev),
          },
          2: {
            className: styles.row__index,
          },
          6: {
            className: styles.product__count,
          },
          7: {
            className: styles.total__sale,
          },
          8: {
            className: styles.message__btn,
            align: "center",
          },
        }}
        isLoading={filteredCustomers.isLoading}
      />

      {filteredCustomers.data?.data?.results.length === 0 && (
        <div className={styles.empty}>
          <img src="/empty.svg" alt="empty" />
        </div>
      )}

      <SendMessageForm
        customers={selectedCustomers}
        isOpenForm={isOpenForm}
        setIsSmsModal={setIsSmsModal}
      />

      <CreateSmsTemplateModal
        isSmsModal={isSmsModal}
        setIsSmsModal={setIsSmsModal}
      />

      <TablePagination
        current={page}
        total={filteredCustomers.data?.data?.count || 0}
        pageSize={limit}
        onChange={(p) => setPage(p)}
        
      />
    </div>
  );
};

export default Customers;
