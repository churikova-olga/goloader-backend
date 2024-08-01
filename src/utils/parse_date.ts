export function formatDate(date) {
  const datePart = [
    date.getDate(),
    date.getMonth() + 1,
    date.getFullYear()
  ].map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, "0")).join(".");
  let timePart = [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ].map((n, i) => n.toString().padStart(2, "0")).join(":");
  return datePart + " " + timePart;
}