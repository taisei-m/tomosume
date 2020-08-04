import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1
	},
	userName: {
		color: 'black',
		fontSize: 13,
		fontWeight: '700',
	},
	userIcon: {
		width: 90,
		height: 90,
		borderRadius: 90/ 2,
		borderColor: 'white',
		borderWidth: 2,
	},
	listItem: {
		margin: 15,
	},
	shopName: {
		fontSize: 25
	},
	favoriteMenu: {
		margin: 10
	},
	number: {
		fontSize: 28
	},
	numberKey: {
		fontSize: 12,
		textAlign: 'center',
		color: '#818181'
	},
	editButton: {
		width: 160,
		backgroundColor:"white",
		borderRadius:15,
		height:35,
		alignItems:"center",
		justifyContent:"center",
		borderColor: '#818181',
		borderWidth: 1,
		marginRight: 10
	},
	editText: {
		color: 'black',
		fontWeight: '500',
	},
	list: {
		marginTop: 20,
		marginBottom: 10
	},
})