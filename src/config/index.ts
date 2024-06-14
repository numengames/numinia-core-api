export default {
  port: process.env.SERVER_PORT || 8000,
  mongo: {
    protocol: process.env.MONGODB_PROTOCOL || 'mongodb',
    host: process.env.MONGODB_HOST || '',
    port: process.env.MONGODB_PORT || '27017',
    hasPort: false,
    databaseName: process.env.MONGODB_DATABASE_NAME || '',
    options: {
      replicaSet: '',
    },
    user: process.env.MONGODB_USER || '',
    pass: process.env.MONGODB_PASS || '',
  },
  logger: {
    loki: {
      isActive: true,
      job: 'numinia-core-api',
      host: 'https://logs-prod-012.grafana.net',
      user: process.env.GRAFANA_LOGGER_USER || 'test',
      password: process.env.GRAFANA_LOGGER_PASSWORD || 'test',
    },
    discord: {
      isActive: true,
      service: 'numinia-core-api',
      webhook: process.env.DISCORD_WEBHOOK || 'test',
    },
  },
};
