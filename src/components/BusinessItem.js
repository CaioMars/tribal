import React from "react";
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Icon } from "react-native-elements";
import PropTypes from "prop-types";

const SCREEN_WIDTH = Dimensions.get("screen").width;

export default function BusinessItem({ business, onPress }) {
  return (
    <TouchableHighlight
      underlayColor="#eee"
      onPress={onPress}
      style={styles.rowFront}
    >
      <View style={styles.container}>
        <View style={styles.containerBusinessName}>
          <Text>{business.name}</Text>
        </View>
        <View>
          <Icon name={"chevron-right"} />
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    width: SCREEN_WIDTH,
    height: 70,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  rowFront: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  containerBusinessName: {
    flex: 1,
  },
});

BusinessItem.propTypes = {
  business: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};
