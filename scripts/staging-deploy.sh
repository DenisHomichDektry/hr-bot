#!/bin/bash

# Start SSH agent
eval "$(ssh-agent -s)" || exit 1

# Add SSH key
ssh-add ~/.ssh/github-hr-telegram-bot || exit 1

# Change to the project directory
cd hr-telegram-bot || exit 1

# Checkout the staging branch
git checkout staging || exit 1

# Pull the latest changes
git pull || exit 1

# Install dependencies
yarn || exit 1

# Build the project
yarn build || exit 1

# Restart the PM2 process (assuming PM2 is installed)
pm2 restart hrbot || exit 1
