import { ReactNode, useEffect, useState } from "react";
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage";
import "./App.css";
import { offlineExchange } from "@urql/exchange-graphcache";
import {
  createClient,
  dedupExchange,
  fetchExchange,
  gql,
  Provider,
  useQuery,
} from "urql";

const cache = offlineExchange({});

export const client = createClient({
  url: "https://hungry-pig-70-2tepq6xrjxh0.deno.dev/",
  fetchOptions: {
    headers: {
      Credentials: "include",
    },
  },
  exchanges: [dedupExchange, cache, fetchExchange],
});

function UrqlProvider({ children }: { children: ReactNode }) {
  return <Provider value={client}>{children}</Provider>;
}

const query = gql`
  {
    me {
      id
      email
    }
  }
`;

console.log(query.loc?.source.body);

const query2 = gql`
  {
    me {
      id
      name
    }
  }
`;

function DoQuery() {
  const [result] = useQuery({
    query,
  });

  const [res2] = useQuery({
    query: query2,
  });

  return (
    <div>
      {JSON.stringify(result)}
      {JSON.stringify(res2)}
    </div>
  );
}

function App() {
  return (
    <UrqlProvider>
      <div className="App">
        <DoQuery />
      </div>
    </UrqlProvider>
  );
}

export default App;
