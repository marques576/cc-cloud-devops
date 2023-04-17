terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

resource "docker_network" "my_network" {
  name = "my_network"
}

resource "docker_container" "my_container" {
  name    = "cc-individualproj"
  image   = "docker/compose:1.29.0"
  command = ["up", "-d"]
  env     = ["COMPOSE_FILE=app/docker-compose.yml"]
  networks_advanced {
    name = docker_network.my_network.name
  }
  volumes {
    host_path      = "/home/marques576/Nextcloud/ComputacaoemNuvem/IndividualProject"
    container_path = "/app"
    read_only      = true
  }
}
