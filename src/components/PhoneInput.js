import React from "react";
import PropTypes from "prop-types";
import { Input } from "react-native-elements";
import { mask } from "remask";
import { stripNumber } from "../functions/helper";

export default function PhoneInput({
  label,
  value,
  placeholder,
  onChangeText,
  maskFormat,
  ...others
}) {
  const phoneMask = maskFormat || "(999) 9999-9999";

  return (
    <Input
      label={label}
      value={mask(value, phoneMask)}
      placeholder={placeholder}
      onChangeText={onChangeText}
      keyboardType="phone-pad"
      {...others}
    />
  );
}

PhoneInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  maskFormat: PropTypes.string,
};
