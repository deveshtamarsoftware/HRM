import 'package:flutter/material.dart';

class EmployeeStatusScreen extends StatelessWidget {
  final Map<String, dynamic> employeeData;

  const EmployeeStatusScreen({super.key, required this.employeeData});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Employee Status"),
        backgroundColor: Colors.blueAccent,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Card(
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("👤 ${employeeData['firstName']} ${employeeData['lastName']}",
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                Text("📧 Email: ${employeeData['email']}"),
                Text("📱 Phone: ${employeeData['phone']}"),
                Text("🎂 DOB: ${employeeData['dob']}"),
                Text("⚧ Gender: ${employeeData['gender']}"),
                Text("💍 Marital Status: ${employeeData['maritalStatus']}"),
                const SizedBox(height: 20),
                Row(
                  children: [
                    const Text("📌 Status: ",
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    Chip(
                      label: Text(employeeData['status']),
                      backgroundColor: employeeData['status'] == "Pending"
                          ? Colors.orangeAccent
                          : employeeData['status'] == "Approved"
                          ? Colors.green
                          : Colors.red,
                      labelStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
