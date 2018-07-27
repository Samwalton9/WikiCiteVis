'use strict';

module.exports = class DOMBuilder {

  /**
   * Builds and returns specified HTML element, optionally adding it to the DOM.
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
  static buildElement(elName, cssClasses, textContent, parent, attachBefore) {

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

  static constructHeadColHeading(text, propertyName, $form) {
    const $th = DOMBuilder.buildElement('th', ['search-results__item__heading']);
    const $button = DOMBuilder.buildElement('button', ['ordering-control'], text, $th);
    $button.addEventListener('click', () => {

      let newOrderByValue = propertyName;
      // handle a previous orderBy field
      const oldField = $form.querySelector('[name="orderBy"]');
      // if the inverse of the same field appears invert it again (handles asc -> desc & visa versa)
      if (oldField) {
        if (oldField.value === propertyName) {
          newOrderByValue = `-${propertyName}`
        }
        $form.removeChild(oldField);
      }

      // create hidden orderBy field
      const $orderBy = DOMBuilder.buildElement('input', [], '', $form);
      $orderBy.name = 'orderBy';
      $orderBy.type = 'hidden';
      $orderBy.value = newOrderByValue;
      $form.appendChild($orderBy);
      // click on form submit button
      $form.querySelector('[type="submit"]').click();
    });



    return $th;
  }

  static constructTableHead(headRowCols, $form) {
    const $thead = DOMBuilder.buildElement('thead');
    const $headRow = DOMBuilder.buildElement('tr', ['search-results__row'], '', $thead);

    headRowCols.forEach((colData) => {
      $headRow.appendChild(DOMBuilder.constructHeadColHeading(colData.text, colData.properyName, $form));
    });

    return $thead;
  }

  static constructTableSkeleton(headRowCols, $form) {
    const $table = DOMBuilder.buildElement('table');
    const $thead = DOMBuilder.constructTableHead(headRowCols, $form);
    $table.appendChild($thead);
    return $table;
  }

  static constructTableBodyRow(data, deriveSourceUri) {
    const $tr = DOMBuilder.buildElement('tr', ['search-results__row']);
    const $tdLang = DOMBuilder.buildElement('td', ['search-results__item__lang'], data.language.toUpperCase());

    const $tdTitle = DOMBuilder.buildElement('td', ['search-results__item__title']);
    const processedTitle = data.page_title.replace(/ /g, '_');
    const $tdTitleLink = DOMBuilder.buildElement('a', ['search-results__item__lang'], data.page_title, $tdTitle);
    $tdTitleLink.href = `https://${data.language}.wikipedia.org/wiki/${processedTitle}`;

    const $topic = DOMBuilder.buildElement('td', [], data.article_topic.replace(/_/g, ' '));

    const $oaStatus = DOMBuilder.buildElement('td');
    const oaUrl = data.oa_url;
    // 'nan' seems to be junk data so don't try and link to it (still display, to expose in case needs fixing).
    if (oaUrl && oaUrl.toLowerCase() !== 'nan') {
      const $link = DOMBuilder.buildElement('a', [], data.oa_status, $oaStatus);
      $link.href = data.oa_url;
    } else {
      $oaStatus.innerHTML = data.oa_status;
    }

    const $tdId = DOMBuilder.buildElement('td', ['search-results__item__id']);
    const sourceUri = deriveSourceUri.call(null, data.id, data.type);
    const $sourceLink = DOMBuilder.buildElement('a', [], data.id, $tdId);
    $sourceLink.href = sourceUri;

    const $timeStamp = DOMBuilder.buildElement('td', ['search-results__item__time']);
    const $diffLink = DOMBuilder.buildElement('a', [], data.timestamp, $timeStamp);
    $diffLink.href = `https://${data.language}.wikipedia.org/wiki/Special:Diff/${data.rev_id}`;

    $tr.appendChild($tdLang);
    $tr.appendChild($tdTitle);
    $tr.appendChild($topic);
    $tr.appendChild($oaStatus);
    $tr.appendChild($tdId);
    $tr.appendChild($timeStamp);

    return $tr;
  }

  static constructResultsTable(list, headRowCols, deriveSourceUri, $form) {
    const $table = DOMBuilder.constructTableSkeleton(headRowCols, $form);
    let $tbody = DOMBuilder.buildElement('tbody');
    DOMBuilder.appendToTableBody(list, deriveSourceUri, $tbody);
    $table.appendChild($tbody);

    document.querySelector('.search-results').appendChild($table);
  }

  static appendToTableBody(list, deriveSourceUri, $tableBody) {
    let $tbody = $tableBody || document.querySelector('tbody');
    list.forEach((result) => {
      $tbody.appendChild(DOMBuilder.constructTableBodyRow(result, deriveSourceUri));
    });
  }

  static constructResultsHeading(resultCount) {
    const $container = document.querySelector('.search-results');
    let $heading = $container.querySelector('.heading');
    if (!$heading) {
      $heading = DOMBuilder.buildElement('h2', ['heading'], '', $container);
    }

    let $count = $heading.querySelector('.result-count');
    const countDisplay = ` ${resultCount} results`;
    if (!$count) {
      $count = DOMBuilder.buildElement('span', ['result-count'], countDisplay, $heading);
    } else {
      $count.innerHTML = countDisplay;
    }
  }

  static constructLoadingSpinner($parent) {
    $parent.classList.add('loading');
    const $wrapper = DOMBuilder.buildElement('div', ['loading-spinner-wrapper'], '', $parent);
    DOMBuilder.buildElement('div', ['loading-spinner'], '', $wrapper);
  }

  static removeLoadingSpinner() {
    const $loadingSpinnerWrapper = document.querySelector('.loading-spinner-wrapper');
    if ($loadingSpinnerWrapper) {
      const $parent = $loadingSpinnerWrapper.parentNode;
      $parent.removeChild($loadingSpinnerWrapper);
      $parent.classList.remove('loading');
    }
  }

  static clear($element) {
    $element.innerHTML = '';
  }

  static constructPager(uris, getData, displayData, $searchResultsContainer) {
    const $oldPager = document.querySelector('.pager');
    if ($oldPager) {
      $oldPager.parentNode.removeChild($oldPager);
    }
    const $pager = DOMBuilder.buildElement('div', ['pager']);

    if (uris.next) {
      const $next = DOMBuilder.buildElement('button', ['next'], 'More');
      $next.id = 'nextPage';
      // Temporary hacking the URL to get a local client instance running
      $next.dataset.uri = uris.next.replace('http://api:8000', 'http://54.229.175.46:8081');
      $next.addEventListener('click', (e) => {
        DOMBuilder.constructLoadingSpinner($searchResultsContainer);
        getData.call(null, e.target.dataset.uri).then(displayData).then(DOMBuilder.removeLoadingSpinner);
      });
      $pager.appendChild($next);
    }

    document.querySelector('.search-results').appendChild($pager);
  }

  static constructOrderToggle(isDescending) {

    const toggle = () => {

    }

    const text = isDescending ? 'descending' : 'acending';
    const $toggle = this.buildElement('button', [], text);
    $toggle

    return toggle;
  }

};
