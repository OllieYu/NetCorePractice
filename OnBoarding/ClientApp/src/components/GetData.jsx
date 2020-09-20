import $ from 'jquery'
import React from 'react'

export default function getData(mydata) {
    var mydata1 = mydata
    $.ajax({
      type:'GET',
      url: 'Customers/GetCustomer',
      success: function(data) {
        this.setState({mydata1: data})
      }.bind(this),
      error: function(err) {
        console.error(err.toString())
      }
    })
}