import bs58 from "bs58";

let base58String =
  "6XfdwA6SLfcZeYs8CMDeedrptZhfKD25m1oawL2ycf2zJ41XWWWNerzsAMzAKmpgx8DJtb3H6CJ5KitP1m71ERH";
let bytes = bs58.decode(base58String);

console.log(`[${bytes}]`);
