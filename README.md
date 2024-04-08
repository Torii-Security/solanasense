# Solana Sense
SolanaSense is a comprehensive analytics and monitoring platform tailored for the Solana ecosystem, covering the entire spectrum of protocols from on-chain to frontend and backend. With advanced SIEM (Security Information and Event Management) capabilities and SOC (Security Operations Center) support, it provides in-depth insights, robust monitoring, and proactive alerting to safeguard and optimize blockchain operations.

Solana Sense stack consists of custom Sense worker to gather on-chain data for specific program, transform this data and put into ELK stack.

## Setup
1. Copy `.env.sample` to `.env` and fill environment variables.
2. To support alerting adjust Kibana config at `elk-infra/kibana/config/kibana.yml`:
- generate encryption keys using one of the following commands:
```
docker container run --rm docker.elastic.co/kibana/kibana:8.6.2 bin/kibana-encryption-keys generate

or

openssl rand -hex 32
```

3. Then run setup script:
```sh
docker-compose up setup
```

Check this repo for references and help [docker-elk](https://github.com/deviantony/docker-elk)

## Starting
To start run

```sh
docker-compose up
```
