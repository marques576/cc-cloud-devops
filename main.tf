terraform {
  required_providers {
    vercel = {
      source = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

provider "vercel" {
  api_token = "YOUR_VERCEL_API_TOKEN"
}

resource "vercel_git_repository" "website" {
  name = "my-website"
  repo = "https://github.com/YOUR_GITHUB_USERNAME/YOUR_WEBSITE_REPO.git"
}

resource "vercel_project_environment_variable" "website" {
  key   = "MY_ENV_VAR"
  value = "my-value"
}

resource "vercel_project_build_settings" "website" {
  build_command = "npm run build"
}

resource "vercel_project" "website" {
  name                = "my-website"
  git_repository_id   = vercel_git_repository.website.id
  environment         = "production"
  build_settings_id   = vercel_project_build_settings.website.id
  environment_aliases = ["my-website.vercel.app"]
  environment_variables = [
    vercel_project_environment_variable.website.id,
  ]
}

output "website_url" {
  value = vercel_project.website.url
}