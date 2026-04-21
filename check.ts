import data from './src/data.json' with { type: 'json' };

const indexOf19Merch2024 = data.findIndex((day) => day.createdAt.startsWith('2024-03-19'));
const daysFrom19Merch2024 = data.slice(indexOf19Merch2024);
daysFrom19Merch2024.forEach((day, index) => {
  // is occupied greater then next day?
  if (day.occupied > daysFrom19Merch2024[index + 1]?.occupied) {
    console.log(day.createdAt, day.occupied, daysFrom19Merch2024[index + 1].occupied);
  }
});
