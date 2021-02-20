import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	mapStyle: {
		...StyleSheet.absoluteFillObject,
		width: '100%',
		height: '100%',
		position: 'relative',
	},
	card: {
		borderRadius: 10,
	},
	userInfomation: {
		flexDirection: 'row',
		marginBottom: 10,
	},
	userName: {
		fontSize: 18,
		paddingTop: 5,
		paddingLeft: 10,
	},
	favorite: {
		paddingRight: 40,
		marginLeft: 5,
	},
	price: {
		borderRightWidth: 1,
		borderRightColor: 'grey',
		paddingRight: 40,
		marginLeft: 5,
	},
	category: {
		marginLeft: 10,
		marginRight: 5,
	},
	itemName: {
		color: 'grey',
		fontWeight: '700',
	},
	categoryName: {
		marginTop: 5,
		fontWeight: '700',
	},
	menuName: {
		marginTop: 5,
		fontWeight: '700',
	},
});
