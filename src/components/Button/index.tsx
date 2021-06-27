import { ButtonHTMLAttributes } from "react";

import "./style.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
  logout?: boolean;
};

export function Button({
  isOutlined = false,
  logout = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button ${isOutlined ? "outlined" : ""}button ${
        logout ? "logout" : ""
      }`}
      {...props}
    />
  );
}
