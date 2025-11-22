import { useEffect, useState } from "react";
import { PrinterIcon } from "@/shared/ui/icons";
import { useProducts } from "@/entities/product/model/useProducts";
import type { ProductItem } from "@/entities/product/api/types";
import { GenerateBarcode } from "@/shared/ui/GenerateBarcode";
import StoreSelector from "@/shared/ui/StoreSelector";
import axios from "axios";
import JsBarcode from "jsbarcode";

import styles from "./Barcode.module.scss";
import { useProfileInfo } from "@/entities/cashier/model/useProfileInfo";

// URL вашего локального сервера печати
const PRINT_SERVER_URL = "http://localhost:31415";

const svgToBase64 = (svgString: string): string => {
  const bytes = new TextEncoder().encode(svgString);
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte)
  ).join("");
  return btoa(binString);
};

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

  const createSVGLabel = (item: ProductItem) => {
    // Генерируем штрихкод с JsBarcode
    const tempDiv = document.createElement("div");
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    JsBarcode(svgElement, String(item.barcode), {
      format: "CODE128",
      width: 4,
      height: 80,
      displayValue: false,
      margin: 0,
    });

    svgElement.setAttribute("width", "520");
    tempDiv.appendChild(svgElement);
    const barcodeContent = tempDiv.innerHTML;

    // Создаем SVG этикетку с всеми элементами
    const svg = `
    <svg width="580" height="400" xmlns="http://www.w3.org/2000/svg" style="font-family: Arial, sans-serif;">
      <rect width="580" height="400" fill="white"/>

      <text x="290" y="50" font-size="28" font-weight="bold" text-anchor="middle">
        ${storeName}
      </text>

      <g transform="translate(0, 60)">
        <text x="290" y="80" font-size="48" font-weight="bold" text-anchor="middle">
          ${((+item.sale_price) || 0).toLocaleString("de-DE")} uzs
        </text>

        <text x="290" y="120" font-size="28" text-anchor="middle">
          ${item.name}
        </text>

        <g transform="translate(30, 160)">
          ${barcodeContent}
        </g>

        <text x="290" y="280" font-size="26" text-anchor="middle">
          ${item.barcode}
        </text>
      </g>

      <g transform="translate(540, 50)">
        <circle cx="0" cy="0" r="35" fill="none" stroke="#333" stroke-width="2"/>
        <text x="0" y="8" font-size="28" font-weight="bold" text-anchor="middle">
          ${item.size?.size || "-"}
        </text>
      </g>
    </svg>
  `;

    return svg;
  };

  const handlePrint = async (item: ProductItem) => {
    if (!item.barcode || String(item.barcode).trim() === "") {
      alert("Bu mahsulotda shtrix kod yo'q");
      return;
    }

    try {
      const svgString = createSVGLabel(item);
      const svgBase64 = svgToBase64(svgString);
      const imageData = `data:image/svg+xml;base64,${svgBase64}`;

      if (serverStatus === "online") {
        // Отправляем на print-server
        const response = await axios.post(`${PRINT_SERVER_URL}/print`, {
          base64Image: imageData,
          printerName: "Xprinter XP-365B",
          itemInfo: {
            name: item.name,
            barcode: item.barcode,
            price: item.sale_price,
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
        // Fallback: печать через браузер
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          alert('Не удалось открыть окно печати. Разрешите всплывающие окна.');
          return;
        }

        const printContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Etiketka</title>
            <meta charset="UTF-8">
            <style>
              @page { size: 58mm 40mm; margin: 0; }
              body { margin: 0; padding: 0; }
              img { width: 58mm; height: 40mm; display: block; }
            </style>
          </head>
          <body>
            <img src="${imageData}" />
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                  setTimeout(() => window.close(), 500);
                }, 800);
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
      alert("Ошибка при печати этикетки");
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <h3>Bar kod sozlamalari</h3>
        <StoreSelector />
      </div>
      <h3 style={{ display: 'none' }}>
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
                  {((+item.sale_price) || 0).toLocaleString("de-DE")} uzs
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
