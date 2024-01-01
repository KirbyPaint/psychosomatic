import { exec } from "child_process";
import util from "util";

const { PASSWORD } = process.env;

const execFunction = util.promisify(exec);

export async function shutdown() {
	const { stdout, stderr } = await execFunction(`echo ${PASSWORD} | sudo -S shutdown -r now`);
	console.log({ stderr });
	return stdout;
}
