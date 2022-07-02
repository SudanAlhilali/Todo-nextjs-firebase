import { Container } from "@mui/system";
import { TodoList } from "../components/TodoList";
import { TodoForm } from "../components/TodoForm";
import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import TodoContext from "./TodoContext";
import { userAuth } from "../config/Auth";
import { auth, db } from "../config/firebaseConfig";
import { vertifyIdToken } from "../firebaseAdmin";
import {
  collection,
  getDocs,
  getDocsFromServer,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import nookies from "nookies";

const Home = ({ todosProps }) => {
  const { currentUser } = userAuth();

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [todo, setTodo] = useState({ title: "", detail: "" });
  const showAlert = (type, msg) => {
    setAlertType(type);
    setAlertMessage(msg);
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason == "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <TodoContext.Provider value={{ showAlert, todo, setTodo }}>
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", justifyContent: "space-between" }} mt={3}>
          <IconButton onClick={() => auth.signOut()}>
            <Avatar src={currentUser.phooURL} />
          </IconButton>
          <Typography variant="h5">{currentUser.displayName}</Typography>
        </Box>
        <TodoForm />
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={alertType}
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
        <TodoList todosProps={todosProps} />
      </Container>
    </TodoContext.Provider>
  );
};

export default Home;

export async function getServerSideProps(context) {
  let todos = [];
  try {
    const cookies = nookies.get(context);

    const token = await vertifyIdToken(cookies.token);
    const { email } = token;
    const collectionRef = collection(db, "todos");

    const q = query(
      collectionRef,
      where("email", "==", email),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      todos.push({
        ...doc.data(),
        id: doc.id,
        timestamp: doc.data()?.timestamp.toDate().getTime(),
      });
    });
    console.log(todos);
    return {
      props: {
        todosProps: JSON.stringify(todos),
      },
    };
  } catch {
    return {
      props: {
        todosProps: JSON.stringify(todos),
      },
    };
  }
}
