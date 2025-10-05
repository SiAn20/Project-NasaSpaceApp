import axios from "axios";

const API_BASE_URL = "https://project-nasaspaceapp.onrender.com/api/nasa";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export * from "./nasa.api";
