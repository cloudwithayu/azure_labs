output "public_ip_address" {
  description = "Public IP address of the Windows VM"
  value       = azurerm_public_ip.pip.ip_address
}

output "vm_id" {
  description = "Resource ID of the created Windows VM"
  value       = azurerm_windows_virtual_machine.vm.id
}