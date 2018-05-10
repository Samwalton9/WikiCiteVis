import pytest

from citations.models import Citation


@pytest.fixture
@pytest.mark.django_db
def citation():
    return Citation.objects.create(language='en',
                                   page_id=1234,
                                   page_title='Foo Title',
                                   rev_id=789,
                                   timestamp='2014-09-05T13:32:40Z',
                                   type='doi',
                                   id='10.2307/3486499')

