from python:3

MAINTAINER daniel@federschmidt.xyz

COPY . /app
WORKDIR /app

RUN pip install pipenv

RUN pipenv install --system

CMD ["python", "app.py"]