Flink Docker Examples
=====================

**NOTE**: These resources are in a draft state, and should be used for reference only.

Examples for how to use the Flink Docker images in a variety of ways.

Docker Compose
--------------

Use the [Docker Compose config](docker-compose.yml) in this repo to create a local Flink cluster.

See the [docs](https://ci.apache.org/projects/flink/flink-docs-release-1.2/setup/docker.html) for
information on its usage.

Flink Helm Chart
----------------

Build the Helm archive:

    $ helm package helm/flink/

Deploy a non-HA Flink cluster with a single taskmanager:

    $ helm install --name my-cluster flink*.tgz

Deploy a non-HA Flink cluster with three taskmanagers:

    $ helm install --name my-cluster --set flink.num_taskmanagers=3 flink*.tgz

Deploy an HA Flink cluster with three taskmanagers:

    $ cat > values.yaml <<EOF
    flink:
      num_taskmanagers: 3
      config: |
        zookeeper_quorum: <zookeeper quorum string>
        state_s3_bucket: <s3 bucket>
        aws_access_key_id: <aws access key>
        aws_secret_access_key: <aws secret key>
    EOF

    $ helm install --name my-cluster --values values.yaml flink*.tgz

Note that the AWS access keys may not be required if you use a role (recommended). Anything under "config: |" will be added to the Flink config file. It's not limited to HA settings.