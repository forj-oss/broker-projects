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
var config = {
  cmd: '/bin/bash /var/lib/forj/newproject.sh',
  notificationContext: 'new.project.notification',
  successMsg: 'Project request created, please +2 the change on Gerrit.',
  connection: {
    host: 'localhost',
    port: 5672,
    login: 'admin',
    password: 'changeme',
    vhost: 'maestro'
  },
  exchange_name: 'maestro_exch',
  exchange_options: { 
    type: 'topic', 
    passive: 'true',
    durable: 'true',
    autodelete: false,
    noDeclare: false,
    comfirm: false
  }
};
 
module.exports = config;