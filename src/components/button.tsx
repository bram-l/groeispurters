import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import styles from './button.module.css';

export const Button: FC<
  { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, ...rest }) => {
  return (
    <button className={styles.button} {...rest}>
      {children}
    </button>
  );
};
