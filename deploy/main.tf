# Nuxt Website - Cloud Run Deployment
# SEO-critical: always-on with min_instances=1

# Import existing Cloud Run service (remove after first successful apply)
import {
  to = module.nuxt_website.google_cloud_run_v2_service.main
  id = "projects/blichstudio-infras/locations/europe-west1/services/blich-website"
}

provider "google" {
  project = data.terraform_remote_state.shared.outputs.project_id
  region  = data.terraform_remote_state.shared.outputs.region
}

data "terraform_remote_state" "shared" {
  backend = "gcs"
  config = {
    bucket = "blichstudio-infras-terraform-state"
    prefix = "terraform/state/shared"
  }
}

module "nuxt_website" {
  source = "../../terraform-modules/modules/cloud-run"

  service_name    = "blich-website"
  environment     = data.terraform_remote_state.shared.outputs.environment
  region          = data.terraform_remote_state.shared.outputs.region
  project_id      = data.terraform_remote_state.shared.outputs.project_id
  container_image = var.container_image
  port            = 3000

  cpu_limit    = "1"
  memory_limit = "512Mi"

  # Always-on for SEO
  min_instances = 1
  max_instances = 10

  # Instance-based billing (CPU always allocated)
  cpu_idle          = false
  startup_cpu_boost = false
  request_timeout   = 60

  enable_vpc_access = false

  service_account_email = data.terraform_remote_state.shared.outputs.service_account_emails["nuxt-website"]
  allow_public_access   = true

  environment_variables = {
    NODE_ENV            = "production"
    NUXT_PUBLIC_API_URL = "https://api.blichstudio.com"
  }

  labels = { service = "website" }
}
