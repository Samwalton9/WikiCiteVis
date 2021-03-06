# Generated by Django 2.0.5 on 2018-05-11 09:32

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Citation',
            fields=[
                ('identifier', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('language', models.CharField(max_length=10)),
                ('page_id', models.IntegerField()),
                ('page_title', models.CharField(max_length=250)),
                ('rev_id', models.IntegerField()),
                ('timestamp', models.DateTimeField()),
                ('type', models.CharField(choices=[('arxiv', 'arxiv'), ('doi', 'doi'), ('isbn', 'isbn'), ('pmcid', 'pmcid'), ('pmid', 'pmid')], default='doi', max_length=25)),
                ('id', models.CharField(db_index=True, max_length=250)),
            ],
        ),
    ]
