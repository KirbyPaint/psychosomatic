import { exec } from "child_process";
import util from "util";

const execFunction = util.promisify(exec);

export async function ls() {
  const { stdout, stderr } = await execFunction(`ls`);
  console.log({ stderr });
  return stdout;
}
