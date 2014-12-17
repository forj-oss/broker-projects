projects-broker
=========

Nodejs project that subscribes itselt to a RabbitMQ queue to process Project use cases.

## Installation

  npm install projects-broker --save
  node projects-broker.js

## Project Creation

  (1) Start the app: node proects-broker.js

  (2) Submit a RabbitMQ Message:
  Vhost: maestro
  Exchange: maestro_exch
  Queue: project
  Routing key: project.*.*
  Payload:
  {
   "message": {
     "action": {
         "context" : "project.create",
         "ctx_data": {
               "name" : "foo",
               "description": "my foo proj1"
          }
     },
     "ACL": {
          "user": "user@domain.com",
          "role": "admin"
     },
     "debug": true,
     "log": {
         "enable": true,
         "level": "debug",
         "target":""
     },
     "origin": "maestro.ui",
     "site_id": "14m"
    }
  }

## Tests

  npm test
  grunt lint
  grunt

## Contributing

  In lieu of a formal styleguide, take care to maintain the existing coding style.
  Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 1.0.0 Initial release