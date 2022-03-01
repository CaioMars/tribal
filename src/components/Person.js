import React from "react";
import { View, StyleSheet } from "react-native";
import { formatPhoneNumber } from "../functions/helper";
import { Text } from "react-native-elements";
import PropTypes from "prop-types";

export default function Person({ person }) {
  return (
    <View style={styles.container}>
      <View style={styles.containerWrapper}>
        <View style={styles.containerHeader}>
          <View>
            <Text style={styles.textName}>{person.name}</Text>
            <Text>{person.role}</Text>
            <Text>{`Since ${person.join_date}`}</Text>
          </View>
        </View>
        <View style={styles.containerDetails}>
          <View style={styles.containerLeft}>
            <Text style={styles.textLabel}>Phone</Text>
            <Text style={styles.textValue}>
              {formatPhoneNumber(person.phone)}
            </Text>
          </View>
          <View style={styles.containerRight}>
            <Text style={styles.textLabel}>E-mail</Text>
            <Text style={styles.textValue}>{person.email}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  containerWrapper: {
    backgroundColor: "#fff",
    padding: 20,
  },
  containerHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  containerFooter: {},
  containerDetails: {
    display: "flex",
    flexDirection: "row",
  },
  containerLeft: {
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  containerRight: {
    flex: 1,
  },
  textName: {
    fontWeight: "bold",
    fontSize: 21,
  },
  textLabel: {
    color: "#777",
  },
  textValue: {},
});

Person.proTypes = {
  person: PropTypes.object.isRequired,
};
