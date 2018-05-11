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

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('query:' ,composeQuery(e.target));
  }

  $searchForm.addEventListener('submit', handleSubmit);

}(window));




