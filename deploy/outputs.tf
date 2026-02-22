output "service_url" {
  description = "Public website Cloud Run service URL"
  value       = module.nuxt_website.service_uri
}

output "latest_revision" {
  description = "Latest deployed revision"
  value       = module.nuxt_website.latest_revision
}
