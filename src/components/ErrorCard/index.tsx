import React from "react";

import styles from "./styles.module.scss";

interface ErrorCard {
  error: string;
}

const ErrorCard = ({ error }: ErrorCard) => {
  return (
    <div className={styles.error}>
      <h1>{error}</h1>
    </div>
  );
};

export default ErrorCard;
