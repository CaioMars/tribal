import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-elements";
import BottomSheet from "./BottomSheet";
import PropTypes from "prop-types";

export default function BottomSheetWelcome({ show, onHide }) {
  return (
    <BottomSheet show={show} onHide={onHide}>
      <View style={styles.container}>
        <Text h4 style={styles.textTitle}>
          Welcome friend! 👋
        </Text>
        <Text style={styles.textDesc}>
          Since this is the first business you have added, we wanted to let you
          know that items like Business and Person can be swiped to the right
          and left for more options. This way you can edit or delete items
          easily.
        </Text>
        <Button title="Got it" onPress={onHide} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  textTitle: {
    marginBottom: 20,
    textAlign: "center",
  },
  textDesc: {
    marginBottom: 40,
    color: "#555",
    fontSize: 16,
  },
});

BottomSheetWelcome.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};
