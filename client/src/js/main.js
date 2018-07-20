const DOMBuilder = require('./DOMBuilder');

(function (window) {

  'use strict';

  const $searchForm = document.getElementById('searchForm');

  function composeQuery($form) {
    // return 'http://54.229.175.46:8081/api/v1/citations/?id=10.7554/eLife.09560';

    const baseUri = $form.action;
    const term = $form.search.value;
    const type = $form.querySelector('input[name="type"]:checked').value;
    const startDate = $form.startDate.value;
    // TODO: Add now as end date if none specified
    const endDate = $form.endDate.value;

    const $langPicker = $form.querySelector('#langPicker');
    const language = $langPicker.options[$langPicker.selectedIndex].value;

    const isIdLookup = $form.querySelector('#stringency').checked;
    const stringency = isIdLookup ? 'id' : 'search';

    const $orderBy = $form.querySelector('[name="orderBy"]');
    const orderBy = $orderBy ? $orderBy.value : '';

    return `${baseUri}?${stringency}=${term}&type=${type}&language=${language}&startDate=${startDate}&endDate=${endDate}&orderBy=${orderBy}`;
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
    const data = JSON.parse(dataString);

    if (!data.count) {
      return;
    }

    // First page
    if (!data.previous) {
      DOMBuilder.constructResultsHeading(data.count);
      DOMBuilder.constructResultsTable(data.results, config.headRowCols, deriveSourceUri, $searchForm);
    } else {
      DOMBuilder.appendToTableBody(data.results, deriveSourceUri);
    }

    DOMBuilder.constructPager(
      {
        previous: data.previous,
        next: data.next
      },
      getData,
      displayData,
      document.querySelector('.search-results')
      );
  }

  function handleSubmit(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const $searchResultsContainer = document.querySelector('.search-results');
    DOMBuilder.clear($searchResultsContainer);
    DOMBuilder.constructLoadingSpinner($searchResultsContainer);
    getData(composeQuery(e.target))
      .then(displayData).then(DOMBuilder.removeLoadingSpinner);
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
        properyName: 'language'
      },
      {
        text: 'Title',
        properyName: 'page_title'
      },
      {
        text: 'ID',
        properyName: 'page_id'
      },
      {
        text: 'Time stamp',
        properyName: 'timestamp'
      }
    ]
  };

  $searchForm.addEventListener('submit', handleSubmit);

}(window));
