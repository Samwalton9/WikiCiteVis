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
        'article_topic',
        'oa_status',
    )
    search_fields = (
        'id',
    )

    @staticmethod
    def filter_timestamp_range(qs, start_date, end_date):
        return qs.filter(timestamp__range=[start_date, end_date])

    def get_queryset(self):
        order_by = self.request.query_params.get('orderBy', None)
        start_date = self.request.query_params.get('startDate', None)
        end_date = self.request.query_params.get('endDate', None)

        if order_by:
            queryset = self.queryset.order_by(order_by)
        else:
            queryset = self.queryset.all()

        if start_date and end_date:
            queryset = self.filter_timestamp_range(queryset, start_date, end_date)

        return queryset
