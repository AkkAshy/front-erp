import { useState, useEffect, useRef } from "react";
import { customersApi } from "@/entities/customer/api/customersApi";
import type { Customer } from "@/entities/customer/api/types";
import type { NewCustomerData } from "@/entities/sales/model/types";
import { formatPhoneWithMask } from "@/shared/lib/utils/formatters";
import styles from "./CustomerSearch.module.scss";

interface CustomerSearchProps {
  onSelectCustomer: (customer: Customer | null) => void;
  onCreateNew?: (customerData: NewCustomerData) => void;
  placeholder?: string;
  autoFocus?: boolean;
  selectedCustomer?: Customer | null;
}

export const CustomerSearch = ({
  onSelectCustomer,
  onCreateNew,
  placeholder = "Telefon raqamni kiriting (+998...)",
  autoFocus = false,
  selectedCustomer: externalSelectedCustomer,
}: CustomerSearchProps) => {
  const [phone, setPhone] = useState("+998");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Sync with external selected customer
  useEffect(() => {
    if (externalSelectedCustomer !== undefined) {
      setSelectedCustomer(externalSelectedCustomer);
      if (externalSelectedCustomer) {
        setPhone(formatPhoneWithMask(externalSelectedCustomer.phone));
        setShowResults(false);
        setNotFound(false);
      }
    }
  }, [externalSelectedCustomer]);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-focus input
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce timeout ref
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search customers by phone
  const searchByPhone = async (phoneValue: string) => {
    console.log("🔍 Searching for phone:", phoneValue);

    // Минимум 7 символов (+998 + 3 цифры) для поиска
    if (phoneValue.length < 7) {
      console.log("❌ Phone too short:", phoneValue.length);
      setCustomers([]);
      setNotFound(false);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setNotFound(false);

    try {
      // Поиск клиентов по телефону
      console.log("📞 Searching customers with phone:", phoneValue);
      const searchResponse = await customersApi.getFilteredCustomers({
        search: phoneValue,
        limit: 10,
      });
      console.log("📋 Search results:", searchResponse.data);

      const results = searchResponse.data.results || [];
      if (results.length > 0) {
        console.log("✅ Found customers:", results.length);
        setCustomers(results);
        setShowResults(true);
        setNotFound(false);
      } else {
        console.log("❌ No customers found");
        setCustomers([]);
        setNotFound(true);
        setShowResults(true); // Показываем dropdown с "не найдено"
      }
    } catch (searchError) {
      console.error("❌ Search error:", searchError);
      setCustomers([]);
      setNotFound(true);
      setShowResults(true); // Показываем dropdown с "не найдено"
    } finally {
      setIsSearching(false);
    }
  };

  // Handle phone input change
  const handlePhoneChange = (value: string) => {
    // Ensure phone always starts with +998
    if (!value.startsWith("+998")) {
      value = "+998";
    }

    // Remove non-digits except +
    value = value.replace(/[^\d+]/g, "");

    // Limit length to +998XXXXXXXXX (13 characters)
    if (value.length > 13) {
      value = value.slice(0, 13);
    }

    setPhone(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Auto-search when user types (минимум 3 цифры после +998)
    if (value.length >= 7) {
      // Debounce: ждем 300мс после последнего ввода
      searchTimeoutRef.current = setTimeout(() => {
        searchByPhone(value);
      }, 300);
    } else {
      setCustomers([]);
      setNotFound(false);
      setShowResults(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Select customer from dropdown
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setPhone(customer.phone);
    setShowResults(false);
    onSelectCustomer(customer);
  };

  // Clear selection
  const handleClear = () => {
    setSelectedCustomer(null);
    setPhone("+998");
    setCustomers([]);
    setNotFound(false);
    setShowResults(false);
    onSelectCustomer(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Create new customer
  const handleCreateNew = () => {
    if (onCreateNew && phone.length === 13) {
      onCreateNew({
        first_name: "",
        phone: phone,
      });
      setShowResults(false);
    }
  };

  return (
    <div className={styles.customerSearch}>
      <div className={styles.searchBox}>
        <input
          ref={inputRef}
          type="tel"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder={placeholder}
          className={styles.input}
          disabled={!!selectedCustomer}
        />

        {isSearching && (
          <div className={styles.loader}>
            <span className={styles.spinner}></span>
          </div>
        )}

        {selectedCustomer && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            title="O'chirish"
          >
            ✕
          </button>
        )}
      </div>

      {/* Selected customer info */}
      {selectedCustomer && (
        <div className={styles.selectedCustomer}>
          <div className={styles.customerCard}>
            <div className={styles.customerHeader}>
              <h4>{selectedCustomer.first_name} {selectedCustomer.last_name}</h4>
              {selectedCustomer.is_vip && (
                <span className={styles.vipBadge}>VIP</span>
              )}
            </div>
            <p className={styles.phone}>{selectedCustomer.phone}</p>
            {selectedCustomer.email && (
              <p className={styles.email}>{selectedCustomer.email}</p>
            )}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.label}>Jami xarid:</span>
                <span className={styles.value}>
                  {(selectedCustomer.total_spent ?? 0).toLocaleString()} so'm
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.label}>Xaridlar soni:</span>
                <span className={styles.value}>
                  {selectedCustomer.total_purchases || 0}
                </span>
              </div>
              {selectedCustomer.bonus_balance > 0 && (
                <div className={styles.stat}>
                  <span className={styles.label}>Bonus:</span>
                  <span className={styles.value}>
                    {(selectedCustomer.bonus_balance ?? 0).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search results dropdown */}
      {showResults && !selectedCustomer && (
        <div ref={resultsRef} className={styles.resultsDropdown}>
          {customers.length > 0 ? (
            <ul className={styles.resultsList}>
              {customers.map((customer) => (
                <li
                  key={customer.id}
                  onClick={() => handleSelectCustomer(customer)}
                  className={styles.resultItem}
                >
                  <div className={styles.customerInfo}>
                    <div className={styles.nameRow}>
                      <span className={styles.name}>
                        {customer.first_name} {customer.last_name}
                      </span>
                      {customer.is_vip && (
                        <span className={styles.vipBadgeSmall}>VIP</span>
                      )}
                    </div>
                    <span className={styles.phoneSmall}>{customer.phone}</span>
                    {customer.total_spent && (
                      <span className={styles.totalSpent}>
                        {(customer.total_spent ?? 0).toLocaleString()} so'm xarid qilgan
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : notFound ? (
            <div className={styles.notFound}>
              <p>Mijoz topilmadi</p>
              {onCreateNew && phone.length === 13 && (
                <button
                  type="button"
                  onClick={handleCreateNew}
                  className={styles.createButton}
                >
                  + Bu telefon bilan yangi mijoz yaratish
                </button>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
