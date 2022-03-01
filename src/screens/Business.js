import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { Button, Icon, Text } from "react-native-elements";
import * as ROUTES from "../navigation/Routes";
import { useQuery, useMutation } from "react-query";
import {
  fetchPeople,
  deletePerson,
  deleteBusiness,
  fetchBusiness,
} from "../hooks/api";
import Person from "../components/Person";
import { SwipeListView } from "react-native-swipe-list-view";
import AppColors from "../style/AppColors";
import BottomSheetAction from "../components/BottomSheetAction";
import ButtonDelete from "../components/ButtonDelete";
import { trimToLength } from "../functions/helper";

const SCREEN_WIDTH = Dimensions.get("screen").width;

export default function Business({ navigation, route }) {
  const { businessId } = route.params;
  const [holdPersonId, setHoldPersonId] = useState("");
  const [showBottomsheetPerson, setShowBottomsheetPerson] = useState(false);
  const [showBottomsheetBusiness, setShowBottomsheetBusiness] = useState(false);

  const {
    data: business,
    status,
    refetch: refetchBusiness,
  } = useQuery(["business", businessId], () => fetchBusiness(businessId));

  const {
    data: people,
    status: statusPeople,
    refetch: refetchPeople,
  } = useQuery(["people", businessId], () => fetchPeople(businessId));

  // Dynamic screen header
  useEffect(() => {
    if (status === "success") {
      navigation.setOptions({
        title: trimToLength(business.name, 25),
        headerRight: () => (
          <Button
            title={"Edit"}
            type="clear"
            onPress={() =>
              navigation.push(ROUTES.CREATE_BUSINESS, { business })
            }
          />
        ),
      });
    }
  }, [business, status]);

  useEffect(() => {
    const focusSubscription = navigation.addListener("focus", () => {
      if (status !== "loading") {
        refetchBusiness();
        refetchPeople();
      }
    });

    return () => focusSubscription();
  }, [status]);

  const mutateDeletePerson = useMutation(
    ({ businessId, personId }) => deletePerson(businessId, personId),
    {
      onSuccess: () => {
        setHoldPersonId("");
        setShowBottomsheetPerson(false);
        refetchPeople();
      },
      onError: () =>
        Toast.show({
          type: "error",
          text1: "Failed to delete person",
        }),
    }
  );

  const mutateDeleteBusiness = useMutation(
    ({ businessId }) => deleteBusiness(businessId),
    {
      onSuccess: () => {
        setShowBottomsheetBusiness(false);
        navigation.goBack();
      },
      onError: () =>
        Toast.show({
          type: "error",
          text1: "Failed to delete business",
        }),
    }
  );

  if (status === "loading")
    return (
      <View style={styles.containerCentered}>
        <ActivityIndicator size="large" color={AppColors.primary} />
      </View>
    );

  if (status === "error")
    return (
      <View style={styles.containerCentered}>
        <Text style={styles.textError}>
          Error occurred while loading business
        </Text>
        <Button title="Try again" onPress={refetchBusiness} />
      </View>
    );

  return (
    <>
      <SwipeListView
        useFlatList={true}
        scrollEnabled={true}
        ListHeaderComponent={() => (
          <>
            <View style={styles.containerBusiness}>
              <View style={styles.containerLogo}>
                <Icon
                  name="no-photography"
                  size={40}
                  style={styles.iconNoImage}
                />
              </View>
              <Text h4 style={styles.textBusinessName}>
                {business.name}
              </Text>

              <View style={styles.containerAction}>
                <View style={styles.containerPeopleCount}>
                  <Text style={styles.textPeopleCount}>
                    {people?.persons.length || 0}
                  </Text>
                  <Text style={styles.textPeopleLabel}>
                    {people?.persons.length === 1 ? "person" : "people"}
                  </Text>
                </View>
                <View style={styles.containerPeopleButton}>
                  <Button
                    title="Add person"
                    onPress={() =>
                      navigation.push(ROUTES.CREATE_PERSON, {
                        businessId: business.businessId,
                      })
                    }
                  />
                </View>
              </View>
            </View>
            <View style={styles.containerPeople}>
              <Text h4 style={styles.textPeople}>
                People
              </Text>
            </View>
          </>
        )}
        data={people?.persons}
        keyExtractor={({ personId }) => personId}
        renderItem={({ item }) => <Person key={item.personId} person={item} />}
        ListEmptyComponent={() => {
          if (statusPeople === "loading") {
            return (
              <View style={styles.containerPeopleInfo}>
                <ActivityIndicator size="large" color={AppColors.primary} />
              </View>
            );
          } else {
            return (
              <View style={styles.containerPeopleInfo}>
                <Text>No people found</Text>
              </View>
            );
          }
        }}
        renderHiddenItem={(data, rowMap) => (
          <View style={styles.rowBack}>
            <Button
              title={
                <>
                  <Icon
                    name="edit"
                    size={24}
                    color="#fff"
                    containerStyle={{ padding: 0 }}
                  />
                </>
              }
              onPress={() => {
                rowMap[data.item.personId].closeRow();
                navigation.push(ROUTES.CREATE_PERSON, {
                  businessId,
                  person: data.item,
                });
              }}
            />
            <Button
              title={<Icon name="delete-outline" size={24} color="#fff" />}
              buttonStyle={styles.buttonDelete}
              onPress={() => {
                rowMap[data.item.personId].closeRow();
                setShowBottomsheetPerson(true);
                setHoldPersonId(data.item.personId);
              }}
            />
          </View>
        )}
        leftOpenValue={50}
        rightOpenValue={-50}
        ListFooterComponent={() => (
          <View style={styles.containerDelete}>
            <ButtonDelete
              title="Delete business"
              onPress={() => setShowBottomsheetBusiness(true)}
              type="clear"
            />
          </View>
        )}
      />
      <BottomSheetAction
        show={showBottomsheetPerson}
        onHide={() => setShowBottomsheetPerson(false)}
        title="Delete person"
        description="Are you sure you want to delete this person?"
        onConfirm={() => {
          mutateDeletePerson.mutate({
            businessId,
            personId: holdPersonId,
          });
        }}
        onCancel={() => {
          setHoldPersonId("");
          setShowBottomsheetPerson(false);
        }}
      />

      <BottomSheetAction
        show={showBottomsheetBusiness}
        onHide={() => setShowBottomsheetPerson(false)}
        title="Delete business"
        description="Are you sure you want to delete this business?"
        onConfirm={() => {
          mutateDeleteBusiness.mutate({
            businessId,
          });
        }}
        onCancel={() => {
          setShowBottomsheetBusiness(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  containerCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerBusiness: {
    alignItems: "center",
    marginBottom: 40,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: AppColors.backgroundBusinessHeader,
  },
  containerLogo: {
    width: 112,
    height: 112,
    maxWidth: 125,
    maxHeight: 125,
    backgroundColor: AppColors.backgroundBusinessLogo,
    borderRadius: 100,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconNoImage: {
    opacity: 0.3,
  },
  textBusinessName: {},
  containerPeopleCount: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  containerPeopleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textPeopleCount: {
    fontSize: 21,
    marginRight: 8,
    fontWeight: "bold",
  },
  textPeopleLabel: {
    fontSize: 21,
  },
  containerAction: {
    borderTopWidth: 2,
    borderTopColor: AppColors.backgroundBusinessLogo,
    marginVertical: 20,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: SCREEN_WIDTH * 0.9,
  },
  containerPeople: {
    paddingHorizontal: 20,
  },
  containerPeopleInfo: {
    margin: 20,
    padding: 20,
    backgroundColor: AppColors.backgroundItem,
    alignItems: "center",
    justifyContent: "center",
  },
  textPeople: {
    marginBottom: 20,
  },
  rowBack: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: AppColors.backgroundSwipe,
    paddingHorizontal: 15,
  },
  buttonDelete: { backgroundColor: AppColors.danger },
  containerDelete: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  textError: {
    marginBottom: 20,
  },
});
