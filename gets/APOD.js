import axios from "axios";

export async function getAPOD(url) {
  return await axios.get(url).then((response) => response.data);
}
