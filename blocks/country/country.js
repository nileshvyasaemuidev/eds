export default async function decorate(block) {
  const link = block.querySelector('a');
  if (!link) {
    return;
  }
  const dataPath = link.href;
  const response = await fetch(dataPath);
  const data = await response.json();
  const countries = data?.All?.data || [];
  block.innerHTML = '';

  const dropdown = document.createElement('select');
  dropdown.className = 'continent-filter';

  const table = document.createElement('table');
  table.className = 'country-table';

  const continents = ['All', ...new Set(
    countries
      .map((item) => item.Continent?.trim())
      .filter(
        (continent) => continent
          && continent !== 'Continent',
      ),
  )];

  continents.sort();

  if (continents.includes('All')) {
    continents.splice(
      continents.indexOf('All'),
      1,
    );
    continents.unshift('All');
  }

  continents.forEach((continent) => {
    const option = document.createElement('option');
    option.value = continent;
    option.textContent = continent;
    dropdown.append(option);
  });

  const renderCountries = (selectedContinent) => {
    table.innerHTML = '';

    table.innerHTML = `
      <thead>
        <tr>
          <th>Country</th>
          <th>Capital</th>
          <th>Continent</th>
          <th>Abbreviation</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');

    const filtered = selectedContinent === 'All'
      ? countries
      : countries.filter(
        (country) => country.Continent === selectedContinent,
      );

    filtered.forEach((country) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${country.Country}</td>
        <td>${country.Capital}</td>
        <td>${country.Continent}</td>
        <td>${country.Abbreviation}</td>
      `;

      tbody.append(row);
    });
  };

  dropdown.addEventListener('change', (e) => {
    renderCountries(e.target.value);
  });

  block.append(dropdown);
  block.append(table);

  renderCountries('All');
}
