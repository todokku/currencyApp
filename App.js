import React, { Component } from 'react';
import { AsyncStorage, ScrollView, TextInput, StyleSheet, Text, View, Image, KeyboardAvoidingView, Button, TouchableOpacity } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
const axios = require('axios');
const cio = require('react-native-cheerio');
import imagePicker from 'react-native-image-picker';

const options = {
  noData: true,
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};





class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      image: null
    };
    this.getPrices();
    AsyncStorage.getItem('name').then(value => this.setState({ name: value }));
    AsyncStorage.getItem('text').then(value => this.setState({ text: value }));
    AsyncStorage.getItem('image').then(value => this.setState({ image: value }));
    console.log(this.state.image);

  }
  getPrices() {
    axios.get('http://www.tgju.org/').then(response => {
      const $ = cio.load(response.data);
      var dollar = $("li#l-price_dollar_rl span.info-price").text() + " Rials";
      var euro = $("li#l-price_eur span.info-price").text() + " Rials";
      var coin = $("tr[data-market-row=\"sekeb\"]").attr("data-price") + " Rials";
      var coinImam = $("li#l-sekee span.info-price").text() + " Rials";
      this.setState({ dollar: dollar, euro: euro, coinImam: coinImam, coin: coin });
    }).catch(error => alert(error));
  };

  openImage = () => {
    console.log(this.state.image)
    imagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ image: response.uri });
        AsyncStorage.setItem('image', response.uri);
        // console.log('IMAGE: ');
        // console.log(response);
        // AsyncStorage.getItem('image').then(value => console.log(value));
      }
    });
  }


  render() {
    return (

      <ScrollView style={styles.container}>

        <KeyboardAvoidingView>
          <View style={styles.border}>
            <View style={styles.square}>
              <Image resizeMode='stretch' style={styles.img} source={require('./images/icDollar.png')} />
              <Text style={styles.price}>{this.state.dollar}</Text>
            </View>
            <View style={styles.square}>
              <Image resizeMode='stretch' style={styles.img} source={require('./images/icEuro.png')} />
              <Text style={styles.price}>{this.state.euro}</Text>
            </View>
          </View>


          <View style={styles.border} >
            <View style={styles.square}>
              <Image resizeMode='stretch' style={styles.img} source={require('./images/icCoinImam.png')} />
              <Text style={styles.price}>{this.state.coinImam}</Text>
            </View>
            <View style={styles.square}>
              <Image resizeMode='stretch' style={styles.img} source={require('./images/icCoin.png')} />
              <Text style={styles.price}>{this.state.coin}</Text>
            </View>
          </View>

          <View style={styles.UserInfoBox}>
            <TextInput placeholder="Enter Your Name"
              onChangeText={(value) => AsyncStorage.setItem('name', value)} defaultValue={this.state.name} />
            <TouchableOpacity onPress={this.openImage}>
              {this.state.image ? <Image resizeMode='stretch' style={styles.userImage} source={{ uri: this.state.image }} /> : <Image resizeMode='stretch' style={styles.userImage} source={require('./images/icUser.png')} />}
            </TouchableOpacity>
          </View>
          <View style={styles.DailyNotes}>
            <TextInput placeholder="Daily Notes..." multiline={true}
              onChangeText={(value) => AsyncStorage.setItem('text', value)} defaultValue={this.state.text} />
          </View>

          <CalendarPicker></CalendarPicker>
        </KeyboardAvoidingView>
      </ScrollView >
    );
  }
}

export default App;

const styles = StyleSheet.create
  ({
    img:
    {
      height: 140,
      width: 140,
      borderRadius: 20,
      margin: 5
    },
    border:
    {
      flexDirection: 'row'
    },
    price:
    {
      textAlign: 'center'
    },
    square:
    {
      height: 180,
      width: "45%",
      borderWidth: 2,
      borderColor: 'blue',
      alignItems: 'center',
      margin: 10,
      borderRadius: 10
    },
    // main: 
    // {
    //   flex: 1,
    //   borderWidth: 2,
    //   borderColor: 'blue',
    //   height: 700,
    //   margin: 10,
    //   alignItems: 'center',
    //   borderRadius: 10
    // },
    vertical:
    {
      flexDirection: 'row',
      borderWidth: 2,
      borderRadius: 10,
      margin: 10,
      width: 370,
      borderColor: 'blue'
    },
    secondText:
    {
      textAlignVertical: 'center',
      marginLeft: 50
    },
    container:
    {
      flex: 1,
    },
    userImage:
    {
      height: "95%",
      width: "50%",
      marginLeft: "60%",
      marginTop: "1%"

    },
    UserInfoBox: {
      flexDirection: "row",
      width: "95%",
      height: 150,
      borderWidth: 2,
      borderRadius: 10,
      borderColor: "blue",
      margin: 10
    },
    DailyNotes: {
      width: "95%",
      height: 150,
      borderWidth: 2,
      borderRadius: 10,
      borderColor: "blue",
      margin: 10
    }
  });