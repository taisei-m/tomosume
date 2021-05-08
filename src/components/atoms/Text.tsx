import React from "react";
import { StyleSheet, Text as RNText } from "react-native";

type Props = {
  color?: string;
  size?: number;
  weight?: "400" | "700";
  textAlign?: "left" | "center" | "right" | "auto";
  decorationLine?: "underline" | "none";
  onPress?: () => void;
};

export const Text: React.FC<Props> = ({
  children,
  color,
  decorationLine,
  size,
  textAlign,
  weight,
  onPress
}) => {
  const colorStyle = {
    color: color ? color : "black"
  };
  const sizeStyle = {
    fontSize: size ? size : 18
  };
  const weightStyle = {
    fontWeight: weight ? weight : "400"
  };
  const alignStyle = {
    textAlign: textAlign ? textAlign : "auto"
  };
  const decorationLineStyle = {
    textDecorationLine: decorationLine ? decorationLine : "none"
  };

  return (
    <RNText
      style={[
        colorStyle,
        decorationLineStyle,
        sizeStyle,
        weightStyle,
        alignStyle
      ]}
      onPress={onPress}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({});
