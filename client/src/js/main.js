(function (window) {

  'use strict';
  const $searchForm = document.getElementById('searchForm');

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
        xhr.open('GET', url);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        xhr.send();
      }
    );
  }

  function displayData(data) {
    console.log('data', data);
  }

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    getData(composeQuery(e.target))
      .then(displayData);
    console.log('query:' ,composeQuery(e.target));

  }

  $searchForm.addEventListener('submit', handleSubmit);

}(window));




