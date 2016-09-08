#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Please pass in the environment as the first argument"
  exit 1
fi

. ./$1.env
. ./$1_secret.env

grunt