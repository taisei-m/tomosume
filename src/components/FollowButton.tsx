import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity,} from 'react-native';
import { Text,} from 'react-native-elements';

type followButtonProps = {
    id: string
    isfollowingMutually?: boolean
}

const FollowButton = (props: followButtonProps) => {
    const [_hasFollowd, setHasFollowed] = useState<boolean>(true)

    useEffect(() => {
        console.log(props.isfollowingMutually)
        if (props.isfollowingMutually == true){
            setHasFollowed(true)
        } else {
            setHasFollowed(false)
        }
    }, [])

    const follow = (id: string) => {
        console.log(id)
        setHasFollowed(!_hasFollowd)
    }

    return (
        <TouchableOpacity
            style={
                _hasFollowd
                ? styles.followButton
                : styles.notFollowButton
                }
            onPress={()=> {follow(props.id)}
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
