import pytest


@pytest.mark.django_db
def test_can_create_citation(citation):
    assert citation
    assert citation.language == 'en'
    assert citation.page_id == 1234
    assert citation.page_title == 'Foo Title'
    assert citation.rev_id == 789
    assert citation.timestamp == '2014-09-05T13:32:40Z'
    assert citation.type == 'doi'
    assert citation.id == '10.2307/3486499'
