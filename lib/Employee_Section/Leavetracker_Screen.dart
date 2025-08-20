import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import 'Calender_Screen.dart';

class LeaveTrackerScreen extends StatelessWidget {
  final Map<String, dynamic>? leaveData;

   LeaveTrackerScreen({super.key, this.leaveData});

  final List<Map<String, dynamic>> sampleLeaves = [
    {
      'date': '2025-08-07',
      'type': 'Sick Leave',
      'reason': 'Fever and rest',
      'status': 1,
      'approved': null,
    },
    {
      'date': '2025-08-02',
      'type': 'Planned Leave',
      'reason': 'Trip to hometown',
      'status': 2,
      'approved': true,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final leave = leaveData ?? sampleLeaves.first;
    final statusLabels = [' Leave Applied', 'Under Review', 'Approved / Rejected'];

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text("Leave Tracker", style: TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xFF1976D2),
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Leave Summary Card
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          leave['type'],
                          style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF333333)),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                          decoration: BoxDecoration(
                            color: _getStatusColor(leave['status'], leave['approved']).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: _getStatusColor(leave['status'], leave['approved']),
                            ),
                          ),
                          child: Text(
                            _getStatusText(leave['status'], leave['approved']),
                            style: TextStyle(
                              color: _getStatusColor(leave['status'], leave['approved']),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    _buildDetailRow(Icons.calendar_today, 'Date',
                        DateFormat('MMM dd, yyyy').format(DateTime.parse(leave['date']))),
                    const SizedBox(height: 12),
                    _buildDetailRow(Icons.note, 'Reason', leave['reason']),
                    const SizedBox(height: 12),
                    _buildDetailRow(Icons.access_time, 'Duration', '1 Day'),
                    const SizedBox(height: 12),
                    _buildDetailRow(Icons.person, 'Approver', 'HR Department'),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Tracker Header
            const Padding(
              padding: EdgeInsets.only(left: 8.0),
              child: Text(
                'Status Tracker',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF333333)),
              ),
            ),

            const SizedBox(height: 16),

            // Tracker Timeline
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: List.generate(3, (index) {
                  return _buildTrackerStep(
                    stepIndex: index,
                    currentStatus: leave['status'],
                    isApproved: leave['approved'],
                    label: statusLabels[index],
                    isLast: index == 2,
                  );
                }),
              ),
            ),

            const SizedBox(height: 32),

            // Additional Info
            const Padding(
              padding: EdgeInsets.only(left: 8.0),
              child: Text(
                'Additional Information',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF333333)),
              ),
            ),

            const SizedBox(height: 12),

            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Remaining Leave Balance',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildLeaveBalanceItem('Sick', '7/10'),
                        _buildLeaveBalanceItem('Casual', '3/6'),
                        _buildLeaveBalanceItem('Earned', '12/15'),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String title, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: const Color(0xFF1976D2)),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(color: Color(0xFF888888))),
            const SizedBox(height: 4),
            Text(value, style: const TextStyle(fontSize: 16)),
          ],
        ),
      ],
    );
  }

  Widget _buildTrackerStep({
    required int stepIndex,
    required int currentStatus,
    required bool? isApproved,
    required String label,
    required bool isLast,
  }) {
    final isCompleted = stepIndex < currentStatus;
    final isCurrent = stepIndex == currentStatus;

    Color circleColor = const Color(0xFFE0E0E0);
    IconData icon = Icons.radio_button_unchecked;
    Color iconColor = const Color(0xFF9E9E9E);
    Color lineColor = const Color(0xFFE0E0E0);

    if (isCompleted) {
      circleColor = const Color(0xFF4CAF50).withOpacity(0.2);
      icon = Icons.check_circle;
      iconColor = const Color(0xFF4CAF50);
      lineColor = const Color(0xFF4CAF50);
    }

    if (isCurrent) {
      circleColor = const Color(0xFF1976D2).withOpacity(0.2);
      icon = _getCurrentStepIcon(currentStatus, isApproved);
      iconColor = _getCurrentStepColor(currentStatus, isApproved);
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Timeline
        Column(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: circleColor,
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 60,
                color: lineColor,
              ),
          ],
        ),

        const SizedBox(width: 16),

        // Content
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: isCurrent ? const Color(0xFF333333) : const Color(0xFF666666)),
                ),
                const SizedBox(height: 8),
                if (isCurrent)
                  Text(
                    _getStatusMessage(currentStatus, isApproved),
                    style: const TextStyle(color: Color(0xFF666666)),
                  ),
                if (isCurrent && currentStatus == 1)
                  const SizedBox(height: 8),
                if (isCurrent && currentStatus == 1)
                  const LinearProgressIndicator(
                    value: 0.7,
                    backgroundColor: Color(0xFFE0E0E0),
                    valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF1976D2)),
                  ),
                if (isCurrent && currentStatus == 2)
                  const SizedBox(height: 8),
                if (isCurrent && currentStatus == 2)
                  Text(
                    isApproved == true
                        ? 'Your leave has been approved'
                        : 'Your leave request was rejected',
                    style: TextStyle(
                        color: isApproved == true ? const Color(0xFF4CAF50) : const Color(0xFFF44336)),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  IconData _getCurrentStepIcon(int status, bool? approved) {
    if (status == 2) {
      return approved == true ? Icons.check_circle : Icons.cancel;
    }
    return Icons.adjust;
  }

  Color _getCurrentStepColor(int status, bool? approved) {
    if (status == 2) {
      return approved == true ? const Color(0xFF4CAF50) : const Color(0xFFF44336);
    }
    return const Color(0xFF1976D2);
  }

  String _getStatusMessage(int status, bool? approved) {
    if (status == 0) return 'Your request has been submitted';
    if (status == 1) return 'Your request is being reviewed';
    if (status == 2) {
      return approved == true
          ? 'Approved by HR Manager'
          : 'Rejected due to insufficient leave balance';
    }
    return '';
  }

  Color _getStatusColor(int status, bool? approved) {
    if (status == 2) {
      return approved == true ? const Color(0xFF4CAF50) : const Color(0xFFF44336);
    }
    if (status == 1) return const Color(0xFF1976D2);
    return const Color(0xFF9E9E9E);
  }

  String _getStatusText(int status, bool? approved) {
    if (status == 2) return approved == true ? 'Approved' : 'Rejected';
    if (status == 1) return 'Under Review';
    return 'Applied';
  }

  Widget _buildLeaveBalanceItem(String type, String balance) {
    return Column(
      children: [
        Text(type, style: const TextStyle(color: Color(0xFF666666))),
        const SizedBox(height: 4),
        Text(balance, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ],
    );
  }
}