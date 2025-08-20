import 'package:flutter/material.dart';

import 'EmployeeDetailsView.dart';
import 'emp_managment.dart'; // Assuming this is where EmployeeForm is

class EmployeeListPage extends StatefulWidget {
  const EmployeeListPage({Key? key}) : super(key: key);

  @override
  _EmployeeListPageState createState() => _EmployeeListPageState();
}

class _EmployeeListPageState extends State<EmployeeListPage> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = "";

  // 🔹 Dummy local employee data instead of Firebase
  final List<Map<String, dynamic>> employees = [
    {
      "employeeId": "EMP001",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "department": "HR",
      "role": "Manager",
      "profileImage": "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      "employeeId": "EMP002",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "department": "IT",
      "role": "Developer",
      "profileImage": "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      "employeeId": "EMP003",
      "name": "Michael Johnson",
      "email": "michael.j@example.com",
      "department": "Finance",
      "role": "Accountant",
      "profileImage": "https://randomuser.me/api/portraits/men/3.jpg"
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  // 🔎 Filter employees by query
  List<Map<String, dynamic>> _filterEmployees(
      List<Map<String, dynamic>> employees, String query) {
    if (query.isEmpty) return employees;

    return employees.where((employee) {
      final name = employee['name']?.toString().toLowerCase() ?? '';
      final department = employee['department']?.toString().toLowerCase() ?? '';
      final id = employee['employeeId']?.toString().toLowerCase() ?? '';
      final email = employee['email']?.toString().toLowerCase() ?? '';
      return name.contains(query.toLowerCase()) ||
          department.contains(query.toLowerCase()) ||
          id.contains(query.toLowerCase()) ||
          email.contains(query.toLowerCase());
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filteredEmployees = _filterEmployees(employees, _searchQuery);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Employee List"),
        backgroundColor: Colors.blue,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
              context, MaterialPageRoute(builder: (_) => EmployeeForm()));
        },
        backgroundColor: Colors.blue,
        child: const Icon(Icons.add),
        tooltip: "Add Employee",
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: TextField(
              controller: _searchController,
              onChanged: (value) {
                setState(() {
                  _searchQuery = value;
                });
              },
              decoration: InputDecoration(
                hintText: "Search by name, ID, email or designation",
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ),
          Expanded(
            child: filteredEmployees.isEmpty
                ? const Center(child: Text("No matching employees found."))
                : ListView.builder(
              itemCount: filteredEmployees.length,
              itemBuilder: (context, index) {
                final data = filteredEmployees[index];

                return Card(
                  margin: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 6),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundImage: NetworkImage(
                        data['profileImage']?.toString().isNotEmpty == true
                            ? data['profileImage']
                            : 'https://randomuser.me/api/portraits/men/1.jpg',
                      ),
                    ),
                    title: Text(data['name'] ?? 'No Name'),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('ID: ${data['employeeId'] ?? 'N/A'}'),
                        Text('Email: ${data['email'] ?? 'N/A'}'),
                        Text(
                            'Department: ${data['department'] ?? 'No department'}'),
                      ],
                    ),
                    trailing: PopupMenuButton<String>(
                      icon: const Icon(Icons.more_vert),
                      onSelected: (value) {
                        if (value == 'view_details') {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => Employeedetailsview(
                                employeeId: data['employeeId'],
                              ),
                            ),
                          );
                        }
                      },
                      itemBuilder: (context) => [
                        const PopupMenuItem(
                          value: 'view_details',
                          child: Text('View Details'),
                        ),
                        // const PopupMenuItem(
                        //   value: 'manage_permissions',
                        //   child: Text('Manage Role Permissions'),
                        // ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
