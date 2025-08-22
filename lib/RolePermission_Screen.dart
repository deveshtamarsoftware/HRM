import 'package:flutter/material.dart';

class RolePermissionScreen extends StatefulWidget {
  const RolePermissionScreen({super.key});

  @override
  State<RolePermissionScreen> createState() => _RolePermissionScreenState();
}

class _RolePermissionScreenState extends State<RolePermissionScreen> {
  final Map<String, List<String>> permissions = {
    "Admin": [
      "Manage HR",
      "Manage Employees",
      "Approve Leaves",
      "View All Attendance Reports",
      "Manage Payroll",
      "Assign Projects",
    ],
    "HR": [
      "Approve/Reject Leaves",
      "View Attendance",
      "Manage Employee Profiles",
      "Generate Salary Slips",
      "View Projects",
    ],
    "Employee": [
      "Apply Leave",
      "Check-In / Check-Out",
      "View Own Attendance",
      "View Projects Assigned",
      "View Salary Slip",
    ],
  };

  Map<String, Set<String>> selectedPermissions = {
    "Admin": {},
    "HR": {},
    "Employee": {},
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Roles & Permissions",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        // backgroundColor: Colors.deepPurple,
      ),
      body: ListView(
        padding: const EdgeInsets.all(12),
        children: permissions.keys.map((role) {
          return Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            elevation: 4,
            margin: const EdgeInsets.symmetric(vertical: 8),
            child: ExpansionTile(
              leading: Icon(
                role == "Admin"
                    ? Icons.admin_panel_settings
                    : role == "HR"
                    ? Icons.people_alt
                    : Icons.person,
                color: Colors.deepPurple,
              ),
              title: Text(
                role,
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              children: permissions[role]!.map((perm) {
                return CheckboxListTile(
                  title: Text(perm),
                  value: selectedPermissions[role]!.contains(perm),
                  activeColor: Colors.deepPurple,
                  onChanged: (val) {
                    setState(() {
                      if (val == true) {
                        selectedPermissions[role]!.add(perm);
                      } else {
                        selectedPermissions[role]!.remove(perm);
                      }
                    });
                  },
                );
              }).toList(),
            ),
          );
        }).toList(),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(12),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.deepPurple,
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          onPressed: () {
            debugPrint("Selected Permissions: $selectedPermissions");
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("Permissions Saved Successfully ✅")),
            );
          },
          child: const Text("Save Permissions", style: TextStyle(fontSize: 16,color: Colors.white)),
        ),
      ),
    );
  }
}
