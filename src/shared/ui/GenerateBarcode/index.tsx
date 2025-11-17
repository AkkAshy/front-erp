import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";

type BarcodeProps = {
  value: string;
};

export function GenerateBarcode({ value }: BarcodeProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      JsBarcode(ref.current, value, {
        format: "CODE128",
        displayValue: false,
        fontSize: 16,
        lineColor: "#000",
        width: 3,
      });
    }
  }, [value]);

  return <canvas ref={ref}></canvas>;
}
