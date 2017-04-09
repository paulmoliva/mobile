/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Picker,
  ListView,
  Image
} from 'react-native';

export default class coolthing extends Component {
    constructor(props){
        super(props);
        this.state = {
            sales: {},
            loading: true
        }
    }

    componentDidMount(){
        const getCurrentUser = () => {
            return fetch('http://127.0.0.1:5000/api/historical_sales')
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        sales: responseJson,
                        loading: false
                    });
                    this.setState({
                        employee: Object.keys(this.state.sales)[0],
                    })
                })
                .catch((error) => {
                    console.error(error);
                });
        };
        getCurrentUser();
  }


  render() {
        if (this.state.loading){
            return (
                <View style={styles.container}>
                    <Text>Loading Employee Performance</Text>
                    <Image source={require('./img/ajax-loader.gif')} />
                </View>
            )
        } else {
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            return (
                <View style={{flex: 1, paddingTop: 22, flexDirection:'column', justifyContent:'center'}}>
                    <Picker
                        selectedValue={this.state.employee}
                        onValueChange={(val) => this.setState({employee: val})}>
                        {Object.keys(this.state.sales).map((el, i) => {
                            return (
                                <Picker.Item label={this.state.sales[el]['employees.full_name_2']} value={this.state.sales[el]['employees.full_name_2']} />
                            )
                        })}
                    </Picker>
                    {this.state.sales[this.state.employee] ? (<ListView
                        dataSource={ds.cloneWithRows(Object.keys(this.state.sales[this.state.employee]))}
                        renderRow={(rowData) => (
                            <View style={{flex: 1, flexDirection: 'column', justifyContent:'flex-start'}}>
                                <Text>{rowData.split('.')[1]}</Text>
                                <Text>{this.state.sales[this.state.employee][rowData]}</Text>
                                <Text> </Text>
                            </View>
                        )}
                    />) : <Text>Choose an employee to view performance</Text>}
                </View>
            );
        }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('coolthing', () => coolthing);
