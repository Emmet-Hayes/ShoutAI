FROM python:latest AS builder
WORKDIR /app
#copy all the files
COPY . .

#Install the dependencies and seed DB
RUN pip install -r requirements.txt
RUN python seed_db.py

#ENV DB_PWD Sh0ut@1T3@m4Tufts
#flask configs
ENV FLASK_APP app.py
ENV FLASK_DEBUG 1
ENV FLASK_RUN_PORT 8000
ENV FLASK_RUN_HOST 0.0.0.0

EXPOSE 8000
#run commands
CMD ["flask", "run"]
