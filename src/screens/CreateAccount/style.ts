import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	keyboardScrollView: {
		flex: 1,
		backgroundColor: 'white',
	},
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		paddingTop: '50%',
	},
	logo: {
		fontWeight: 'bold',
		fontSize: 30,
		color: 'black',
		marginTop: '20%',
		marginBottom: '10%',
	},
	inputView: {
		width: '85%',
		height: 50,
		marginBottom: 20,
		justifyContent: 'center',
		padding: 20,
	},
	inputText: {
		height: 50,
		color: 'black',
		paddingLeft: 5,
		paddingRight: 0,
		fontSize: 14,
	},
	redInputErrorMessage: {
		color: 'red',
	},
	greenInputErrorMessage: {
		color: '#48D1CC',
	},
	aboveButtonMessage: {
		marginTop: '2%',
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
	AlreadyHaveAccountText: {
		textDecorationLine: 'underline',
		marginTop: '5%',
	},
	alreadyHaveAccountBtnArea: {
		marginTop: 20,
	},
});
