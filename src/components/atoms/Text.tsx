import React from 'react';
import { View, StyleSheet, Text as RNText, TextStyle } from 'react-native';

type Props = {
	style?: TextStyle;
};

export const Text: React.FC<Props> = ({ children, style }) => {
	const textStyle = {
		color: 'black',
		fontSize: 18,
	};
	return <RNText style={[textStyle, style]}>{children}</RNText>;
};

const styles = StyleSheet.create({});
