import React from 'react'
// import axios from "axios"
import $ from 'jquery'
import _ from 'lodash'
import { Dropdown, Pagination, Form, Modal, Button, Icon, Table } from 'semantic-ui-react'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import format from 'date-fns/format'

export class SalesContainer extends React.Component {
  constructor() {
    super()
    this.state = {
      //sales data from database
      data: [],
      //customer,product,store data form database
      customerData:[],
      productData:[],
      storeData:[],
      //selected value id
      selectCustomer:null,
      selectProduct:null,
      selectStore:null,
      selectDate:null,
      //edit record
      editCustomer:null,
      editProduct:null,
      editStore:null,
      editDate:null,
      //flag for modal
      deleteModalOpen: false,
      newModalOpen: false,
      editModalOpen: false,
      //record id for delete modal 
      recordId: 0,
      //pagination
      perPage:5,
      activePage:1,
      pageCount:1,
      perPageOptions:[
        { text: 5, value: 5 },
        { text: 10, value: 10 },
        { text: 15, value: 15 },
      ]
    }
    this.getData()
    this.getCustomerData()
    this.getProductData()
    this.getStoreData()
    this.handleSort = this.handleSort.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.handleDropdownChange = this.handleDropdownChange.bind(this)
  }

  //get customer,product,store data for sales table
  getCustomerData() {
    $.ajax({
      type: 'GET',
      url: 'Customers/GetCustomer',
      success: function (response) {
        const customerData = response.map((item) => {
            const container = {}
            container.text = item.name
            container.value = item.id
            return container
          })
        this.setState({ 
          customerData: customerData
        })
      }.bind(this),
      error: function (err) {
        console.error(err.toString())
      }
    });
  }

  getProductData() {
    $.ajax({
      type: 'GET',
      url: 'Products/GetProduct',
      success: function (response) {
        const productData = response.map((item) => {
            const container = {}
            container.text = item.name
            container.value = item.id
            return container
          })
        this.setState({ 
          productData: productData
        })
      }.bind(this),
      error: function (err) {
        console.error(err.toString())
      }
    });
  }

  getStoreData() {
    $.ajax({
      type: 'GET',
      url: 'Stores/GetStore',
      success: function (response) {
        const storeData = response.map((item) => {
            const container = {}
            container.text = item.name
            container.value = item.id
            return container
          })
        this.setState({ 
          storeData: storeData
        })
      }.bind(this),
      error: function (err) {
        console.error(err.toString())
      }
    });
  }

  //get data from local database and slice it for pagination
  getData() {
    $.ajax({
      type: 'GET',
      url: 'Sales/GetSales',
      success: function (response) {
        let data = [...response]
        let slice = data.slice((this.state.activePage - 1) * this.state.perPage, this.state.activePage * this.state.perPage)
        this.setState({ 
          data: slice,
          pageCount: Math.ceil(data.length/this.state.perPage),
        })
      }.bind(this),
      error: function (err) {
        console.error(err.toString())
      }
    });
  }

  //add new record
  handleCreateClick = () => {
    $.ajax({
      type: 'POST',
      url: 'Sales/PostSales',
      contentType: "application/json",
      data: JSON.stringify({
        productId: this.state.selectProduct,
        customerId: this.state.selectCustomer,
        storeId: this.state.selectStore,
        dateSold:this.state.selectDate
      }),
      success: function (data) {
        this.getData()
      }.bind(this),
      error: function (err) {
        console.error(err.toString())
      }
    });
  }

  //update record
  handleUpdateClick = (id) => {
    $.ajax({
      type: 'PUT',
      url: `Sales/PutSales/${id}`,
      contentType: "application/json",
      data: JSON.stringify({
        id: id,
        productId: this.state.selectProduct,
        customerId: this.state.selectCustomer,
        storeId: this.state.selectStore,
        dateSold: this.state.selectDate
      }),
      success: function (data) {
        this.getData()
      }.bind(this),
      error: function (err) {
        console.error(err.toString())
      }
    });
  }

