from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from citations.models import Citation
from citations.serializers import CitationSerializer


class CitationViewSet(viewsets.ModelViewSet):
    model = Citation
    queryset = Citation.objects.all()
    serializer_class = CitationSerializer
    filter_backends = (filters.SearchFilter, DjangoFilterBackend)
    filter_fields = (
        'id',
        'type',
        'language',
    )
    search_fields = (
        'id',
    )
