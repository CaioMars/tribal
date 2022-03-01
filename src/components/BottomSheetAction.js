import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-elements";
import BottomSheet from "./BottomSheet";
import PropTypes from "prop-types";

export default function BottomSheetAction({
  show,
  onHide,
  onConfirm,
  onCancel,
  title,
  description,
}) {
  return (
    <BottomSheet show={show} onHide={onHide}>
      <View style={styles.container}>
        {title && (
          <Text h4 style={styles.textTitle}>
            {title}
          </Text>
        )}
        {description && <Text style={styles.textDesc}>{description}</Text>}
      </View>
      <Button
        title="Confirm"
        onPress={onConfirm}
        containerStyle={styles.buttonConfirm}
      />
      <Button
        title="Cancel"
        type="clear"
        onPress={onCancel}
        containerStyle={styles.buttonCancel}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  textTitle: {
    marginBottom: 20,
    textAlign: "center",
  },
  textDesc: {
    marginBottom: 40,
    color: "#555",
    fontSize: 16,
    textAlign: "center",
  },
  buttonConfirm: {
    marginBottom: 20,
  },
  buttonCancel: {},
});

BottomSheetAction.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};
