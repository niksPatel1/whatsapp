import React, { useState } from 'react'
import Chatmessage from './Chat_message'
import axios from '../axios';
import { useEffect } from 'react';
import Pusher from 'pusher-js';

function Chat_body(user) {

  //!
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("/messages/sync")
      .then((response) => {
        setMessages(response.data)
      });
  }, [])
  // console.log(messages);


  useEffect(() => {
    //! -------------pusher------------------
    var pusher = new Pusher('68be50924cd2fba8a00f', {
      cluster: 'ap2'
    });

    var channel = pusher.subscribe('message');


    channel.bind('inserted', function (data) {
      setMessages([...messages, data])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };

    //! -------------pusher------------------
  }, [messages])
  //!

  return (
    <div className='Chat_body'>
      {
        messages.map((message)=>{
          return (
            <Chatmessage 
              reciever={message.recieved}
              key={message._id}
              _id= {message._id}
              name={message.name}
              message={message.message}
              date={message.timestamp}
              user={user}
            />
          )
        })
      }
    </div>
  )
}

export default Chat_body