  //delete record
  handleDeleteClick = (id) => {
    $.ajax({
      type: 'DELETE',
      url: `Sales/DeleteSales/${id}`,
      success: function (data) {
        this.getData()
      }.bind(this),
      error: function (err) {
        console.error(err.toString())
      }
    });
  }


  //table sorf function
  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state
    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      })
      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    })
  }

  //handle pagination function
  handlePageClick = (e, {activePage}) => {
    this.setState({
      activePage
    },() => {
      this.getData()
    })
  }
  
  //handle records per page function
  handleDropdownChange = (e, data) => {
    this.setState({
      perPage: data.value
    },() => {
      this.getData()
    })
  }

  //set data for create sales
  handleNewCustomer = (e, data) => {
    this.setState({
      selectCustomer: data.value
    })
  }

  handleNewProduct = (e, data) => {
    this.setState({
      selectProduct: data.value
    })
  }

  handleNewStore = (e, data) => {
    this.setState({
      selectStore: data.value
    })
  }

  handleNewDate = (e, data) => {
    if (data.value != null){
      let res = format(data.value,'MM/dd/yyyy')
      this.setState({
          selectDate: res
        })
    }
    else{
      this.setState({
        selectDate: data.value
      })
    } 
    
  }

  //close modal
  newModalClose = () => this.setState({ newModalOpen: false, selectCustomer: null, selectProduct: null, selectDate: null, selectStore: null})
  editModalClose = () => this.setState({ editModalOpen: false, recordId: '', editCustomer:null, editProduct:null, editAddress:null, editDate:null , selectCustomer: null, selectProduct: null, selectDate: null, selectStore: null})
  deleteModalClose = () => this.setState({ deleteModalOpen: false, recordId: '' })

  render() {
    const { column, data, direction, deleteModalOpen, editModalOpen, newModalOpen, activePage} = this.state
    let editdate = new Intl.DateTimeFormat('en-US',{year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(this.state.editDate))
    let selectdata = new Intl.DateTimeFormat('en-US',{year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(this.state.selectDate))
    return (
      <div>
        <Button color='blue' onClick={() => this.setState({ newModalOpen: true })}>New Sale</Button>
        <br />
        <br />
        {/* record table */}
        <Table sortable celled fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'customer' ? direction : null}
                onClick={this.handleSort('customer')}
              >
                Customer
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'product' ? direction : null}
                onClick={this.handleSort('product')}
              >
                Product
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'store' ? direction : null}
                onClick={this.handleSort('store')}
              >
                Store
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'datasold' ? direction : null}
                onClick={this.handleSort('datasold')}
              >
                Data Sold
              </Table.HeaderCell>
              <Table.HeaderCell>
                Action
              </Table.HeaderCell>
              <Table.HeaderCell>
                Action
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(data, ({ id, customer, product, store, dateSold, storeId, customerId, productId }) => (
              <Table.Row key={id}>
                <Table.Cell>{customer["name"]}</Table.Cell>
                <Table.Cell>{product["name"]}</Table.Cell>
                <Table.Cell>{store["name"]}</Table.Cell>
                <Table.Cell>{Intl.DateTimeFormat("en-US",{year: "numeric", month: "long", day: "2-digit" }).format(new Date(dateSold))}</Table.Cell>
                <Table.Cell><Button color='yellow' onClick={() => this.setState({ editModalOpen: true, recordId: id, editCustomer: customerId, selectCustomer: customerId, editProduct: productId, selectProduct: productId, editStore: storeId, selectStore: storeId, editDate:dateSold, selectDate:dateSold })}><Icon name='edit' />EDIT</Button></Table.Cell>
                <Table.Cell><Button color='red' onClick={() => {
                  this.setState({ deleteModalOpen: true, recordId: id })
                }
                }><Icon name='trash' />DELETE</Button></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        {/* delete model */}
        <Modal style={{ height: 'auto', top: 'auto', left: 'auto', bottom: 'auto', right: 'auto' }} size='tiny' dimmer='blurring' open={deleteModalOpen} onClose={this.deleteModalClose}>
          <Modal.Header>Delete customer</Modal.Header>
          <Modal.Content>
            <strong>Are you sure?</strong>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.deleteModalClose}>
              cancel
            </Button>
            <Button
              negative
              icon='remove'
              labelPosition='right'
              content="delete"
              onClick={() => {
                this.handleDeleteClick(this.state.recordId)
                this.deleteModalClose()
              }
              }
            />
          </Modal.Actions>
        </Modal>
        {/* edit modal */}
        <Modal style={{ height: 'auto', top: 'auto', left: 'auto', bottom: 'auto', right: 'auto' }} size='tiny' dimmer='blurring' open={editModalOpen} onClose={this.editModalClose}>
          <Modal.Header>Edit customer</Modal.Header>
          <Modal.Content>
            <Form>
              <SemanticDatepicker
                format='YYYY-MM-DD'
                label='Data sold'
                onChange={this.handleNewDate}
                value={new Date(this.state.selectDate)}        
              />
              <Form.Dropdown
                fluid
                selection
                options={this.state.customerData}
                label='Customer'
                onChange={this.handleNewCustomer}
                defaultValue={this.state.selectCustomer}
                
              />
              <Form.Dropdown
                fluid
                selection
                options={this.state.productData}
                label='Product'
                onChange={this.handleNewProduct}
                defaultValue={this.state.selectProduct}
              />
              <Form.Dropdown
                fluid
                selection
                options={this.state.storeData}
                label='Store'
                onChange={this.handleNewStore}
                defaultValue={this.state.selectStore}
              />  
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.editModalClose}>
              cancel
            </Button>
            <Button 
              disabled={this.state.editCustomer === this.state.selectCustomer
                        && this.state.editProduct === this.state.selectProduct 
                        && this.state.editStore === this.state.selectStore
                        && editdate === selectdata}
              positive
              icon='checkmark'
              labelPosition='right'
              content="edit"
              onClick={() => {
                this.handleUpdateClick(this.state.recordId)
                this.editModalClose()
              }}
            />
          </Modal.Actions>
        </Modal>
        {/* create modal */}
        <Modal style={{ height: 'auto', top: 'auto', left: 'auto', bottom: 'auto', right: 'auto', overflow: 'visible'}} size='tiny' dimmer='blurring' open={newModalOpen} onClose={this.newModalClose} >
          <Modal.Header>Create sales</Modal.Header>
          <Modal.Content>
            <Form>
              <SemanticDatepicker
                format='YYYY-MM-DD'
                label='Data sold'
                onChange={this.handleNewDate}        
              />
              <Form.Dropdown
                fluid
                selection
                options={this.state.customerData}
                label='Customer'
                onChange={this.handleNewCustomer}
              />
              <Form.Dropdown
                fluid
                selection
                options={this.state.productData}
                label='Product'
                onChange={this.handleNewProduct}
              />
              <Form.Dropdown
                fluid
                selection
                options={this.state.storeData}
                label='Store'
                onChange={this.handleNewStore}
              />  
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.newModalClose}>
              cancel
            </Button>
            <Button
              disabled={!this.state.selectCustomer || !this.state.selectProduct || !this.state.selectStore || !this.state.selectDate}
              positive
              icon='checkmark'
              labelPosition='right'
              content="create"
              onClick={() => {
                this.handleCreateClick()
                this.newModalClose()
                }
              }
            />
          </Modal.Actions>
        </Modal>

        <Dropdown
          compact
          selection
          options={this.state.perPageOptions}
          defaultValue={5}
          onChange={this.handleDropdownChange}
        />

        <Pagination
          style={{float: 'right'}}
          boundaryRange={0}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          siblingRange={1}
          totalPages={this.state.pageCount}
          onPageChange={this.handlePageClick}
          activePage={activePage}
        />
        <br/>  
        <br/>
      </div>

    )
  }
}




