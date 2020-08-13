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
	// メニューの長さが長い時にはみ出す可能性がある。cssで対策する必要あり
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
	followButton: {
		width: 180,
		backgroundColor:'#d3d3d3',
		borderRadius:15,
		height:35,
		alignItems:'center',
		justifyContent:'center',
		borderColor: '#d3d3d3',
		borderWidth: 1,
	},
	unFollowButton: {
		width: 180,
		backgroundColor:'#fbd01d',
		borderRadius:15,
		height : 35,
		alignItems:'center',
		justifyContent:'center',
		borderColor: '#fbd01d',
		borderWidth: 1,
	},
	followButtonText: {
		color: 'white'
	},
	unfollowButtonText: {
		color: 'white'
	},
	list: {
		marginTop: 20,
		marginBottom: 270
	},
});

