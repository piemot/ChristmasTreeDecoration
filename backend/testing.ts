import fs from "fs";

// list files

const files = fs.readdirSync("/");
console.log(files);
