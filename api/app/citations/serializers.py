from rest_framework import serializers

from citations.models import Citation


class CitationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Citation
        fields = '__all__'
