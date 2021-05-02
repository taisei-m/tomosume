import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	keyboardScrollView: {
		flex: 1,
		backgroundColor: 'white',
	},
	sigininButton: {
		width: '80%',
	},
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		// justifyContent: 'center',
		paddingTop: '30%',
	},
	logo: {
		fontWeight: 'bold',
		fontSize: 50,
		color: 'black',
		marginTop: '20%',
		marginBottom: '10%',
	},
	inputView: {
		width: '80%',
		borderRadius: 25,
		borderColor: 'black',
		borderWidth: 1,
		height: 50,
		justifyContent: 'center',
		paddingLeft: '5%',
		paddingRight: '5%',
	},
	inputText: {
		height: 50,
		color: 'black',
	},
	inputErrorMessage: {
		marginBottom: '3%',
		color: 'red',
	},
	inputNotErrorMessage: {
		marginBottom: '3%',
		color: '#48D1CC',
	},
	forgotText: {
		color: 'black',
		textDecorationLine: 'underline',
		// marginBottom: "13%",
	},
	createAccountText: {
		// color: '#818181',
		color: 'black',
		textDecorationLine: 'underline',
		marginTop: '5%',
	},
	aboveButtonMessage: {
		marginTop: '3%',
		marginBottom: '4%',
		color: 'red',
	},
	button: {
		backgroundColor: '#5E9CFE',
		borderRadius: 25,
		borderColor: 'black',
		height: 50,
	},
	icon: {
		marginRight: 10,
	},
});
