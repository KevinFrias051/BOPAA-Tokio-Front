"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import "./currencySelector.css";

interface CurrencySelectorProps {
  currency: "USD" | "YEN";
  onChange: (newCurrency: "USD" | "YEN") => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currency,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="currency-selector">
      <label htmlFor="currency">{t("currencySelector.label")}</label>
      <select
        id="currency"
        value={currency}
        onChange={(e) => onChange(e.target.value as "USD" | "YEN")}
      >
        <option value="USD">{t("currencySelector.usd")}</option>
        <option value="YEN">{t("currencySelector.yen")}</option>
      </select>
    </div>
  );
};
