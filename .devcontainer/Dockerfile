FROM ruby:3.0.1

ARG USERNAME=app
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
  && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
  && curl -sL https://deb.nodesource.com/setup_16.x | bash - \
  && apt-get update \
  && apt-get install -y sudo nodejs zip \
  && echo "$USERNAME ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
  && chmod 0440 /etc/sudoers.d/$USERNAME

ENV BUNDLE_PATH=/vendor/bundle
RUN mkdir -p /app $BUNDLE_PATH /home/$USERNAME/.config
RUN chown -R $USERNAME /app $BUNDLE_PATH /home

USER $USERNAME

ENV SHELL=/bin/bash

WORKDIR /app
