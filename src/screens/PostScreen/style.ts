import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		paddingTop: 100,
		alignItems: 'center',
	},
	itemName: {
		color: '#fbd01d',
	},
	searchResultArea: {
		// width: 265,
		backgroundColor: 'white',
		height: 40,
		padding: 5,
		borderColor: 'black',
		width: 200,
	},
	inputView: {
		borderRadius: 25,
		borderColor: 'black',
		height: 50,
		marginBottom: 20,
		padding: 20,
		color: 'black',
		alignContent: 'center',
		marginHorizontal: 40,
	},
	closeButton: {
		marginHorizontal: 20,
		marginTop: 5,
		borderColor: 'black',
		color: 'black',
		borderRadius: 25,
	},
	inputText: {
		height: 50,
		color: 'black',
		borderColor: '#818181',
		borderBottomWidth: 1,
		padding: 5,
	},
	inputShopName: {
		width: 30,
	},
	input: {
		backgroundColor: 'white',
		height: 40,
		padding: 5,
		fontSize: 18,
		borderBottomWidth: 0.5,
		width: 250,
	},
	suggestion: {
		backgroundColor: 'white',
		padding: 5,
		fontSize: 14,
		marginRight: 5,
		marginLeft: 5,
	},
});
export const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: 'grey',
		borderRadius: 4,
		color: 'black',
		paddingRight: 30, // to ensure the text is never behind the icon
		width: 250,
	},
	inputAndroid: {
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderWidth: 0.5,
		borderColor: 'grey',
		borderRadius: 8,
		color: 'black',
		paddingRight: 30, // to ensure the text is never behind the icon
		width: 250,
		backgroundColor: '#eee',
	},
});
