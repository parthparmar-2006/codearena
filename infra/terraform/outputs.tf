output "public_ip" {
  description = "Elastic IP of the k3s server (use it as the EC2_HOST GitHub secret)"
  value       = aws_eip.this.public_ip
}

output "app_url" {
  description = "Public link to the app"
  value       = "http://${aws_eip.this.public_ip}.nip.io"
}
