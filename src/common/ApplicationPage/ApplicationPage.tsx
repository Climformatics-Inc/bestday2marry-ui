import * as React from "react";
import styles from "./ApplicationPage.module.css";
import { NavLink } from "react-router-dom";

export interface Props {
  children?: React.ReactNode;
  backTo?: string;
}

export const ApplicationPage: React.FC<Props> = (props: Props) => {
  const { children, backTo } = props;
  return (
    <div className={styles.applicationPage}>
      <div className={styles.header}>
        <div>
          <h1>Best Day 2 Marry</h1>
          <div className={styles.description}>
            An application that tells you what would be the best day for the
            most important occasion in your life!!
          </div>
        </div>
        <div>
          {backTo && (
            <NavLink to={backTo} className={styles.navLink}>
              Back
            </NavLink>
          )}
        </div>
      </div>
      <div className={styles.contents}>{children}</div>
    </div>
  );
};

export default ApplicationPage;
