import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity,} from 'react-native';
import { Text,} from 'react-native-elements';
import {db} from '../../firebaseConfig'
import {followButtonProps} from '../types/types'

const FollowButton = (props: followButtonProps) => {
    // フォロー中であるかいないかを定義する変数
    const [_hasFollowd, setHasFollowed] = useState<boolean>(true)

    useEffect(() => {
        if (props.isFollowExchange == true){
            setHasFollowed(true)
        } else {
            setHasFollowed(false)
        }
    }, [])

    const pressFollowButton = (id: string) => {
        // フォロー中であるかないかで場合分け
        if(_hasFollowd) {
            db.collection('userList').doc(props.userId).collection('follower').doc(id).delete()
        } else {
            db.collection('userList').doc(props.userId).collection('follower').doc(id).set({})
        }
        // ボタンの色を変更する
        setHasFollowed(!_hasFollowd)
    }

    return (
        <TouchableOpacity
            style={
                _hasFollowd
                ? styles.followButton
                : styles.notFollowButton
                }
            onPress={()=> {pressFollowButton(props.id)}
        }
        >
            {
                _hasFollowd
                ? <Text style={{color: 'white'}}>フォロー中</Text>
                : <Text style={{color: 'white'}}>フォロー</Text>
            }
        </TouchableOpacity>
    )
}

export default FollowButton

const styles = StyleSheet.create({
    followButton: {
        width: 100,
        backgroundColor:"#d3d3d3",
        borderRadius:15,
        height:30,
        alignItems:"center",
        justifyContent:"center",
        borderColor: '#d3d3d3',
        borderWidth: 1,
        position: 'absolute',
        top: 10,
        right: 10
    },
    notFollowButton: {
        width: 100,
        backgroundColor:"#5E9CFE",
        borderRadius:15,
        height:30,
        alignItems:"center",
        justifyContent:"center",
        borderColor: '#5E9CFE',
        borderWidth: 1,
        position: 'absolute',
        top: 10,
        right: 10
    }
});
