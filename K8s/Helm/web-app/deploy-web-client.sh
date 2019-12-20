#!/usr/bin/env bash

cd `dirname $0`

helm install --namespace test --name test-web-client ./charts/
