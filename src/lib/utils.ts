import { ChangeEvent } from "react";

export { cn } from "cn";

export function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const files = event.target.files![0];
  const displayUrl = URL.createObjectURL(files);

  return {
    file: files,
    displayUrl,
  };
}

export function convertIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}
