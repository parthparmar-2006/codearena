variable "region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Prefix for resource names and the Project tag"
  type        = string
  default     = "codearena"
}

variable "instance_type" {
  description = "EC2 instance type (needs about 2 GB of RAM for k3s and the app)"
  type        = string
  default     = "t3.small"
}

variable "public_key" {
  description = "Contents of the SSH public key, for example ~/.ssh/codearena.pub"
  type        = string
}

variable "ssh_cidr" {
  description = "CIDR allowed to reach SSH. The CI deploy job connects from changing GitHub runner IPs."
  type        = string
}
