import React, { Component } from 'react';
import { StyleSheet, Text,TextInput, View, Dimensions } from 'react-native';
import io from "socket.io-client";
//delete below after bug fixed
import { YellowBox } from 'react-native';

export default class App extends Component {
  constructor(props){
    super(props)
    YellowBox.ignoreWarnings([
      'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
    ]);
    this.state = {
      inputMsg : "",
      listMsg : [],
    }
  }
  componentDidMount() {
    this.socket = io("http://10.39.1.115:3000")
    this.socket.on("chat message", data => {
      this.setState({ listMsg : [...this.state.listMsg, `${data.name} : ${data.msg}`]})
    })
    this.socket.on("user connected", data => {
      this.setState({ listMsg : [...this.state.listMsg, `${data} is connected`]})
    })
    this.socket.on("user disconnected", data => {
      this.setState({ listMsg : [...this.state.listMsg, `${data} is disconnected`]})
    })
  }
  submitChatMessage(){
    let msg = this.state.inputMsg
    if(msg.startsWith("#name")){
      let name = msg.substring(1,5)
      console.log(name);
      return;
    }
    this.socket.emit("chat message", this.state.inputMsg)
    this.setState({inputMsg:""})
  }
  render() {
    const listMsg = this.state.listMsg.map((msg,index)=> (
      <Text key={index}>{msg}</Text>
    ))
    return (
      <View style={styles.container}>
        <View
          style={styles.listMsgContainer}
        >
        {listMsg}
        </View>
        <View
          style={styles.inputSendMsgContainer}
        >
          <TextInput 
            style={styles.inputChat}
            autoCorrect={false}
            value={this.state.inputMsg}
            onSubmitEditing={()=> this.submitChatMessage()}
            onChangeText={inputMsg => {this.setState({inputMsg})}}
          ></TextInput>
        </View>
      </View>
    );
  }
}
const _Width = Dimensions.get("window").width;
const _Height = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flexWrap: "nowrap",
    height: 0.8 * _Height,
    margin:40,
    backgroundColor: '#fff',
  },
  listMsgContainer:{

  },
  inputSendMsgContainer:{
    alignSelf: "center",
    marginTop: "auto",
  },
  inputChat :  {
    height : 40,
    borderWidth : 2,
    width : _Width,
  }
});
