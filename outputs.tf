output "cloudwebURL" {
    value = vercel_project_domain.example.domain
}
output "sockerserver_live_url" {
    value = digitalocean_app.default.live_url
}

output "url_without_protocol" {
  value = local.url_without_protocol_with_dot
}

# output "planetscale_password" {
#   value= planetscale_branch_password.instance.password
#   sensitive = true
# }

#  output "planetscale_password_raw" {
#       value = nonsensitive(planetscale_branch_password.instance.password)
# }