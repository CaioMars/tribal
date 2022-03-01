import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import AppColors from "../style/AppColors";
import PropTypes from "prop-types";

export default function ButtonDelete({ title, onPress, type }) {
  return (
    <Button
      type={type || "outline"}
      title={title}
      buttonStyle={styles.buttonDelete}
      titleStyle={styles.buttonDeleteTitle}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  buttonDelete: {
    color: AppColors.danger,
    borderColor: AppColors.danger,
  },
  buttonDeleteTitle: {
    color: AppColors.danger,
  },
});

ButtonDelete.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  type: PropTypes.string,
};
