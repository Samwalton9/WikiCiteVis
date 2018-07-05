## API

### Importing the data dump

The data dump file can be found [here](https://s3.eu-west-2.amazonaws.com/elife-innovation-sprint-datasets/identifiers_collated.tsv).

To import this into the API's database:

- Download and copy the file into the `api/app` directory
(this will then put the data file in the container when you build it)
- Build the containers using the `docker-compose up --build`
command in the root of the project
- Whilst in the root directory of the project (that contains the `docker-compose.yml`)
run the following command:

`docker-compose exec -d api python manage.py ingest_tsv --data-file-path identifiers_collated.tsv`

- This will ingest the data from the `.tsv` file in a separate process,
you should just see the command return.

- Note: if you would like to see the output of the long running import
then just exclude the `-d` argument from the previous command


### Endpoints

List all citations:

`/api/v1/citations/`

Basic search by `id` (e.g. doi, isbn...):

`/api/v1/citations/?search=12345`

Using `type` and or `language` filters:

`/api/v1/citations/?type=doi&language=en`

Basic search plus `type` and or `language` filters:

`/api/v1/citations/?search=12345&type=doi&language=en`


### Example Return Value

Single citation:

```
{
    "identifier": "1dd55b5f-f753-43de-afc8-18199f742365",
    "language": "nl",
    "page_id": 4060289,
    "page_title": "Antoetra",
    "rev_id": 42181711,
    "timestamp": "2014-09-30T06:53:44Z",
    "type": "isbn",
    "id": "9781841623412"
}
```
