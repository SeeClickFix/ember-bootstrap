'use strict';

const getChannelURL = require('ember-source-channel-url');
const bootstrapVersion = `^${process.env.BOOTSTRAPVERSION}.0.0`;
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    useYarn: true,
    scenarios: [
      {
        name: 'ember-lts-4.8',
        npm: {
          devDependencies: {
            'ember-source': '~4.8.0',
            bootstrap: bootstrapVersion,
          },
        },
      },
      {
        name: 'ember-lts-4.12',
        npm: {
          devDependencies: {
            'ember-source': '~4.12.0',
            bootstrap: bootstrapVersion,
          },
        },
      },
      {
        name: 'ember-lts-5.4',
        npm: {
          devDependencies: {
            'ember-source': '~5.4.0',
            bootstrap: bootstrapVersion,
          },
        },
      },
      {
        name: 'ember-lts-5.8',
        npm: {
          devDependencies: {
            'ember-source': '~5.8.0',
            bootstrap: bootstrapVersion,
          },
        },
      },
      {
        name: 'ember-concurrency-v3',
        npm: {
          dependencies: {
            'ember-concurrency': '^3.1.1',
          },
          devDependencies: {
            bootstrap: bootstrapVersion,
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release'),
            bootstrap: bootstrapVersion,
          },
        },
        env: {
          // FAIL_ON_DEPRECATION: true,
        },
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('beta'),
            bootstrap: bootstrapVersion,
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('canary'),
            bootstrap: bootstrapVersion,
          },
        },
        env: {
          // FAIL_ON_DEPRECATION: true,
        },
      },
      {
        name: 'node-tests',
        command: 'yarn run nodetest',
      },
      embroiderSafe({
        env: {
          FASTBOOT_DISABLED: true,
        },
        npm: {
          devDependencies: {
            bootstrap: bootstrapVersion,
            // @todo remove this once embroider 0.41.0 is released
            webpack: '^5.0.0',
          },
        },
      }),
      embroiderOptimized({
        env: {
          FASTBOOT_DISABLED: true,
        },
        npm: {
          devDependencies: {
            bootstrap: bootstrapVersion,
            // @todo remove this once embroider 0.41.0 is released
            webpack: '^5.0.0',
          },
        },
      }),
    ],
  };
};
