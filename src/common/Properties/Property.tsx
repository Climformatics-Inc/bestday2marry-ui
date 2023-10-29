import * as React from "react";
import propertyStyles from "./Properties.module.css";

export interface Props {
  children: React.ReactNode;
  label: string;
  hint?: string;
}

export const Property: React.FC<Props> = (props: Props) => {
  const { children, label, hint } = props;

  return <div className={propertyStyles.property}>
    <label className={propertyStyles.label}>{label}:</label>
    {children}
    {hint && <div className={propertyStyles.hint}>{hint}</div>}
  </div>
};

export default Property;
