#!/bin/bash
# Runs once as root on the first boot of the EC2 instance.
set -euo pipefail

# 2 GB of swap gives k3s and the judge some headroom on a 2 GB instance.
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# Single-node k3s from the stable channel. It ships Traefik, metrics-server and a NetworkPolicy controller.
curl -sfL https://get.k3s.io | INSTALL_K3S_CHANNEL=stable sh -
