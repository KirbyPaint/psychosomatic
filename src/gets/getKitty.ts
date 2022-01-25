import axios from "axios";
const KITTY_URL = "https://aws.random.cat/meow"; // maybe I will add more :3 meow

export function getKitty() {
  return axios.get(KITTY_URL).then((response) => response.data.file);
}
