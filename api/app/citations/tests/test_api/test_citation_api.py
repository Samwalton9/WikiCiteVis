import pytest

from django.test.client import Client

from citations.models import Citation


@pytest.mark.django_db
def test_can_get_citation_list(admin_client: Client, citation: Citation):
    response = admin_client.get('/api/v1/citations/')
    assert response.status_code == 200
