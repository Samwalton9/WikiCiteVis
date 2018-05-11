(function (window) {

  'use strict';


  const $searchForm = document.getElementById('searchForm');

  /**
   * Builds and returns specified HTML element, optionally adding it to the DOM.
   *
   *
   *
   * @param {string} elName Name of the HTML element to build
   * @param {Array<string>} [cssClasses] CSS class name(s) to set on the element
   * @param {string} [textContent] Textual content of the element
   * @param {string|Element} [parent] Parent element to attach to
   * @param {string|Element|boolean} [attachBefore] The sibling before which to attach the element:
   *  true: following sibling is the parent's first element child
   *  HTMLElement: explicitly supplied following sibling
   *  string: CSS selector to use to find the following sibling
   *
   * @returns {Element}
   */
  function buildElement(elName, cssClasses, textContent, parent, attachBefore) {

    const $el = document.createElement(elName);
    const $parent = typeof parent === 'string' ? document.querySelector(parent)
      : parent;

    // Work out what the new element's following sibling will be, based on value of attachBefore.
    const $followingSibling = (function () {

      if (!!attachBefore) {

        if (typeof attachBefore === 'boolean') {
          if ($parent.firstElementChild instanceof HTMLElement) {
            return $parent.firstElementChild;
          } else {
            return null;
          }

        } else if (typeof attachBefore === 'string') {
          return $parent.querySelector(attachBefore);

        } else if (attachBefore instanceof HTMLElement) {
          return attachBefore;

        }
      }
    }());

    if (Array.isArray(cssClasses)) {
      cssClasses.forEach(cssClass => {
        $el.classList.add(cssClass);
      });
    }

    if (textContent) {
      $el.innerHTML = textContent;
    }

    if ($parent) {
      if ($followingSibling) {
        if ($followingSibling.parentNode !== $parent) {
          throw new ReferenceError(
            'Trying to attach an element with respect to an element sibling, but the two elements do not share a common parent.'
          );
        }

        $parent.insertBefore($el, $followingSibling);
      } else {
        $parent.appendChild($el);
      }
    }

    return $el;
  }

  function composeQuery($form) {
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

  function displayData(data) {
    constructResultsHeading(data.count);
    console.log('data', data);
  }

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    getData(composeQuery(e.target))
      .then(displayData);
    console.log('query:' ,composeQuery(e.target));

  }

  function constructResultsHeading(resultCount) {
    const $heading = document.getElementById('searchResultsHeading');
    let $count = $heading.querySelector('.result-count');
    if (!$count) {
      $count = buildElement('span', ['result-count'], ` (${resultCount} results)`, $heading);
      $heading.appendChild($count);
    }
  }

  function constructTableHead() {
    const $thead = buildElement('thead');
    const $headRow = buildElement('tr', [], '', $thead);

    const headRowCols = [
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
      },
    ];

    headRowCols.forEach((colData) => {
      $headRow.appendChild(constructHeadColHeading(colData.text, colData.href));
    });

    return $thead;
  }

  function constructHeadColHeading(text, href) {
    const $th = buildElement('th', ['search-results__item__heading', 'search-results__item__lang']);
    const $a = buildElement('a', [], text, $th);
    $a.href = href;
    return $th;
  }

  function constructTableBody(resultsList) {
    const $tbody = buildElement('tbody');
    resultsList.forEach((result) => {
      $tbody.appendChild(constructTableBodyRow(result));
    });

    return $tbody;
  }

  function constructTableBodyRow(data) {
    const $tr = buildElement('tr', ['search-results__row']);
    const $tdLang = buildElement('td', ['search-results__item__lang'], data.language);

    const $tdTitle = buildElement('td', ['search-results__item__title']);
    const processedTitle = data.page_title.replace(/ /g, '_');
    const $tdTitleLink = buildElement('a', ['search-results__item__lang'], data.page_title, $tdTitle);
    $tdTitleLink.href = `https://${data.language}.wikipedia.org/wiki/${processedTitle}`;

    const $tdId = buildElement('td', ['search-results__item__id'], data.page_id);
    const $timeStamp = buildElement('td', ['search-results__item__time'], data.timestamp);

    $tr.appendChild($tdLang);
    $tr.appendChild($tdTitle);
    $tr.appendChild($tdId);
    $tr.appendChild($timeStamp);

    return $tr;
  }

  function constructTableSkeleton(list) {
    const $table = buildElement('table');
    const $thead = constructTableHead();
    $table.appendChild($thead);
    return $table;
  }

  function constructResultsTable(list) {
    const $table = constructTableSkeleton();
    const $tbody = constructTableBody(list);
    $table.appendChild($tbody);

    document.querySelector('.search-results').appendChild($table);
  }

  $searchForm.addEventListener('submit', handleSubmit);

  const mockData =   {
    "count": 1,
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
      }
    ]
  };

  constructResultsTable(mockData.results);

}(window));




