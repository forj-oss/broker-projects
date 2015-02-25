#!/usr/bin/env node
/**
*# (c) Copyright 2014 Hewlett-Packard Development Company, L.P.
*#
*#   Licensed under the Apache License, Version 2.0 (the "License");
*#   you may not use this file except in compliance with the License.
*#   You may obtain a copy of the License at
*#
*#       http://www.apache.org/licenses/LICENSE-2.0
*#
*#   Unless required by applicable law or agreed to in writing, software
*#   distributed under the License is distributed on an "AS IS" BASIS,
*#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*#   See the License for the specific language governing permissions and
*#   limitations under the License.
*/
'use strict';

var amqp = require('amqp');
var msg = require('msg-util').Message;
var projectUtils = require('./lib/project-utils');
var config = require('./config');
var queue_name = 'project';
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'projects-broker'});

var rabbitmqConnectionOptions =  config.connection;
var rabbitmqImplOptions = { defaultExchangeName: config.exchange_name };
var exchangeName = config.exchange_name;
var exchangeOptions = config.exchange_options;
var connection = amqp.createConnection(rabbitmqConnectionOptions, rabbitmqImplOptions);

// Wait for connection to become established.
connection.on('ready', function () {

  connection.queue(queue_name, { passive: true }, function (queue) {
    log.info('Queue ' + queue.name + ' is open');

    queue.subscribe(function (payload, headers, deliveryInfo, messageObject) {
      log.info('Got a message with routing key: ' + deliveryInfo.routingKey);
      log.info('messageObject timestamp: ' + messageObject.timestamp);

      var notificationJson = {};  // Notification Message to be published
      try{
        notificationJson = {
          message: {  
            action: {
              context : config.notificationContext,
              ctx_data: {
                name : payload.message.action.ctx_data.name,
                description: ''
              }
            },
            ACL: {
              user: payload.message.ACL.user,
              role: payload.message.ACL.role
            },
            debug: payload.message.debug,
            log: {
              enable: payload.message.log.enable,
              level: payload.message.log.level,
              target: payload.message.log.target
            },
            origin: payload.message.origin,
            site_id: payload.message.site_id,
            time_stamp: payload.message.time_stamp
          }
        };
      }catch(err) {
        log.error(err);
      }

      var projectName = payload.message.action.ctx_data.name;

      msg.isValid(payload, function (error){
        if (error){
          log.error(error);
        }else{
          var cmd = config.cmd + ' ' + projectName;
          projectUtils.createProject(cmd, function (error, stdout, stderr) {
            if (error){
              // Error notification
              var errorMsg = 'Project creation failed: ' + stderr;
              notificationJson.message.action.ctx_data.description = errorMsg;
              log.error(errorMsg);
            }else{
              // Success notification
              notificationJson.message.action.ctx_data.description = config.successMsg;
              log.info(stdout);
              log.info(config.successMsg);
            }
            // Sending notification
            msg.isValid(notificationJson, function (error){
              if (error){
                log.error(error);
              }else{
                connection.exchange(exchangeName, exchangeOptions, function(exchange) {
                  exchange.publish(config.notificationContext, msg.getJSON(notificationJson));
                });
              }
            });
          });
        }
      });
    });
  });
});

connection.addListener('error', function (e) {
  throw e;
});
