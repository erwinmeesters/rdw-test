const vehiclesTable = {
  options: {
    selectable: false,
    clickable: true,
    detailed: false
  },
  columns: [
    {
      label: 'Voertuigsoort',
      id: 'voertuigsoort',
      options: {
        width: 250,
        searchable: true,
        sortable: 'voertuigsoort'
      }
    },
    {
      label: 'Merk',
      id: 'merk',
      options: {
        searchable: true,
        sortable: 'merk'
      }
    },
    {
      label: 'Type',
      id: 'handelsbenaming',
      options: {
        searchable: true,
        sortable: 'handelsbenaming'
      }
    },
    {
      label: 'Kenteken',
      id: 'kenteken',
      options: {
        searchable: true,
        sortable: 'kenteken'
      }
    },
    {
      label: 'Kleur',
      id: 'eerste_kleur',
      options: {
        searchable: true,
        sortable: 'eerste_kleur'
      }
    }
  ]
};

export default vehiclesTable;
