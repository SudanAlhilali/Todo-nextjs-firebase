import { async } from "@firebase/util";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React from "react";
import { db } from "../../config/firebaseConfig";
import Link from "next/link";

const Detail = ({ getTodoProps }) => {
  const todo = JSON.parse(getTodoProps);

  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <Card
            sx={{ minWidth: 275, maxWidth: 600, boxSahdow: 3 }}
            style={{ backgroundColor: "FAFAFA" }}
          >
            <CardContent>
              <Typography variant="h5" component="div">
                {todo.title}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {todo.detail}
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="/">
                <Button size="small">Back to Home</Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Detail;

export const getStaticPaths = async () => {
  const snapshot = await getDocs(collection(db, "todos"));
  const paths = snapshot.docs.map((doc) => {
    return {
      params: { id: doc.id.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const id = context.params.id;

  const docRef = doc(db, "todos", id);
  const docSnap = await getDoc(docRef);

  return {
    props: { getTodoProps: JSON.stringify(docSnap.data()) || null },
  };
};
