import axios from "axios";

export async function getAPOD(url: string) {
  return await axios.get(url).then((response) => response.data);
}
