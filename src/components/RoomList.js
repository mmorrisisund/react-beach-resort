import React from 'react'

import Room from './Room'

export default function RoomList ({ rooms }) {
  if (rooms.length === 0) {
    return (
      <div className='empty-search'>
        unfortunately no rooms matched your search parameters
      </div>
    )
  }

  return (
    <section className='roomslist'>
      <div className='roomslist-center'>
        {rooms.map(room => (
          <Room key={room.id} room={room} />
        ))}
      </div>
    </section>
  )
}
