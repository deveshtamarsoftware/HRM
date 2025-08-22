import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';

import 'admin_Registation_Screen.dart';

class EmployeeForm extends StatefulWidget {
  @override
  _EmployeeFormState createState() => _EmployeeFormState();
}

class _EmployeeFormState extends State<EmployeeForm> {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
// drog
  // Dropdown + Date
  String _selectedGender = 'Male';
  String _selectedMaritalStatus = 'Single';
  DateTime _dateOfBirth = DateTime(1990, 1, 1);

  File? _profileImage;
  final picker = ImagePicker();
  final _dateFormatter = DateFormat('dd-MM-yyyy');
  bool _isLoading = false;

  Future<void> _pickImage() async {
    final pickedFile =
    await picker.pickImage(source: ImageSource.gallery, imageQuality: 75);
    if (pickedFile != null) {
      setState(() => _profileImage = File(pickedFile.path));
    }
  }


  void _submitForm() {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    Future.delayed(const Duration(seconds: 2), () {
      setState(() => _isLoading = false);

      // Employee data create
      final employeeData = {
        'firstName': _firstNameController.text,
        'lastName': _lastNameController.text,
        'email': _emailController.text,
        'phone': _phoneController.text,
        'dob': _dateFormatter.format(_dateOfBirth),
        'gender': _selectedGender,
        'maritalStatus': _selectedMaritalStatus,
        'status': "Pending", // Default Pending
      };

      // Navigate to Status Page
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => EmployeeStatusScreen(employeeData: employeeData),
        ),
      );

      _resetForm();
    });
  }

  void _resetForm() {
    _formKey.currentState?.reset();
    setState(() {
      _profileImage = null;
      _dateOfBirth = DateTime(1990, 1, 1);
      _selectedGender = 'Male';
      _selectedMaritalStatus = 'Single';
      _usernameController.clear();
      _passwordController.clear();
      _emailController.clear();
      _phoneController.clear();
      _firstNameController.clear();
      _lastNameController.clear();
    });
  }

  Widget _buildTextField(TextEditingController controller, String label,
      IconData icon,
      {bool isPassword = false,
        TextInputType keyboardType = TextInputType.text}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
      child: TextFormField(
        controller: controller,
        obscureText: isPassword,
        keyboardType: keyboardType,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon, color: Colors.blueAccent),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          filled: true,
          fillColor: Colors.grey[100],
        ),
        validator: (value) =>
        value == null || value.isEmpty ? 'Enter $label' : null,
      ),
    );
  }

  Widget _buildDropdown(String currentValue, String label, IconData icon,
      List<String> items, ValueChanged<String> onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
      child: DropdownButtonFormField<String>(
        value: currentValue,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon, color: Colors.blueAccent),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          filled: true,
          fillColor: Colors.grey[100],
        ),
        items: items
            .map((item) => DropdownMenuItem(value: item, child: Text(item)))
            .toList(),
        onChanged: (val) {
          if (val != null) onChanged(val);
        },
      ),
    );
  }

  Widget _buildDatePicker(
      String label, DateTime selectedDate, ValueChanged<DateTime> onDateSelected) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
      child: InkWell(
        onTap: () async {
          final picked = await showDatePicker(
            context: context,
            initialDate: selectedDate,
            firstDate: DateTime(1900),
            lastDate: DateTime(2100),
          );
          if (picked != null) onDateSelected(picked);
        },
        child: InputDecorator(
          decoration: InputDecoration(
            labelText: label,
            prefixIcon: const Icon(Icons.calendar_today, color: Colors.blueAccent),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            filled: true,
            fillColor: Colors.grey[100],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(_dateFormatter.format(selectedDate)),
              const Icon(Icons.edit_calendar, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add New Employee',
            style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.blueAccent,
        elevation: 2,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(18),
        child: Form(
          key: _formKey,
          child: Card(
            elevation: 4,
            shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Profile Picture
                  Center(
                    child: GestureDetector(
                      onTap: _pickImage,
                      child: CircleAvatar(
                        radius: 55,
                        backgroundColor: Colors.blue[100],
                        backgroundImage: _profileImage != null
                            ? FileImage(_profileImage!)
                            : null,
                        child: _profileImage == null
                            ? const Icon(Icons.add_a_photo,
                            size: 40, color: Colors.white70)
                            : null,
                      ),
                    ),
                  ),
                  const SizedBox(height: 25),

                  const Text("👤 Personal Information",
                      style:
                      TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const Divider(),

                  _buildTextField(
                      _firstNameController, 'First Name', Icons.badge),
                  _buildTextField(
                      _lastNameController, 'Last Name', Icons.badge),
                  _buildDatePicker('Date of Birth', _dateOfBirth,
                          (val) => setState(() => _dateOfBirth = val)),
                  _buildDropdown(_selectedGender, 'Gender', Icons.person,
                      ['Male', 'Female','Other'],
                          (val) => setState(() => _selectedGender = val)),
                  _buildDropdown(
                      _selectedMaritalStatus,
                      'Marital Status',
                      Icons.family_restroom,
                      ['Single', 'Married', 'Divorced', 'Widowed'],
                          (val) => setState(() => _selectedMaritalStatus = val)),

                  const SizedBox(height: 20),

                  const Text("📧 Account Information",
                      style:
                      TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const Divider(),

                  _buildTextField(
                      _usernameController, 'Username', Icons.person_outline),
                  _buildTextField(_passwordController, 'Password', Icons.lock,
                      isPassword: true),
                  _buildTextField(_emailController, 'Email', Icons.email,
                      keyboardType: TextInputType.emailAddress),
                  _buildTextField(_phoneController, 'Phone', Icons.phone,
                      keyboardType: TextInputType.phone),

                  const SizedBox(height: 25),

                  // Buttons
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _isLoading ? null : _submitForm,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blueAccent,
                            minimumSize: const Size.fromHeight(50),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12)),
                          ),
                          icon: _isLoading
                              ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                                color: Colors.white, strokeWidth: 2),
                          )
                              : const Icon(Icons.save),
                          label: const Text("Register Employee",
                              style:
                              TextStyle(color: Colors.white, fontSize: 16)),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _resetForm,
                          style: OutlinedButton.styleFrom(
                            minimumSize: const Size.fromHeight(50),
                            side: const BorderSide(color: Colors.redAccent),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12)),
                          ),
                          icon: const Icon(Icons.refresh, color: Colors.red),
                          label: const Text("Reset",
                              style:
                              TextStyle(color: Colors.red, fontSize: 16)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
