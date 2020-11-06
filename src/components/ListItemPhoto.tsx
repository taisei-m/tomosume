import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, Dimensions, Image} from 'react-native';
import { Avatar, Card, Icon } from 'react-native-elements';

interface ItemProps {
	id: string;
	userName?: string;
	iconURL?: string;
	title?: string;
	address?: string;
	category: string;
	favorite: string;
	price: string;
	userId?: string;
	pressMethod: Function;
	photoInFeedURI?: string;
}

const Item = (props: ItemProps) => {
	const [_aspectRate, setAspectRate] = useState<number>(0);
	const [_windowWidth, setWindowWidth] = useState<number>(0);

	const photoInfeedURI: string = '../../assets/suberidai.png';


	useEffect(() => {
		const source = Image.resolveAssetSource(require(photoInfeedURI));
		setAspectRate(source.height/source.width); 
		setWindowWidth(Dimensions.get('window').width);
	}, []);

	return (
		<View style={styles.container}>
			<Card containerStyle={styles.card}>
				<View style={styles.feedHeader}>
					<TouchableOpacity onPress={() => props.pressMethod(props.userId)}>
						<View style={styles.feedHeaderIcon}>
							<Avatar rounded source={{ uri: props.iconURL }} size={'small'} />
						</View>
					</TouchableOpacity>
					<View style={styles.feedHeaderText}>
						<TouchableOpacity onPress={() => props.pressMethod(props.userId)}>
							<View>
								<Text style={styles.userName}>{props.userName}</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity>
							<Text style={styles.shopAddress} numberOfLines={2}>
								{props.address}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View>
					<Image
						style={{height: _windowWidth * _aspectRate , width: "100%"}}
						source={require(photoInfeedURI)}
					/>
				</View>
				<View style={styles.actionButtons}>
					<View style={styles.actionButtonsLeft}>
						<View style={styles.actionButtonHeart}>
							<Icon 
								size={30}
								name="heart"
								type="font-awesome"
								color="red"
								// onPress={() =>{}}
							/>
						</View>
						<View style={styles.actionButtonSearch}>
							<Icon
								size={30}
								name="search"
								type="font-awesome"
								color="black"
								// onPress={() => }
							/>
						</View>
					</View>
					<View style={styles.actionButtonsRight}>
						<View style={styles.actionButtonKeep}>
							<Icon
								size={30}
								name="inbox"
								type="font-awesome"
								color="black"
								// onPress={() => }
							/>
						</View>
					</View>
				</View>
				<View style={styles.frameReview}>
					<View style={styles.favorite}>
						<Text style={styles.itemName}>おすすめメニュー</Text>
						<Text style={styles.menuName} numberOfLines={3}>
							{props.favorite}
						</Text>
					</View>
					<View style={styles.price}>
						<Text style={styles.itemName}>値段</Text>
						<Text style={styles.menuName}>{props.price}</Text>
					</View>
					<View style={styles.category}>
						<Text style={styles.itemName}>カテゴリー</Text>
						<Text style={styles.categoryName}>{props.category}</Text>
					</View>
				</View>
				<Text style={styles.caption}>				
					gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg
				</Text>
			</Card>
		</View>
	);
};
export default Item;

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	card: {
		padding: 0,
		margin: 0,
		backgroundColor: 'white',
		borderColor: "white",
		borderRadius: 0,
		width: 100 + '%',
		...Platform.select({
			ios: {
				shadowOpacity: 0.3,
				shadowColor: '#000',
				shadowOffset: { width: 3, height: 3 },
				shadowRadius: 3,
			},
		}),
	},
	feedHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 9,
		marginBottom: 9,
		marginLeft: 12,
		marginRight: 12,
	},
	feedHeaderIcon: {

	},
	feedHeaderText: {
		flexDirection: "column",
		justifyContent: "center",
		marginLeft: 12,
	},
	userName: {
		fontSize: 13,
		fontWeight: '700',
	},
	shopAddress: {
		fontSize: 13,
	},
	actionButtons: {
		flexDirection: "row",
		marginTop: 9,
		marginLeft: 12,
		marginRight: 12,
	},
	actionButtonsLeft: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-start",
	},
	actionButtonsRight: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	actionButtonHeart: {
		
	},
	actionButtonSearch: {
		marginLeft: 12,
	},
	actionButtonKeep: {
		
	},
	frameReview : { 
		flexDirection: 'row', 
		marginTop: 9, 
		marginBottom: 9,
		marginLeft: 12,
		marginRight: 12
	},
	favorite: {
		borderRightWidth: 1,
		borderRightColor: 'grey',
		flex: 2,
		paddingLeft: 5,
	},
	price: {
		borderRightWidth: 1,
		borderRightColor: 'grey',
		flex: 1,
		paddingLeft: 5,
	},
	category: {
		flex: 1,
		paddingLeft: 5,
	},
	itemName: {
		color: 'grey',
		fontWeight: '700',
		fontSize: 13,
	},
	categoryName: {
		marginTop: 5,
		fontWeight: '700',
	},
	menuName: {
		marginTop: 5,
		fontWeight: '700',
	},
	feedPhoto: {
		// width: 100 + "%",
		// height: Dimensions.get('window').width * 
	},
	caption: {
		marginTop: 9,
		marginBottom: 20,
		marginLeft: 12,
		marginRight: 12,
	}
});
