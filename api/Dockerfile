FROM python:3.6.4-jessie

WORKDIR /srv/app/

RUN pip install pipenv

COPY app/Pipfile app/Pipfile.lock ./
RUN pipenv install --deploy --system

COPY app /srv/app/

CMD python manage.py migrate && python manage.py runserver 0.0.0.0:8000
