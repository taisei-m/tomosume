import { StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontWeight: 'bold',
		fontSize: 27,
		color: 'black',
		marginBottom: 40,
	},
	resetDescription: {
		width: '80%',
		marginBottom: 30,
	},
	inputView: {
		width: '80%',
		borderRadius: 25,
		borderColor: 'black',
		borderWidth: 1,
		height: 50,
		marginBottom: 0,
		justifyContent: 'center',
		paddingLeft: '5%',
		paddingRight: '5%',
	},
	inputText: {
		height: 50,
		color: 'black',
	},
	forgot: {
		margin: 20,
		color: '#818181',
		marginBottom: 60,
	},
	aboveButtonMessage: {
		marginRight: '5%',
		marginLeft: '5%',
		marginTop: '3%',
		marginBottom: '2%',
		color: 'red',
	},
	button: {
		backgroundColor: '#5E9CFE',
		borderRadius: 25,
		borderColor: 'black',
		height: 50,
	},
	buttonText: {
		color: 'white',
	},
	icon: {
		marginRight: 10,
	},
	AlreadyHaveAnAccountText: {
		color: 'black',
		textDecorationLine: 'underline',
		marginTop: '5%',
	},
});
