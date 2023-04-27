terraform {
  required_providers {
    vercel = {
      source = "vercel/vercel"
      version = "0.11.4"
    }
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    cloudflare = {
      source = "cloudflare/cloudflare"
      version = "4.4.0"
    }
  }
}

resource "vercel_project_environment_variable" "vite_websocket_url" {
  project_id = vercel_project.example.id
  key = "VITE_WEBSOCKET_URL"
  value = "wss://${local.url_without_protocol}"
  target = ["production","preview","development"]
}

resource "vercel_project_environment_variable" "vite_google_maps_api_key_env" {
  project_id = vercel_project.example.id
  key = "VITE_GOOGLE_MAPS_API_KEY"
  value = var.google_maps_api_key
  target = ["production","preview","development"]
}

resource "vercel_project" "example" {
  name      = "terraform-test-project"
  framework = "vite"
  output_directory = "dist"
  root_directory = "webdjicontrollws/"
  git_repository = {
    type = "github"
    repo = var.git_repository
  }
}

data "vercel_project_directory" "example" {
  path = "webdjicontrollws/"
}

resource "vercel_project_domain" "example" {
  project_id = vercel_project.example.id
  domain     = "ccweb.marques576.eu.org"
}

resource "vercel_deployment" "example" {
  project_settings = {
    output_directory = "dist"
   }
  project_id  = vercel_project.example.id
  files       = data.vercel_project_directory.example.files
  production  = true
  environment = {
    VITE_WEBSOCKET_URL = "wss://${local.url_without_protocol}"
    VITE_GOOGLE_MAPS_API_KEY = var.google_maps_api_key
  }

}

//DIGITAL OCEAN
resource "digitalocean_app" "default" {
  spec {
    name = "cc-individualproj"
    region ="ams"

    domain {
      name = var.backend_domain
    }

    service {
      name = "socketserver"
      dockerfile_path = "sockerserver/Dockerfile"
      github {
        repo = var.git_repository
        branch = "main"
        deploy_on_push = true
      }
      source_dir = "sockerserver/"
      http_port = 8080

    env {
      key = "DATABASE_URL"
      value = digitalocean_database_cluster.mysql-example.host
    }
    env {
      key = "DATABASE_PORT"
      value = digitalocean_database_cluster.mysql-example.port
    }
    env {
      key = "DATABASE_USER"
      value = digitalocean_database_cluster.mysql-example.user
    }
    env {
      key = "DATABASE_PASSWORD"
      value = digitalocean_database_cluster.mysql-example.password
    }
    env {
      key = "DATABASE_NAME"
      value = digitalocean_database_cluster.mysql-example.database
    }
    }
  }

}

//CLOUDFLARE
resource "cloudflare_record" "example" {
  zone_id = "50657706a4f9844b2052af3293dbd0f7"
  name    = "ccserver"
  type    = "CNAME"
  value   =  local.url_without_protocol_with_dot
  ttl     = 3600
}


//NOTIFICATIONS

resource "null_resource" "notify_server_build_complete" {
  provisioner "local-exec" {
    command = "curl -X POST -H 'Content-Type: application/json' -d '{ \"username\":\"Terraform\",\"content\": \"Server build and provisioning is complete with no errors! on ${digitalocean_app.default.live_url} :white_check_mark:\" }' ${var.webhook_url}"
  }
  depends_on = [
    digitalocean_app.default,
  ]
}

resource "null_resource" "notify_web_build_complete" {
  provisioner "local-exec" {
    command = "curl -X POST -H 'Content-Type: application/json' -d '{ \"username\":\"Terraform\", \"content\": \"Web build and provisioning is complete with no errors! on https://ccweb.marques576.eu.org :white_check_mark:\" }' ${var.webhook_url}"
  }
  depends_on = [
    vercel_deployment.example,
  ]
}

resource "null_resource" "notify_database_build_complete" {
  provisioner "local-exec" {
    command = "curl -X POST -H 'Content-Type: application/json' -d '{ \"username\":\"Terraform\", \"content\": \"Database is online! on ${digitalocean_database_cluster.mysql-example.host} :white_check_mark:\" }' ${var.webhook_url}"
  }
  depends_on = [
    digitalocean_database_cluster.mysql-example,
  ]
}

# resource "null_resource" "notify_cloudflare_build_complete" {
#   provisioner "local-exec" {
#     command = "curl -X POST -H 'Content-Type: application/json' -d '{ \"username\":\"Terraform\", \"content\": \"Domain sucessfully updated on cloudflare with no errors! :white_check_mark:\" }' ${var.webhook_url}"
#   }
#   depends_on = [
#     cloudflare_record.example,
#   ]
# }
//DATABASE
resource "digitalocean_database_cluster" "mysql-example" {
  name       = "example-mysql-cluster"
  //project_id = digitalocean_app.default.id
  engine     = "mysql"
  version    = "8"
  size       = "db-s-1vcpu-1gb"
  region     = "ams3"
  node_count = 1
}