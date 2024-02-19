function checkUserData() {
  const data = sessionStorage.getItem('clients');

  if (data) {
    let dataPars = JSON.parse(data);
    dataPars.forEach(item => {
      const name = item.name;
      const lastName = item.lastName;
      const email = item.email;

      if (!name && !lastName && !email) {
        location.href = 'index.html';
      }
    });
  }
}
