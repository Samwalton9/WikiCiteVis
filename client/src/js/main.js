const DOMBuilder = require('./DOMBuilder');

(function (window) {

  'use strict';

  const $searchForm = document.getElementById('searchForm');

  function composeQuery($form) {
    // return 'http://54.229.175.46:8081/api/v1/citations/?id=10.7554/eLife.09560';

    const baseUri = $form.action;
    const search = $form.search.value;
    const type = $form.querySelector('input[name="type"]:checked').value;
    const startDate = $form.startDate.value;
    const endDate = $form.endDate.value;

    const $langPicker = $form.querySelector('#langPicker');
    const language = $langPicker.options[$langPicker.selectedIndex].value;

    return `${baseUri}?search=${search}&type=${type}&language=${language}&startDate=${startDate}&endDate=${endDate}`;
  }

  function getData(query) {
    return new Promise(
      function resolver(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
          resolve(xhr.responseText);
        });
        xhr.addEventListener('error', reject);
        xhr.open('GET', query);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        xhr.send();
      }
    );
  }

  function displayData(dataString) {
    console.log('Placeholder fn until search returning results');
    console.log('data', dataString);
    const data = JSON.parse(dataString);
    DOMBuilder.constructResultsHeading(data);
    DOMBuilder.constructResultsTable(data.results, config.headRowCols, deriveSourceUri);

  }

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    getData(composeQuery(e.target))
      .then(displayData);
    console.log('query:' ,composeQuery(e.target));
  }

  function deriveSourceUri(id, type) {
    let prefix;
    switch (type.toLowerCase()) {
    case 'doi':
      prefix = 'http://doi.org/';
      break;
    case 'isbn':
      prefix = 'https://en.wikipedia.org/wiki/Special:BookSources/';
      break;
    case 'arxiv':
      prefix = 'https://arxiv.org/abs/';
      break;
    case 'pmid':
      prefix = 'https://www.ncbi.nlm.nih.gov/pubmed/';
      break;
    case 'pmcid':
      prefix = 'https://www.ncbi.nlm.nih.gov/pmc/articles/';
    }

    return `${prefix}${id}`
  }

  const config = {
    headRowCols: [
      {
        text: 'Language',
        href: 'sortByLang_ToggleDirection'
      },
      {
        text: 'Title',
        href: 'sortByTitle_ToggleDirection'
      },
      {
        text: 'ID',
        href: 'sortById_ToggleDirection'
      },
      {
        text: 'Time stamp',
        href: 'sortByTimeStamp_ToggleDirection'
      }
    ]
  };

  const mockData =   {
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
      {
        "identifier": "780a692c-c37e-45a8-9d86-214787274316",
        "language": "sw",
        "page_id": 15871,
        "page_title": "Malaria",
        "rev_id": 318169,
        "timestamp": "2009-11-19T12:35:47Z",
        "type": "doi",
        "id": "10.1038/nsmb947"
      },
      {
        "identifier": "780a692c-c37e-45a8-9d86-214787274316",
        "language": "sw",
        "page_id": 15871,
        "page_title": "Malaria",
        "rev_id": 318169,
        "timestamp": "2009-11-19T12:35:47Z",
        "type": "doi",
        "id": "10.1038/nsmb947"
      },
      {
        "identifier": "780a692c-c37e-45a8-9d86-214787274316",
        "language": "sw",
        "page_id": 15871,
        "page_title": "Malaria",
        "rev_id": 318169,
        "timestamp": "2009-11-19T12:35:47Z",
        "type": "doi",
        "id": "10.1038/nsmb947"
      },
      {
        "identifier": "780a692c-c37e-45a8-9d86-214787274316",
        "language": "sw",
        "page_id": 15871,
        "page_title": "Malaria",
        "rev_id": 318169,
        "timestamp": "2009-11-19T12:35:47Z",
        "type": "doi",
        "id": "10.1038/nsmb947"
      },
      {
        "identifier": "780a692c-c37e-45a8-9d86-214787274316",
        "language": "sw",
        "page_id": 15871,
        "page_title": "Malaria",
        "rev_id": 318169,
        "timestamp": "2009-11-19T12:35:47Z",
        "type": "doi",
        "id": "10.1038/nsmb947"
      }
    ]
  };

  $searchForm.addEventListener('submit', handleSubmit);

}(window));
