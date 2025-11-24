import { type FC, useEffect, useState } from "react";
import CreateModal from "../CreateModal";
import { useProductVariants } from "@/entities/product/model/useProductVariants";
import { useProfileInfo } from "@/entities/cashier/model/useProfileInfo";
import { PrinterIcon } from "../icons";
import JsBarcode from "jsbarcode";
import axios from "axios";
import styles from "./ProductVariantsModal.module.scss";

const PRINT_SERVER_URL = "http://localhost:31415";

const svgToBase64 = (svgString: string): string => {
  const bytes = new TextEncoder().encode(svgString);
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte)
  ).join("");
  return btoa(binString);
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  productId: number | null;
  productName: string;
};

const ProductVariantsModal: FC<Props> = ({ isOpen, onClose, productId, productName }) => {
  const variants = useProductVariants(productId);
  const profile = useProfileInfo();
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    if (variants.data?.results) {
      console.log("🎯 Варианты товара загружены:", {
        productId,
        productName,
        totalVariants: variants.data.results.length,
        variants: variants.data.results,
      });
    }
  }, [variants.data, productId, productName]);

  // Проверка доступности сервера печати
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios(`${PRINT_SERVER_URL}/status`);
        if (response.status === 200) {
          setServerStatus("online");
        } else {
          setServerStatus("offline");
        }
      } catch {
        setServerStatus("offline");
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 5000);
    return () => clearInterval(interval);
  }, []);

  const createSVGLabel = (variant: any, storeName: string = "Magazin") => {
    const tempDiv = document.createElement("div");
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    JsBarcode(svgElement, String(variant.barcode), {
      format: "CODE128",
      width: 4,
      height: 80,
      displayValue: false,
      margin: 0,
    });

    svgElement.setAttribute("width", "520");
    tempDiv.appendChild(svgElement);
    const barcodeContent = tempDiv.innerHTML;

    const svg = `
    <svg width="580" height="400" xmlns="http://www.w3.org/2000/svg" style="font-family: Arial, sans-serif;">
      <rect width="580" height="400" fill="white"/>

      <text x="290" y="50" font-size="28" font-weight="bold" text-anchor="middle">
        ${storeName}
      </text>

      <g transform="translate(0, 60)">
        <text x="290" y="80" font-size="48" font-weight="bold" text-anchor="middle">
          ${parseFloat(variant.sale_price).toLocaleString("de-DE")} uzs
        </text>

        <text x="290" y="120" font-size="28" text-anchor="middle">
          ${variant.display_name}
        </text>

        <g transform="translate(30, 160)">
          ${barcodeContent}
        </g>

        <text x="290" y="280" font-size="26" text-anchor="middle">
          ${variant.barcode}
        </text>
      </g>

      <g transform="translate(540, 50)">
        <circle cx="0" cy="0" r="35" fill="none" stroke="#333" stroke-width="2"/>
        <text x="0" y="8" font-size="28" font-weight="bold" text-anchor="middle">
          -
        </text>
      </g>
    </svg>
  `;

    return svg;
  };

  const handlePrint = async (variant: any) => {
    if (!variant.barcode || String(variant.barcode).trim() === "") {
      alert("Bu variantda shtrix kod yo'q");
      return;
    }

    try {
      // Получаем название магазина из профиля пользователя (ProfileResponse -> data -> store -> name)
      const storeName = profile.data?.data?.store?.name || "Magazin";
      const svgString = createSVGLabel(variant, storeName);
      const svgBase64 = svgToBase64(svgString);
      const imageData = `data:image/svg+xml;base64,${svgBase64}`;

      if (serverStatus === "online") {
        const response = await axios.post(`${PRINT_SERVER_URL}/print`, {
          base64Image: imageData,
          printerName: "Xprinter XP-365B",
          itemInfo: {
            name: variant.display_name,
            barcode: variant.barcode,
            price: variant.sale_price,
          },
        });

        const result = await response.data;

        if (result.success) {
          console.log("✅ Напечатано:", variant.display_name);
        } else {
          console.error("❌ Ошибка печати:", result.error);
          alert(`Ошибка печати: ${result.error || "Неизвестная ошибка"}`);
        }
      } else {
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

  return (
    <CreateModal
      isOpen={isOpen}
      onClose={onClose}
      width={1000}
      headTitle={`${productName} - Variantlar`}
      overflowY="scroll"
    >
      <div className={styles.container}>
        {variants.isLoading && (
          <div className={styles.loading}>
            <p>Variantlar yuklanmoqda...</p>
          </div>
        )}

        {variants.isError && (
          <div className={styles.error}>
            <p>Xatolik: Variantlarni yuklashda muammo yuz berdi</p>
          </div>
        )}

        {!variants.isLoading && !variants.isError && (
          <>
            {variants.data?.results?.length === 0 ? (
              <div className={styles.empty}>
                <img src="/empty.svg" alt="empty" />
                <p>Bu mahsulotda variantlar mavjud emas</p>
              </div>
            ) : (
              <>
                <div className={styles.summary}>
                  <p>
                    Jami <strong>{variants.data?.results?.length || 0}</strong> ta variant topildi
                  </p>
                </div>
              <div className={styles.variantsList}>
                <div className={styles.header}>
                  <div className={styles.headerCell}>#</div>
                  <div className={styles.headerCell}>Variant nomi</div>
                  <div className={styles.headerCell}>SKU</div>
                  <div className={styles.headerCell}>Shtrix-kod</div>
                  <div className={styles.headerCell}>Atributlar</div>
                  <div className={styles.headerCell}>Miqdor</div>
                  <div className={styles.headerCell}>Sotish narxi</div>
                  <div className={styles.headerCell}>Chop etish</div>
                </div>

                {Array.isArray(variants.data?.results) && variants.data.results.map((variant, index) => {
                  const quantity = parseFloat(variant.quantity) || 0;
                  const salePrice = parseFloat(variant.sale_price) || 0;

                  return (
                    <div key={variant.id} className={styles.variantRow}>
                      <div className={styles.cell}>{index + 1}</div>
                      <div className={styles.cell}>
                        <span className={styles.displayName}>{variant.display_name}</span>
                      </div>
                      <div className={styles.cell}>
                        <span className={styles.sku}>{variant.sku}</span>
                      </div>
                      <div className={styles.cell}>
                        <span className={styles.barcode}>{variant.barcode}</span>
                      </div>
                      <div className={styles.cell}>
                        <div className={styles.attributes}>
                          {variant.attributes.map((attr, idx) => (
                            <span key={idx} className={styles.attributeBadge}>
                              {attr.attribute_name}: {attr.value_text}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={styles.cell}>
                        <span className={quantity <= 5 ? styles.lowStock : ""}>
                          {quantity.toFixed(0)}
                        </span>
                      </div>
                      <div className={styles.cell}>
                        {salePrice > 0
                          ? `${salePrice.toLocaleString("de-DE")} uzs`
                          : "-"}
                      </div>
                      <div className={styles.cell}>
                        <button
                          onClick={() => handlePrint(variant)}
                          className={styles.printButton}
                          disabled={!variant.barcode || String(variant.barcode).trim() === ""}
                        >
                          <PrinterIcon />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              </>
            )}
          </>
        )}
      </div>
    </CreateModal>
  );
};

export default ProductVariantsModal;
