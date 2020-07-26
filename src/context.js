import React, { Component } from 'react'
import items from './data'
import Client from './contentful'

const RoomContext = React.createContext()

class RoomProvider extends Component {
  state = {
    rooms: [],
    sortedRooms: [],
    featuredRooms: [],
    loading: true,
    type: 'all',
    capacity: 1,
    price: 0,
    minPrice: 0,
    maxPrice: 0,
    minSize: 0,
    maxSize: 0,
    breakfast: false,
    pets: false
  }

  getData = async () => {
    try {
      const response = await Client.getEntries({
        content_type: 'beachResortRoom'
      })
      const rooms = this.formatData(response.items)
      const featuredRooms = rooms.filter(room => room.featured)
      const maxPrice = Math.max(...rooms.map(room => room.price))
      const maxSize = Math.max(...rooms.map(room => room.size))

      this.setState({
        rooms,
        sortedRooms: rooms,
        featuredRooms,
        loading: false,
        price: maxPrice,
        maxPrice,
        maxSize
      })
    } catch (error) {
      console.log(error)
    }
  }

  componentDidMount () {
    this.getData()
  }

  formatData (items) {
    return items.map(item => {
      const { id } = item.sys
      const images = item.fields.images.map(image => image.fields.file.url)

      return { ...item.fields, id, images }
    })
  }

  getRoom = slug => this.state.rooms.find(room => room.slug === slug)

  handleChange = ({ target }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value
    this.setState({ [target.name]: value }, this.filterRooms)
  }

  filterRooms = () => {
    let {
      rooms,
      type,
      capacity,
      price,
      minSize,
      maxSize,
      breakfast,
      pets
    } = this.state

    let tempRooms = [...rooms]

    if (type !== 'all') {
      tempRooms = tempRooms.filter(room => room.type === type)
    }

    if (capacity !== 1) {
      tempRooms = tempRooms.filter(room => room.capacity >= capacity)
    }

    tempRooms = tempRooms.filter(room => room.price <= price)

    tempRooms = tempRooms.filter(
      room => room.size >= minSize && room.size <= maxSize
    )

    if (breakfast) {
      tempRooms = tempRooms.filter(room => room.breakfast)
    }

    if (pets) {
      tempRooms = tempRooms.filter(room => room.pets)
    }

    this.setState({ sortedRooms: tempRooms })
  }

  render () {
    return (
      <RoomContext.Provider
        value={{
          ...this.state,
          getRoom: this.getRoom,
          handleChange: this.handleChange
        }}
      >
        {this.props.children}
      </RoomContext.Provider>
    )
  }
}

const RoomConsumer = RoomContext.Consumer

export function withRoomConsumer (Component) {
  return function ConsumerWrapper (props) {
    return (
      <RoomConsumer>
        {value => <Component {...props} context={value} />}
      </RoomConsumer>
    )
  }
}

export { RoomProvider, RoomConsumer, RoomContext }
