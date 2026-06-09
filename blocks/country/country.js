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
  dropdown.name = 'Filter by continent';
  dropdown.className = 'continent-filter';

  const tableWrapper = document.createElement('div');
  const table = document.createElement('table');
  tableWrapper.className = 'country-table-wrapper';
  table.className = 'country-table';

  const countLabel = document.createElement('div');
  countLabel.className = 'country-count';

  const continents = ['All', ...new Set(
    countries
      .map((item) => item.Continent?.trim())
      .filter(
        (continent) => continent
          && continent !== 'Continent',
      ),
  )];

  continents.sort((a, b) => a.localeCompare(b));

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
          <th>Sr. No</th>
          <th>Country</th>
          <th>Capital</th>
          <th>Continent</th>
          <th>Abbr.</th>
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

    countLabel.innerHTML = `      
        Total Countries: <span>${filtered.length}</span>      
    `;
    filtered.forEach((country, index) => {
      const row = document.createElement('tr');
      const iso2 = country.Abbreviation?.trim().toLowerCase();

      row.innerHTML = `
        <td>${index + 1}</td>
        <td class="country-name">
          <div class="country-info">
            <img
              class="country-flag"
              src="https://flagcdn.com/w40/${iso2}.png"
              alt="${country.Country} flag"
              loading="lazy"
            />
            <span>${country.Country}</span>
          </div>
        </td>
        <td>${country.Capital}</td>
        <td>${country.Continent}</td>
        <td>${country.Abbreviation}</td>
        `; tbody.append(row);
    });
  };

  dropdown.addEventListener('change', (e) => {
    renderCountries(e.target.value);
  });

  tableWrapper.append(table);

  block.append(dropdown);
  block.append(countLabel);
  block.append(tableWrapper);

  renderCountries('All');
}
