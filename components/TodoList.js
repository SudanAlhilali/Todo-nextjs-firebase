import React, { useEffect, useState } from 'react'
import {collection, onSnapshot, orderBy, query, where} from 'firebase/firestore'
import {db} from '../config/firebaseConfig'
import { Todo } from './Todo';
import { userAuth } from '../config/Auth';


export const TodoList = ({todosProps}) => {
    const [todos, setTodos] = useState([]);
    const {currentUser} = userAuth();
    useEffect(() => {
       setTodos(JSON.parse(todosProps))
    }, [])
    

    useEffect(() => {
      // collRef for graping the db called "todos"
      const collectionRef = collection(db,"todos")
      // query of how I want to order the docs
      const q = query(collectionRef,where("email", "==", currentUser?.email) ,orderBy("timestamp", "desc"));

      const unsub = onSnapshot(q, (querySnapshot) => {
        setTodos(querySnapshot.docs.map(doc => ({...doc.data(),
          id: doc.id, timestamp: doc.data().timestamp?.toDate().getTime()})))
      })

    }, [])
    

  return <>
  {todos.map(todo => <Todo key={todo.id}
    id={todo.id}
    title={todo.title}
    detail={todo.detail}
    timestamp={todo.timestamp}
  />)}

  {/* {todos.map(
    todo => <div key={todo.id}>{todo.title}</div>
  )} */}
  </>
}

