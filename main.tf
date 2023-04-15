terraform {
  required_providers {
    vercel = {
      source = "vercel/vercel"
      version = "0.11.4"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_token
}

resource "vercel_project" "example" {
  name      = "terraform-test-project"
  framework = "vite"
  git_repository = {
    type = "github"
    repo = "marques576/cc-individualproj"
  }
}

data "vercel_project_directory" "example" {
  path = "webdjicontrollws/"
}

resource "vercel_project_domain" "example" {
  project_id = vercel_project.example.id
  domain     = "cloudweb.marques576.eu.org"
}

resource "vercel_deployment" "example" {
  project_settings = {
    build_command = "npm run build"
    install_command = "npm install"
    output_directory = "dist"
   }
  project_id  = vercel_project.example.id
  files       = data.vercel_project_directory.example.files
  path_prefix = "webdjicontrollws/"
  production  = true

}
