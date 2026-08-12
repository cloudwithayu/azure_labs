variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region for deployment"
  type        = string
}

variable "vm_name" {
  description = "Name of the Windows VM"
  type        = string
  default     = "win-public-vm"
}

variable "subnet_id" {
  description = "ID of the subnet where the NIC will attach"
  type        = string
}

variable "vm_size" {
  description = "Size of the Azure Virtual Machine"
  type        = string
  default     = "Standard_B2s"
}

variable "admin_username" {
  description = "Admin username for the Windows VM"
  type        = string
  default     = "azureuser"
}

variable "admin_password" {
  description = "Admin password for the Windows VM"
  type        = string
  sensitive   = true
}