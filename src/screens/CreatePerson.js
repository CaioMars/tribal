import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import PhoneInput from "../components/PhoneInput";
import {
  isEmailAddress,
  isPhoneNumber,
  stripNumber,
  stripEmailAddress,
} from "../functions/helper";
import { useMutation } from "react-query";
import { postPerson, updatePerson, deletePerson } from "../hooks/api";
import Toast from "react-native-toast-message";
import AppColors from "../style/AppColors";
import BottomSheetAction from "../components/BottomSheetAction";

export default function CreatePerson({ navigation, route }) {
  const { businessId, person } = route.params;
  const isEdit = person?.personId ? true : false;

  const [name, setName] = useState(person?.name || "");
  const [errorName, setErrorName] = useState("");
  const [email, setEmail] = useState(person?.email || "");
  const [errorEmail, setErrorEmail] = useState("");
  const [phone, setPhone] = useState(person?.phone || "");
  const [errorPhone, setErrorPhone] = useState("");
  const [role, setRole] = useState(person?.role || "");
  const [errorRole, setErrorRole] = useState("");
  const [date, setDate] = useState(person?.join_date || "");
  const [errorDate, setErrorDate] = useState("");
  const [showDate, setShowDate] = useState(false);
  const [showBottomsheet, setShowBottomsheet] = useState(false);

  // Post person hook
  const mutatePostPerson = useMutation(
    ({ businessId, data }) => postPerson(businessId, data),
    {
      onSuccess: () => navigation.goBack(),
      onError: () =>
        Toast.show({
          type: "error",
          text1: "Failed to create person",
        }),
    }
  );

  // Update person hook
  const mutateUpdatePerson = useMutation(
    ({ businessId, personId, data }) =>
      updatePerson(businessId, personId, data),
    {
      onSuccess: () => navigation.goBack(),
      onError: () =>
        Toast.show({
          type: "error",
          text1: "Failed to update person",
        }),
    }
  );

  // Delete person hook
  const mutateDeletePerson = useMutation(
    ({ businessId, personId }) => deletePerson(businessId, personId),
    {
      onSuccess: () => navigation.goBack(),
      onError: () =>
        Toast.show({
          type: "error",
          text1: "Failed to delete person",
        }),
    }
  );

  useEffect(() => {
    // Dynamic screen header
    if (isEdit) {
      navigation.setOptions({
        title: "Edit person",
      });
    }
  }, []);

  function onChangeText(value, field) {
    switch (field) {
      case "name":
        if (value.length < 44) setName(value);
        break;
      case "email":
        value = stripEmailAddress(value);
        setEmail(value);
        break;
      case "phone":
        if (stripNumber(value).length <= 11) setPhone(value);
        break;
      case "role":
        setRole(value);
        break;
      default:
        break;
    }
  }

  // Check if all fields are valid
  function isFormValid() {
    let error = false;

    if (!name) {
      setErrorName("Please add a name");
      error = true;
    }

    if (!email) {
      setErrorEmail("Please add e-mail");
      error = true;
    } else if (!isEmailAddress(email)) {
      setErrorEmail("Please add valid e-mail");
      error = true;
    }

    if (!phone) {
      setErrorPhone("Please add phone number");
      error = true;
    } else if (!isPhoneNumber(phone)) {
      setErrorPhone("Please add a valid phone number");
      error = true;
    }

    if (!role) {
      setErrorRole("Please add a name");
      error = true;
    }

    if (!date) {
      setErrorDate("Please add a date");
      error = true;
    } else if (moment(date, "DD/MM/YYYY").isAfter(moment())) {
      setErrorDate("Date cannot be in the future");
      error = true;
    }

    return !error;
  }

  // Clears all errors
  function clearErrors() {
    setErrorName("");
    setErrorEmail("");
    setErrorPhone("");
    setErrorRole("");
    setErrorDate("");
  }

  function onSubmit() {
    clearErrors();
    if (isFormValid()) {
      if (!isEdit) {
        mutatePostPerson.mutate({
          businessId,
          data: { name, email, phone, role, join_date: date },
        });
      } else {
        mutateUpdatePerson.mutate({
          businessId,
          personId: person.personId,
          data: { name, email, phone, role, join_date: date },
        });
      }
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.containerContent}>
        <Input
          label="Name"
          value={name}
          errorMessage={errorName}
          onChangeText={(value) => onChangeText(value, "name")}
        />
        <Input
          label="E-mail"
          value={email}
          errorMessage={errorEmail}
          onChangeText={(value) => onChangeText(value, "email")}
          keyboardType="email-address"
        />
        <PhoneInput
          label="Phone"
          value={phone}
          errorMessage={errorPhone}
          onChangeText={(value) => onChangeText(value, "phone")}
        />
        <Input
          label="Role"
          value={role}
          errorMessage={errorRole}
          onChangeText={(value) => onChangeText(value, "role")}
        />
        <TouchableOpacity onPress={() => setShowDate(true)}>
          <Input
            label="Join date"
            value={date}
            errorMessage={errorDate}
            onChangeText={(value) => onChangeText(value, "date")}
            disabled={true}
            disabledInputStyle={{ opacity: 1 }}
          />
        </TouchableOpacity>
        {showDate && (
          <DateTimePicker
            value={new Date()}
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setDate(moment(selectedDate).format("D/MM/YYYY").toString());
                setShowDate(false);
              }
            }}
          />
        )}
        {isEdit && (
          <>
            <Button
              type="outline"
              title="Delete person"
              buttonStyle={styles.buttonDelete}
              titleStyle={styles.buttonDeleteTitle}
              onPress={() => setShowBottomsheet(true)}
            />
            <View style={styles.containerAPINotice}>
              <Text style={styles.textAPINotice}>
                Notice: API only allows to edit the person's name, any other
                changes are ignored by the API endpoint.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
      <View>
        <Button title={isEdit ? "Save" : "Add"} onPress={() => onSubmit()} />
      </View>
      <BottomSheetAction
        show={showBottomsheet}
        onHide={() => setShowBottomsheet(false)}
        title="Delete person"
        description="Are you sure you want to delete this person?"
        onConfirm={() => {
          mutateDeletePerson.mutate({
            businessId,
            personId: person.personId,
          });
        }}
        onCancel={() => {
          setShowBottomsheet(false);
        }}
      />
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
  buttonDelete: {
    color: AppColors.danger,
    borderColor: AppColors.danger,
  },
  buttonDeleteTitle: {
    color: AppColors.danger,
  },
  containerAPINotice: {
    paddingVertical: 20,
  },
  textAPINotice: {
    color: "#777",
  },
});
