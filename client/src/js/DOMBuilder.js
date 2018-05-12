'use strict';

module.exports = class DOMBuilder {

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

  static constructHeadColHeading(text, href) {
    const $th = DOMBuilder.buildElement('th', ['search-results__item__heading']);
    const $a = DOMBuilder.buildElement('a', [], text, $th);
    $a.href = href;
    return $th;
  }

  static constructTableHead(headRowCols) {
    const $thead = DOMBuilder.buildElement('thead');
    const $headRow = DOMBuilder.buildElement('tr', ['search-results__row'], '', $thead);

    headRowCols.forEach((colData) => {
      $headRow.appendChild(DOMBuilder.constructHeadColHeading(colData.text, colData.href));
    });

    return $thead;
  }

  static constructTableSkeleton(headRowCols) {
    const $table = DOMBuilder.buildElement('table');
    const $thead = DOMBuilder.constructTableHead(headRowCols);
    $table.appendChild($thead);
    return $table;
  }

  static constructTableBodyRow(data) {
    const $tr = DOMBuilder.buildElement('tr', ['search-results__row']);
    const $tdLang = DOMBuilder.buildElement('td', ['search-results__item__lang'], data.language.toUpperCase());

    const $tdTitle = DOMBuilder.buildElement('td', ['search-results__item__title']);
    const processedTitle = data.page_title.replace(/ /g, '_');
    const $tdTitleLink = DOMBuilder.buildElement('a', ['search-results__item__lang'], data.page_title, $tdTitle);
    $tdTitleLink.href = `https://${data.language}.wikipedia.org/wiki/${processedTitle}`;

    const $tdId = DOMBuilder.buildElement('td', ['search-results__item__id'], data.page_id);
    const $timeStamp = DOMBuilder.buildElement('td', ['search-results__item__time'], data.timestamp);

    $tr.appendChild($tdLang);
    $tr.appendChild($tdTitle);
    $tr.appendChild($tdId);
    $tr.appendChild($timeStamp);

    return $tr;
  }

  static constructTableBody(resultsList) {
    const $tbody = DOMBuilder.buildElement('tbody');
    resultsList.forEach((result) => {
      $tbody.appendChild(DOMBuilder.constructTableBodyRow(result));
    });

    return $tbody;
  }

  static constructResultsTable(list, headRowCols) {
    const $table = DOMBuilder.constructTableSkeleton(headRowCols);
    const $tbody = DOMBuilder.constructTableBody(list);
    $table.appendChild($tbody);

    document.querySelector('.search-results').appendChild($table);
  }

  static constructResultsHeading(resultCount) {
    const $heading = document.getElementById('searchResultsHeading');
    let $count = $heading.querySelector('.result-count');
    if (!$count) {
      $count = DOMBuilder.buildElement('span', ['result-count'], ` (${resultCount} results)`, $heading);
      $heading.appendChild($count);
    }
  }

}
