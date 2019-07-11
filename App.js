import React, { Component } from 'react';
import { AsyncStorage, ScrollView, TextInput, StyleSheet, Text, View, Image, KeyboardAvoidingView, TouchableOpacity, FlatList } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
const cio = require('react-native-cheerio');
import imagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';
import Button from 'react-native-button';


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
      name: '',
      image: null,
      list: [],
      data: [],
      prices: {},
      showModal: false
    };
    this.getPrices().then(() => {
      AsyncStorage.getItem('name').then(value => {
        this.setState({ name: value });
        AsyncStorage.getItem('list').then(value => {
          value && this.setState({ list: JSON.parse(value) });
          this.saveData();
        });
      });

    });


    AsyncStorage.getItem('text').then(value => this.setState({ text: value }));
    AsyncStorage.getItem('image').then(value => this.setState({ image: value }));

  }

  saveData = () => {
    let strs =
      ["dollor",
        "euro",
        "coinImam",
        "coin",];
    let counts = {
      dollor: this.state.list.filter(x => x.id == "dollor").length,
      euro: this.state.list.filter(x => x.id == "euro").length,
      coinImam: this.state.list.filter(x => x.id == "coinImam").length,
      coin: this.state.list.filter(x => x.id == "coin").length
    }
    //alert(counts.dollor + " " + counts.euro + " " + counts.coinImam + counts.coin);
    if (this.state.list == null)
      this.state.list = [];
    for (let i = 0; i < 4; i++) {
      if (counts[strs[i]] == 5)
        this.state.list.shift();
      let data = {
        id: strs[i],
        price: this.state.prices[strs[i]],
        name: this.state.name,
        date: new Date().toLocaleString()
      };
      this.state.list.push(data);
    }

    AsyncStorage.setItem('list', JSON.stringify(this.state.list));
  }


  showData = (id) => {
    let data = [];
    for (let i = 0; i < this.state.list.length; i++) {
      if (this.state.list[i].id === id)
        data.push(this.state.list[i]);
    }
    this.setState({ showModal: true, data: data });
    // for (let i = 0; i < data.length; i++) {
    //   alert(data[i].id + " , " + data[i].price + " , " + data[i].name + " , " + data[i].date);
    // }
  }

  async getPrices() {
    fetch('http://www.tgju.org/').then(response => response.text().then(html => {
      const $ = cio.load(html);
      var dollor = $("li#l-price_dollar_rl span.info-price").text() + " Rials";
      var euro = $("li#l-price_eur span.info-price").text() + " Rials";
      var coin = $("tr[data-market-row=\"sekeb\"]").attr("data-price") + " Rials";
      var coinImam = $("li#l-sekee span.info-price").text() + " Rials";
      let prices = {
        dollor: dollor,
        euro: euro,
        coinImam: coinImam,
        coin: coin
      };
      this.setState({ prices: prices });
    })).catch((error) => alert(error));
  };

  openImage = () => {
    console.log(this.state.image)
    imagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ image: response.uri });
        AsyncStorage.setItem('image', response.uri);
      }
    });
  }

  deleteImage = () => {
    this.setState({ image: null });
    AsyncStorage.setItem('image', '');
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  }

  render() {
    return (

      <ScrollView style={styles.container}>
        <KeyboardAvoidingView>
          <Modal
            isVisible={this.state.showModal}
          >
            <View style={{ margin: '10%', width: 300, height: 450, backgroundColor: "white", alignContent: 'center', alignItems: 'center' }}>
              <Text>Last 5 entrance{'\n\n'}</Text>
              <FlatList style={{ width: '80%', height: '90%', alignContent: 'center' }} data={this.state.data}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) =>
                  <View style={{
                    borderBottomColor: 'grey',
                    borderBottomWidth: 1,
                    alignItems: 'center'
                  }}>
                    <Text>{item.name}</Text>
                    <Text>{item.date}</Text>
                    <Text>{item.price}</Text>

                  </View>
                }
              />
              <Button onPress={this.toggleModal}>Close</Button>
            </View>
          </Modal>

          <View style={styles.border}>
            <TouchableOpacity style={styles.square} onPress={() => this.showData("dollor")}>
              <Image resizeMode='stretch' style={styles.img} source={require('./images/icDollar.png')} />
              <Text style={styles.price}>{this.state.prices.dollor}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.square} onPress={() => this.showData("euro")}>
              <Image resizeMode='stretch' style={styles.img} source={require('./images/icEuro.png')} />
              <Text style={styles.price}>{this.state.prices.euro}</Text>
            </TouchableOpacity>
          </View>


          <View style={styles.border} >
            <TouchableOpacity style={styles.square} onPress={() => this.showData("coinImam")}>
              <Image resizeMode='stretch' style={styles.img} source={require('./images/icCoinImam.png')} />
              <Text style={styles.price}>{this.state.prices.coinImam}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.square} onPress={() => this.showData("coin")}>
              <Image resizeMode='stretch' style={styles.img} source={require('./images/icCoin.png')} />
              <Text style={styles.price}>{this.state.prices.coin}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.UserInfoBox}>
            <TextInput placeholder="Enter Your Name"
              onChangeText={(value) => AsyncStorage.setItem('name', value)} defaultValue={this.state.name} />
            <TouchableOpacity onPress={this.openImage} onLongPress={this.deleteImage}>
              {this.state.image ? <Image resizeMode='stretch' style={styles.userImage} source={{ uri: this.state.image }} /> : <Image resizeMode='stretch' style={styles.userImage} source={require('./images/icUser.png')} />}
            </TouchableOpacity>
          </View>
          <View style={styles.DailyNotes}>
            <TextInput placeholder="Daily Notes..." multiline={true}
              onChangeText={(value) => AsyncStorage.setItem('text', value)} defaultValue={this.state.text} />
          </View>

          <CalendarPicker ></CalendarPicker>
        </KeyboardAvoidingView>

        <Button onPress={() => {
          AsyncStorage.clear();
          alert("async cleard")
        }} style={{ fontSize: 30, color: 'rgb(242, 240, 240)', backgroundColor: "rgb(245, 59, 59)", }}>
          Clear AsyncStorage</Button>

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
      height: "100%",
      width: "100%",
      marginLeft: "47.8%",
      borderRadius: 10,

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