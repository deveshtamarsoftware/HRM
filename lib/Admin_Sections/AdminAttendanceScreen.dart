import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class AdminAttendanceScreen extends StatefulWidget {
  const AdminAttendanceScreen({super.key});

  @override
  State<AdminAttendanceScreen> createState() => _AdminAttendanceScreenState();
}

class _AdminAttendanceScreenState extends State<AdminAttendanceScreen> {
  DateTime _selectedDate = DateTime.now();
  List<Map<String, dynamic>> _attendanceData = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchAttendanceData();
  }

  // Dummy data instead of Firebase
  Future<void> _fetchAttendanceData() async {
    setState(() => _isLoading = true);

    await Future.delayed(const Duration(seconds: 1)); // fake loading

    // Example dummy data
    final data = [
      {
        'employeeId': 'EMP001',
        'name': 'Rahul Sharma',
        'position': 'Developer',
        'checkIn': '09:15 AM',
        'checkOut': '06:05 PM',
        'status': 'Present',
        'checkInLocation': 'Noida Office',
        'checkOutLocation': 'Noida Office',
        'totalWorkedHours': '8h 50m',
      },
      {
        'employeeId': 'EMP002',
        'name': 'Priya Verma',
        'position': 'Designer',
        'checkIn': '--',
        'checkOut': '--',
        'status': 'Absent',
        'checkInLocation': '--',
        'checkOutLocation': '--',
        'totalWorkedHours': '--',
      },
      {
        'employeeId': 'EMP003',
        'name': 'Amit Kumar',
        'position': 'Tester',
        'checkIn': '10:00 AM',
        'checkOut': '--',
        'status': 'Working',
        'checkInLocation': 'Remote (Delhi)',
        'checkOutLocation': '--',
        'totalWorkedHours': '--',
      },
    ];

    setState(() {
      _attendanceData = data;
      _isLoading = false;
    });
  }

  Future<void> _selectDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2023),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
      await _fetchAttendanceData(); // reload with same dummy data
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Employee Attendance'),
        actions: [
          IconButton(
            icon: const Icon(Icons.calendar_today),
            onPressed: () => _selectDate(context),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              'Attendance for ${DateFormat('dd MMM yyyy').format(_selectedDate)}',
              style: const TextStyle(
                  fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: _attendanceData.isEmpty
                ? const Center(child: Text('No attendance records found'))
                : ListView.builder(
              itemCount: _attendanceData.length,
              itemBuilder: (context, index) {
                final record = _attendanceData[index];
                return _buildAttendanceCard(record);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAttendanceCard(Map<String, dynamic> record) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  record['name'],
                  style: const TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold),
                ),
                Chip(
                  label: Text(
                    record['status'],
                    style: TextStyle(
                      color: record['status'] == 'Absent'
                          ? Colors.red
                          : (record['status'] == 'Working'
                          ? Colors.orange
                          : Colors.green),
                    ),
                  ),
                  backgroundColor: record['status'] == 'Absent'
                      ? Colors.red[50]
                      : (record['status'] == 'Working'
                      ? Colors.orange[50]
                      : Colors.green[50]),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'ID: ${record['employeeId']} | ${record['position']}',
              style: const TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                _buildTimeInfo('Check In', record['checkIn']),
                const SizedBox(width: 16),
                _buildTimeInfo('Check Out', record['checkOut']),
                const SizedBox(width: 16),
                _buildTimeInfo('Worked', record['totalWorkedHours']),
              ],
            ),
            const SizedBox(height: 8),
            if (record['checkIn'] != '--')
              Text(
                'Check-in Location: ${record['checkInLocation']}',
                style: const TextStyle(fontSize: 12),
              ),
            if (record['checkOut'] != '--')
              Text(
                'Check-out Location: ${record['checkOutLocation']}',
                style: const TextStyle(fontSize: 12),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimeInfo(String label, String value) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 12, color: Colors.grey),
          ),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
