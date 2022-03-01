import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import BusinessItem from "../components/BusinessItem";
import { Text } from "react-native-elements";
import { fetchBusinesses, deleteBusiness } from "../hooks/api";
import { useQuery, useMutation } from "react-query";
import { SwipeListView } from "react-native-swipe-list-view";
import { Button, Icon } from "react-native-elements";
import Toast from "react-native-toast-message";
import * as ROUTES from "../navigation/Routes";
import AppColors from "../style/AppColors";
import BottomSheetAction from "../components/BottomSheetAction";
import BottomSheetWelcome from "../components/BottomSheetWelcome";
import { storeData, getData } from "../hooks/localStorage/localStorage";

export default function Directory({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [holdBusinessId, setHoldBusinessId] = useState("");
  const [showBottomsheet, setShowBottomsheet] = useState(false);
  const [showBottomsheetWelcome, setShowBottomsheetWelcome] = useState(false);

  // Load Businesses hook
  const {
    data: businesses,
    status,
    refetch,
    isRefetching,
  } = useQuery("businesses", fetchBusinesses);

  // Delete business hook
  const mutationDeleteBusiness = useMutation((data) => deleteBusiness(data), {
    onSuccess: () => {
      setShowBottomsheet(false);
      setHoldBusinessId("");
      refetch();
    },
    onError: () =>
      Toast.show({
        type: "error",
        text1: "Failed to add new business",
      }),
  });

  useEffect(() => {
    const focusSubscription = navigation.addListener("focus", () => refetch());

    return () => focusSubscription();
  }, []);

  useEffect(() => {
    if (!isRefetching && refreshing) setRefreshing(false);
  }, [isRefetching]);

  // Welcome message hook
  useEffect(() => {
    const hasWelcomed = async () => {
      const welcomed = await getData("@welcomed");
      if (!welcomed) {
        setShowBottomsheetWelcome(true);
        await storeData("@welcomed", "1");
      }
    };
    if (businesses && businesses.length === 1) hasWelcomed();
  }, [businesses]);

  if (status === "loading") {
    return (
      <View style={styles.containerCentered}>
        <ActivityIndicator size="large" color={AppColors.primary} />
      </View>
    );
  } else if (status === "error") {
    return (
      <View style={styles.containerCentered}>
        <Text>Failed to load businesses</Text>
        <Button title="Try again" onPress={refetch} />
      </View>
    );
  } else {
    return (
      <>
        <SwipeListView
          useFlatList={true}
          data={businesses}
          keyExtractor={(item) => item.businessId}
          renderItem={({ item }) => (
            <BusinessItem
              business={item}
              onPress={() =>
                navigation.push(ROUTES.BUSINESS, {
                  businessId: item.businessId,
                })
              }
            />
          )}
          renderHiddenItem={(data, rowMap) => (
            <View style={styles.rowBack}>
              <Button
                title={<Icon name="edit" size={24} color="#fff" />}
                onPress={() => {
                  rowMap[data.item.businessId].closeRow();
                  navigation.push(ROUTES.CREATE_BUSINESS, {
                    business: data.item,
                  });
                }}
              />
              <Button
                title={<Icon name="delete-outline" size={24} color="#fff" />}
                onPress={() => {
                  setHoldBusinessId(data.item.businessId);
                  setShowBottomsheet(true);
                  rowMap[data.item.businessId].closeRow();
                }}
                buttonStyle={styles.buttonDelete}
              />
            </View>
          )}
          leftOpenValue={75}
          rightOpenValue={-75}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            refetch();
          }}
          ListFooterComponent={() => {
            if (businesses && businesses.length)
              return (
                <View style={styles.containerPullRefresh}>
                  <Text style={styles.textPullRefresh}>Pull to refresh</Text>
                </View>
              );
            else return null;
          }}
          ListEmptyComponent={() => (
            <View style={styles.containerCentered}>
              <Text style={styles.textEmpty}>No business found</Text>
              <Button
                title="Create business"
                onPress={() => navigation.push(ROUTES.CREATE_BUSINESS)}
              />
            </View>
          )}
          contentContainerStyle={businesses.length === 0 ? { flex: 1 } : {}}
        />
        <BottomSheetAction
          show={showBottomsheet}
          onHide={() => setShowBottomsheet(false)}
          title="Delete business"
          description="Are you sure you want to delete this business?"
          onConfirm={() => {
            mutationDeleteBusiness.mutate(holdBusinessId);
          }}
          onCancel={() => {
            setHoldBusinessId("");
            setShowBottomsheet(false);
          }}
        />

        <BottomSheetWelcome
          show={showBottomsheetWelcome}
          onHide={() => setShowBottomsheetWelcome(false)}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  containerCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
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
  textEmpty: {
    marginBottom: 20,
    fontSize: 18,
  },
  containerPullRefresh: {
    padding: 20,
    alignItems: "center",
  },
  textPullRefresh: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#bbb",
  },
});
