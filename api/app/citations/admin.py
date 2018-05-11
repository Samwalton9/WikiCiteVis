from django.contrib import admin

from citations.models import Citation


class CitationAdmin(admin.ModelAdmin):
    list_per_page = 20

    list_filter = (
        'id',
    )

    list_display = (
        'identifier',
        'type',
        'id',
        'timestamp',
    )

    list_display_links = ['identifier']


admin.site.register(Citation, CitationAdmin)
