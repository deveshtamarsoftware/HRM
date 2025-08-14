import 'package:flutter/material.dart';
import 'Attendance_Screen.dart';
import 'Calender_Screen.dart';

class PersonalDetailsView extends StatelessWidget {
  final Map<String, String?> personalInfo = {
    "First Name": "Harsh",
    "Last Name": "Singhal",
    "Email": "singhalharsh379@gmail.com",
    "Phone": "+91 9876543210",
    "Date of Birth": "2000-01-01",
    "PAN Number": "ABCDE1234F",
    "Aadhar Number": "1234 5678 9012",
    "Father Name": "Mr. Adesh Singhal",
    "Mother Name": "Mrs. Sunita Singhal",
    "Secondary Phone": "+91 7895037479",
    "Emergency Contact Name": "Aakash Singhal",
    "Emergency Contact Number": "+91 9876123456",
    "Nationality": "Indian",
    "Passport Number": "M1234567",
  };

  final Map<String, String?> addressInfo = {
    "Current Address": "Sector 59 Noida",
    "Permanent Address": "Reda,Rampur, Saharanpur",
    "City": "Noida",
    "State": "Uttar Predesh",
    "Pincode": "247451",
  };

  final Map<String, String?> jobInfo = {
    "Job Title": "Flutter Developer",
    "Department": "Mobile Development",
    "Employee ID": "EMP20250801",
    "Date of Joining": "2024-08-10",
    "Reporting Manager": "Mr. Atul Kumar",
    "Employment Type": "Full-Time",
  };

  final Map<String, String?> experienceInfo = {
    "Previous Company": "Srfusion Tech Pvt Ltd",
    "Years of Experience": "1",
    "Last Designation": "Junior Developer",
  };

  final Map<String, String?> documentInfo = {
    "PAN Number": "ABCDE1234F",
    "Aadhar Number": "1234 5678 9012",
    "Resume": "resume_harsh.pdf",
    "Offer Letter": "offer_letter.pdf",
  };

  final Map<String, String?> bankInfo = {
    "Bank Name": "Panjab National bank",
    "Account Number": "XXXXXX1234",
    "IFSC Code": "SBIN0001234",
    "Branch": "Modipuram , Meerut",
  };

  Widget _buildInfoTile(String title, String? value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Material(
        elevation: 1.5,
        shadowColor: Colors.black12,
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: 4,
                child: Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ),
              ),
              Expanded(
                flex: 6,
                child: Text(
                  value ?? "Not Provided",
                  style: const TextStyle(color: Colors.grey),
                  textAlign: TextAlign.right,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildExpandableSection(String title, Map<String, String?> data) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: ExpansionTile(
          title: Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1976D2),
            ),
          ),
          children: data.entries
              .map((entry) => _buildInfoTile(entry.key, entry.value))
              .toList(),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(

        leadingWidth: 80,
        titleSpacing: 0,
        title: const Text("Employee Details"),
        backgroundColor: Color(0xFF66ABEF),
        foregroundColor: Colors.white,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildExpandableSection("Personal Information", personalInfo),
            _buildExpandableSection("Address Information", addressInfo),
            _buildExpandableSection("Job Information", jobInfo),
            _buildExpandableSection("Experience Details", experienceInfo),
            _buildExpandableSection("Documents", documentInfo),
            _buildExpandableSection("Bank Account Information", bankInfo),
          ],
        ),
      ),
    );
  }
}
