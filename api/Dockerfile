FROM python:3.6.4-jessie

RUN pip install pipenv

ADD app /srv/app/
WORKDIR /srv/app/

RUN pipenv install --system

WORKDIR /srv/app/

CMD python manage.py migrate && python manage.py runserver 0.0.0.0:8000