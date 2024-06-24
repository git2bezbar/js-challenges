import type { ComponentPropsWithoutRef } from "react";

import styles from "./index.module.css";

interface ChipProps extends ComponentPropsWithoutRef<"span"> {}

export default function Chip({ children }: ChipProps) {
  return <span className={styles["chip"]}>{ children }</span>;
}
