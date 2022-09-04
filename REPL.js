const arr = [1, 3, 1, 1, 1, 5];
var half_length = arr.length / 2;
const temp = [];
var match = arr[0];

console.log(match);

for (i = 0; i < arr.length; i++) {
  if (match === arr[i]) {
    temp.push(arr[i]);
  }
}

console.log(temp);

if (temp.length > half_length) {
  console.log(temp[0]);
}
