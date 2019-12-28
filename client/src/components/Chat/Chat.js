import React,{ useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

let socket;

import './Chat.css';

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';

    useEffect(()=>{
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT);
        setRoom(room);
        setName(name);

        socket.emit('join', { name, room },()=>{
            
        });

        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }, [ENDPOINT, location.search]);

    //add the admin message to the messages
    useEffect(() => {
        socket.on('message',(message)=>{
            setMessages([...messages,message]);
        });
    },[messages]);

    //emit the user type messages
   const sendMessage = (event) => {
       event.preventDefault();

       if (message){
           socket.emit('sendMessage',message, ()=> setMessage(''));
       }
   }
console.log(message, messages);

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar></InfoBar>
                <input value={message} 
                    onChange={(event)=> setMessage(event.target.value)} 
                    onKeyPress={event => event.key=== 'Enter' ? sendMessage(event) : null}></input>
            </div>
        </div>
    )
}

export default Chat;