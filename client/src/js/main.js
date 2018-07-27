const DOMBuilder = require('./DOMBuilder');

(function (window) {

  'use strict';

  const $searchForm = document.getElementById('searchForm');

  function getDateString(theDate) {
    // month is 0 indexed
    let month = theDate.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let date = theDate.getDate() < 10 ? `0${theDate.getDate()}` : theDate.getDate();
    return `${theDate.getFullYear()}-${month}-${date}`;
  }

  function composeQuery($form) {
    // return 'http://54.229.175.46:8081/api/v1/citations/?id=10.7554/eLife.09560';

    const baseUri = $form.action;
    const term = $form.search.value;
    const type = $form.querySelector('input[name="type"]:checked').value;

    // Add dates if none specified
    let startDate = $form.startDate.value;
    if (!startDate.length) {
      startDate = getDateString(new Date('01-01-2010'));
    }

    let endDate = $form.endDate.value;
    if (!endDate.length) {
      endDate = getDateString(new Date());
    }

    const $langPicker = $form.querySelector('#langPicker');
    const language = $langPicker.options[$langPicker.selectedIndex].value.toLowerCase();

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

    DOMBuilder.constructResultsHeading(0 + data.count);

    if (data.previous) {
      DOMBuilder.appendToTableBody(data.results, deriveSourceUri);
    } else if (data.count) {
      // First page
      DOMBuilder.constructResultsTable(data.results, config.headRowCols, deriveSourceUri, $searchForm);
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
        text: 'Topic',
        properyName: 'article_topic'
      },
      {
        text: 'OA Status',
        properyName: 'oa_status'
      },
      {
        text: 'ID',
        properyName: 'id'
      },
      {
        text: 'Time stamp',
        properyName: 'timestamp'
      }
    ]
  };

  $searchForm.addEventListener('submit', handleSubmit);

}(window));
