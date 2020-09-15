import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleText: {
		fontWeight: 'bold',
		fontSize: 26,
		color: 'black',
		marginBottom: 40,
	},
	contentText: {
		fontSize: 19,
		color: 'black',
		marginBottom: 40,
	},
	inputView: {
		width: '80%',
		borderRadius: 25,
		borderColor: 'black',
		height: 50,
		marginBottom: 20,
		justifyContent: 'center',
		padding: 20,
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
	button: {
		backgroundColor: '#5E9CFE',
		borderRadius: 25,
		borderColor: 'black',
		height: 50,
	},
	buttonText: {
		color: 'white',
	},
	ToLoginText: {
		textDecorationLine: 'underline',
		marginTop: '5%',
	},
	icon: {
		marginRight: 10,
	},
});
