import { useEffect, useState } from "react";
import { PrinterIcon } from "@/shared/ui/icons";
import { useProducts } from "@/entities/product/model/useProducts";
import type { ProductItem } from "@/entities/product/api/types";
import { GenerateBarcode } from "@/shared/ui/GenerateBarcode";
import { productApi } from "@/entities/product/api/productApi";
import axios from "axios";

import styles from "./Barcode.module.scss";
import { useProfileInfo } from "@/entities/cashier/model/useProfileInfo";

// URL вашего локального сервера печати
const PRINT_SERVER_URL = "http://localhost:31415";

const Barcode = () => {
  const barcodes = useProducts();
  const [serverStatus, setServerStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");
  const profileInfo = useProfileInfo();
  const [storeName, setStoreName] = useState<string>("Magazin");

  useEffect(() => {
    // Безопасная проверка с optional chaining
    const stores = profileInfo.data?.data?.employee?.accessible_stores_info;
    if (stores && stores.length > 0 && stores[0].name) {
      setStoreName(stores[0].name);
    }
  }, [profileInfo.data]);

  // Проверка доступности сервера печати
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios(`${PRINT_SERVER_URL}/status`);

        if (response.status === 200) {
          setServerStatus("online");
          console.log("✅ Сервер печати доступен");
        } else {
          setServerStatus("offline");
        }
      } catch {
        setServerStatus("offline");
        console.error("❌ Сервер печати недоступен. Запустите print-service");
      }
    };

    checkServer();
    // Проверяем каждые 5 секунд
    const interval = setInterval(checkServer, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrint = async (item: ProductItem, quantity: number = 1) => {
    // Проверяем наличие штрихкода
    if (!item.barcode || String(item.barcode).trim() === "") {
      alert("Bu mahsulotda shtrix kod yo'q");
      return;
    }

    try {
      // Получаем данные этикетки с backend
      const labelResponse = await productApi.getPrintLabel(item.id, quantity);
      const labelData = labelResponse.data.data;

      console.log("Label data received:", labelData);

      // Если есть print server, отправляем туда
      if (serverStatus === "online") {
        // Отправляем на сервер печати
        const response = await axios.post(`${PRINT_SERVER_URL}/print`, {
          base64Image: labelData.barcode_image, // Backend уже вернул base64 изображение
          printerName: "Xprinter XP-365B",
          itemInfo: {
            name: labelData.product.name,
            barcode: labelData.product.barcode,
            price: labelData.price.sale_price,
          },
        });

        const result = await response.data;

        if (result.success) {
          console.log("✅ Напечатано:", item.name);
        } else {
          console.error("❌ Ошибка печати:", result.error);
          alert(`Ошибка печати: ${result.error || "Неизвестная ошибка"}`);
        }
      } else {
        // Если print server недоступен, открываем окно браузера для печати
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          alert('Не удалось открыть окно печати. Разрешите всплывающие окна.');
          return;
        }

        const printContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Печать этикетки - ${labelData.product.name}</title>
            <style>
              @media print {
                @page {
                  size: 58mm 40mm;
                  margin: 2mm;
                }
                body {
                  margin: 0;
                  padding: 0;
                }
              }

              body {
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 5px;
              }

              .label {
                width: 54mm;
                height: 36mm;
                border: 1px solid #ccc;
                padding: 3mm;
                margin-bottom: 5mm;
                page-break-after: always;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
              }

              .label:last-child {
                page-break-after: avoid;
              }

              .store-name {
                font-size: 10px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 1mm;
              }

              .product-name {
                font-size: 12px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 2mm;
                max-height: 8mm;
                overflow: hidden;
              }

              .barcode {
                width: 100%;
                height: 15mm;
                object-fit: contain;
                margin: 2mm 0;
              }

              .price {
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                margin-top: 2mm;
              }

              .sku {
                font-size: 8px;
                color: #666;
                text-align: center;
              }
            </style>
          </head>
          <body>
            ${Array(labelData.quantity).fill(0).map(() => `
              <div class="label">
                <div class="store-name">${storeName}</div>
                <div class="product-name">${labelData.product.name}</div>
                ${labelData.barcode_image
                  ? `<img src="${labelData.barcode_image}" alt="Barcode" class="barcode" />`
                  : `<div class="sku">SKU: ${labelData.product.sku}</div>`
                }
                <div class="price">${labelData.price.formatted_price} ${labelData.price.currency}</div>
              </div>
            `).join('')}
            <script>
              window.onload = () => {
                window.print();
                setTimeout(() => window.close(), 500);
              };
            </script>
          </body>
          </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
      }
    } catch (err) {
      console.error("❌ Ошибка:", err);
      alert("Ошибка при получении данных этикетки");
    }
  };

  // Опциональная функция для получения списка принтеров
  // const getPrinters = async () => {
  //   try {
  //     const response = await fetch(`${PRINT_SERVER_URL}/printers`);
  //     const data = await response.json();
  //     return data.printers;
  //   } catch (error) {
  //     console.error("Не удалось получить список принтеров");
  //     return [];
  //   }
  // };

  return (
    <div className={styles.barcode}>
      <h3>
        Bar kod sozlamalari
        {serverStatus === "online" && (
          <span style={{ color: "green" }}> ● Printer faol</span>
        )}
        {serverStatus === "offline" && (
          <span style={{ color: "red" }}> ● Printer topilmadi</span>
        )}
      </h3>

      {barcodes.data?.data?.results.length === 0 ? (
        <div className={styles.empty}>
          <img src="/empty.svg" alt="empty" />
        </div>
      ) : (
        <ul className={styles.barcode__list}>
          {barcodes.data?.data?.results.map((item) => (
            <li key={item.id} className={styles.barcode__item}>
              <div className={styles.item__header}>
                <span className={styles.size}>{item.size?.size ?? "-"}</span>
                <span className={styles.price}>
                  {(+item.sale_price).toLocaleString("de-DE")} uzs
                </span>
                <p className={styles.title}>{item.name}</p>
                {item.barcode && String(item.barcode).trim() !== "" ? (
                  <>
                    <GenerateBarcode value={String(item.barcode)} />
                    <span className={styles.barcode__id}>{item.barcode}</span>
                  </>
                ) : (
                  <span className={styles.barcode__id} style={{ color: '#999', fontStyle: 'italic' }}>
                    Shtrix kod yo'q
                  </span>
                )}
              </div>

              <div className={styles.item__footer}>
                <h2>{item.name}</h2>
                <span
                  onClick={() => handlePrint(item)}
                  style={{
                    opacity: item.barcode && String(item.barcode).trim() !== "" ? 1 : 0.5,
                    cursor: item.barcode && String(item.barcode).trim() !== "" ? 'pointer' : 'not-allowed'
                  }}
                >
                  <PrinterIcon />
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Barcode;
