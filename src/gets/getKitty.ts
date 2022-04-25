import axios from "axios";
import { writeFileSync } from "fs";
const KITTY_URL = "https://aws.random.cat/meow"; // maybe I will add more :3 meow
const acceptedStatusCodes = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226];
export function getKitty() {
  try {
    return axios.get(KITTY_URL).then((response) => {
      if (acceptedStatusCodes.includes(response.status)) {
        return response.data.file;
      } else {
        throw new Error(`Status code ${response.status} was not accepted.`);
      }
      // if (!acceptedStatusCodes.includes(response.status)) {
      //   return new Error("Something went wrong");
      // }
      // return response.data.file;
    });
  } catch (error) {
    writeFileSync(`./error.json`, `${error}\n`);
    return "There was an error";
  }
}
