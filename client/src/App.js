import React, { useState } from 'react';
import './App.css';

function App() {
  
  const [list, setList] = useState([])
  const [term, setTerm] = useState("")
  const [number, setNumber] = useState("")

  function handleChange(e) {
    e.preventDefault()
    setTerm(e.target.value)
  }

  function handleDelete(item) {
    setList(list => list.filter(i => i !== item))
  }

  function handleSubmit() {
    setList([...list, term])
    setTerm("")
  }

  function handleNumber(e) {
    setNumber(e.target.value)
  }

  function handleSend() {
    let messageText = "Here are your to-do's for today:\n"
    list.forEach((item, idx) => {
      messageText = messageText.concat(`${idx + 1}: ${item}\n`)
    })
    const messageToSend = { message: messageText, to: `${number}` }
    fetch('/api/messages', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageToSend)
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
  }

  function printList() {
    const toDoList = list.map((item, idx) => {
      return (
        <div className="todo-item">
          <li key={idx}>
          {item}
          </li>
          <button className="delete-button" onClick={() => handleDelete(item)}>Delete item</button>
        </div>
      )
    })

    return (
      <div>
        <ul>{toDoList}</ul>
        <p>Enter your number to get the list sent to your phone via SMS (please include "+" and country code, no lines or spaces, e.g.: <b>+16665554321</b>)</p>
        <input onChange={handleNumber} type="tel" placeholder="Number" value={number} required></input>
        <button className="send-button" onClick={handleSend}>Send!</button>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>Todo <span className="material-icons md-48">done</span> <span className="with">with</span> <span className="material-icons md-48">arrow_right_alt</span> <span className="twilio">Twilio</span> <span className="material-icons md-48">perm_phone_msg</span></h1>
      <div className="input-row">
        <input onChange={handleChange} placeholder="Enter a todo" value={term}></input>
        <button className="add" onClick={handleSubmit}>Add</button>
      </div>
      <div className="list">
      {
        list.length 
        ?
        printList()
        : 
        <div className="no-items">
          <p>Either you're all caught up or you should add some items!</p>
        </div>
      }
      </div>
    </div>
  );
}

export default App;
