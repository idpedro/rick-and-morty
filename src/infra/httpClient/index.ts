import axios from "axios";

if (process.env.NEXT_PUBLIC_BASE_API_URL == null) {
  throw new Error("Base url not defined");
}

const ApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
});

export { ApiInstance };
