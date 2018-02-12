export default function setupServer(db) {
  db.dropDatabase((err, result) => {
    if (err) throw err;

  });
}
