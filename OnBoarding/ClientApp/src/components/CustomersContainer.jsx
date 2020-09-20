import React from 'react'
// import axios from "axios"
import $ from 'jquery'
import _ from 'lodash'
import { Dropdown, Pagination, Form, Modal, Button, Icon, Table } from 'semantic-ui-react'

export class CustomersContainer extends React.Component {
  constructor() {
    super()
    this.state = {
      data: [],
      deleteModalOpen: false,
      newModalOpen: false,
      editModalOpen: false,
      //record id for delete modal 
      recordId: 0,
      //create record
      newName: '',
      newAddress: '',
      //edit record
      editName: '',
      editAddress: '',
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
    this.handleSort = this.handleSort.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.handleDropdownChange = this.handleDropdownChange.bind(this)
  }

  //get data from local database
  // getData = () =>{
  //   axios.get('Customers/GetCustomer')
  //         .then(response => {
  //           this.setState({
  //             data: response.data
  //           })
  //         })
  //         .catch((error) => {
  //             console.log(error);
  //         });
  // }
  getData() {
    $.ajax({
      type: 'GET',
      url: 'Customers/GetCustomer',
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
  // handleCreateClick = () => {
  //   axios.post('Customers/PostCustomer', {
  //     name: this.state.newName,
  //     address: this.state.newAddress
  //   })
  //   .then((response) => {
  //     this.getData()
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }
  handleCreateClick = () => {
    $.ajax({
      type: 'POST',
      url: 'Customers/PostCustomer',
      contentType: "application/json",
      data: JSON.stringify({
        name: this.state.newName,
        address: this.state.newAddress
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
  // handleUpdateClick = (id) => {
  //   axios.put(`Customers/PutCustomer/${id}`, {
  //     id: id,
  //     name: this.state.editName,
  //     address: this.state.editAddress
  //   })
  //   .then((response) => {
  //     this.getData()
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }
  handleUpdateClick = (id) => {
    $.ajax({
      type: 'PUT',
      url: `Customers/PutCustomer/${id}`,
      contentType: "application/json",
      data: JSON.stringify({
        id: id,
        name: this.state.editName,
        address: this.state.editAddress
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
  // handleDeleteClick = (id) => {
  //   axios.delete(`Customers/DeleteCustomer/${id}`)
  //   .then((response) => {
  //     this.getData()
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }
  handleDeleteClick = (id) => {
    $.ajax({
      type: 'DELETE',
      url: `Customers/DeleteCustomer/${id}`,
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

  handlePageClick = (e, {activePage}) => {
    this.setState({
      activePage
    },() => {
      this.getData()
    })
  }
  
  handleDropdownChange = (e, data) => {
    this.setState({
      perPage: data.value
    },() => {
      this.getData()
    })
  }


  //close modal
  newModalClose = () => this.setState({ newModalOpen: false, newName: '', newAddress: '' })
  editModalClose = () => this.setState({ editModalOpen: false, recordId: '', editAddress: '', editName: '' })
  deleteModalClose = () => this.setState({ deleteModalOpen: false, recordId: '' })

  render() {
    const { column, data, direction, deleteModalOpen, editModalOpen, newModalOpen, activePage} = this.state
    return (
      <div>
        <Button color='blue' onClick={() => this.setState({ newModalOpen: true })}>New Customer</Button>
        <br />
        <br />
        <Table sortable celled fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'name' ? direction : null}
                onClick={this.handleSort('name')}
              >
                Name
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'address' ? direction : null}
                onClick={this.handleSort('address')}
              >
                Address
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
            {_.map(data, ({ id, address, name }) => (
              <Table.Row key={id}>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{address}</Table.Cell>
                <Table.Cell><Button color='yellow' onClick={() => this.setState({ editModalOpen: true, recordId: id, editName: name, editAddress: address })}><Icon name='edit' />EDIT</Button></Table.Cell>
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
              <Form.Input
                value={this.state.editName}
                onChange={(e) => this.setState({ editName: e.target.value })}
                label='NAME'
              />
              <Form.Input
                value={this.state.editAddress}
                onChange={(e) => this.setState({ editAddress: e.target.value })}
                label='ADDRESS'
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.editModalClose}>
              cancel
            </Button>
            <Button
              disabled={!this.state.editAddress || !this.state.editName}
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
        <Modal style={{ height: 'auto', top: 'auto', left: 'auto', bottom: 'auto', right: 'auto' }} size='tiny' dimmer='blurring' open={newModalOpen} onClose={this.newModalClose}>
          <Modal.Header>Create customer</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input label='NAME' onChange={(e) => this.setState({ newName: e.target.value })} />
              <Form.Input label='ADDRESS' onChange={(e) => this.setState({ newAddress: e.target.value })} />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.newModalClose}>
              cancel
            </Button>
            <Button
              disabled={!this.state.newName || !this.state.newAddress}
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




