export function extend(obj: {}, data: {}) {
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      obj[key] = data[key];
    }
  }
}
