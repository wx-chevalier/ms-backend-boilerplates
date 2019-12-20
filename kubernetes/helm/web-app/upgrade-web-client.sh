#!/usr/bin/env bash

cd `dirname $0`

helm upgrade --namespace test --name test-web-client ./charts/
