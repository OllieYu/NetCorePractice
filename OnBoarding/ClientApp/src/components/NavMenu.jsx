import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Segment } from 'semantic-ui-react'

export class NavMenu extends Component {
  
  state = { activeItem: window.location.pathname.substr(1) || 'Customers' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render () {
    const { activeItem } = this.state
    return (
      <Segment style={{borderRadius: '0'}} inverted>
        <Menu inverted pointing secondary>
          <Menu.Item>
            <img src="/reactIcon.png" alt=""/>
          </Menu.Item>
          
          <Menu.Item
            as={Link}
            to = "/Customers"
            name='Customers'
            active={activeItem === 'Customers'}
            onClick={this.handleItemClick}
          />

          <Menu.Item
            as={Link}
            to = "/Products"
            name='Products'
            active={activeItem === 'Products'}
            onClick={this.handleItemClick}
          />

          <Menu.Item
            as={Link}
            to = "/Stores"
            name='Stores'
            active={activeItem === 'Stores'}
            onClick={this.handleItemClick}
          />

          <Menu.Item
            as={Link}
            to = "/Sales"
            name='Sales'
            active={activeItem === 'Sales'}
            onClick={this.handleItemClick}
          />
          
        </Menu>
      </Segment>
    );
  }
}
