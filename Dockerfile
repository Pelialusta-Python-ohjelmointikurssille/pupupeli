FROM alpine:latest

RUN apk upgrade --update
RUN apk add python3 git

RUN git clone "https://github.com/Pelialusta-Python-ohjelmointikurssille/pupupeli"

WORKDIR /pupupeli
CMD ["python3","server.py"]