import { useEffect } from "react";

type UseBarcodeScannerProps = {
  enabled: boolean;
  onScan: (barcode: string) => void;
};

export function useBarcodeScanner({ onScan, enabled }: UseBarcodeScannerProps) {
  useEffect(() => {
    if (!enabled) return;
    let buffer = "";
    let timer: number | null = null;

    const handler = (e: KeyboardEvent) => {
      // Игнорируем ввод в input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (timer) clearTimeout(timer);

      if (e.key.length === 1) {
        buffer += e.key;
      }

      timer = window.setTimeout(() => {
        if (buffer.length > 5) {
          onScan(buffer); // ✅ передаём готовый штрихкод
        }
        buffer = "";
      }, 200);
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
      if (timer) clearTimeout(timer);
    };
  }, [onScan, enabled]);
}
