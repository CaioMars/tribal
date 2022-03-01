import axios from "axios";
import AppConfig from "../../../AppConfig";

const instance = axios.create({
  baseURL: AppConfig.API,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": AppConfig.API_SECRET,
  },
});

export default instance;
