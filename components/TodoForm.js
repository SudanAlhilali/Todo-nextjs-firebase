import { Button, TextField } from '@mui/material'
import { addDoc, collection, serverTimestamp,updateDoc,doc } from 'firebase/firestore'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { userAuth } from '../config/Auth'
import { db } from '../config/firebaseConfig' 
import  TodoContext  from '../pages/TodoContext'

export const TodoForm = ({todosProps}) => {
    const inputAreaRef = useRef(null);
    const {currentUser} = userAuth();
    const {showAlert, todo, setTodo} = useContext(TodoContext)

    const onSubmit = async() =>{
        if(todo?.hasOwnProperty('timestamp')){
            //update the todo
            const docRef = doc(db,"todos",todo.id);
            const todoUpdated = {...todo, timestamp: serverTimestamp()}
            updateDoc(docRef,todoUpdated);
            setTodo({title: '', detail: ''});
            showAlert('info', `Todo with id ${todo.id} updated successfully`)
        }else{
            const collectionRef = collection(db,"todos");
            const docRef = await addDoc(collectionRef,{...todo,email:currentUser.email,timestamp:serverTimestamp()})
            setTodo({title: '', detail: ''})
            showAlert('success',`Todo with id ${docRef.id} is added successfully`)
        }
   }
     useEffect(() => {
        const checkIfClickedOutside = (e) => {
          if(!inputAreaRef.current.contains(e.target)){
              console.log("OutSide input area")
              setTodo({title: '', detail: ''})
          }else{
              console.log("inside input area");
          }
        }
        document.addEventListener('mousedown', checkIfClickedOutside)
        return () => {
          document.removeEventListener('mousedown', checkIfClickedOutside)
        }
      }, [])
  return <>
    <div ref={inputAreaRef}>
    <TextField fullWidth label="title" margin="normal"
        value={todo.title}
        onChange={e=>setTodo({...todo,title:e.target.value})}
    />
    <TextField fullWidth label="detail"  multiline maxRows={4} 
        value={todo.detail}
        onChange={e=>setTodo({...todo,detail:e.target.value})}
    />
    <Button variant="contained" sx={{mt:3}} margin onClick={onSubmit}>
        {todo.hasOwnProperty('timestamp')? 'Updated todo': 'Add new todo'}</Button>
    </div>
  </>
}
