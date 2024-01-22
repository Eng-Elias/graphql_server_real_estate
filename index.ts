import express from "express";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema"; // Import your schema from the correct path

async function startApolloServer() {
  const app = express();

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  server.applyMiddleware({ app });

  // Add other middleware or server configurations if needed

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
