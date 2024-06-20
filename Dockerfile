FROM alpine:latest

RUN apk upgrade --update
RUN apk add python3 git nodejs npm bash

RUN git clone "https://github.com/Pelialusta-Python-ohjelmointikurssille/pupupeli"
RUN git clone "https://github.com/Pelialusta-Python-ohjelmointikurssille/pupuproxy"

WORKDIR /
CMD ["/pupupeli/start.sh"]