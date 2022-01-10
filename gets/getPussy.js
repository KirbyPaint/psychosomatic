// if any of my coworkers see this function name a) I'm sorry b) I'm not sorry
import axios from "axios";
const KITTY_URL = "https://aws.random.cat/meow"; // maybe I will add more :3 meow

export function getPussy() {
  return axios.get(KITTY_URL).then((response) => response.data.file);
}
