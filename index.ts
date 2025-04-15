import { transmission } from "./services/transmission";

async function main() {
  const res = await transmission.getAllData();
  console.log(res);
}