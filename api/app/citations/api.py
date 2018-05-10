from rest_framework import viewsets

from citations.models import Citation
from citations.serializers import CitationSerializer


class CitationViewSet(viewsets.ModelViewSet):
    model = Citation
    queryset = Citation.objects.all()
    serializer_class = CitationSerializer
