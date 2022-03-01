import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";

const DURATION_IN = 300;
const DURATION_OUT = 200;

const screenHeight = Dimensions.get("screen").height;
function BottomSheet(props) {
  const [show, setShow] = useState(props.show);
  const panY = useRef(new Animated.Value(screenHeight)).current;

  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: DURATION_IN,
    useNativeDriver: true,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: screenHeight,
    duration: DURATION_OUT,
    useNativeDriver: true,
  });

  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const handleDismiss = () => {
    closeAnim.start(() => {
      setShow(false);
      props.onHide();
    });
  };

  useEffect(() => {
    if (props.show !== show) {
      if (props.show) {
        setShow(true);
        resetPositionAnim.start();
      } else handleDismiss();
    }
  }, [props.show]);

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: () =>
        Animated.event([null, { dy: panY }], {
          useNativeDriver: false,
        }),
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 150 || gs.vy > 0.2) {
          return handleDismiss();
        }
        return resetPositionAnim.start();
      },
    })
  ).current;

  const panHandlers = panResponders.panHandlers;

  return (
    <Modal
      animated
      animationType="fade"
      visible={show}
      transparent
      onRequestClose={handleDismiss}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlay}
        onPress={() => {
          handleDismiss();
        }}
      >
        <Animated.View
          style={{
            ...styles.container,
            transform: [{ translateY }],
            bottom: 0,
          }}
          {...panHandlers}
        >
          <View style={styles.sliderIndicatorRow}>
            <View style={styles.sliderIndicator} />
          </View>
          <View style={props.containerStyle}>{props.children}</View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.3)",
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    minHeight: 200,
  },
  sliderIndicatorRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sliderIndicator: {
    backgroundColor: "#CECECE",
    height: 4,
    width: 45,
  },
});

BottomSheet.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
};

export default BottomSheet;
