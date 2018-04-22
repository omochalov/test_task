FROM node

ENV APP_NAME=test-app
ENV APP_USER=test
ENV USER_HOME=/home/$APP_USER
ENV APP_HOME=$USER_HOME/$APP_NAME

RUN useradd --user-group --create-home --shell /bin/false $APP_USER

COPY package.json $APP_HOME/
RUN chown -R $APP_USER:$APP_USER $USER_HOME/*

USER $APP_USER
WORKDIR $APP_HOME
RUN npm install

USER root
COPY . $APP_HOME

USER $APP_USER
CMD ["npm", "start"]
