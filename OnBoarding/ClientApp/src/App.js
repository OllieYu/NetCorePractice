import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { CustomersContainer } from './components/CustomersContainer';
import ProductsContainer from './components/ProductsContainer';
import { SalesContainer } from './components/SalesContainer';
import  StoresContainer  from './components/StoresContainer';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={CustomersContainer} />
        <Route path='/Customers' component={CustomersContainer} />
        <Route path='/Products' component={ProductsContainer} />
        <Route path='/Sales' component={SalesContainer} />
        <Route path='/Stores' component={StoresContainer} />
      </Layout>
    );
  }
}
