provider "vercel" {
  api_token = var.vercel_api_token
}

# Configure the DigitalOcean Provider
provider "digitalocean" {
  token = var.digitalocean_api_token
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# provider "planetscale" {
#   service_token    = var.service_token    
#   service_token_id = var.service_token_id  
# }