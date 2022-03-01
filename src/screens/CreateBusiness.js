import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import { useMutation } from "react-query";
import { postBusiness, updateBusiness } from "../hooks/api";
import Toast from "react-native-toast-message";

export default function CreateBusiness({ navigation, route }) {
  const { business } = route?.params || "";
  const isEdit = business?.businessId ? true : false;
  const [name, setName] = useState(business?.name || "");

  // Dynamic screen header
  useEffect(() => {
    if (isEdit)
      navigation.setOptions({
        title: "Edit business",
      });
  }, []);

  // Post business hook
  const mutationPost = useMutation((data) => postBusiness(data), {
    onSuccess: () => navigation.goBack(),
    onError: () =>
      Toast.show({
        type: "error",
        text1: "Failed to add new business",
      }),
  });

  // Update business hook
  const mutationUpdate = useMutation(
    (data) => updateBusiness(data.businessId, data.businessData),
    {
      onSuccess: () => navigation.goBack(),
      onError: () =>
        Toast.show({
          type: "error",
          text1: "Failed to update business",
        }),
    }
  );

  const onSubmit = () => {
    if (isEdit) {
      mutationUpdate.mutate({
        businessId: business?.businessId,
        businessData: { name },
      });
    } else {
      mutationPost.mutate({ name });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerContent}>
        <Input
          value={name}
          label="Business name"
          onChangeText={(value) => setName(value)}
        />
      </View>

      <Button title={isEdit ? "Save" : "Add"} onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  containerContent: {
    flex: 1,
  },
});
