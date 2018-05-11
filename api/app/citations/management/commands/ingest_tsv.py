import logging

from django.core.management.base import BaseCommand
from django.db.utils import DataError
import pandas

from citations.models import Citation


LOG = logging.getLogger(__name__)


def import_tsv(data_file_path: str) -> None:
    """Import some citation data from .tsv file.

    Note: this is currently a dirty way to do this :()

    :param data_file_path: str
    :return:
    """
    with open(data_file_path) as tsvfile:
        reader = pandas.read_csv(tsvfile, sep='\t', header=0)

    try:
        for idx in range(10000000000):
            ct = reader.iloc[idx]

            try:
                print(f'{ct.id} / {ct.type} / {ct.page_title}')

                Citation.objects.create(page_id=ct.page_id,
                                        timestamp=ct.timestamp,
                                        page_title=ct.page_title,
                                        rev_id=ct.rev_id,
                                        type=ct.type,
                                        id=ct.id,
                                        language=ct.language)
            except ValueError:
                # blank line? missing data ?
                pass
            except DataError:
                # trash doi value
                pass

    except IndexError:
        # end of file
        pass


class Command(BaseCommand):
    help = 'Ingest citation data from a .tsv data file'

    def add_arguments(self, parser):
        parser.add_argument('--data-file-path', type=str)

    def handle(self, *args, **options):
        data_file_path = options['data_file_path']
        import_tsv(data_file_path)
