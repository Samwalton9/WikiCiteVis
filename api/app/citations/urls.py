from django.urls import path, include

from rest_framework import routers

from citations.api import CitationViewSet


router_v1 = routers.DefaultRouter()

router_v1.register('citations', CitationViewSet, base_name='citation')


urlpatterns = [
    path('api/v1/', include((router_v1.urls, 'api_v1'))),
]
