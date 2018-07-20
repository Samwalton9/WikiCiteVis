import uuid

from django.db import models


ARXIV = 'arxiv'
DOI = 'doi'
ISBN = 'isbn'
PMCID = 'pmcid'
PMID = 'pmid'

CITATION_TYPES = (
    (ARXIV, 'arxiv'),
    (DOI, 'doi'),
    (ISBN, 'isbn'),
    (PMCID, 'pmcid'),
    (PMID, 'pmid'),
)


class Citation(models.Model):
    identifier = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    language = models.CharField(max_length=10)
    page_id = models.IntegerField()
    page_title = models.CharField(max_length=250)
    rev_id = models.IntegerField()
    timestamp = models.DateTimeField(null=False)
    type = models.CharField(max_length=25, choices=CITATION_TYPES, default=DOI)
    id = models.CharField(db_index=True, max_length=250)
    article_topic = models.CharField(max_length=250, blank=True, null=True)
    oa_status = models.CharField(max_length=250, blank=True, null=True)
    oa_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return f'{self.identifier} / {self.type}: {self.id}'
