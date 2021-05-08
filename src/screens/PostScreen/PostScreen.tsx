import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity
} from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Input } from "react-native-elements";
import { Button } from "react-native-elements";
import RNPickerSelect from "react-native-picker-select";
import GlobalContainer from "../../store/GlobalState";
import { Subscribe } from "unstated";
import { ContainerProps, NavLoginParamList } from "../../types/types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { styles, pickerSelectStyles } from "./style";
import {
  fetchShopPredictions,
  fetchShopDescription,
  registerShopInfomation,
  setShopInfoOnFireStore,
  registerReview,
  canPress
} from "./index";

const PostScreen: React.FC<NavigationProps & ContainerProps> = (props) => {
  const [shopName, setShopName] = useState<string>("");
  const [favoriteMenu, changeFavorite] = useState<string>("");
  const [price, changePrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [address, setShopAddress] = useState<string>("");
  const [inputedShopName, setInputedShopName] = useState<string>("");
  const [predictions, setPredictions] = useState<any>();
  const [isShownPredictions, setIsShownPredictions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [_dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [_latitude, setLatitude] = useState<number>(35.68123620000001);
  const [_longitude, setLongitude] = useState<number>(139.7671248);
  const [canPressSearchButton, setCanPressSearchButton] = useState<boolean>(
    false
  );
  const [whileSearching, setWhileSearching] = useState<boolean>(false);
  const categoryItemList = [
    { label: "居酒屋", value: "居酒屋" },
    { label: "カフェ", value: "カフェ" },
    { label: "中華", value: "中華" },
    { label: "ラーメン", value: "ラーメン" },
    { label: "ランチ", value: "ランチ" },
    { label: "ディナー", value: "ディナー" },
    { label: "その他", value: "その他" }
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
      } else {
        const location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      }
    })();
  }, []);
  const selectCategory = (category: string) => {
    setCategory(category);
  };
  const change = (text: string) => {
    setInputedShopName(text);
  };
  const close = () => {
    // falseになると検索結果の一覧が表示されなくなる
    setIsShownPredictions(false);
    change("");
  };
  const selectShopName = (shopName: string, address: string) => {
    setShopAddress(address);
    setShopName(shopName);
  };
  const searchShop = async () => {
    if (inputedShopName == "") {
      setDialogVisible(true);
    } else {
      setCanPressSearchButton(true);
      setWhileSearching(true);
      const shopPredictions = await fetchShopPredictions(
        inputedShopName,
        _latitude,
        _longitude
      );
      setIsShownPredictions(true);
      setPredictions(shopPredictions.predictions);
      setCanPressSearchButton(false);
      setWhileSearching(false);
    }
  };

  const postReview = async () => {
    setIsLoading(true);
    setIsPressed(true);
    canPress(category, shopName, isPressed);
    const shopDescriptionJson = await fetchShopDescription(address);
    const shopInfomation = await registerShopInfomation(shopDescriptionJson);
    await setShopInfoOnFireStore(shopInfomation, address, shopName);
    await registerReview(
      shopInfomation,
      props.globalState.state.uid,
      price,
      category,
      favoriteMenu,
      shopName,
      address
    );
    setShopName("");
    changeFavorite("");
    changePrice("");
    selectCategory("");
    setIsLoading(false);
    setIsPressed(false);
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View>
          <Text style={styles.itemName}>店名検索</Text>
          <View
            style={{ flexDirection: "row", width: 250, alignContent: "center" }}
          >
            <Input
              containerStyle={styles.searchResultArea}
              placeholder="例）新宿　吉野家"
              value={inputedShopName}
              onChangeText={change}
            />
            <Button
              onPress={searchShop}
              title="検索"
              type="solid"
              buttonStyle={{
                borderRadius: 10,
                backgroundColor: "white",
                borderColor: "black",
                borderWidth: 1
              }}
              titleStyle={{ color: "black" }}
              disabled={canPressSearchButton}
              loading={whileSearching}
              disabledStyle={
                canPressSearchButton ? { backgroundColor: "white" } : null
              }
            ></Button>
          </View>
        </View>
        {isShownPredictions ? (
          <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: "white" }}
          >
            <View>
              <FlatList
                data={predictions}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      selectShopName(
                        item.structured_formatting.main_text,
                        item.description
                      )
                    }
                  >
                    <Text style={styles.suggestion} key={item.id}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                )}
              ></FlatList>
              <Button
                title={"閉じる"}
                type="outline"
                buttonStyle={styles.closeButton}
                titleStyle={{ color: "black" }}
                onPress={close}
              />
            </View>
          </KeyboardAwareScrollView>
        ) : null}
        <View style={{ marginTop: 30 }}>
          <Text style={styles.itemName}>店名 (必須)</Text>
          <TextInput
            placeholder="検索結果が入力されます"
            value={shopName}
            style={styles.input}
            onChangeText={() => selectShopName(shopName, address)}
            editable={false}
          />
        </View>
        <View style={{ marginTop: 30 }}>
          <Text style={styles.itemName}>カテゴリー (必須)</Text>
          <RNPickerSelect
            doneText=""
            items={categoryItemList}
            style={pickerSelectStyles}
            placeholder={{ label: "選択してください", value: "" }}
            onValueChange={selectCategory}
          />
        </View>
        <View style={{ marginTop: 30 }}>
          <Text style={styles.itemName}>おすすめのメニュー</Text>
          <TextInput
            style={styles.input}
            placeholder="おすすめのメニューを入力して下さい"
            value={favoriteMenu}
            onChangeText={changeFavorite}
          />
        </View>
        <View style={{ marginTop: 30 }}>
          <Text style={styles.itemName}>値段</Text>
          <TextInput
            style={styles.input}
            placeholder="価格を入力して下さい"
            value={price}
            onChangeText={changePrice}
          />
        </View>
        <View style={{ marginTop: 30, width: "60%" }}>
          <Button
            buttonStyle={{ borderRadius: 20, backgroundColor: "#fbd01d" }}
            title="投稿する"
            type="solid"
            onPress={postReview}
            disabled={canPress(category, shopName, isPressed)}
            loading={isLoading}
            disabledStyle={isPressed ? { backgroundColor: "#fbd01d" } : null}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

type PostScreenNavigationProps = BottomTabNavigationProp<
  NavLoginParamList,
  "Post"
>;

type NavigationProps = {
  navigation: PostScreenNavigationProps;
};

export const PostScreenWrapper: React.FC<NavigationProps> = ({
  navigation
}) => {
  return (
    <Subscribe to={[GlobalContainer]}>
      {(globalState: GlobalContainer) => (
        <PostScreen globalState={globalState} navigation={navigation} />
      )}
    </Subscribe>
  );
};
