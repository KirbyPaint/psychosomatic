#!/bin/bash

set -euo pipefail

# Copy the .env file and remove anything within quotation marks

sed < .env "s/\".*\"//" > .env.example