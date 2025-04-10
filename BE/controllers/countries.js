const axios = require('axios');
const RequestLog = require('../models/RequestLog');

const getAllCountries = async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    
    const filteredData = response.data.map(country => ({
      name: country.name.common,
      capital: country.capital?.[0],
      currency: Object.values(country.currencies || {})[0]?.name,
      languages: Object.values(country.languages || {}),
      flag: country.flags.png
    }));
    
    res.json(filteredData);
  } catch (error) {
    console.error('RestCountries API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch countries data' });
  }
};

const getCountryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
    
    const country = response.data[0];
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    const filteredData = {
      name: country.name.common,
      capital: country.capital?.[0],
      currency: Object.values(country.currencies || {})[0]?.name,
      languages: Object.values(country.languages || {}),
      flag: country.flags.png
    };
    
    res.json(filteredData);
  } catch (error) {
    console.error('RestCountries API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch country data' });
  }
};

module.exports = { getAllCountries, getCountryByName };