# Badger Bridge Discord Bot

🏆 **GitCoin Bounty Winner**

A containerized monitoring bot that tracks specified Twitter accounts for tweets containing "🦡" emoji and automatically relays matching tweets to configured Discord channels.

## Project Overview

This Node.js application demonstrates:
- **Asynchronous API processing** using promises for concurrent Twitter stream monitoring and Discord API integration
- **Flexible credential management** supporting both environment variables and AWS Secrets Manager
- **Containerized deployment** with Docker for consistent environments
- **Cloud-native architecture** deployed and tested on AWS EKS (Elastic Kubernetes Service)

## Technical Implementation

- **Runtime**: Node.js with promise-based asynchronous processing
- **APIs**: Twitter API for monitoring, Discord API for posting
- **Security**: Configurable credential management (environment variables or AWS Secrets Manager)
- **Containerization**: Docker
- **Cloud Deployment**: AWS EKS

## Functionality

The bot monitors a specified Twitter account for tweets containing the "🦡" emoji and automatically posts matching tweets to configured Discord channels. Account and channel selection is configurable through environment variables.

## Architecture Highlights

- Event-driven processing for real-time Twitter monitoring
- Asynchronous operations to handle concurrent API calls without blocking
- Secure credential handling with multiple configuration options
- Container-ready design for cloud deployment

This project showcases modern DevOps practices including containerization, cloud deployment, and secure configuration management.
