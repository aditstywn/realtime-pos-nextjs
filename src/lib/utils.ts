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
