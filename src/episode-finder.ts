import * as fs from "fs";
import path from "path";

export function whichEpisode() {
  const tvDirectory = path.join(process.cwd(), `episodeList.txt`);
  console.log(tvDirectory);
  // fs.readdir(tvDirectory, function (err, files) {
  //   if (err) {
  //     return console.log(`Unable to scan directory: ` + err);
  //   }
  //   const shows: string[] = [];
  //   files.forEach(function (file) {
  //     shows.push(file);
  //   });
  //   return shows;
  // });
  try {
    const data = fs.readFileSync(tvDirectory, `utf8`);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
