import React from "react";
import { Button as RNButton } from "react-native-elements";
import { StyleSheet } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
};

export const Button: React.FC<Props> = ({ title, onPress }) => {
  return (
    <RNButton
      title={title}
      buttonStyle={styles.button}
      titleStyle={styles.title}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fbd01d",
    borderRadius: 5,
    height: 40
  },
  title: {
    fontWeight: "700",
    padding: 10
  }
});
