# Sentry

1. Download docker-compose.yml to dir named `sentry`
2. Change `SENTRY_SECRET_KEY` to random 32 char string
3. Run `docker-compose up -d`
4. Run `docker-compose exec sentry sentry upgrade` to setup database and create admin user
5. (_Optional_) Run `docker-compose exec sentry pip install sentry-slack` if you want slack plugin, it can be done later
6. Run `docker-compose restart sentry`
7. Sentry is now running on public port `9000`

* https://docs.docker.com/compose/compose-file/#env_file
* https://docs.docker.com/compose/compose-file/#depends_on

# Official Sentry integration/plugin

* https://github.com/getsentry/sentry-redmine - Sentry integration for creating Redmine issues
* https://github.com/getsentry/sentry-github - Sentry extension which integrates with GitHub
* https://github.com/getsentry/sentry-phabricator - Sentry extension which integrates with Phabricator
* https://github.com/getsentry/sentry-pagerduty - Sentry plugin for integrating with PagerDuty
* https://github.com/getsentry/sentry-teamwork - Sentry plugin that integrates with Teamwork
* https://github.com/getsentry/sentry-heroku - Sentry extension which integrates Heroku release tracking
* https://github.com/getsentry/sentry-freight - Sentry extension which integrates with Freight release tracking
* https://github.com/getsentry/sentry-youtrack - Sentry extension which integrates with YouTrack
* https://github.com/getsentry/sentry-bitbucket - Sentry extension which integrates with Bitbucket
* https://github.com/getsentry/sentry-jira - Plugin for sentry that lets you create JIRA issues
* https://github.com/getsentry/sentry-irc - Plugin for Sentry that logs errors to an IRC room
* https://github.com/getsentry/sentry-trello - Plugin for Sentry that creates cards on a Trello board
* https://github.com/getsentry/sentry-campfire - Sentry plugin for sending notifications to Campfire
* https://github.com/getsentry/sentry-groveio - Plugin for Sentry that logs errors to an IRC room on Grove.io
* https://github.com/getsentry/sentry-irccat - Plugin for Sentry which sends errors to irccat (or any other service which supports irccat's simple socket-based protocol)
* https://github.com/getsentry/sentry-slack - Slack integration for Sentry

# Sentry integration/plugin

* https://github.com/linovia/sentry-hipchat - Sentry plugin that integrates with Hipchat
* https://github.com/butorov/sentry-telegram - Plugin for Sentry which allows sending notification via Telegram messenger
* https://github.com/mattrobenolt/sentry-twilio - A plugin for Sentry that sends SMS notifications via Twilio
* https://github.com/Banno/getsentry-kafka - An Apache Kafka plugin for Sentry

# Nginx

```yaml
server {
  server_name sentry.example.com;
  listen 80;
  location / {
    proxy_pass http://sentry:9000;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
  }
}
```
