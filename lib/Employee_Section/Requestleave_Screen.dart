import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:file_picker/file_picker.dart';


import 'LeaveStatus_Screen.dart';

class SubmitLeaveRequestPage extends StatefulWidget {
  const SubmitLeaveRequestPage({super.key});

  @override
  State<SubmitLeaveRequestPage> createState() => _SubmitLeaveRequestPageState();
}

class _SubmitLeaveRequestPageState extends State<SubmitLeaveRequestPage> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _reasonController = TextEditingController();
  final TextEditingController _emergencyContactController = TextEditingController();

  DateTime? _startDate;
  DateTime? _endDate;
  String? _leaveType;
  PlatformFile? _pickedFile;

  final List<String> _leaveTypes = [
    'Casual Leave',
    'Sick Leave',
    'Earned Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Comp Off',
    'Work From Home',
  ];

  final Map<String, int> _leaveLimits = {
    'Casual Leave': 5,
    'Sick Leave': 5,
    'Earned Leave': 5,
    'Maternity Leave': 3,
    'Paternity Leave': 2,
    'Comp Off': 3,
    'Work From Home': 2,
  };

  Map<String, int> _pendingByType = {};

  @override
  void initState() {
    super.initState();
    _fetchPendingLeaves();
  }

  void _fetchPendingLeaves() {
    setState(() {
      _pendingByType = {
        'Casual Leave': 1,
        'Sick Leave': 0,
        'Earned Leave': 2,
        'Maternity Leave': 0,
        'Paternity Leave': 1,
        'Comp Off': 0,
        'Work From Home': 1,
      };
    });
  }

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(type: FileType.any);
    if (result != null) {
      setState(() {
        _pickedFile = result.files.first;
      });
    }
  }

  Future<void> _pickDate(bool isStart) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2023),
      lastDate: DateTime(2030),
    );
    if (picked != null) {
      setState(() {
        if (isStart) {
          _startDate = picked;
          if (_endDate != null && _endDate!.isBefore(_startDate!)) {
            _endDate = null;
          }
        } else {
          _endDate = picked;
        }
      });
    }
  }

  void _submitRequest() {
    if (_formKey.currentState!.validate() && _startDate != null && _endDate != null && _leaveType != null) {
      final leaveData = {
        'leaveType': _leaveType,
        'startDate': DateFormat('yyyy-MM-dd').format(_startDate!),
        'endDate': DateFormat('yyyy-MM-dd').format(_endDate!),
        'reason': _reasonController.text.trim(),
        'emergencyContact': _emergencyContactController.text.trim(),
        'attachment': _pickedFile?.name,
        'status': 'Pending',
        'timestamp': DateTime.now().toString(),
      };

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Leave request submitted")),
      );

      _formKey.currentState!.reset();
      _reasonController.clear();
      _emergencyContactController.clear();
      setState(() {
        _startDate = null;
        _endDate = null;
        _leaveType = null;
        _pickedFile = null;
      });
    } else {
      // Force validation messages to appear
      setState(() {});
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please complete all required fields")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        title: const Text("Request Leave"),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 1,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              // Leave Type
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("Leave Type", style: TextStyle(fontWeight: FontWeight.w600)),
                      const SizedBox(height: 8),
                      DropdownButtonFormField<String>(
                        decoration: InputDecoration(
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                        ),
                        value: _leaveType,
                        items: _leaveTypes.map((type) => DropdownMenuItem(value: type, child: Text(type))).toList(),
                        hint: const Text("Select Leave Type"),
                        validator: (val) => val == null ? 'Please select a leave type' : null,
                        onChanged: (val) => setState(() => _leaveType = val),
                      ),
                      if (_leaveType != null)
                        Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Text(
                            "Pending: ${_pendingByType[_leaveType] ?? 0} | Remaining: ${(_leaveLimits[_leaveType] ?? 0) - (_pendingByType[_leaveType] ?? 0)}",
                            style: const TextStyle(fontSize: 13, color: Colors.black),
                          ),
                        ),
                    ],
                  ),
                ),
              ),

              // Date Picker
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    children: [
                      ListTile(
                        title: Text(_startDate == null ? "Start Date *" : DateFormat('dd MMM yyyy').format(_startDate!)),
                        leading: const Icon(Icons.date_range),
                        onTap: () => _pickDate(true),
                      //  subtitle: _startDate == null ? const Text('Please select start date', style: TextStyle(color: Colors.red)) : null,
                      ),
                      ListTile(
                        title: Text(_endDate == null ? "End Date *" : DateFormat('dd MMM yyyy').format(_endDate!)),
                        leading: const Icon(Icons.date_range),
                        onTap: () => _pickDate(false),
                       // subtitle: _endDate == null ? const Text('Please select end date', style: TextStyle(color: Colors.red)) : null,
                      ),
                    ],
                  ),
                ),
              ),

              // Reason
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: TextFormField(
                    controller: _reasonController,
                    maxLines: 2,
                    validator: (val) => val == null || val.trim().isEmpty ? 'Please enter a reason' : null,
                    decoration: InputDecoration(
                      hintText: "Reason for leave",
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      filled: true,
                      fillColor: Colors.grey.shade100,
                    ),
                  ),
                ),
              ),

              // Emergency Contact
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: TextFormField(
                    controller: _emergencyContactController,
                    keyboardType: TextInputType.phone,
                   // validator: (val) => val == null || val.trim().isEmpty ? 'Enter emergency contact' : null,
                    decoration: InputDecoration(
                      hintText: "Emergency contact number",
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      filled: true,
                      fillColor: Colors.grey.shade100,
                    ),
                  ),
                ),
              ),

              // Attachment
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      OutlinedButton.icon(
                        icon: const Icon(Icons.attach_file, size: 16),
                        label: const Text("Choose File", style: TextStyle(fontSize: 13)),
                        onPressed: _pickFile,
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          _pickedFile?.name ?? "No file selected",
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 40),

              // Submit Button
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: _submitRequest,
                  style: FilledButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    backgroundColor: Colors.blue.shade600,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: const Text("Submit Leave Request", style: TextStyle(fontSize: 14)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
